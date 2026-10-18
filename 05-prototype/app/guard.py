"""Hai lớp chặn an toàn của prototype.

Lớp trước: phân loại câu hỏi trước khi gọi model.
Lớp sau: kiểm tra câu trả lời của model trước khi hiển thị.

Danh sách từ khóa là của prototype, không phải tiêu chí phân loại cấp cứu đã được thẩm định.
"""

import re
import unicodedata

KHAN_CAP = "khan_cap"
Y_KHOA = "y_khoa"
TRONG_PHAM_VI = "trong_pham_vi"

# Mô tả triệu chứng cấp tính: dừng ngay, không gọi model.
URGENT_PATTERNS = [
    r"dau nguc", r"tuc nguc", r"kho tho", r"ngat xiu", r"bi ngat", r"bat tinh",
    r"co giat", r"liet nua nguoi", r"yeu nua nguoi", r"meo mieng",
    r"chay mau nhieu", r"non ra mau", r"di ngoai ra mau", r"sot cao",
    r"dau du doi", r"tu tu", r"muon chet", r"tu hai",
]

# Câu hỏi đòi diễn giải bệnh, tiên lượng hay điều trị: chuyển cho bác sĩ.
MEDICAL_PATTERNS = [
    r"bi benh", r"benh gi", r"mac benh", r"ung thu", r"tieu duong",
    r"co sao khong", r"co sao ko", r"nguy hiem", r"nghiem trong",
    r"uong thuoc", r"thuoc gi", r"dung thuoc", r"lieu luong", r"lieu dung",
    r"dieu tri", r"chua benh", r"chua tri", r"nen an", r"an kieng", r"kieng gi",
    r"co can di kham", r"co phai di kham", r"co can nhap vien",
]

# Câu trả lời của model không được chứa các ý này.
FORBIDDEN_OUTPUT_PATTERNS = [
    r"ban (dang )?bi ", r"ban (co the )?mac", r"ban co the bi", r"co the la (benh|dau hieu)",
    r"dau hieu cua benh", r"nguy co mac", r"chan doan (cua )?(ban|benh)", r"duoc chan doan",
    r"nen uong", r"hay uong", r"nen dung thuoc", r"lieu luong",
    r"khong sao dau", r"khong co gi (dang )?lo", r"khong can (phai )?lo", r"yen tam",
    r"khong can (phai )?di kham",
]

# Số điện thoại chỉ được lấy từ cấu hình đã kiểm chứng, không để model tự sinh.
PHONE_PATTERN = re.compile(r"(?<!\d)(0\d{2,3}[\s.]?\d{3,4}[\s.]?\d{3,4}|1900[\s.]?\d{4})(?!\d)")


def normalize(text: str) -> str:
    """Chữ thường, bỏ dấu tiếng Việt, gộp khoảng trắng."""
    text = text.lower().replace("đ", "d")
    text = unicodedata.normalize("NFD", text)
    text = "".join(c for c in text if unicodedata.category(c) != "Mn")
    return re.sub(r"\s+", " ", text).strip()


def _matches(text: str, patterns: list[str]) -> bool:
    return any(re.search(rf"\b{p}", text) for p in patterns)


def classify_question(question: str) -> str:
    text = normalize(question)
    if _matches(text, URGENT_PATTERNS):
        return KHAN_CAP
    if _matches(text, MEDICAL_PATTERNS):
        return Y_KHOA
    return TRONG_PHAM_VI


def check_answer(answer: str) -> tuple[bool, str]:
    """Trả về (đạt, lý do). Không đạt thì giao diện ẩn câu trả lời."""
    if PHONE_PATTERN.search(answer):
        return False, "có số điện thoại do model sinh ra"
    text = normalize(answer)
    for p in FORBIDDEN_OUTPUT_PATTERNS:
        if re.search(rf"\b{p}", text):
            return False, f"vượt ranh giới: {p}"
    return True, ""
