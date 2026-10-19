# Need statement

Trạng thái: ĐÃ CHỐT HƯỚNG, BẢN NHÁP v2. Bằng chứng hiện có là quan sát trên MyVinmec; chờ đối chiếu phỏng vấn P1-P3 trước khi chốt câu chữ.

- Problem (vấn đề): người bệnh vừa nhận kết quả có câu hỏi về một chỉ số trên phiếu, nhưng không tìm được nội dung phù hợp trong kho kiến thức và hỏi đáp bác sĩ có sẵn trên MyVinmec, và không có đường đi rõ ràng từ câu hỏi đó tới bác sĩ.
- Population (nhóm người dùng): người bệnh vừa nhận kết quả xét nghiệm, tự đọc phiếu trước khi được bác sĩ giải thích.
- Outcome (kết quả mong muốn): rút ngắn thời gian từ lúc có kết quả đến lúc có câu trả lời đáng tin cho câu hỏi về chỉ số trên phiếu.

Phát biểu: "Cách để rút ngắn thời gian từ lúc có kết quả đến lúc có câu trả lời đáng tin cho câu hỏi về chỉ số trên phiếu, cho người bệnh vừa nhận kết quả xét nghiệm mà không tìm được nội dung phù hợp trong kho kiến thức và hỏi đáp bác sĩ có sẵn."
Không đưa chatbot, AI hoặc giải pháp cụ thể vào need statement.

Bản v1 (19/10/2026) đặt kết quả mong muốn là "tăng tỷ lệ tìm được lời giải thích đáng tin". Bản v2 mở rộng sang "có được câu trả lời đáng tin", vì khi kho chưa có nội dung, tìm kiếm tốt hơn cũng không giúp được người bệnh.

## Lý do ưu tiên

Bằng chứng: trong kiểm thử tìm kiếm ở mục Cộng đồng hỏi đáp bác sĩ, 6/7 lượt tìm không trả kết quả; lượt còn lại (GLU) trả 2 bài đều lệch ý, một bài mở sai trang. Cùng lúc đó, màn hình ghi 20.915 câu hỏi đã được bác sĩ giải đáp. Nội dung có sẵn nhưng không tới được người hỏi, và người hỏi không được dẫn tới bác sĩ khi kho không có câu trả lời.

Mức ảnh hưởng: người bệnh không có câu trả lời trong app có thể chuyển sang nguồn ngoài, chưa kiểm chứng. Đây là giả thuyết, cần phỏng vấn xác nhận. Khảo sát ở Mỹ (BP01) cho thấy lo lắng tăng nhiều hơn ở người thấy kết quả bất thường (17% so với 5%).

Khả năng kiểm chứng trong thời gian cho phép: cao. Lặp lại cùng bộ từ khóa trên prototype; đếm số chỉ số có cờ có sẵn bài; đo số bước từ phiếu tới câu trả lời hoặc tới câu hỏi đã gửi bác sĩ.

Hướng khác đã cân nhắc và lý do bỏ:
- "Người bệnh thiếu nơi để hỏi về kết quả": bỏ, vì app đã có trợ lý AI, Cộng đồng hỏi đáp, CSKH 24/07, nút gọi từng bệnh viện (O1, O6, O9).
- "Chỉ cần tìm kiếm tốt hơn": bỏ làm hướng chính, vì không giúp được khi kho chưa có câu trả lời và một phần lỗi sửa được không cần AI (ĐĐ4).
- Hướng lâm sàng hoặc dữ liệu bệnh viện: bỏ, vì đề bài tập giới hạn ở trải nghiệm người bệnh trên MyVinmec và cấm dùng dữ liệu bệnh án.

## Bằng chứng dẫn tới need statement

| ID | File và đoạn bằng chứng | Insight | Nhu cầu | Chức năng | Phiên thử/tác vụ | Điều chỉnh |
|---|---|---|---|---|---|---|
| E01 | [myvinmec-observation.md](../01-phong-van/myvinmec-observation.md), O6 và bảng kiểm thử (quan sát) | Tìm kiếm không trả kết quả cho câu hỏi thường gặp sau xét nghiệm máu | Có nội dung phù hợp mà không phải tự tìm | ① Bài bác sĩ đã viết hiện sẵn dưới chỉ số có cờ; tìm theo ý nghĩa | [CHƯA THỬ] T1, T2 | |
| E02 | Như trên, từ khóa GLU (quan sát) | Tìm kiếm không hiểu chữ viết tắt in trên phiếu; một kết quả mở sai bài | Tìm theo đúng ngữ cảnh phiếu xét nghiệm | ① Khớp theo mã chỉ số; tìm kèm dòng trên phiếu | [CHƯA THỬ] T1 | |
| E03 | Như trên, O1, O6, O9 (quan sát) | Kênh hỗ trợ có nhiều nhưng rời nhau | Đi từ câu hỏi tới đúng kênh | ② Soạn câu hỏi gửi bác sĩ ngay từ chỉ số; lối ra CSKH, gọi bệnh viện | [CHƯA THỬ] T4 | |
| E04 | Như trên, ĐĐ5 (quan sát và trang vinmec.com) | Câu hỏi đã có bác sĩ trả lời không hiện ra | Không phải hỏi lại câu đã có câu trả lời; kho được bổ sung khi còn thiếu | ② Chống trùng trước khi gửi; ③ Vinmec thấy câu tìm không ra và chỉ số thiếu nội dung | [CHƯA THỬ] T4 | |
| E05 | Phiếu P01-P03 | [CHƯA CÓ] | | | | |

Dùng liên kết tương đối đến file thật, ví dụ mã đoạn `P01-03`. Ghi rõ quan sát / diễn giải / giả thuyết / mô phỏng. Không điền các ID không tồn tại.

## Tiêu chí kiểm chứng

Tác vụ và kết quả quan sát được:
- Với cùng bộ từ khóa của kiểm thử (đường huyết lúc đói cao, men gan cao, GLU, ALT, duong huyet cao), người thử tìm được nội dung đúng ý, có dẫn nguồn.
- Từ một chỉ số có cờ, người thử mở được bài bác sĩ đã viết, hoặc gửi được câu hỏi cho bác sĩ, mà không cần người điều phối giúp.

Giả thuyết chưa được chứng minh: người bệnh thật sự tìm trong app khi có kết quả; khi không tìm được, họ chuyển sang nguồn ngoài; họ sẵn lòng gửi câu hỏi riêng tư cho bác sĩ và đồng ý cho dùng câu hỏi đã ẩn danh để bổ sung kho.
