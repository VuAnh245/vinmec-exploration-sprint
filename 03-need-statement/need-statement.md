# Need statement

Trạng thái: ĐÃ CHỐT, BẢN v3. Có bằng chứng từ quan sát MyVinmec và phỏng vấn P01-P03 (ghi chép dạng diễn ý).

- Problem (vấn đề): người bệnh có câu hỏi về kết quả khám của mình nhưng không tìm được nội dung phù hợp trong kho kiến thức và hỏi đáp bác sĩ có sẵn trên MyVinmec, và không gửi được câu hỏi mới tới bác sĩ ở đó.
- Population (nhóm người dùng): người bệnh đã nhận kết quả khám (xét nghiệm, chẩn đoán hình ảnh hoặc kết luận của bác sĩ), tự tìm hiểu trước hoặc sau khi được bác sĩ giải thích.
- Outcome (kết quả mong muốn): rút ngắn thời gian từ lúc có kết quả đến lúc có câu trả lời đáng tin.

Phát biểu: "Cách để rút ngắn thời gian từ lúc có kết quả đến lúc có câu trả lời đáng tin, cho người bệnh đã nhận kết quả khám có câu hỏi về kết quả của mình mà không tìm được nội dung phù hợp, cũng không gửi được câu hỏi mới, trong kho kiến thức và hỏi đáp bác sĩ có sẵn."
Không đưa chatbot, AI hoặc giải pháp cụ thể vào need statement.

Lịch sử: v1 (19/10/2026) đặt kết quả mong muốn là "tăng tỷ lệ tìm được lời giải thích đáng tin" cho chỉ số trên phiếu. v2 mở sang "có được câu trả lời đáng tin", vì khi kho chưa có nội dung, tìm kiếm tốt hơn cũng không giúp được. v3 mở từ "chỉ số trên phiếu" sang "kết quả khám" và thêm "không gửi được câu hỏi mới", theo phỏng vấn P01-P03: câu hỏi của họ là về vấn đề sức khỏe sau khám, xuất hiện lúc nhận kết quả, khoảng 1 tuần sau khi khám, hoặc trong lúc theo dõi (I05, I07, I09).

## Lý do ưu tiên

Bằng chứng: trong kiểm thử tìm kiếm ở mục Cộng đồng hỏi đáp bác sĩ, 6/7 lượt tìm không trả kết quả; lượt còn lại (GLU) trả 2 bài đều lệch ý, một bài mở sai trang. Cùng lúc đó, màn hình ghi 20.915 câu hỏi đã được bác sĩ giải đáp. Nội dung có sẵn nhưng không tới được người hỏi, và người hỏi không được dẫn tới bác sĩ khi kho không có câu trả lời.

Bằng chứng từ người dùng: ba người được phỏng vấn đều khám tại Vinmec Ocean Park 2, đều tìm câu hỏi của mình trong Cộng đồng hỏi đáp bác sĩ và không thấy kết quả (P01-01, P02-01, P03-01). Mẫu nhỏ, từ một cơ sở.

Mức ảnh hưởng: khi không có câu trả lời trong app, cả ba người phỏng vấn đều rời app hoặc phải chờ. Một người sang Google và đọc bài chung chung, một người định chờ tái khám, một người gọi tổng đài rồi được khuyên đặt lịch và cuối cùng chờ tái khám (P01-12, P02-14, P03-13; I12). Câu hỏi thường nảy ra sau khi đã gặp bác sĩ, lúc không còn ai để hỏi lại (I11). Khảo sát ở Mỹ (BP01) cho thấy lo lắng tăng nhiều hơn ở người thấy kết quả bất thường (17% so với 5%).

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
| E05 | [P01-01](../01-phong-van/interviews/P01.md), [P02-01](../01-phong-van/interviews/P02.md), [P03-01](../01-phong-van/interviews/P03.md) (phỏng vấn, diễn ý) | Cả ba người tìm câu hỏi về sức khỏe của mình trong Cộng đồng hỏi đáp và không thấy kết quả (I05) | Có câu trả lời đáng tin | ① bài hiện sẵn; tìm theo ý nghĩa; ② hỏi bác sĩ khi kho chưa có | [CHƯA THỬ] T2, T4 | |
| E06 | [P02-02](../01-phong-van/interviews/P02.md) (phỏng vấn, diễn ý); O6b (quan sát) | Tràn thông tin, phải lướt và tìm nhiều lần (I06) | Thấy ngay vài câu đúng ngữ cảnh | ① chỉ hiện tối đa 2-3 bài đúng chỉ số hoặc câu hỏi | [CHƯA THỬ] T1 | |
| E07 | O6b (quan sát); [P02-14](../01-phong-van/interviews/P02.md), [P03-11](../01-phong-van/interviews/P03.md), [P03-17](../01-phong-van/interviews/P03.md) (phỏng vấn, diễn ý) | Không gửi được câu hỏi mới tới bác sĩ; 12 chủ đề cố định (I07, I08) | Gửi được câu hỏi của mình, không phải chọn chủ đề | ② soạn câu hỏi gửi bác sĩ, riêng tư, chống trùng | [CHƯA THỬ] T4 | |
| E08 | [P01-12](../01-phong-van/interviews/P01.md), [P02-14](../01-phong-van/interviews/P02.md), [P03-13](../01-phong-van/interviews/P03.md) (phỏng vấn, diễn ý) | Không tìm ra thì rời app hoặc chờ tái khám; câu hỏi nảy ra sau khi đã gặp bác sĩ (I11, I12) | Có câu trả lời đáng tin mà không phải chờ tới lần khám sau | ① bài hiện sẵn; ② hỏi bác sĩ khi kho chưa có | [CHƯA THỬ] T2, T4 | |
| E09 | [P01-17](../01-phong-van/interviews/P01.md), [P02-19](../01-phong-van/interviews/P02.md), [P03-18](../01-phong-van/interviews/P03.md) (phỏng vấn, diễn ý) | Tin bác sĩ hơn chatbot; tin hơn khi biết câu trả lời từ bác sĩ (I13) | Biết câu trả lời đến từ bác sĩ nào, bài nào | ① dẫn tên bác sĩ và bài gốc; AI chỉ chọn và trích, không tự trả lời | [CHƯA THỬ] T1, T2 | |

## Tiêu chí kiểm chứng

Tác vụ và kết quả quan sát được:
- Với cùng bộ từ khóa của kiểm thử (đường huyết lúc đói cao, men gan cao, GLU, ALT, duong huyet cao), người thử tìm được nội dung đúng ý, có dẫn nguồn.
- Từ một chỉ số có cờ, người thử mở được bài bác sĩ đã viết, hoặc gửi được câu hỏi cho bác sĩ, mà không cần người điều phối giúp.

Giả thuyết chưa được chứng minh: hành vi tìm trong app và chuyển sang nguồn ngoài đã có ở 3/3 người phỏng vấn (I05, I12) nhưng mẫu nhỏ, từ một cơ sở; chưa biết người bệnh sẵn lòng gửi câu hỏi riêng tư cho bác sĩ và đồng ý cho dùng câu hỏi đã ẩn danh để bổ sung kho.
