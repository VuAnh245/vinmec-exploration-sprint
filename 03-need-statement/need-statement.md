# Need statement

Trạng thái: ĐÃ CHỐT HƯỚNG (ngách), BẢN NHÁP v1. Bằng chứng hiện có là quan sát trên MyVinmec; chờ đối chiếu phỏng vấn P1-P3 trước khi chốt câu chữ.

- Problem (vấn đề): người bệnh vừa nhận kết quả có câu hỏi về một chỉ số trên phiếu, nhưng không tìm được nội dung phù hợp trong kho kiến thức và hỏi đáp bác sĩ có sẵn trên MyVinmec.
- Population (nhóm người dùng): người bệnh vừa nhận kết quả xét nghiệm, tự đọc phiếu trước khi được bác sĩ giải thích.
- Outcome (kết quả mong muốn): tăng tỷ lệ tìm được lời giải thích đáng tin, đúng với chỉ số trên phiếu.

Phát biểu: "Cách để tăng tỷ lệ tìm được lời giải thích đáng tin, đúng với chỉ số trên phiếu, cho người bệnh vừa nhận kết quả xét nghiệm mà không tìm được nội dung phù hợp trong kho kiến thức và hỏi đáp bác sĩ có sẵn."
Không đưa chatbot, AI hoặc giải pháp cụ thể vào need statement.

## Lý do ưu tiên

Bằng chứng: trong kiểm thử tìm kiếm ở mục Cộng đồng hỏi đáp bác sĩ, 6/7 lượt tìm không trả kết quả; lượt còn lại (GLU) trả 2 bài đều lệch ý, một bài mở sai trang. Cùng lúc đó, màn hình ghi 20.915 câu hỏi đã được bác sĩ giải đáp. Nội dung có sẵn nhưng không tới được người hỏi.

Mức ảnh hưởng: người bệnh không tìm được câu trả lời trong app có thể chuyển sang nguồn ngoài, chưa kiểm chứng. Đây là giả thuyết, cần phỏng vấn xác nhận.

Khả năng kiểm chứng trong thời gian cho phép: cao. Có thể lặp lại cùng bộ từ khóa trên prototype và so tỷ lệ tìm đúng.

Hướng khác đã cân nhắc và lý do bỏ:
- "Người bệnh thiếu nơi để hỏi về kết quả": bỏ, vì app đã có trợ lý AI, Cộng đồng hỏi đáp, CSKH 24/07, nút gọi từng bệnh viện (O1, O6, O9).
- Hướng lâm sàng hoặc dữ liệu bệnh viện: bỏ, vì đề bài tập giới hạn ở trải nghiệm người bệnh trên MyVinmec và cấm dùng dữ liệu bệnh án.

## Bằng chứng dẫn tới need statement

| ID | File và đoạn bằng chứng | Insight | Nhu cầu | Chức năng | Phiên thử/tác vụ | Điều chỉnh |
|---|---|---|---|---|---|---|
| E01 | [myvinmec-observation.md](../01-phong-van/myvinmec-observation.md), O6 và bảng kiểm thử (quan sát) | Tìm kiếm không trả kết quả cho câu hỏi thường gặp sau xét nghiệm máu | Tìm được nội dung phù hợp | [CHƯA CHỐT] | [CHƯA THỬ] | |
| E02 | Như trên, từ khóa GLU (quan sát) | Tìm kiếm không hiểu chữ viết tắt in trên phiếu; một kết quả mở sai bài | Tìm theo đúng ngữ cảnh phiếu xét nghiệm | [CHƯA CHỐT] | [CHƯA THỬ] | |
| E03 | Như trên, O1, O6, O9 (quan sát) | Kênh hỗ trợ có nhiều nhưng rời nhau | Đi từ câu hỏi tới đúng kênh | [CHƯA CHỐT] | [CHƯA THỬ] | |
| E04 | Phiếu P01-P03 | [CHƯA CÓ] | | | | |

Dùng liên kết tương đối đến file thật, ví dụ mã đoạn `P01-03`. Ghi rõ quan sát / diễn giải / giả thuyết / mô phỏng. Không điền các ID không tồn tại.

## Tiêu chí kiểm chứng

Tác vụ và kết quả quan sát được: với cùng bộ từ khóa của kiểm thử (đường huyết lúc đói cao, men gan cao, GLU, ALT, duong huyet cao), người thử tìm được nội dung đúng ý, có dẫn nguồn, trong prototype.
Giả thuyết chưa được chứng minh: người bệnh thật sự tìm trong app khi có kết quả; khi không tìm được, họ chuyển sang nguồn ngoài.
