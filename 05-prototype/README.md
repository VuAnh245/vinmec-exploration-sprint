# Prototype: Hỏi đáp kết quả xét nghiệm

Trạng thái: PROTO-V2, CHẠY ĐƯỢC TRÊN MÁY, CHƯA THỬ VỚI NGƯỜI DÙNG.

- Nhu cầu giải quyết: người bệnh vừa nhận kết quả không tìm được nội dung phù hợp trong kho kiến thức và hỏi đáp bác sĩ có sẵn ([need statement](../03-need-statement/need-statement.md), điểm đau ĐĐ2, ĐĐ3, ĐĐ5, ĐĐ6 trong [workflow](../02-journey-map/journey-map.md)).
- Tác vụ chính: từ một chỉ số có cờ trên phiếu, hoặc một câu hỏi tự gõ, tìm đúng bài bác sĩ Vinmec đã viết, có dẫn link gốc, kèm câu hỏi để mang tới bác sĩ và lối ra dịch vụ.
- Giao diện: bản mô phỏng điện thoại dựng lại MyVinmec để đặt thiết kế đề xuất vào đúng chỗ người bệnh sẽ gặp. Luôn hiện nhãn "BẢN MÔ PHỎNG · không phải ứng dụng thật"; không dùng ảnh hay logo gốc của Vinmec. Ảnh chụp các kịch bản: [screenshots/](screenshots/).
- Demo: chạy local theo hướng dẫn bên dưới. Link deploy: [CHƯA ĐIỀN]
- Version dùng khi thử: proto-v2 (chưa gắn tag git)
- AI chạy thật hay mô phỏng: chạy thật, gọi OpenAI khi có API key. Câu hỏi khẩn cấp không gọi model.
- Phần chưa tích hợp với MyVinmec: không đọc dữ liệu MyVinmec; phiếu là dữ liệu mô phỏng; kho nguồn chỉ có 11 trang công khai; ba nút "Bước tiếp theo" chỉ hiện thông báo mô phỏng.

## Hai giao diện

| Giao diện | Dùng để | Chạy |
|---|---|---|
| **Bản mô phỏng điện thoại** (`app/mobile/`, máy chủ `app/server.py`) | Demo và thử với người dùng. Dựng lại các màn hình MyVinmec v3.0.5 đã chụp (Trang chủ, Tất cả dịch vụ, Cộng đồng hỏi đáp, Tìm kiếm, Bài viết, Liên hệ, Nhắc lịch uống thuốc, Sổ tiêm). Nút chuyển **Hiện trạng** (tái hiện đúng lỗi đã quan sát) và **Thiết kế đề xuất** (gắn tính năng mới vào đúng chỗ). Bảng bên trái ghi màn hình đang xem dựa trên bằng chứng nào | `python 05-prototype/app/server.py`, mở http://localhost:8600 |
| Giao diện kỹ thuật (`app/app.py`, Streamlit) | Đo và so sánh nhanh từng từ khóa | `streamlit run 05-prototype/app/app.py` |

Cả hai dùng chung `search.py`, `guard.py`, `llm.py` và prompt PR02.

Bản mô phỏng dựng lại theo ảnh chụp, dùng biểu tượng đơn giản thay hình gốc: giống bố cục, không giống từng điểm ảnh. Tab Hồ sơ và màn hình phiếu kết quả chưa quan sát được trên app thật (O5), nên ở chế độ đề xuất đây là màn hình thiết kế mới, có ghi chú trên bảng bên trái. Đường link mở thẳng kịch bản: `http://localhost:8600/#kich-ban-1` đến `#kich-ban-4`.

## Hướng dẫn chạy (PowerShell, từ thư mục gốc repo)

```powershell
pip install -r 05-prototype/app/requirements.txt
python 05-prototype/app/server.py
```

Cả hai giao diện tự nạp `OPENAI_API_KEY` và `OPENAI_MODEL` (mặc định `gpt-4o-mini`) từ file `.env` ở gốc repo nếu có; biến đặt trong terminal được ưu tiên. Không có key thì chế độ đề xuất chỉ hiện kết quả tìm theo từ khóa.

Chạy test (không cần API key):

```powershell
python -m pytest 05-prototype/app
```

Đã kiểm tra ngày 19/10/2026 trên Windows, Python 3.14.4, streamlit 1.61.1, openai 2.48.0: 45/45 test đạt; máy chủ bản mô phỏng và server Streamlit đều khởi động được; chụp màn hình Chrome headless cho 4 kịch bản hiển thị đúng. Lời gọi OpenAI chưa được chạy thử trong lần kiểm tra này. Không commit API key; `.env` và `.streamlit/secrets.toml` đã nằm trong `.gitignore`.

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
| Giao diện | HTML/JS khung điện thoại dựng lại MyVinmec, máy chủ Python thư viện chuẩn | Chỉ dùng Streamlit; Figma | Người thử bấm như trên app thật; so được hiện trạng và đề xuất trên cùng một màn hình; key nằm ở máy chủ; không cần cài thêm thư viện | Phải tự dựng lại giao diện; không giống từng điểm ảnh |
| Lọc câu hỏi | Từ khóa, chạy trước model | Dùng model để phân loại | Kiểm thử được, nhánh khẩn cấp không phụ thuộc API | Bỏ sót cách diễn đạt lạ |

## Thành phần

- Bản mô phỏng điện thoại: [index.html](app/mobile/index.html), [app.js](app/mobile/app.js), [style.css](app/mobile/style.css), máy chủ [server.py](app/server.py)
- Giao diện kỹ thuật: [app.py](app/app.py)
- Dùng chung: [search.py](app/search.py) (tìm và làm sạch kết quả), [guard.py](app/guard.py) (hai lớp chặn), [llm.py](app/llm.py) (gọi model, nạp `.env`)
- Test: [test_guard.py](app/test_guard.py), [test_search.py](app/test_search.py), [test_app.py](app/test_app.py), [test_server.py](app/test_server.py)
- Kho nguồn: [kho-bai-viet-vinmec.json](nguon-noi-dung/kho-bai-viet-vinmec.json)
- Dữ liệu mô phỏng: [phiếu 01](mock-data/mock-phieu-ket-qua-01.json), [phiếu 02](mock-data/mock-phieu-ket-qua-02.json)
- Prompt: [PR02](prompts/PR02-tim-va-dan-nguon-v1.md) (đang dùng), [PR01](prompts/PR01-giai-thich-phieu-v1.md) (proto-v1, không còn dùng)
- [Kế hoạch thử người dùng](user-testing/test-plan.md)
- [Tổng hợp thử nghiệm và thay đổi](user-testing/findings.md)
