"""Kiểm tra máy chủ của bản mô phỏng điện thoại, không cần API key."""

import json
import threading
import urllib.error
import urllib.request
from http.server import ThreadingHTTPServer

import pytest

import server


@pytest.fixture
def base_url(monkeypatch):
    monkeypatch.setenv("OPENAI_API_KEY", "")
    httpd = ThreadingHTTPServer(("127.0.0.1", 0), server.Handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    yield f"http://127.0.0.1:{httpd.server_address[1]}"
    httpd.shutdown()
    httpd.server_close()


def post(base_url, payload):
    req = urllib.request.Request(f"{base_url}/api/search", data=json.dumps(payload).encode("utf-8"),
                                 headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req) as res:
        return json.loads(res.read())


def test_serves_page_and_data(base_url):
    with urllib.request.urlopen(f"{base_url}/") as res:
        assert "BẢN MÔ PHỎNG" in res.read().decode("utf-8")
    with urllib.request.urlopen(f"{base_url}/api/data") as res:
        data = json.loads(res.read())
    assert len(data["bai"]) == 11 and len(data["phieu"]) == 2 and data["co_ai"] is False


def test_urgent_question(base_url):
    assert post(base_url, {"cau_hoi": "Tôi đang đau ngực"})["loai"] == "khan_cap"


def test_without_key_returns_keyword_results(base_url):
    result = post(base_url, {"cau_hoi": "ALT", "dong_phieu": {"ma": "ALT"}})
    assert result["loi_ai"] is True
    assert [b["id"] for b in result["tu_khoa"]] == ["K05"]


def test_rejects_empty_question(base_url):
    with pytest.raises(urllib.error.HTTPError) as err:
        post(base_url, {"cau_hoi": "  "})
    assert err.value.code == 400
