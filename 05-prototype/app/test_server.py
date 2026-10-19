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


ROW = {"ma": "WBC", "ten": "Số lượng bạch cầu", "ket_qua": 11.2, "don_vi": "G/L", "khoang_tham_chieu": "4.0 - 10.0", "co": "H"}


def get(base_url, path):
    with urllib.request.urlopen(f"{base_url}{path}") as res:
        return json.loads(res.read())


def test_data_maps_report_codes_to_articles(base_url):
    data = get(base_url, "/api/data")
    assert data["theo_chi_so"]["GLU"] == ["K01", "K02"]
    assert data["theo_chi_so"]["WBC"] == []


def post_to(base_url, path, payload):
    req = urllib.request.Request(f"{base_url}{path}", data=json.dumps(payload).encode("utf-8"),
                                 headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req) as res:
        return json.loads(res.read())


def test_closed_loop_records_gaps_for_vinmec(base_url):
    server.STORE.__init__()
    post(base_url, {"cau_hoi": "duong huyet cao"})
    draft = post_to(base_url, "/api/draft", {"loi_nguoi_benh": "", "dong_phieu": ROW})
    assert "WBC" in draft["cau_hoi_nhap"] and draft["trung"] == []
    sent = post_to(base_url, "/api/send", {"cau_hoi": draft["cau_hoi_nhap"], "dong_phieu": ROW,
                                           "dong_y_bo_sung_kho": True, "trung_voi": []})
    assert sent["da_gui"] is True
    view = get(base_url, "/api/vinmec")
    assert view["tim_khong_ra"] == [{"cau_hoi": "duong huyet cao", "so_lan": 1}]
    assert view["chi_so_thieu_noi_dung"] == [{"ma": "WBC", "so_lan": 1}]
    assert view["cau_hoi_da_gui"][0]["dong_y_bo_sung_kho"] is True

    post_to(base_url, "/api/send", {"cau_hoi": draft["cau_hoi_nhap"], "dong_phieu": ROW, "trung_voi": []})
    view = get(base_url, "/api/vinmec")
    assert len(view["cau_hoi_da_gui"]) == 1 and view["cau_hoi_da_gui"][0]["so_lan"] == 2


def test_send_refuses_urgent_text(base_url):
    assert post_to(base_url, "/api/send", {"cau_hoi": "Tôi đang đau ngực"})["da_gui"] is False
