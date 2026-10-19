"""Máy chủ cho bản mô phỏng giao diện điện thoại (thư mục mobile/).

Chạy từ thư mục gốc repo: python 05-prototype/app/server.py
Mở http://localhost:8600. API key nằm ở máy chủ, không gửi xuống trình duyệt.
"""

import json
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

import llm
import search

HERE = Path(__file__).resolve().parent
STATIC_DIR = HERE / "mobile"
MOCK_DIR = HERE.parent / "mock-data"
PORT = 8600
MAX_BODY = 4096

CORPUS = search.load_corpus()


def load_reports() -> list[dict]:
    return [json.loads(p.read_text(encoding="utf-8")) for p in sorted(MOCK_DIR.glob("mock-phieu-ket-qua-*.json"))]


def ask_model(query: str, row: dict | None) -> dict | None:
    return llm.ask(query, row, CORPUS, os.environ.get("OPENAI_API_KEY"), os.environ.get("OPENAI_MODEL"))


def to_json(result: dict) -> dict:
    """Trải phẳng bài trong kết quả để trình duyệt dùng trực tiếp."""
    return {
        "loai": result["loai"],
        "loi_ai": result["loi_ai"],
        "hieu_cau_hoi": result["hieu_cau_hoi"],
        "ket_qua": [{**r["bai"], "ly_do": r["ly_do"], "muc_nen_doc": r["muc_nen_doc"]} for r in result["ket_qua"]],
        "cau_hoi": result["cau_hoi"],
        "tu_khoa": result["tu_khoa"],
    }


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

    def do_GET(self):
        if self.path == "/api/data":
            self.send_json({"bai": CORPUS, "phieu": load_reports(), "co_ai": bool(os.environ.get("OPENAI_API_KEY"))})
            return
        super().do_GET()

    def do_POST(self):
        if self.path != "/api/search":
            self.send_json({"loi": "không tìm thấy"}, 404)
            return
        length = int(self.headers.get("Content-Length") or 0)
        if not 0 < length <= MAX_BODY:
            self.send_json({"loi": "yêu cầu không hợp lệ"}, 400)
            return
        try:
            payload = json.loads(self.rfile.read(length))
            query = str(payload.get("cau_hoi", "")).strip()[:300]
            row = payload.get("dong_phieu") if isinstance(payload.get("dong_phieu"), dict) else None
        except (ValueError, AttributeError):
            self.send_json({"loi": "yêu cầu không hợp lệ"}, 400)
            return
        if not query:
            self.send_json({"loi": "thiếu câu hỏi"}, 400)
            return
        self.send_json(to_json(search.tra_loi(query, row, CORPUS, ask_model)))


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
