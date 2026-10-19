"""Máy chủ cho bản mô phỏng giao diện điện thoại (thư mục mobile/).

Chạy từ thư mục gốc repo: python 05-prototype/app/server.py
Mở http://localhost:8600. API key nằm ở máy chủ, không gửi xuống trình duyệt.

Vòng khép kín (proto-v3) chỉ giữ dữ liệu trong bộ nhớ của phiên chạy, không ghi ra file, mất khi tắt máy chủ.
"""

import json
import os
import sys
import threading
from collections import Counter
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

import guard
import llm
import search

HERE = Path(__file__).resolve().parent
STATIC_DIR = HERE / "mobile"
MOCK_DIR = HERE.parent / "mock-data"
PORT = 8600
MAX_BODY = 4096
MAX_TEXT = 500
MAX_RECORDS = 200

CORPUS = search.load_corpus()


def load_reports() -> list[dict]:
    return [json.loads(p.read_text(encoding="utf-8")) for p in sorted(MOCK_DIR.glob("mock-phieu-ket-qua-*.json"))]


class Store:
    """Những gì phía Vinmec nhìn thấy: câu tìm không ra và câu hỏi đã gửi bác sĩ."""

    def __init__(self):
        self.lock = threading.Lock()
        self.not_found: Counter = Counter()
        self.missing_codes: Counter = Counter()
        self.sent: list[dict] = []

    def record_not_found(self, query: str, row: dict | None) -> None:
        with self.lock:
            if len(self.not_found) < MAX_RECORDS:
                self.not_found[guard.normalize(query)] += 1
            if row:
                self.missing_codes[row["ma"]] += 1

    def record_sent(self, question: str, row: dict | None, consent: bool, same_ids: list[str]) -> None:
        """Câu hỏi giống hệt nhau (bỏ dấu) được gom lại để bác sĩ trả lời một lần."""
        key = guard.normalize(question)
        with self.lock:
            existing = next((s for s in self.sent if s["khoa"] == key), None)
            if existing:
                existing["so_lan"] += 1
                existing["dong_y_bo_sung_kho"] = existing["dong_y_bo_sung_kho"] or consent
            elif len(self.sent) < MAX_RECORDS:
                self.sent.append({"khoa": key, "cau_hoi": question, "ma": row["ma"] if row else "",
                                  "dong_y_bo_sung_kho": consent, "trung_voi": same_ids, "so_lan": 1})
            if row and not same_ids:
                self.missing_codes[row["ma"]] += 1

    def snapshot(self) -> dict:
        with self.lock:
            return {
                "tim_khong_ra": [{"cau_hoi": q, "so_lan": n} for q, n in self.not_found.most_common()],
                "chi_so_thieu_noi_dung": [{"ma": m, "so_lan": n} for m, n in self.missing_codes.most_common()],
                "cau_hoi_da_gui": [{k: v for k, v in s.items() if k != "khoa"}
                                   for s in sorted(self.sent, key=lambda s: -s["so_lan"])],
            }


STORE = Store()


def ask_model(query: str, row: dict | None) -> dict | None:
    return llm.ask(query, row, CORPUS, os.environ.get("OPENAI_API_KEY"), os.environ.get("OPENAI_MODEL"))


def ask_draft(words: str, row: dict | None) -> dict | None:
    return llm.ask_draft(words, row, CORPUS, os.environ.get("OPENAI_API_KEY"), os.environ.get("OPENAI_MODEL"))


def search_json(result: dict) -> dict:
    """Trải phẳng bài trong kết quả để trình duyệt dùng trực tiếp."""
    return {
        "loai": result["loai"],
        "loi_ai": result["loi_ai"],
        "hieu_cau_hoi": result["hieu_cau_hoi"],
        "ket_qua": [{**r["bai"], "ly_do": r["ly_do"], "muc_nen_doc": r["muc_nen_doc"]} for r in result["ket_qua"]],
        "cau_hoi": result["cau_hoi"],
        "tu_khoa": result["tu_khoa"],
    }


def found_nothing(result: dict) -> bool:
    shown = result["tu_khoa"] if result["loi_ai"] else result["ket_qua"]
    return result["loai"] != guard.KHAN_CAP and not shown


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(STATIC_DIR), **kwargs)

    def log_message(self, format, *args):
        # Không ghi log nội dung câu hỏi (rủi ro RR04); chỉ ghi đường dẫn và mã trạng thái.
        sys.stderr.write(f"{self.command} {self.path.split('?')[0]} {args[1] if len(args) > 1 else ''}\n")

    def send_json(self, data, status: int = 200) -> None:
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def read_payload(self) -> dict | None:
        length = int(self.headers.get("Content-Length") or 0)
        if not 0 < length <= MAX_BODY:
            return None
        try:
            payload = json.loads(self.rfile.read(length))
        except ValueError:
            return None
        return payload if isinstance(payload, dict) else None

    def do_GET(self):
        if self.path == "/api/data":
            reports = load_reports()
            by_code = {r["ma"]: [i["id"] for i in search.lookup_by_code(r["ma"], CORPUS)]
                       for report in reports for r in report["chi_so"]}
            self.send_json({"bai": CORPUS, "phieu": reports, "theo_chi_so": by_code,
                            "co_ai": bool(os.environ.get("OPENAI_API_KEY"))})
            return
        if self.path == "/api/vinmec":
            self.send_json(STORE.snapshot())
            return
        super().do_GET()

    def do_POST(self):
        payload = self.read_payload()
        if payload is None:
            self.send_json({"loi": "yêu cầu không hợp lệ"}, 400)
            return
        row = payload.get("dong_phieu") if isinstance(payload.get("dong_phieu"), dict) else None
        if row is not None and not {"ma", "ten", "ket_qua", "don_vi", "khoang_tham_chieu", "co"} <= row.keys():
            row = None

        if self.path == "/api/search":
            query = str(payload.get("cau_hoi", "")).strip()[:MAX_TEXT]
            if not query:
                self.send_json({"loi": "thiếu câu hỏi"}, 400)
                return
            result = search.tra_loi(query, row, CORPUS, ask_model)
            if found_nothing(result):
                STORE.record_not_found(query, row)
            self.send_json(search_json(result))
        elif self.path == "/api/draft":
            words = str(payload.get("loi_nguoi_benh", "")).strip()[:MAX_TEXT]
            self.send_json(search.soan_cau_hoi(words, row, CORPUS, ask_draft))
        elif self.path == "/api/send":
            question = str(payload.get("cau_hoi", "")).strip()[:MAX_TEXT]
            if not question:
                self.send_json({"loi": "thiếu câu hỏi"}, 400)
                return
            if guard.classify_question(question) == guard.KHAN_CAP:
                self.send_json({"loai": guard.KHAN_CAP, "da_gui": False})
                return
            same_ids = [i for i in payload.get("trung_voi") or [] if i in CORPUS]
            STORE.record_sent(question, row, bool(payload.get("dong_y_bo_sung_kho")), same_ids)
            self.send_json({"loai": guard.TRONG_PHAM_VI, "da_gui": True})
        else:
            self.send_json({"loi": "không tìm thấy"}, 404)


def main(port: int = PORT) -> None:
    # Console Windows mặc định không in được tiếng Việt.
    for stream in (sys.stdout, sys.stderr):
        stream.reconfigure(encoding="utf-8", errors="replace")
    llm.load_env_file()
    server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print(f"Mở http://localhost:{port}  (AI: {'có key' if os.environ.get('OPENAI_API_KEY') else 'chưa có key'})")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()


if __name__ == "__main__":
    main()
