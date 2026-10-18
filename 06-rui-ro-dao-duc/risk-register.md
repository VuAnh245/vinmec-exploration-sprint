# Rủi ro và giảm thiểu

Trạng thái: CHƯA ĐÁNH GIÁ PROTOTYPE CỤ THỂ.

| ID | Tình huống gây rủi ro | Người bị ảnh hưởng | Hậu quả | Mức độ và lý do | Giảm thiểu | Cách kiểm chứng | Rủi ro còn lại |
|---|---|---|---|---|---|---|---|

Các câu hỏi gợi ý, chưa phải phát hiện: AI có tự tạo hướng dẫn dịch vụ không có nguồn? Người dùng có nhầm là lời khuyên y khoa? Có rò thông tin vào log? Khi API lỗi, người dùng có biết bước tiếp? Dữ liệu mô phỏng có bị hiểu là trạng thái thật?

Gắn từng biện pháp với chức năng thực tế, không chỉ ghi "có cảnh báo".

## Quản lý dữ liệu

Trạng thái: QUY TẮC DỰ KIẾN, CHƯA XÁC NHẬN THỰC THI.

- Xin đồng ý trước phỏng vấn; chỉ hỏi trải nghiệm dịch vụ.
- Không hỏi chẩn đoán, bệnh án hoặc tình trạng sức khỏe.
- Dùng mã P01/U01; không lưu bảng tên thật trong repo.
- Không chụp ảnh người hay giấy tờ y tế; không ghi âm khi chưa đồng ý.
- Chỉ giữ thông tin tối thiểu cần cho bằng chứng; loại chi tiết có thể tái định danh.
- Công khai phần AI tạo; không đưa thông tin cá nhân vào công cụ AI.

| Loại dữ liệu thực sự thu | Mục đích | Nơi giữ | Ai truy cập | Thời gian lưu/xóa | Cách ẩn danh |
|---|---|---|---|---|---|

Trước khi công khai repo, rà soát cả file và lịch sử Git. Chỉ dùng dữ liệu được phép; không coi dữ liệu công khai là mặc nhiên được tái phân phối.
