# Tổng hợp thử nghiệm

Trạng thái: CHƯA THỬ VỚI NGƯỜI DÙNG. Đã có một lần điều chỉnh trước khi thử, do kết quả quan sát app.

| Phát hiện | Phiên/tác vụ hỗ trợ | Mức ảnh hưởng | Quyết định | Trạng thái sửa | Đã thử lại? |
|---|---|---|---|---|---|

## Nhật ký điều chỉnh

| Ngày | Bằng chứng dẫn tới sửa | Trước | Sau | File/commit/version | Kiểm chứng lại và kết quả |
|---|---|---|---|---|---|
| 19/10/2026 | Kiểm thử tìm kiếm trên MyVinmec: 6/7 lượt không có kết quả, GLU ra 2 bài lệch ý, một kết quả mở sai bài; app đã có trợ lý AI và nhiều kênh hỗ trợ (O1, O6, O9). Need statement đổi theo | proto-v1: AI tự giải thích phiếu (PR01); một số tổng đài chung | proto-v2: AI chọn bài bác sĩ Vinmec đã viết và dẫn link (PR02); lối ra dịch vụ theo đúng MyVinmec; thêm từ khóa khẩn cấp theo công cụ Sàng lọc đột quỵ | `app.py`, `search.py`, `guard.py`, PR02; proto-v2 | 41/41 test tự động đạt; chưa thử với người dùng |
| 19/10/2026 | Ứng viên muốn người thử bấm trên giao diện giống MyVinmec thật để so hiện trạng và đề xuất | Giao diện Streamlit, bố cục gần giống mục Cộng đồng hỏi đáp | Bản mô phỏng điện thoại dựng lại 8 màn hình MyVinmec đã chụp, có hai chế độ Hiện trạng và Thiết kế đề xuất; thêm lối vào từ phiếu kết quả (màn hình đề xuất); Streamlit giữ làm giao diện kỹ thuật | `app/mobile/`, `server.py`, `llm.py`; proto-v2 | 45/45 test tự động đạt; ảnh chụp 4 kịch bản trong `screenshots/`; chưa thử với người dùng |
| 19/10/2026 | Đánh giá của ứng viên: chỉ tìm kiếm tốt hơn thì giá trị nhỏ; tìm kiếm không giúp được khi kho chưa có câu trả lời (ĐĐ5), một phần lỗi sửa được không cần AI (ĐĐ4). Need statement đổi sang v2 | proto-v2: người bệnh tự tìm; hành trình dừng khi không tìm thấy | proto-v3: vòng khép kín. ① bài hiện sẵn dưới chỉ số có cờ; ② AI soạn câu hỏi gửi bác sĩ, báo câu tương tự đã có (PR03), gửi riêng tư, đồng ý bổ sung kho mặc định tắt; ③ bảng phía Vinmec gom câu tìm không ra, chỉ số thiếu nội dung, câu hỏi trùng | `search.py`, `guard.py`, `llm.py`, `server.py`, `app/mobile/`, PR03; proto-v3 | 55/55 test tự động đạt; ảnh chụp ①②③ trong `screenshots/`; chưa thử với người dùng |

Ghi cả quyết định chưa sửa và lý do. Không viết lại log để tạo cảm giác đã thử nghiệm nhiều vòng.

## Chỉ số thực đo

Tỷ lệ tìm đúng với cùng bộ từ khóa. "Đúng" nghĩa là có ít nhất một kết quả nói về đúng chỉ số trong máu mà người hỏi muốn tìm.

| Từ khóa | MyVinmec (quan sát 19/10/2026) | Tìm theo từ khóa trong prototype (`test_search.py`) | Tìm theo ý nghĩa (AI) trong prototype |
|---|---|---|---|
| đường huyết lúc đói cao | Không có kết quả | Không có kết quả | [CHƯA CHẠY] |
| men gan cao | Không có kết quả | Đúng (K04) | [CHƯA CHẠY] |
| GLU | 2 kết quả, 0 đúng (thuốc Glucovance, glucose nước tiểu) | Không có kết quả | [CHƯA CHẠY] |
| ALT | Không có kết quả | Đúng (K05) | [CHƯA CHẠY] |
| duong huyet cao | Không có kết quả | Không có kết quả | [CHƯA CHẠY] |
| Tỷ lệ tìm đúng | 0/5 | 2/5 | [CHƯA CHẠY] |

Bài hiện sẵn trên phiếu (bước ①, không dùng AI): 5/6 chỉ số có cờ trong hai phiếu mô phỏng có bài (GLU, CHOL, LDL-C, NEUT%, PLT); WBC chưa có bài và đi thẳng tới "Hỏi bác sĩ". Con số này phụ thuộc vào kho 11 bài của bản thử.

Cột MyVinmec tìm trên toàn bộ kho của app; hai cột prototype chỉ tìm trong 11 bài của kho nguồn. Vì vậy ba cột không cùng mẫu số về nội dung, chỉ so được cách tìm với cùng câu hỏi. Kết quả thử với người dùng ghi ở phiếu U01-U03.

## Tác động dự kiến

[GIẢ THUYẾT. Không trình bày như tác động đã đạt]

## Giới hạn / kết quả không thuận lợi

[CHƯA ĐIỀN]
