# Prototype: Hỏi đáp kết quả xét nghiệm

Trạng thái: PROTO-V3.2, CHẠY ĐƯỢC TRÊN MÁY, CHƯA THỬ VỚI NGƯỜI DÙNG.

- Nhu cầu giải quyết: rút ngắn thời gian từ lúc có kết quả đến lúc có câu trả lời đáng tin ([need statement v3](../03-need-statement/need-statement.md), điểm đau ĐĐ2, ĐĐ3, ĐĐ5, ĐĐ6, ĐĐ7, ĐĐ8, ĐĐ10 trong [workflow](../02-journey-map/journey-map.md)). Prototype minh họa bằng chỉ số xét nghiệm; phỏng vấn cho thấy cùng vấn đề với câu hỏi sức khỏe sau khám nói chung.
- Tác vụ chính: một vòng khép kín gồm ba bước.
  1. Đẩy thay vì kéo: bài bác sĩ Vinmec đã viết hiện sẵn ngay dưới mỗi chỉ số có cờ trên phiếu, khớp theo mã chỉ số, không cần AI. Vẫn tìm được bằng câu tự gõ (AI tìm theo ý nghĩa, dẫn link gốc).
  2. Hỏi bác sĩ: khi chưa đủ, AI soạn lại lời người bệnh thành câu hỏi rõ ràng kèm đúng thông tin trên phiếu, báo câu tương tự đã có câu trả lời; người bệnh sửa rồi gửi riêng tư, tự chọn có cho Vinmec dùng câu hỏi đã ẩn danh để bổ sung kho hay không. AI không trả lời thay bác sĩ.
  3. Khép vòng phía Vinmec: bảng câu tìm không ra, chỉ số đang thiếu nội dung, câu hỏi đã gửi (câu giống nhau gom lại để bác sĩ trả lời một lần).
- Giao diện: bản mô phỏng điện thoại dựng lại MyVinmec để đặt thiết kế đề xuất vào đúng chỗ người bệnh sẽ gặp. Luôn hiện nhãn "BẢN MÔ PHỎNG · không phải ứng dụng thật"; không dùng ảnh hay logo gốc của Vinmec. Ảnh chụp các kịch bản: [screenshots/](screenshots/).
- Demo: chạy local theo hướng dẫn bên dưới. Chưa deploy; người chấm chạy local theo hướng dẫn
- Version hiện tại: proto-v3.2 (chưa gắn tag git; gắn tag trước phiên thử đầu tiên)
- AI chạy thật hay mô phỏng: chạy thật, gọi OpenAI khi có API key (PR02 tìm, PR03 soạn câu hỏi). Câu hỏi khẩn cấp không gọi model. Không có key: tìm theo từ khóa và soạn câu hỏi theo mẫu.
- Phần chưa tích hợp với MyVinmec: không đọc dữ liệu MyVinmec; phiếu là dữ liệu mô phỏng; kho nguồn chỉ có 11 trang công khai; không có bác sĩ thật nhận câu hỏi; dữ liệu phía Vinmec chỉ nằm trong bộ nhớ máy chủ của phiên chạy; các nút gọi, gửi yêu cầu chỉ hiện thông báo mô phỏng.
- Đo được ngay trên kho hiện tại: 5/6 chỉ số có cờ trong hai phiếu mô phỏng có bài hiện sẵn (GLU, CHOL, LDL-C, NEUT%, PLT); WBC chưa có bài và đi thẳng tới "Hỏi bác sĩ" (kiểm tra bằng `search.lookup_by_code` ngày 19/10/2026).

## Hai giao diện

| Giao diện | Dùng để | Chạy |
|---|---|---|
| Bản mô phỏng điện thoại (`app/mobile/`, máy chủ `app/server.py`) | Demo và thử với người dùng. Dựng lại các màn hình MyVinmec v3.0.5 đã chụp (Trang chủ, Tất cả dịch vụ, Cộng đồng hỏi đáp, Tìm kiếm, Bài viết, Liên hệ, Nhắc lịch uống thuốc, Sổ tiêm). Nút chuyển "Hiện trạng" (tái hiện đúng lỗi đã quan sát) và "Thiết kế đề xuất" (gắn tính năng mới vào đúng chỗ). Bảng bên trái ghi màn hình đang xem dựa trên bằng chứng nào | `python 05-prototype/app/server.py`, mở http://localhost:8600 |
| Giao diện kỹ thuật (`app/app.py`, Streamlit) | Đo và so sánh nhanh từng từ khóa | `streamlit run 05-prototype/app/app.py` |

Cả hai dùng chung `search.py`, `guard.py`, `llm.py` và prompt PR02.

Cách xem trước và sau: đổi chế độ giữ nguyên màn hình đang xem; mỗi thay đổi của thiết kế đề xuất có viền nét đứt và nhãn MỚI. Bảng "Điểm đau → thay đổi" bên trái có nút Trước và Sau cho từng điểm đau đã nêu trong phỏng vấn và quan sát:

| Điểm đau | Trước (hiện trạng) | Sau (đề xuất) | Link mở thẳng |
|---|---|---|---|
| ĐĐ2 Tìm câu hỏi của mình, không có kết quả | Màn hình tìm kiếm trống, không có lối đi tiếp | Thay màn hình trống bằng lời mời "Đặt câu hỏi cho bác sĩ" | `#dau-tim-khong-ra-truoc`, `#dau-tim-khong-ra-sau` |
| ĐĐ7 Tràn thông tin | Chuyên mục Tim mạch: danh sách dài phải lướt | Tìm trong chuyên mục; chỉ hiện 3 câu mới nhất, danh sách dài thu gọn | `#dau-tran-thong-tin-truoc`, `#dau-tran-thong-tin-sau` |
| ĐĐ8 Không gửi được câu hỏi, thẻ bác sĩ không hỏi được, không biết bác sĩ giỏi lĩnh vực gì | Thẻ bác sĩ chỉ có tên và nút "Xem"; không có nút đặt câu hỏi | Thẻ bác sĩ ghi chuyên khoa, lĩnh vực chuyên sâu, số câu đã trả lời; nút "Hỏi bác sĩ này"; luồng hỏi 3 bước gợi ý bác sĩ phù hợp kèm lý do | `#dau-khong-hoi-duoc-truoc`, `#dau-khong-hoi-duoc-sau` |
| ĐĐ9 12 chủ đề cố định | Phải tự xếp câu hỏi vào 12 chủ đề | Đặt câu hỏi không cần chọn chủ đề; câu hỏi được chuyển tới chuyên khoa phù hợp (mô phỏng) | `#dau-chu-de-truoc`, `#dau-chu-de-sau` |
| ĐĐ3, ĐĐ4 "GLU" lệch ý, mở sai bài | Tìm "GLU" ra bài thuốc và bài nước tiểu; bài đầu mở sai | Bài bác sĩ viết về GLU hiện sẵn dưới chỉ số trên phiếu | `#dau-glu-truoc`, `#dau-glu-sau` |

Trang chuyên mục chỉ dựng lại Tim mạch (đã chụp ảnh): 3 tiêu đề đầu là tiêu đề thật ngày 08/07/2024, không chép phần thân câu hỏi có tuổi và chỉ số của người hỏi; các thẻ xám chỉ tái hiện độ dài danh sách; tên bác sĩ được ẩn. Có hiệu ứng chuyển màn hình, sheet trượt lên, phản hồi khi bấm và khung tải nhấp nháy.

Dẫn đường người dùng (proto-v3.2): Cộng đồng hỏi đáp mở đầu bằng khung "Bạn đang thắc mắc điều gì?" với 3 bước và 2 nút rõ ràng (Tìm câu trả lời, Hỏi bác sĩ), gợi ý "Bắt đầu tại đây" cho lần đầu, hàng "Bác sĩ trả lời nhiều nhất" mở hồ sơ bác sĩ. Luồng hỏi bác sĩ có thanh tiến trình 3 bước (Câu hỏi, Bác sĩ phù hợp, Xem lại và gửi); màn hình đã gửi có các mốc trạng thái. Bác sĩ, lĩnh vực và số câu đã trả lời trong [mock-bac-si.json](mock-data/mock-bac-si.json) là dữ liệu mô phỏng, có nhãn trên giao diện; việc ghép bác sĩ do `search.match_doctors` làm theo lĩnh vực và chuyên khoa, không do model chọn.

Bản mô phỏng dựng lại theo ảnh chụp, dùng biểu tượng đơn giản thay hình gốc: giống bố cục, không giống từng điểm ảnh. Tab Hồ sơ và màn hình phiếu kết quả chưa quan sát được trên app thật (O5), nên ở chế độ đề xuất đây là màn hình thiết kế mới, có ghi chú trên bảng bên trái. Đường link mở thẳng kịch bản: `http://localhost:8600/#kich-ban-1` đến `#kich-ban-5`.

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

Đã kiểm tra ngày 19/10/2026 trên Windows, Python 3.14.4, streamlit 1.61.1, openai 2.48.0: 61/61 test đạt; máy chủ bản mô phỏng và server Streamlit đều khởi động được; chụp màn hình Chrome headless cho 4 kịch bản hiển thị đúng. Lời gọi OpenAI chưa được chạy thử trong lần kiểm tra này. Không commit API key; `.env` và `.streamlit/secrets.toml` đã nằm trong `.gitignore`.

## Thiết kế và quyết định

1. Input: một chỉ số có cờ trên phiếu mô phỏng (bấm chip) hoặc câu hỏi tự gõ. Không nhận dữ liệu sức khỏe thật.
2. Luồng xử lý: câu hỏi qua `guard.classify_question`. Câu khẩn cấp dừng ngay và hiện số 115. Các câu còn lại gửi model cùng chỉ mục 11 bài; câu hỏi cần chuyên môn vẫn được tìm bài nhưng hiện cảnh báo và giữ câu hỏi để hỏi bác sĩ. Song song, app chạy tìm theo từ khóa để so sánh.
3. Nhiệm vụ của AI: (a) tìm: hiểu câu hỏi (chữ viết tắt trên phiếu, câu thiếu chữ, không dấu), chọn tối đa 3 bài, nói vì sao bài phù hợp và mục nên đọc trước, gợi ý câu hỏi cho bác sĩ ([PR02](prompts/PR02-tim-va-dan-nguon-v1.md)); (b) soạn câu hỏi gửi bác sĩ từ lời người bệnh và dòng trên phiếu, chỉ ra bài đã trả lời câu tương tự, gợi ý chuyên khoa ([PR03 v2](prompts/PR03-soan-cau-hoi-bac-si-v2.md)). AI không giải thích kết quả và không trả lời thay bác sĩ. Bước ① (bài hiện sẵn trên phiếu) và việc gom câu hỏi trùng phía Vinmec không dùng AI.
4. Kiểm tra output: `search.clean_result` bỏ id không có trong kho, bỏ tên mục không có thật, cắt còn 3 bài; lý do và câu hỏi đi qua `guard.check_answer`. Đường dẫn lấy từ kho, không lấy từ model.
5. Lỗi, thiếu key, ngoài phạm vi: hiện thông báo lỗi, vẫn hiện kết quả tìm theo từ khóa và phần "Bước tiếp theo". Không lưu log nội dung câu hỏi.
6. So với giải pháp không AI: tìm theo từ khóa (bỏ dấu, khớp từng từ trong tiêu đề) đã tìm được "men gan cao" và "ALT", nhưng không tìm được "GLU", "duong huyet cao", "đường huyết lúc đói cao" (xem `test_search.py`). Một số lỗi trên app thật, như kết quả mở sai bài, sửa được bằng làm sạch dữ liệu. Giá trị AI cần kiểm chứng: hiểu chữ viết tắt theo ngữ cảnh phiếu và câu hỏi tự nhiên.

| Quyết định | Phương án được chọn | Phương án thay thế | Lý do | Trade-off |
|---|---|---|---|---|
| Phạm vi giải pháp | Vòng khép kín: bài hiện sẵn, hỏi bác sĩ có chống trùng, bảng phía Vinmec (proto-v3) | Chỉ tìm kiếm tốt hơn (proto-v2) | Tìm kiếm không giúp được khi kho chưa có câu trả lời; một phần lỗi tìm kiếm sửa được không cần AI; vòng khép kín mang giá trị cho người bệnh, bác sĩ và Vinmec | Thêm dữ liệu câu hỏi chứa thông tin sức khỏe, phải gửi riêng tư và xin đồng ý (RR09) |
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
- Prompt: [PR02](prompts/PR02-tim-va-dan-nguon-v1.md) và [PR03 v2](prompts/PR03-soan-cau-hoi-bac-si-v2.md) (đang dùng), [PR03 v1](prompts/PR03-soan-cau-hoi-bac-si-v1.md) (proto-v3), [PR01](prompts/PR01-giai-thich-phieu-v1.md) (proto-v1, không còn dùng)
- [Kế hoạch thử người dùng](user-testing/test-plan.md)
- [Tổng hợp thử nghiệm và thay đổi](user-testing/findings.md)
