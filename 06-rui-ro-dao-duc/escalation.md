# Chuyển tiếp khi ngoài phạm vi hoặc khẩn cấp

Trạng thái: ĐÃ THIẾT KẾ VÀ CÀI TRONG PROTO-V2, CHƯA ĐƯỢC BÁC SĨ HAY VINMEC THẨM ĐỊNH.

Prototype không đưa lời khuyên y khoa và không tự giải thích kết quả; AI chỉ chọn bài bác sĩ Vinmec đã viết. Mọi câu hỏi đi qua `guard.classify_question` trước khi tới model; mọi lý do, câu hỏi gợi ý do model viết đi qua `guard.check_answer` trước khi hiển thị. Thông điệp dưới đây chép nguyên văn từ `05-prototype/app/app.py`.

| Tình huống | Prototype dừng xử lý gì | Thông điệp hiển thị | Kênh hỗ trợ | Nguồn/ngày kiểm tra | Cách thử |
|---|---|---|---|---|---|
| Khẩn cấp: người dùng mô tả triệu chứng cấp tính (ví dụ đau ngực, khó thở, đột ngột khó nói, yếu chân tay) | Không gọi model, không hiện kết quả tìm kiếm | "Nếu bạn đang có triệu chứng như vậy, hãy gọi cấp cứu 115 hoặc đến cơ sở cấp cứu gần nhất ngay. Công cụ này không xử lý tình huống khẩn cấp." | Cấp cứu 115 | Số cấp cứu quốc gia. Ba dấu hiệu méo miệng, yếu liệt chân tay, khó nói lấy theo công cụ Sàng lọc đột quỵ trong MyVinmec (O10, 19/10/2026) | `test_guard.py`, `test_search.py`, `test_app.py` |
| Cần chuyên môn: hỏi kết quả có nghĩa là bệnh gì, có nguy hiểm không, có cần dùng thuốc không | Vẫn tìm bài bác sĩ đã viết; giữ câu hỏi ở đầu danh sách để người dùng lưu và mang tới bác sĩ | "Câu hỏi này cần bác sĩ trả lời dựa trên tình trạng cụ thể của bạn. Công cụ chỉ giúp tìm bài bác sĩ đã viết, không đưa lời khuyên y khoa." | Nút "Tư vấn với bác sĩ" (mô phỏng) | Không áp dụng | `test_search.py`, `test_app.py` |
| Model viết lý do hoặc câu hỏi vượt ranh giới | Để trống lý do; bỏ câu hỏi đó | Không hiện câu bị chặn | Như trên | Không áp dụng | `test_search.py` |
| Model đưa id bài không có trong kho hoặc tên mục bịa | Bỏ bài hoặc bỏ tên mục | Không hiện | Không áp dụng | Không áp dụng | `test_search.py` |
| Câu hỏi về dịch vụ (giờ, chi phí, thủ tục) | Prototype không có thông tin dịch vụ; model bị cấm nêu | Phần "Bước tiếp theo" luôn hiển thị | "Gửi yêu cầu CSKH 24/07", "Gọi bệnh viện nơi bạn khám" (mô phỏng, theo đúng mục Liên hệ của MyVinmec) | Quan sát O9, 19/10/2026 | Bấm các nút trong phần Bước tiếp theo |
| Lỗi API, thiếu key, mất mạng | Không có kết quả AI | "Chưa kết nối được dịch vụ AI. Bạn vẫn có thể xem kết quả tìm theo từ khóa hoặc dùng phần Bước tiếp theo." | Kết quả tìm theo từ khóa; phần Bước tiếp theo | Không áp dụng | `test_search.py`, `test_app.py` (chạy không có key) |

Danh sách từ khóa khẩn cấp là của prototype, không phải tiêu chí phân loại cấp cứu đã thẩm định. Prototype không hiển thị số điện thoại nào ngoài 115. Bản thử không được tuyên bố đã được Vinmec thẩm định.
