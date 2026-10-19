# Tổng hợp thử nghiệm

Trạng thái: CHƯA THỬ VỚI NGƯỜI DÙNG. Đã có một lần điều chỉnh trước khi thử, do kết quả quan sát app.

| Phát hiện | Phiên/tác vụ hỗ trợ | Mức ảnh hưởng | Quyết định | Trạng thái sửa | Đã thử lại? |
|---|---|---|---|---|---|

## Nhật ký điều chỉnh

| Ngày | Bằng chứng dẫn tới sửa | Trước | Sau | File/commit/version | Kiểm chứng lại và kết quả |
|---|---|---|---|---|---|
| 19/10/2026 | Kiểm thử tìm kiếm trên MyVinmec: 6/7 lượt không có kết quả, GLU ra 2 bài lệch ý, một kết quả mở sai bài; app đã có trợ lý AI và nhiều kênh hỗ trợ (O1, O6, O9). Need statement đổi theo | proto-v1: AI tự giải thích phiếu (PR01); một số tổng đài chung | proto-v2: AI chọn bài bác sĩ Vinmec đã viết và dẫn link (PR02); lối ra dịch vụ theo đúng MyVinmec; thêm từ khóa khẩn cấp theo công cụ Sàng lọc đột quỵ | `app.py`, `search.py`, `guard.py`, PR02; proto-v2 | 41/41 test tự động đạt; chưa thử với người dùng |

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

Cột MyVinmec tìm trên toàn bộ kho của app; hai cột prototype chỉ tìm trong 11 bài của kho nguồn. Vì vậy ba cột không cùng mẫu số về nội dung, chỉ so được cách tìm với cùng câu hỏi. Kết quả thử với người dùng ghi ở phiếu U01-U03.

## Tác động dự kiến

[GIẢ THUYẾT. Không trình bày như tác động đã đạt]

## Giới hạn / kết quả không thuận lợi

[CHƯA ĐIỀN]
