# Tổng hợp thử nghiệm

Trạng thái: CHƯA THỬ VỚI NGƯỜI DÙNG. Đã có 5 lần điều chỉnh trước khi thử (nhật ký bên dưới) và một lượt chạy thử nội bộ của ứng viên.

| Phát hiện | Phiên/tác vụ hỗ trợ | Mức ảnh hưởng | Quyết định | Trạng thái sửa | Đã thử lại? |
|---|---|---|---|---|---|

## Nhật ký điều chỉnh

| Ngày | Bằng chứng dẫn tới sửa | Trước | Sau | File/commit/version | Kiểm chứng lại và kết quả |
|---|---|---|---|---|---|
| 19/10/2026 | Kiểm thử tìm kiếm trên MyVinmec: 6/7 lượt không có kết quả, GLU ra 2 bài lệch ý, một kết quả mở sai bài; app đã có trợ lý AI và nhiều kênh hỗ trợ (O1, O6, O9). Need statement đổi theo | proto-v1: AI tự giải thích phiếu (PR01); một số tổng đài chung | proto-v2: AI chọn bài bác sĩ Vinmec đã viết và dẫn link (PR02); lối ra dịch vụ theo đúng MyVinmec; thêm từ khóa khẩn cấp theo công cụ Sàng lọc đột quỵ | `app.py`, `search.py`, `guard.py`, PR02; proto-v2 | 41/41 test tự động đạt; chưa thử với người dùng |
| 19/10/2026 | Ứng viên muốn người thử bấm trên giao diện giống MyVinmec thật để so hiện trạng và đề xuất | Giao diện Streamlit, bố cục gần giống mục Cộng đồng hỏi đáp | Bản mô phỏng điện thoại dựng lại 8 màn hình MyVinmec đã chụp, có hai chế độ Hiện trạng và Thiết kế đề xuất; thêm lối vào từ phiếu kết quả (màn hình đề xuất); Streamlit giữ làm giao diện kỹ thuật | `app/mobile/`, `server.py`, `llm.py`; proto-v2 | 45/45 test tự động đạt; ảnh chụp 4 kịch bản trong `screenshots/`; chưa thử với người dùng |
| 19/10/2026 | Đánh giá của ứng viên: chỉ tìm kiếm tốt hơn thì giá trị nhỏ; tìm kiếm không giúp được khi kho chưa có câu trả lời (ĐĐ5), một phần lỗi sửa được không cần AI (ĐĐ4). Need statement đổi sang v2 | proto-v2: người bệnh tự tìm; hành trình dừng khi không tìm thấy | proto-v3: vòng khép kín. ① bài hiện sẵn dưới chỉ số có cờ; ② AI soạn câu hỏi gửi bác sĩ, báo câu tương tự đã có (PR03), gửi riêng tư, đồng ý bổ sung kho mặc định tắt; ③ bảng phía Vinmec gom câu tìm không ra, chỉ số thiếu nội dung, câu hỏi trùng | `search.py`, `guard.py`, `llm.py`, `server.py`, `app/mobile/`, PR03; proto-v3 | 55/55 test tự động đạt; ảnh chụp ①②③ trong `screenshots/`; chưa thử với người dùng |
| 19/10/2026 | Ứng viên xem bản demo: chuyển màn hình không có hiệu ứng, đổi chế độ quay về trang chủ nên không so được trước và sau, các điểm đau từ phỏng vấn (ĐĐ7, ĐĐ8, ĐĐ9) chưa hiện trong demo | Không có trang chuyên mục; đổi chế độ về trang chủ; không có nút đặt câu hỏi ở Cộng đồng | Trang chuyên mục Tim mạch dựng theo ảnh O6b; nút "Hỏi bác sĩ này" và "Đặt câu hỏi cho bác sĩ"; màn hình tìm không ra mời đặt câu hỏi; đổi chế độ giữ màn hình; bảng Điểm đau → thay đổi với nút Trước/Sau; hiệu ứng chuyển màn hình; ghi "gửi tới" ở phía Vinmec | `app/mobile/`, `server.py`; proto-v3.1 | 56/56 test tự động đạt; ảnh trước và sau trong `screenshots/v3-dau-*`; chưa thử với người dùng |
| 19/10/2026 | Ứng viên xem proto-v3.1: hỏi bác sĩ chưa có tác dụng lớn vì không biết bác sĩ giỏi lĩnh vực gì; giao diện đơn điệu, người dùng không biết bắt đầu từ đâu | Thẻ bác sĩ không ghi lĩnh vực; luồng hỏi một màn hình; Cộng đồng chỉ có gợi ý nhỏ | Hồ sơ bác sĩ (mô phỏng) có chuyên khoa, lĩnh vực, số câu đã trả lời; gợi ý bác sĩ phù hợp kèm lý do (`search.match_doctors`, PR03 v2 gợi ý chuyên khoa); luồng hỏi 3 bước có thanh tiến trình; khung mở đầu "Bạn đang thắc mắc điều gì?", gợi ý "Bắt đầu tại đây"; màn hình đã gửi có mốc trạng thái. Sửa thêm: máy chủ báo lỗi khi cổng đang bận thay vì để máy chủ cũ trả lời | `search.py`, `server.py`, `llm.py`, `app/mobile/`, `mock-data/mock-bac-si.json`, PR03 v2; proto-v3.2 | 61/61 test tự động đạt; ảnh `screenshots/v3.2-*`; chưa thử với người dùng |

Ghi cả quyết định chưa sửa và lý do. Không viết lại log để tạo cảm giác đã thử nghiệm nhiều vòng.

## Chỉ số thực đo

Tỷ lệ tìm đúng với cùng bộ từ khóa. "Đúng" nghĩa là có ít nhất một kết quả nói về đúng chỉ số trong máu mà người hỏi muốn tìm.

| Từ khóa | MyVinmec (quan sát 19/10/2026) | Tìm theo từ khóa trong prototype (`test_search.py`) | Tìm theo ý nghĩa (AI) trong prototype |
|---|---|---|---|
| đường huyết lúc đói cao | Không có kết quả | Không có kết quả | [CHƯA CÓ KẾT QUẢ] |
| men gan cao | Không có kết quả | Đúng (K04) | [CHƯA CÓ KẾT QUẢ] |
| GLU | 2 kết quả, 0 đúng (thuốc Glucovance, glucose nước tiểu) | Không có kết quả | [CHƯA CÓ KẾT QUẢ] |
| ALT | Không có kết quả | Đúng (K05) | [CHƯA CÓ KẾT QUẢ] |
| duong huyet cao | Không có kết quả | Không có kết quả | [CHƯA CÓ KẾT QUẢ] |
| Tỷ lệ tìm đúng | 0/5 | 2/5 | [CHƯA CÓ KẾT QUẢ] |

Cột AI: đã chạy ngày 19/10/2026 với gpt-4o-mini nhưng API trả lỗi 429 (tài khoản hết credit), nên chưa có kết quả. Chạy lại khi nạp credit, trước phiên U01.

Bài hiện sẵn trên phiếu (bước ①, không dùng AI): 5/6 chỉ số có cờ trong hai phiếu mô phỏng có bài (GLU, CHOL, LDL-C, NEUT%, PLT); WBC chưa có bài và đi thẳng tới "Hỏi bác sĩ". Con số này phụ thuộc vào kho 11 bài của bản thử.

Cột MyVinmec tìm trên toàn bộ kho của app; hai cột prototype chỉ tìm trong 11 bài của kho nguồn. Vì vậy ba cột không cùng mẫu số về nội dung, chỉ so được cách tìm với cùng câu hỏi. Kết quả thử với người dùng ghi ở phiếu U01-U03.

## Chạy thử nội bộ trước phiên (ứng viên, không phải người thử)

Ngày 19/10/2026, proto-v3.2. Ứng viên tự chạy T1-T4 bằng các hàm của prototype (`search.py`, `guard.py`, `llm.py`) với hai phiếu mô phỏng. API báo hết credit nên mọi bước có AI đều rơi vào nhánh dự phòng. Đây là kiểm tra đường đi và tiêu chí trước khi mời người thử, không thay cho kết quả U01-U03. 61/61 test tự động đạt.

| Tác vụ | Đầu vào ứng viên dùng | Kết quả | Đạt tiêu chí trong test-plan? |
|---|---|---|---|
| T1 | Phiếu Sinh hóa máu, dòng GLU (H) | Bài hiện sẵn K01 "Vai trò của định lượng glucose trong máu", K02 "Xét nghiệm đường huyết là gì?"; không cần AI | Đạt, kể cả khi không có AI |
| T2 | "ALT là chỉ số gì" | Tìm theo từ khóa ra K05 "Chỉ số AST, ALT là chỉ số gì?" | Đạt |
| T2 | "chỉ số men gan ALT" | Không có kết quả: tìm theo từ khóa đòi mọi từ có trong tiêu đề, và không có AI để tìm theo ý nghĩa | Không đạt khi không có AI |
| T3 | "Kết quả này có nghiêm trọng không, tôi có cần dùng thuốc không?" (dòng GLU) | Phân loại là câu hỏi y khoa; không có câu trả lời tư vấn; câu được đưa vào gợi ý hỏi bác sĩ | Đạt phần "không tư vấn"; phần người thử nói được bước tiếp theo chỉ đo được trong phiên |
| T4 | "WBC của tôi cao, tôi muốn hỏi bác sĩ" (dòng WBC) | Câu nháp theo mẫu có tên chỉ số, giá trị 11.2 G/L, khoảng tham chiếu 4.0 - 10.0, cờ H; qua lớp kiểm tra câu hỏi; không có bài trùng (WBC chưa có bài); gợi ý chuyên khoa Huyết học - Xét nghiệm, BS. Minh (mô phỏng) với lý do "lĩnh vực khớp: bạch cầu, WBC" | Đạt |
| T4, khẩn cấp | "tôi đang đau ngực dữ dội, khó thở" | Phân loại khẩn cấp, dừng soạn câu hỏi | Đạt (RR10) |

Rút ra trước phiên:
- Khi không có AI, T2 thành công hay không tùy cách người thử gõ. Nếu chưa nạp credit, ghi chế độ "không có AI" trong phiếu U và đọc kết quả T2 theo giới hạn này.
- T1 và T4 không phụ thuộc AI, nên vẫn thử được ngay cả khi API lỗi.
- Lượt chạy kiểm chứng RR06 với một lỗi API thật (429), không chỉ với trường hợp thiếu key: vẫn có kết quả từ khóa, câu hỏi theo mẫu và gợi ý bác sĩ.

## Tác động dự kiến

[GIẢ THUYẾT. Không trình bày như tác động đã đạt]

## Giới hạn / kết quả không thuận lợi

- Chưa có phiên thử nào với người dùng; mọi kết quả ở trên là quan sát app, test tự động và chạy thử nội bộ của ứng viên.
- Cột tìm theo ý nghĩa (AI) chưa có số liệu vì API hết credit.
- Không có AI, câu "chỉ số men gan ALT" không ra kết quả trong prototype.
- Kho nguồn chỉ có 11 bài; tỷ lệ bài hiện sẵn (5/6 chỉ số có cờ) phụ thuộc vào kho này.
- [Phần kết quả không thuận lợi từ U01-U03: CHƯA ĐIỀN]
