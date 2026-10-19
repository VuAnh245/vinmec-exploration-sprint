"""Tìm bài trong kho nguồn Vinmec công khai.

Hai cách tìm:
- keyword_search: cách tìm thông thường để so sánh, không phải code của MyVinmec.
- tra_loi: gọi model chọn bài theo ý nghĩa câu hỏi, rồi làm sạch kết quả trước khi hiển thị.
"""

import json
import re
from pathlib import Path

import guard

CORPUS_FILE = Path(__file__).resolve().parent.parent / "nguon-noi-dung" / "kho-bai-viet-vinmec.json"
MAX_RESULTS = 3
MAX_QUESTIONS = 3


def load_corpus() -> dict[str, dict]:
    data = json.loads(CORPUS_FILE.read_text(encoding="utf-8"))
    return {item["id"]: item for item in data["bai"]}


def corpus_for_prompt(corpus: dict[str, dict]) -> list[dict]:
    """Phần kho gửi cho model: không gửi đường dẫn để model không tự viết link."""
    return [{k: item[k] for k in ("id", "tieu_de", "loai", "chi_so", "muc")} for item in corpus.values()]


def _words(text: str) -> list[str]:
    return re.sub(r"[^a-z0-9 ]", " ", guard.normalize(text)).split()


def keyword_search(query: str, corpus: dict[str, dict]) -> list[dict]:
    """Mọi từ trong câu hỏi (đã bỏ dấu) phải có trong tiêu đề."""
    words = _words(query)
    if not words:
        return []
    return [item for item in corpus.values() if all(w in _words(item["tieu_de"]) for w in words)]


def clean_result(raw: dict, corpus: dict[str, dict]) -> dict:
    """Chỉ giữ bài có trong kho, lý do và câu hỏi qua được lớp kiểm tra."""
    items, seen = [], set()
    for r in raw.get("ket_qua") or []:
        if not isinstance(r, dict) or r.get("id") not in corpus or r["id"] in seen:
            continue
        item = corpus[r["id"]]
        reason = str(r.get("ly_do", ""))
        section = str(r.get("muc_nen_doc", ""))
        items.append({
            "bai": item,
            "ly_do": reason if guard.check_answer(reason)[0] else "",
            "muc_nen_doc": section if section in item["muc"] else "",
        })
        seen.add(r["id"])
        if len(items) == MAX_RESULTS:
            break

    understanding = str(raw.get("hieu_cau_hoi", ""))
    questions = [q for q in raw.get("cau_hoi_cho_bac_si") or []
                 if isinstance(q, str) and guard.check_answer(q)[0]]
    return {
        "hieu_cau_hoi": understanding if guard.check_answer(understanding)[0] else "",
        "ket_qua": items,
        "cau_hoi": questions[:MAX_QUESTIONS],
    }


def tra_loi(query: str, row: dict | None, corpus: dict[str, dict], ask) -> dict:
    """ask(query, row) gọi model và trả về dict thô; None nghĩa là chưa có API key."""
    kind = guard.classify_question(query)
    result = {"loai": kind, "loi_ai": False, "hieu_cau_hoi": "", "ket_qua": [], "cau_hoi": [],
              "tu_khoa": keyword_search(query, corpus)}
    if kind == guard.KHAN_CAP:
        return result
    try:
        raw = ask(query, row)
    except Exception:
        raw = None
    if raw is None:
        result["loi_ai"] = True
    else:
        result.update(clean_result(raw, corpus))
    if kind == guard.Y_KHOA and query not in result["cau_hoi"]:
        result["cau_hoi"].insert(0, query)
    return result
