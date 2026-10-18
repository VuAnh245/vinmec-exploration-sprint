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


def test_loads_mock_report_with_disclaimer(app):
    assert "không phải sản phẩm của Vinmec" in app.warning[0].value
    assert "Không nhập thông tin cá nhân" in app.warning[0].value
    assert "MÔ PHỎNG" in app.caption[0].value


def test_urgent_question_shows_emergency_number(app):
    app.chat_input[0].set_value("Tôi đang đau ngực và khó thở").run()
    assert any("115" in e.value for e in app.error)


def test_medical_question_is_redirected_to_doctor(app):
    app.chat_input[0].set_value("Tôi có bị bệnh tiểu đường không?").run()
    assert any("cần bác sĩ trả lời" in w.value for w in app.warning)


def test_missing_api_key_still_offers_next_steps(app):
    app.chat_input[0].set_value("GLU là gì?").run()
    assert any("Chưa kết nối được dịch vụ AI" in e.value for e in app.error)
    assert any(b.label == "Gọi tổng đài dịch vụ" for b in app.button)
