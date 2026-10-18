# Ba best practice quốc tế

Trạng thái: ĐÃ ĐIỀN TỪ NGUỒN THỨ CẤP. Số liệu BP01 và BP03 lấy từ trang tin của tổ chức thực hiện nghiên cứu, chưa đối chiếu với bài gốc trên JAMA Network Open.

Ba thực hành đều nói về khoảnh khắc "Nhận kết quả". Chúng cùng chỉ một hướng: người bệnh muốn xem kết quả sớm, một nhóm nhỏ lo lắng hơn khi kết quả bất thường, và nơi đã dùng AI để giải thích kết quả thì vẫn để bác sĩ duyệt trước khi gửi.

| Mục | Thực hành và tổ chức/quốc gia | Vấn đề tương đồng | Nguồn | Hiệu quả thực sự được nguồn hỗ trợ | Bài học cho Vinmec | Giới hạn chuyển giao |
|---|---|---|---|---|---|---|
| BP01 | Mỹ: trả kết quả ngay qua cổng bệnh nhân (Epic MyChart) theo 21st Century Cures Act; khảo sát tại 4 trung tâm học thuật | Người bệnh xem kết quả trước khi được bác sĩ giải thích | [1] | Khảo sát gửi tới hơn 43.000 người, 8.139 người trả lời. 96% muốn xem kết quả ngay qua cổng; 95% người có kết quả "không bình thường" vẫn muốn như vậy. 8% lo lắng hơn sau khi xem; tỷ lệ này là 17% ở người thấy kết quả không bình thường và 5% ở người thấy kết quả bình thường | Không nên giữ kết quả lại để tránh lo lắng. Hỗ trợ nên tập trung vào lúc người bệnh gặp kết quả bất thường, trước khi họ được bác sĩ giải thích | Khảo sát ở Mỹ, trên người đã quen dùng cổng bệnh nhân; người trả lời là nhóm tự chọn |
| BP02 | Anh: NHS App cho xem kết quả xét nghiệm trong hồ sơ của bác sĩ gia đình (GP) | Kênh xem kết quả trên ứng dụng và lối ra khi người bệnh băn khoăn | [2] | Trang hướng dẫn ghi: kết quả được nhân viên y tế xem trước và thường có sau vài ngày; bác sĩ nên hoãn hiển thị nếu cần trao đổi trực tiếp; người bệnh có thể xin ẩn một số kết quả; nếu băn khoăn thì liên hệ GP. Trang không nói về việc giúp người bệnh hiểu kết quả. Đây là mô tả chính sách, không phải số liệu hiệu quả | Màn hình kết quả cần một lối ra rõ ràng tới người có chuyên môn. Kết quả nhạy cảm nên có cơ chế để bác sĩ quyết định thời điểm hiển thị | Hệ thống công có bác sĩ gia đình; Vinmec là bệnh viện tư, không có mô hình GP tương ứng |
| BP03 | Stanford Health Care (Mỹ): AI soạn nháp lời giải thích kết quả xét nghiệm, chẩn đoán hình ảnh, giải phẫu bệnh bằng ngôn ngữ dễ hiểu; bác sĩ duyệt và sửa trước khi gửi qua cổng bệnh nhân | Dùng mô hình ngôn ngữ để giải thích kết quả cho người bệnh | [3] | Thí điểm với bác sĩ chăm sóc ban đầu: 244 người dùng thử ít nhất một lần, 93 người trả lời khảo sát. 71% thấy hiệu suất tăng, 72% thấy lời giải thích cho người bệnh tốt hơn; thời gian tiết kiệm ước khoảng 1,1 phút mỗi tác vụ. Bác sĩ còn lo ngại về độ chính xác và độ đầy đủ | AI nên đứng sau bác sĩ khi diễn giải kết quả. Phần người bệnh tự dùng chỉ nên giải thích cách đọc phiếu và gợi ý câu hỏi, như cách prototype đang giới hạn | Số liệu là cảm nhận của bác sĩ, chưa đo phản ứng của người bệnh; công cụ tích hợp sâu vào hồ sơ bệnh án điện tử |

Không dùng trang giới thiệu sản phẩm làm bằng chứng hiệu quả lâm sàng. Trước khi trình bày, mở bài gốc của BP01 và BP03 để lấy DOI và đối chiếu số liệu.

## Áp dụng vào prototype

- Từ BP01: prototype hỗ trợ ngay lúc người bệnh đọc phiếu, đặc biệt các chỉ số có ký hiệu H/L.
- Từ BP02: mọi câu trả lời đều kèm phần "Bước tiếp theo" (đặt tư vấn kết quả, gọi tổng đài).
- Từ BP03: AI không diễn giải bệnh; câu hỏi cần diễn giải được chuyển thành câu hỏi cho bác sĩ.

## Tài liệu tham khảo

| Mã | Tác giả/tổ chức | Tên tài liệu | Năm | URL/DOI | Ngày truy cập | Đoạn hỗ trợ nhận định |
|---|---|---|---|---|---|---|
| [1] | Vanderbilt University Medical Center (VUMC News) | Survey finds patients value immediate access to test results | 2023 | https://news.vumc.org/2023/03/22/survey-finds-patients-value-immediate-access-to-test-results/ | 18/10/2026 | Thiết kế khảo sát, cỡ mẫu, tỷ lệ ưa thích xem ngay và tỷ lệ lo lắng hơn |
| [2] | NHS | Test results in the NHS App | Không ghi | https://www.nhs.uk/nhs-app/help/health-records-in-the-nhs-app/test-results/ | 18/10/2026 | Thời gian có kết quả, việc xem trước, hoãn hoặc ẩn kết quả, liên hệ GP |
| [3] | Applied Radiology | Stanford tests AI tool to help clinicians explain imaging and lab results | 2025 | https://appliedradiology.com/articles/stanford-tests-ai-tool-to-help-clinicians-explain-imaging-and-lab-results | 18/10/2026 | Cách công cụ hoạt động, bác sĩ duyệt trước khi gửi, số liệu khảo sát thí điểm, lo ngại về độ chính xác |

Bài gốc cần mở thêm: Steitz B. và cộng sự, JAMA Network Open, 2023 (nghiên cứu của [1]); Shah S. J. và cộng sự, JAMA Network Open, 2025 (nghiên cứu của [3]).
