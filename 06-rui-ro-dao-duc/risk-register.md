# Rủi ro và giảm thiểu

Trạng thái: ĐÃ ĐÁNH GIÁ THEO PROTO-V1, CHƯA CÓ KẾT QUẢ THỬ VỚI NGƯỜI DÙNG.

Rủi ro lớn nhất là AI trượt từ "giải thích cách đọc phiếu" sang "diễn giải bệnh". Mỗi biện pháp dưới đây gắn với một phần cụ thể trong code và có cách kiểm chứng.

| ID | Tình huống gây rủi ro | Người bị ảnh hưởng | Hậu quả | Mức độ và lý do | Giảm thiểu | Cách kiểm chứng | Rủi ro còn lại |
|---|---|---|---|---|---|---|---|
| RR01 | AI nói kết quả cho thấy một bệnh, khuyên dùng thuốc, hoặc trấn an sai | Người bệnh | Hoảng sợ hoặc chủ quan, bỏ lỡ tư vấn | Cao: đây là ranh giới chính của sản phẩm | System prompt PR01 cấm rõ; `guard.check_answer` ẩn câu trả lời có ý chẩn đoán, khuyên thuốc, trấn an và thay bằng lời mời hỏi bác sĩ | `test_guard.py`: 5 câu trả lời vượt ranh giới bị chặn, 3 câu giải thích hợp lệ được qua | Model diễn đạt lách qua danh sách từ khóa; cần chạy thêm bộ câu hỏi vượt ranh giới với model thật |
| RR02 | Người dùng mô tả triệu chứng cấp tính | Người bệnh | Chậm cấp cứu nếu chờ AI trả lời | Cao: hậu quả nghiêm trọng dù hiếm | `guard.classify_question` nhận diện từ khóa khẩn cấp trước khi gọi model; giao diện hiện số 115 và dừng xử lý | `test_guard.py` (4 câu khẩn cấp), `test_app.py` (số 115 hiện trên giao diện) | Từ khóa không phải tiêu chí phân loại cấp cứu đã thẩm định; bỏ sót cách nói khác |
| RR03 | Model bịa số điện thoại, quy trình hay giá dịch vụ | Người bệnh | Gọi nhầm số, mất niềm tin | Trung bình | Số 115 và số tổng đài chỉ lấy từ hằng số trong `app.py`; `guard.check_answer` chặn câu trả lời có số điện thoại; prompt cấm nêu quy trình, giá | `test_guard.py`: câu trả lời có số điện thoại bị chặn | Số tổng đài lấy từ vinmec.com, chưa xác minh lại trong app (tác vụ O9) |
| RR04 | Người dùng gõ thông tin sức khỏe thật vào ô hỏi; nội dung được gửi tới OpenAI | Người dùng | Dữ liệu nhạy cảm rời khỏi máy | Trung bình | Giao diện nhắc không nhập thông tin cá nhân hay kết quả thật; chỉ cho chọn phiếu mô phỏng; app không lưu log nội dung câu hỏi | Đọc lại code: không có lệnh ghi file hay log nội dung | Người dùng vẫn có thể gõ thông tin thật; chính sách lưu dữ liệu phía OpenAI nằm ngoài kiểm soát của prototype |
| RR05 | Người dùng tưởng đây là tính năng thật của Vinmec hoặc tưởng phiếu là kết quả thật | Người thử | Hiểu sai trách nhiệm và độ tin cậy | Trung bình | Cảnh báo đầu trang "không phải sản phẩm của Vinmec"; nhãn "DỮ LIỆU MÔ PHỎNG" trên phiếu; không dùng logo Vinmec | `test_app.py` kiểm tra cảnh báo và nhãn; hỏi người thử sau phiên: họ nghĩ ai cung cấp công cụ | Người đọc lướt có thể bỏ qua cảnh báo |
| RR06 | Thiếu API key, mạng lỗi hoặc model trả lỗi | Người dùng | Bị bỏ lửng, không biết làm gì tiếp | Thấp | Thông báo "Chưa kết nối được dịch vụ AI" kèm phần "Bước tiếp theo" luôn hiển thị | `test_app.py`: chạy không có key vẫn hiện lối ra dịch vụ | Không có |

## Khung pháp lý liên quan

Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 có hiệu lực từ 01/01/2026 [1]. Nghị định 356/2025/NĐ-CP hướng dẫn luật này liệt kê "tình trạng sức khỏe" là dữ liệu cá nhân nhạy cảm [2]. Hai nguồn trên là trang tin thứ cấp, cần đối chiếu văn bản gốc trước khi trích dẫn chính thức. Bài tập không thu dữ liệu sức khỏe; quy tắc dưới đây nhằm giữ đúng điều đó.

## Quản lý dữ liệu

Trạng thái: QUY TẮC ĐÃ CHỐT; PHẦN THỰC THI GHI THEO TỪNG BƯỚC.

- Xin đồng ý trước phỏng vấn; chỉ hỏi trải nghiệm dịch vụ.
- Không hỏi chẩn đoán, bệnh án hoặc tình trạng sức khỏe.
- Dùng mã P01/U01; không lưu bảng tên thật trong repo.
- Không chụp ảnh người hay giấy tờ y tế; không ghi âm khi chưa đồng ý.
- Chỉ giữ thông tin tối thiểu cần cho bằng chứng; loại chi tiết có thể tái định danh.
- Công khai phần AI tạo; không đưa thông tin cá nhân vào công cụ AI.

| Loại dữ liệu thực sự thu | Mục đích | Nơi giữ | Ai truy cập | Thời gian lưu/xóa | Cách ẩn danh |
|---|---|---|---|---|---|
| Ghi chép phỏng vấn đã ẩn danh (P01-P03) | Bằng chứng cho insight và need statement | Repo GitHub public | Bất kỳ ai có link | Lưu cùng repo | Mã P, bỏ tên, nơi làm việc, thông tin sức khỏe |
| Ghi chép thô trước khi ẩn danh | Hoàn thiện phiếu P | Máy của ứng viên, không commit | Ứng viên | [CẦN ỨNG VIÊN XÁC NHẬN thời điểm xóa] | Không áp dụng |
| Ghi chép phiên thử (U01-U03) | Log thử nghiệm và điều chỉnh | Repo GitHub public | Bất kỳ ai có link | Lưu cùng repo | Mã U, không ghi tên |
| Ghi chép dùng thử MyVinmec | Quan sát trải nghiệm hiện tại | Repo GitHub public | Bất kỳ ai có link | Lưu cùng repo | Không ghi số điện thoại, mã PID hay kết quả của tài khoản |
| Phiếu kết quả mô phỏng | Dữ liệu cho prototype | `05-prototype/mock-data/` | Bất kỳ ai có link | Lưu cùng repo | Tự tạo, không lấy từ người thật |
| Câu hỏi người thử gõ vào prototype | Gửi model để trả lời | Gửi tới OpenAI qua API; app không lưu | Ứng viên (trong phiên), OpenAI theo chính sách của họ | Không lưu trong app | Người thử được dặn không nhập thông tin thật |

Trước mỗi lần push, rà soát cả file và lịch sử Git vì repo đang public. Chỉ dùng dữ liệu được phép; không coi dữ liệu công khai là mặc nhiên được tái phân phối.

## Nguồn

[1] Cổng phổ biến giáo dục pháp luật TP. Cần Thơ, "Luật Bảo vệ dữ liệu cá nhân năm 2025 - bảo đảm quyền riêng tư trong kỷ nguyên số." [Online]. Available: https://pbgdpl.cantho.gov.vn/luat-bao-ve-du-lieu-ca-nhan-nam-2025-bao-dam-quyen-rieng-tu-trong-ky-nguyen-so. [Accessed: 18/10/2026].

[2] LuatVietnam, "Thông tin về sức khỏe là dữ liệu cá nhân nhạy cảm." [Online]. Available: https://luatvietnam.vn/tin-van-ban-moi/thong-tin-ve-suc-khoe-la-du-lieu-ca-nhan-nhay-cam-186-106394-article.html. [Accessed: 18/10/2026].
