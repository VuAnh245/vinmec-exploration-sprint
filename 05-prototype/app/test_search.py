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


GLU_ROW = {"ma": "GLU", "ten": "Glucose (đường huyết lúc đói)", "ket_qua": 6.4, "don_vi": "mmol/L",
           "khoang_tham_chieu": "3.9 - 6.1", "co": "H"}


@pytest.mark.parametrize("code, expected", [
    ("GLU", ["K01", "K02"]),
    ("NEUT%", ["K08"]),
    ("WBC", []),
])
def test_lookup_by_code_shows_articles_without_ai(code, expected):
    from search import lookup_by_code
    assert ids(lookup_by_code(code, CORPUS)) == expected


def test_draft_without_key_uses_template_with_report_values():
    from search import soan_cau_hoi
    result = soan_cau_hoi("Tôi hơi lo", GLU_ROW, CORPUS, lambda w, r: None)
    assert result["loi_ai"]
    assert "GLU" in result["cau_hoi_nhap"] and "6.4" in result["cau_hoi_nhap"] and "Tôi hơi lo" in result["cau_hoi_nhap"]
    assert ids(result["trung"]) == ["K01", "K02"]


def test_draft_replaces_unsafe_model_text_and_unknown_ids():
    from search import soan_cau_hoi
    raw = {"cau_hoi_nhap": "Bạn bị tiểu đường rồi, không sao đâu.", "trung_voi": ["K99", "K02"]}
    result = soan_cau_hoi("", GLU_ROW, CORPUS, lambda w, r: raw)
    assert "tiểu đường rồi" not in result["cau_hoi_nhap"]
    assert ids(result["trung"]) == ["K02"]


def test_draft_keeps_medication_questions_for_doctor():
    from search import soan_cau_hoi
    raw = {"cau_hoi_nhap": "Với GLU 6.4 mmol/L, tôi có nên uống thuốc không?", "trung_voi": []}
    assert "nên uống thuốc" in soan_cau_hoi("", GLU_ROW, CORPUS, lambda w, r: raw)["cau_hoi_nhap"]


def test_draft_stops_on_urgent_words():
    from search import soan_cau_hoi
    def ask(words, row):
        raise AssertionError("không được gọi model")
    assert soan_cau_hoi("tôi đang khó thở", GLU_ROW, CORPUS, ask)["loai"] == guard.KHAN_CAP
