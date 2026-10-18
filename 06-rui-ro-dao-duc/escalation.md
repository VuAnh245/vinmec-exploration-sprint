# Chuyển tiếp khi ngoài phạm vi hoặc khẩn cấp

Trạng thái: ĐÃ THIẾT KẾ VÀ CÀI TRONG PROTO-V1, CHƯA ĐƯỢC BÁC SĨ HAY VINMEC THẨM ĐỊNH.

Prototype không đưa lời khuyên y khoa. Mọi câu hỏi đi qua `guard.classify_question` trước khi tới model, và mọi câu trả lời đi qua `guard.check_answer` trước khi hiển thị. Thông điệp dưới đây chép nguyên văn từ `05-prototype/app/app.py`.

| Tình huống | Prototype dừng xử lý gì | Thông điệp hiển thị | Kênh hỗ trợ | Nguồn/ngày kiểm tra | Cách thử |
|---|---|---|---|---|---|
| Khẩn cấp: người dùng mô tả triệu chứng cấp tính (ví dụ đau ngực, khó thở, ngất xỉu) | Không gọi model, không trả lời nội dung | "Nếu bạn đang có triệu chứng như vậy, hãy gọi cấp cứu 115 hoặc đến cơ sở cấp cứu gần nhất ngay. Công cụ này không xử lý tình huống khẩn cấp." | Cấp cứu 115 | Số cấp cứu quốc gia | `test_guard.py`, `test_app.py` (test số 115) |
| Cần chuyên môn: hỏi kết quả có nghĩa là bệnh gì, có nguy hiểm không, có cần điều trị hay dùng thuốc không | Không gọi model; câu hỏi được giữ lại để người dùng lưu thành câu hỏi cho bác sĩ | "Câu hỏi này cần bác sĩ trả lời dựa trên tình trạng cụ thể của bạn. Công cụ chỉ giúp đọc phiếu, không đưa lời khuyên y khoa." | Nút "Đặt lịch tư vấn kết quả" (mô phỏng) | Không áp dụng | `test_guard.py`, `test_app.py` (test chuyển cho bác sĩ) |
| Model tự đánh dấu câu hỏi ngoài phạm vi | Bỏ phần giải thích của model, chỉ giữ câu hỏi gợi ý cho bác sĩ đã qua kiểm tra | Như tình huống "Cần chuyên môn" | Như trên | Không áp dụng | Chạy với model thật, ghi kết quả vào phiếu U |
| Câu trả lời của model vượt ranh giới | Ẩn câu trả lời | "Câu trả lời tự động vượt quá phạm vi đọc phiếu nên đã được ẩn. Bạn nên hỏi trực tiếp bác sĩ." | Như trên | Không áp dụng | `test_guard.py` (5 câu trả lời bị chặn) |
| Câu hỏi về dịch vụ (giờ, chi phí, thủ tục) | Model không được nêu thông tin dịch vụ | Phần "Bước tiếp theo" luôn hiển thị | Tổng đài tư vấn dịch vụ 024 3975 6789 | Trang hướng dẫn MyVinmec trên vinmec.com, truy cập 18/10/2026; [CHƯA XÁC MINH trong app, tác vụ O9] | Bấm nút "Gọi tổng đài dịch vụ" |
| Lỗi API, thiếu key, mất mạng | Không có câu trả lời của AI | "Chưa kết nối được dịch vụ AI. Bạn vẫn có thể đặt lịch tư vấn kết quả hoặc gọi tổng đài ở phần Bước tiếp theo." | Như trên | Không áp dụng | `test_app.py` (chạy không có key) |

Danh sách từ khóa khẩn cấp là của prototype, không phải tiêu chí phân loại cấp cứu đã thẩm định. Không tự tạo số điện thoại hay quy trình bệnh viện. Bản thử không được tuyên bố đã được Vinmec thẩm định.
