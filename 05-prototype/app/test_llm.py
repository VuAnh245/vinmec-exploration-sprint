"""Kiểm tra phần đọc kết quả của model, không cần API key."""

import pytest

import llm


@pytest.mark.parametrize("text", [
    '{"ket_qua": []}',
    '```json\n{"ket_qua": []}\n```',
])
def test_parse_json_with_or_without_fence(text):
    assert llm.parse_json(text) == {"ket_qua": []}


def test_no_key_means_no_call():
    assert llm.ask("GLU", None, {}, None) is None
