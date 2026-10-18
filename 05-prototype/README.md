# Prototype: Trợ lý đọc phiếu kết quả

Trạng thái: PROTO-V1, CHẠY ĐƯỢC TRÊN MÁY, CHƯA THỬ VỚI NGƯỜI DÙNG. Nội dung sẽ điều chỉnh theo need statement và kết quả thử.

- Tác vụ chính: giúp người bệnh đọc phiếu kết quả, chuẩn bị câu hỏi để mang tới bác sĩ và tìm lối ra dịch vụ (đặt tư vấn, gọi tổng đài).
- Nhu cầu giải quyết: [cập nhật sau khi chốt need statement]
- Demo: chạy local theo hướng dẫn bên dưới. Link deploy: [CHƯA ĐIỀN]
- Version dùng khi thử: proto-v1 (chưa gắn tag git)
- AI chạy thật hay mô phỏng: chạy thật, gọi OpenAI khi có API key. Nhánh khẩn cấp và nhánh câu hỏi y khoa không gọi model.
- Phần chưa tích hợp với MyVinmec: không đọc dữ liệu MyVinmec; phiếu là dữ liệu mô phỏng; nút "Đặt lịch tư vấn kết quả" chỉ hiển thị thông báo mô phỏng.

## Hướng dẫn chạy (PowerShell, từ thư mục gốc repo)

```powershell
pip install -r 05-prototype/app/requirements.txt
$env:OPENAI_API_KEY = "<key của bạn>"
$env:OPENAI_MODEL = "gpt-4o-mini"   # tùy chọn, mặc định gpt-4o-mini
streamlit run 05-prototype/app/app.py
```

Chạy test (không cần API key):

```powershell
python -m pytest 05-prototype/app
```

Đã kiểm tra ngày 19/10/2026 trên Windows, Python 3.14.4, streamlit 1.61.1, openai 2.48.0: 27/27 test đạt; server Streamlit khởi động và trả lời health check. Lời gọi OpenAI chưa được chạy thử trong lần kiểm tra này. Không commit API key; `.env` và `.streamlit/secrets.toml` đã nằm trong `.gitignore`.

## Thiết kế và quyết định

1. Input: một phiếu mô phỏng trong `mock-data/` và câu hỏi tự do hoặc câu hỏi nhanh của người dùng. Không nhận dữ liệu sức khỏe thật.
2. Luồng xử lý: câu hỏi qua lớp lọc `guard.classify_question`. Câu khẩn cấp dừng ngay và hiện số 115. Câu đòi diễn giải bệnh hay điều trị được chuyển thành câu hỏi cho bác sĩ. Câu còn lại gửi model cùng phiếu.
3. Nhiệm vụ của AI: giải thích cấu trúc phiếu, chữ viết tắt, nghĩa chung của chỉ số, vị trí so với khoảng tham chiếu in trên phiếu; gợi ý 2-4 câu hỏi cho bác sĩ. Prompt: [PR01](prompts/PR01-giai-thich-phieu-v1.md).
4. Kiểm tra output: `guard.check_answer` chặn câu chẩn đoán, khuyên dùng thuốc, trấn an và số điện thoại do model sinh ra. Câu trả lời bị chặn được thay bằng lời mời hỏi bác sĩ.
5. Lỗi, thiếu key, ngoài phạm vi: hiện thông báo lỗi kèm phần "Bước tiếp theo" (đặt tư vấn, tổng đài, tải danh sách câu hỏi). Không lưu log nội dung câu hỏi.
6. So với giải pháp không AI: một trang FAQ tĩnh trả lời được hai câu hỏi nhanh đầu tiên (các cột, ký hiệu H/L). Giá trị AI cần kiểm chứng khi thử: trả lời câu hỏi tự do về đúng phiếu của người dùng và gợi ý câu hỏi cho bác sĩ gắn với phiếu đó.

| Quyết định | Phương án được chọn | Phương án thay thế | Lý do | Trade-off |
|---|---|---|---|---|
| Giao diện | Streamlit, một file `app.py` | Next.js | Làm nhanh bằng Python, key giữ ở phía server | Giao diện ít tùy biến |
| Model | OpenAI Chat Completions, output JSON | Model khác | Ứng viên có sẵn API key OpenAI | Phụ thuộc dịch vụ ngoài; cần mạng |
| Lọc câu hỏi | Từ khóa, chạy trước model | Dùng model để phân loại | Kiểm thử được, không tốn lời gọi, nhánh khẩn cấp không phụ thuộc API | Bỏ sót cách diễn đạt lạ; có thể bắt nhầm |
| Dữ liệu | 2 phiếu tự mô phỏng | Phiếu thật đã che thông tin | Đề cấm dữ liệu thật của người bệnh | Phiếu mô phỏng có thể khác phiếu thật |

## Thành phần

- Mã nguồn: [app.py](app/app.py), [guard.py](app/guard.py), test [test_guard.py](app/test_guard.py) và [test_app.py](app/test_app.py)
- Dữ liệu mô phỏng: [phiếu 01](mock-data/mock-phieu-ket-qua-01.json), [phiếu 02](mock-data/mock-phieu-ket-qua-02.json)
- [Prompt PR01](prompts/PR01-giai-thich-phieu-v1.md)
- [Kế hoạch thử người dùng](user-testing/test-plan.md)
- [Tổng hợp thử nghiệm và thay đổi](user-testing/findings.md)
