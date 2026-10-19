# Prototype: Hỏi đáp kết quả xét nghiệm

Trạng thái: PROTO-V2, CHẠY ĐƯỢC TRÊN MÁY, CHƯA THỬ VỚI NGƯỜI DÙNG.

- Nhu cầu giải quyết: người bệnh vừa nhận kết quả không tìm được nội dung phù hợp trong kho kiến thức và hỏi đáp bác sĩ có sẵn ([need statement](../03-need-statement/need-statement.md), điểm đau ĐĐ2, ĐĐ3, ĐĐ5, ĐĐ6 trong [workflow](../02-journey-map/journey-map.md)).
- Tác vụ chính: từ một chỉ số có cờ trên phiếu, hoặc một câu hỏi tự gõ, tìm đúng bài bác sĩ Vinmec đã viết, có dẫn link gốc, kèm câu hỏi để mang tới bác sĩ và lối ra dịch vụ.
- Giao diện: mô phỏng bố cục mục "Cộng đồng hỏi đáp bác sĩ" (thanh tiêu đề màu xanh, khung số liệu, ô tìm kiếm, thẻ kết quả) để người thử thấy quen. Không dùng tên hay logo Vinmec làm tên sản phẩm.
- Demo: chạy local theo hướng dẫn bên dưới. Link deploy: [CHƯA ĐIỀN]
- Version dùng khi thử: proto-v2 (chưa gắn tag git)
- AI chạy thật hay mô phỏng: chạy thật, gọi OpenAI khi có API key. Câu hỏi khẩn cấp không gọi model.
- Phần chưa tích hợp với MyVinmec: không đọc dữ liệu MyVinmec; phiếu là dữ liệu mô phỏng; kho nguồn chỉ có 11 trang công khai; ba nút "Bước tiếp theo" chỉ hiện thông báo mô phỏng.

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

Đã kiểm tra ngày 19/10/2026 trên Windows, Python 3.14.4, streamlit 1.61.1, openai 2.48.0: 41/41 test đạt; server Streamlit khởi động và trả lời health check. Lời gọi OpenAI chưa được chạy thử trong lần kiểm tra này. Không commit API key; `.env` và `.streamlit/secrets.toml` đã nằm trong `.gitignore`.

## Thiết kế và quyết định

1. Input: một chỉ số có cờ trên phiếu mô phỏng (bấm chip) hoặc câu hỏi tự gõ. Không nhận dữ liệu sức khỏe thật.
2. Luồng xử lý: câu hỏi qua `guard.classify_question`. Câu khẩn cấp dừng ngay và hiện số 115. Các câu còn lại gửi model cùng chỉ mục 11 bài; câu hỏi cần chuyên môn vẫn được tìm bài nhưng hiện cảnh báo và giữ câu hỏi để hỏi bác sĩ. Song song, app chạy tìm theo từ khóa để so sánh.
3. Nhiệm vụ của AI: hiểu câu hỏi (chữ viết tắt trên phiếu, câu thiếu chữ, không dấu), chọn tối đa 3 bài, nói vì sao bài phù hợp và mục nên đọc trước, gợi ý câu hỏi cho bác sĩ. AI không giải thích kết quả. Prompt: [PR02](prompts/PR02-tim-va-dan-nguon-v1.md).
4. Kiểm tra output: `search.clean_result` bỏ id không có trong kho, bỏ tên mục không có thật, cắt còn 3 bài; lý do và câu hỏi đi qua `guard.check_answer`. Đường dẫn lấy từ kho, không lấy từ model.
5. Lỗi, thiếu key, ngoài phạm vi: hiện thông báo lỗi, vẫn hiện kết quả tìm theo từ khóa và phần "Bước tiếp theo". Không lưu log nội dung câu hỏi.
6. So với giải pháp không AI: tìm theo từ khóa (bỏ dấu, khớp từng từ trong tiêu đề) đã tìm được "men gan cao" và "ALT", nhưng không tìm được "GLU", "duong huyet cao", "đường huyết lúc đói cao" (xem `test_search.py`). Một số lỗi trên app thật, như kết quả mở sai bài, sửa được bằng làm sạch dữ liệu. Giá trị AI cần kiểm chứng: hiểu chữ viết tắt theo ngữ cảnh phiếu và câu hỏi tự nhiên.

| Quyết định | Phương án được chọn | Phương án thay thế | Lý do | Trade-off |
|---|---|---|---|---|
| Vai trò AI | Chọn bài và dẫn nguồn (proto-v2) | Tự giải thích phiếu (proto-v1) | Need statement đổi sau kiểm thử tìm kiếm trên app; nội dung do bác sĩ viết an toàn hơn câu chữ model tự sinh | Chỉ trả lời được trong phạm vi kho nguồn |
| Kho nguồn | Chỉ mục 11 trang công khai trên vinmec.com (tiêu đề, link, người tư vấn, tên mục) | Chép nội dung bài | Dữ liệu công khai không mặc nhiên được phép phân phối lại | Model chọn bài dựa trên tiêu đề và tên mục, không đọc nội dung |
| Lối ra dịch vụ | Theo đúng MyVinmec: CSKH 24/07, gọi bệnh viện nơi khám, tư vấn với bác sĩ | Một số tổng đài chung | Quan sát O9: app không có số tổng đài chung | Bản thử không nối được tới kênh thật |
| Giao diện | Streamlit, bố cục giống mục Cộng đồng hỏi đáp | Next.js | Làm nhanh bằng Python; người thử thấy quen | Giao diện ít tùy biến |
| Lọc câu hỏi | Từ khóa, chạy trước model | Dùng model để phân loại | Kiểm thử được, nhánh khẩn cấp không phụ thuộc API | Bỏ sót cách diễn đạt lạ |

## Thành phần

- Mã nguồn: [app.py](app/app.py) (giao diện), [search.py](app/search.py) (tìm và làm sạch kết quả), [guard.py](app/guard.py) (hai lớp chặn)
- Test: [test_guard.py](app/test_guard.py), [test_search.py](app/test_search.py), [test_app.py](app/test_app.py)
- Kho nguồn: [kho-bai-viet-vinmec.json](nguon-noi-dung/kho-bai-viet-vinmec.json)
- Dữ liệu mô phỏng: [phiếu 01](mock-data/mock-phieu-ket-qua-01.json), [phiếu 02](mock-data/mock-phieu-ket-qua-02.json)
- Prompt: [PR02](prompts/PR02-tim-va-dan-nguon-v1.md) (đang dùng), [PR01](prompts/PR01-giai-thich-phieu-v1.md) (proto-v1, không còn dùng)
- [Kế hoạch thử người dùng](user-testing/test-plan.md)
- [Tổng hợp thử nghiệm và thay đổi](user-testing/findings.md)
