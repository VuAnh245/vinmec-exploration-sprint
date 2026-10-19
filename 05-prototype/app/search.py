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
DOCTOR_FILE = Path(__file__).resolve().parent.parent / "mock-data" / "mock-bac-si.json"
MAX_RESULTS = 3
MAX_QUESTIONS = 3
MAX_DOCTORS = 2

# Gợi ý chuyên khoa nhận câu hỏi theo mã chỉ số có trên phiếu mô phỏng. Đây là quy tắc điều hướng dịch vụ
# của bản thử, không phải chẩn đoán; khi làm thật cần Vinmec xác nhận.
SPECIALTY_BY_CODE = {
    "GLU": "Nội tiết - Đái tháo đường",
    "CHOL": "Tim mạch", "LDL-C": "Tim mạch", "HDL-C": "Tim mạch", "TG": "Tim mạch",
    "ALT": "Tiêu hóa - Gan mật", "AST": "Tiêu hóa - Gan mật",
    "WBC": "Huyết học - Xét nghiệm", "NEUT%": "Huyết học - Xét nghiệm", "PLT": "Huyết học - Xét nghiệm",
}


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


def _code(text: str) -> str:
    return re.sub(r"[^a-z0-9]", "", guard.normalize(text))


def lookup_by_code(code: str, corpus: dict[str, dict]) -> list[dict]:
    """Bài có ghi đúng mã chỉ số (bỏ dấu, bỏ ký tự đặc biệt như %): dùng để hiện sẵn bài trên phiếu, không cần AI."""
    key = _code(code)
    return [item for item in corpus.values() if key and any(_code(c) == key for c in item["chi_so"])]


def load_doctors() -> dict[str, dict]:
    data = json.loads(DOCTOR_FILE.read_text(encoding="utf-8"))
    return {d["id"]: d for d in data["bac_si"]}


def specialties(doctors: dict[str, dict]) -> list[str]:
    return list(dict.fromkeys(d["chuyen_khoa"] for d in doctors.values()))


def match_doctors(text: str, row: dict | None, doctors: dict[str, dict], specialty: str = "") -> list[dict]:
    """Gợi ý bác sĩ theo lĩnh vực khớp với câu hỏi và chuyên khoa gợi ý; trả kèm lý do để người bệnh tự chọn."""
    words = set(_words(text + " " + (f"{row['ten']} {row['ma']}" if row else "")))
    wanted = specialty or (SPECIALTY_BY_CODE.get(row["ma"], "") if row else "")
    ranked = []
    for d in doctors.values():
        tags = [t for t in d["linh_vuc"] if set(_words(t)) <= words]
        score = 2 * len(tags) + (3 if wanted and d["chuyen_khoa"] == wanted else 0)
        if score:
            reason = f"Chuyên khoa {d['chuyen_khoa']}" + (f"; lĩnh vực khớp: {', '.join(tags)}" if tags else "")
            ranked.append((score, d["so_cau_tra_loi"], {**d, "ly_do": reason}))
    ranked.sort(key=lambda x: (-x[0], -x[1]))
    return [d for _, _, d in ranked[:MAX_DOCTORS]]


def template_question(words: str, row: dict | None) -> str:
    """Câu hỏi soạn sẵn khi không có AI: ghép đúng thông tin trên phiếu với lời người bệnh."""
    parts = []
    if row:
        parts.append(f"Phiếu xét nghiệm của tôi có {row['ten']} ({row['ma']}) {row['ket_qua']} {row['don_vi']}, "
                     f"khoảng tham chiếu {row['khoang_tham_chieu']}, được đánh dấu {row['co'] or 'không có cờ'}.")
    if words.strip():
        parts.append(words.strip().rstrip(".?") + ".")
    parts.append("Bác sĩ giải thích giúp tôi chỉ số này có ý nghĩa gì với tôi và tôi cần làm gì tiếp theo?")
    return " ".join(parts)


def soan_cau_hoi(words: str, row: dict | None, corpus: dict[str, dict], ask,
                 doctors: dict[str, dict] | None = None) -> dict:
    """ask(words, row) gọi model soạn câu hỏi gửi bác sĩ; None nghĩa là chưa có API key."""
    kind = guard.classify_question(words) if words.strip() else guard.TRONG_PHAM_VI
    result = {"loai": kind, "loi_ai": False, "cau_hoi_nhap": "", "trung": [], "chuyen_khoa": "", "bac_si": []}
    if kind == guard.KHAN_CAP:
        return result
    try:
        raw = ask(words, row)
    except Exception:
        raw = None
    draft, same_ids, specialty = "", [], ""
    if raw is None:
        result["loi_ai"] = True
    else:
        draft = str(raw.get("cau_hoi_nhap", "")).strip()
        same_ids = [i for i in raw.get("trung_voi") or [] if i in corpus]
        specialty = str(raw.get("chuyen_khoa", "")).strip()
    if not draft or not guard.check_question(draft)[0]:
        draft = template_question(words, row)
    if not same_ids and row:
        same_ids = [item["id"] for item in lookup_by_code(row["ma"], corpus)]
    result["cau_hoi_nhap"] = draft
    result["trung"] = [corpus[i] for i in dict.fromkeys(same_ids)][:MAX_RESULTS]
    if doctors:
        if specialty not in specialties(doctors):
            specialty = SPECIALTY_BY_CODE.get(row["ma"], "") if row else ""
        result["chuyen_khoa"] = specialty
        result["bac_si"] = match_doctors(words, row, doctors, specialty)
    return result


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
