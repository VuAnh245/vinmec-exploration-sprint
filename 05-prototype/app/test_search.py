"""Kiểm tra tìm theo từ khóa và lớp làm sạch kết quả của model, không cần API key."""

import pytest

import guard
from search import clean_result, keyword_search, load_corpus, tra_loi

CORPUS = load_corpus()


def ids(items):
    return [i["id"] for i in items]


def test_corpus_has_eleven_vinmec_pages():
    assert len(CORPUS) == 11
    assert all(item["url"].startswith("https://www.vinmec.com/") for item in CORPUS.values())


@pytest.mark.parametrize("query, expected", [
    ("men gan cao", ["K04"]),
    ("ALT", ["K05"]),
])
def test_keyword_search_finds_exact_words_in_title(query, expected):
    assert ids(keyword_search(query, CORPUS)) == expected


@pytest.mark.parametrize("query", ["GLU", "duong huyet cao", "đường huyết lúc đói cao"])
def test_keyword_search_misses_abbreviations_and_free_questions(query):
    # Giới hạn của cách tìm thông thường: đây là chỗ cần tìm theo ý nghĩa.
    assert keyword_search(query, CORPUS) == []


def test_clean_result_keeps_only_known_ids_and_real_sections():
    raw = {
        "hieu_cau_hoi": "Bạn muốn biết GLU trên phiếu máu là gì.",
        "ket_qua": [
            {"id": "K99", "ly_do": "Bài không tồn tại"},
            {"id": "K01", "ly_do": "Bài giải thích glucose máu.", "muc_nen_doc": "Glucose là gì?"},
            {"id": "K01", "ly_do": "Trùng"},
            {"id": "K02", "ly_do": "Bài về xét nghiệm đường huyết.", "muc_nen_doc": "Mục bịa ra"},
        ],
        "cau_hoi_cho_bac_si": ["Chỉ số GLU của tôi cần theo dõi thế nào?"],
    }
    result = clean_result(raw, CORPUS)
    assert [r["bai"]["id"] for r in result["ket_qua"]] == ["K01", "K02"]
    assert result["ket_qua"][0]["muc_nen_doc"] == "Glucose là gì?"
    assert result["ket_qua"][1]["muc_nen_doc"] == ""


def test_clean_result_caps_at_three_and_blanks_unsafe_reasons():
    raw = {"ket_qua": [
        {"id": "K01", "ly_do": "Kết quả cho thấy bạn bị tiểu đường."},
        {"id": "K02", "ly_do": "Gọi 0912 345 678 để hỏi."},
        {"id": "K09", "ly_do": "Bài liệt kê các chỉ số sinh hóa."},
        {"id": "K11", "ly_do": "Bài thứ tư."},
    ], "cau_hoi_cho_bac_si": ["Bạn nên uống thuốc gì?", "Tôi cần làm xét nghiệm lại không?"]}
    result = clean_result(raw, CORPUS)
    assert [r["bai"]["id"] for r in result["ket_qua"]] == ["K01", "K02", "K09"]
    assert result["ket_qua"][0]["ly_do"] == ""
    assert result["ket_qua"][1]["ly_do"] == ""
    assert result["cau_hoi"] == ["Tôi cần làm xét nghiệm lại không?"]


def test_urgent_question_never_calls_model():
    def ask(query, row):
        raise AssertionError("không được gọi model")
    result = tra_loi("Bố tôi đột ngột khó nói, yếu chân tay", None, CORPUS, ask)
    assert result["loai"] == guard.KHAN_CAP


def test_medical_question_keeps_question_for_doctor():
    result = tra_loi("Men gan cao có nguy hiểm không?", None, CORPUS,
                     lambda q, r: {"ket_qua": [{"id": "K04", "ly_do": "Bài của bác sĩ về men gan cao."}]})
    assert result["loai"] == guard.Y_KHOA
    assert result["cau_hoi"][0] == "Men gan cao có nguy hiểm không?"
    assert [r["bai"]["id"] for r in result["ket_qua"]] == ["K04"]


def test_missing_key_or_model_error_falls_back_to_keyword_search():
    no_key = tra_loi("men gan cao", None, CORPUS, lambda q, r: None)
    assert no_key["loi_ai"] and ids(no_key["tu_khoa"]) == ["K04"]

    def broken(query, row):
        raise RuntimeError("API lỗi")
    assert tra_loi("ALT", None, CORPUS, broken)["loi_ai"]
