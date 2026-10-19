"""Chạy giao diện không cần API key, kiểm tra các nhánh không gọi model."""

from pathlib import Path

import pytest
from streamlit.testing.v1 import AppTest

APP = str(Path(__file__).with_name("app.py"))


@pytest.fixture
def app(monkeypatch):
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    at = AppTest.from_file(APP, default_timeout=30)
    at.run()
    assert not at.exception
    return at


def search_for(app, text):
    app.text_input[0].set_value(text)
    app.button(key="FormSubmitter:tim-kiem-Tìm").click().run()
    assert not app.exception


def test_loads_with_disclaimer(app):
    assert "không phải sản phẩm của Vinmec" in app.warning[0].value
    assert "Không nhập thông tin cá nhân" in app.warning[0].value


def test_flagged_rows_become_search_chips(app):
    labels = [b.label for b in app.button]
    assert any(label.startswith("GLU ·") for label in labels)


def test_urgent_question_shows_emergency_number(app):
    search_for(app, "Tôi đang đau ngực và khó thở")
    assert any("115" in e.value for e in app.error)


def test_medical_question_is_redirected_to_doctor(app):
    search_for(app, "Tôi có bị bệnh tiểu đường không?")
    assert any("cần bác sĩ trả lời" in w.value for w in app.warning)


def test_missing_api_key_still_offers_keyword_results_and_next_steps(app):
    search_for(app, "men gan cao")
    assert any("Chưa kết nối được dịch vụ AI" in e.value for e in app.error)
    assert any("(1 kết quả)" in e.label for e in app.expander)
    assert any(b.label == "Gửi yêu cầu CSKH 24/07" for b in app.button)
