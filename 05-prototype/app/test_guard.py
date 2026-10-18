"""Kiểm tra hai lớp chặn, chạy không cần API key: python -m pytest 05-prototype/app"""

import pytest

from guard import KHAN_CAP, TRONG_PHAM_VI, Y_KHOA, check_answer, classify_question


@pytest.mark.parametrize("question", [
    "Tôi đang đau ngực và khó thở",
    "toi bi ngat xiu sau khi lay mau",
    "Bố tôi bị méo miệng, nói ngọng",
    "Tôi muốn chết",
])
def test_urgent_questions_stop_before_model(question):
    assert classify_question(question) == KHAN_CAP


@pytest.mark.parametrize("question", [
    "Chỉ số này có sao không?",
    "Tôi nên uống thuốc gì?",
    "Tôi có bị bệnh tiểu đường không?",
    "Kết quả này có nguy hiểm không",
    "Tôi nên ăn kiêng gì",
])
def test_medical_questions_go_to_doctor(question):
    assert classify_question(question) == Y_KHOA


@pytest.mark.parametrize("question", [
    "Ký hiệu H nghĩa là gì?",
    "Các cột trên phiếu có nghĩa là gì?",
    "Liệt kê các chỉ số cao hơn khoảng tham chiếu",  # "liệt" không phải triệu chứng
    "Dữ liệu trên phiếu lấy từ đâu?",  # "liệu" không phải liều thuốc
    "Chẩn đoán hình ảnh là gì?",
    "GLU là viết tắt của gì",
])
def test_questions_about_reading_the_report_are_in_scope(question):
    assert classify_question(question) == TRONG_PHAM_VI


@pytest.mark.parametrize("answer", [
    "Kết quả cho thấy bạn bị tiểu đường.",
    "Không sao đâu, bạn cứ yên tâm.",
    "Bạn nên uống thuốc hạ mỡ máu.",
    "Chỉ số này có thể là dấu hiệu của bệnh gan.",
    "Bạn gọi 0912 345 678 để được tư vấn.",
])
def test_answers_crossing_the_boundary_are_blocked(answer):
    ok, _ = check_answer(answer)
    assert not ok


@pytest.mark.parametrize("answer", [
    "GLU là đường huyết lúc đói. Kết quả 6.4 cao hơn khoảng tham chiếu 3.9 - 6.1 in trên phiếu.",
    "Cột đơn vị cho biết kết quả được đo bằng gì, ví dụ mmol/L.",
    "Chẩn đoán hình ảnh gồm các kỹ thuật như X-quang, siêu âm.",
])
def test_plain_explanations_pass(answer):
    ok, reason = check_answer(answer)
    assert ok, reason
