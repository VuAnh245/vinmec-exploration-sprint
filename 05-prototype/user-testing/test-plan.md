# Kế hoạch thử người dùng

Trạng thái: ĐÃ CHỐT KẾ HOẠCH CHO PROTO-V3, CHƯA THỰC HIỆN. Đề yêu cầu 2-3 người; có thể mời lại người đã phỏng vấn và ghi nhận ảnh hưởng của việc họ đã quen chủ đề.

- Phiên bản prototype: proto-v3 (gắn tag `proto-v3` trước phiên đầu tiên; phiên sau sửa ghi phiên bản mới)
- Người thử: người từng nhận kết quả xét nghiệm hoặc chẩn đoán hình ảnh. Cách mời: [ỨNG VIÊN ĐIỀN]
- Hình thức: 15-20 phút, gặp trực tiếp hoặc chia sẻ màn hình; dùng bản mô phỏng điện thoại (`python 05-prototype/app/server.py`) ở chế độ "Thiết kế đề xuất", máy chủ có API key. Có thể cho người thử xem chế độ "Hiện trạng" trước để so sánh, ghi lại nếu có làm.
- Đồng ý tham gia và dùng ghi chép ẩn danh: xác nhận ở đầu mỗi phiếu U.

## Lời mở đầu (đọc nguyên văn)

> Mình đang thử một bản mẫu giúp người bệnh tìm bài giải thích chỉ số trên phiếu kết quả. Đây là bài tập ứng tuyển, không phải sản phẩm của Vinmec; phiếu trên màn hình là dữ liệu giả, bài viết là trang công khai của Vinmec. Mình đang thử công cụ, không thử bạn, nên chỗ nào khó dùng là lỗi của công cụ. Bạn cứ vừa làm vừa nói suy nghĩ của mình. Đừng nhập thông tin sức khỏe thật. Mình ghi chép ẩn danh theo mã U1, U2, ghi chép nằm trong một repo GitHub công khai. Bạn có đồng ý tham gia không?

## Tác vụ

Mọi phiên bắt đầu từ Trang chủ, dùng phiếu "Xét nghiệm sinh hóa máu" để so sánh được giữa các người thử.

| Tác vụ | Tình huống mô phỏng (đọc cho người thử) | Tiêu chí hoàn thành | Chỉ số/cách đo | Khi nào người điều phối hỗ trợ |
|---|---|---|---|---|
| T1. Tìm từ phiếu | "Bạn vừa có kết quả xét nghiệm máu trên app. Phiếu của bạn có chỉ số GLU gắn chữ H. Hãy tìm một bài giải thích chỉ số này." (Đường đi: tab Hồ sơ, phiếu sinh hóa máu; bài hiện sẵn dưới GLU) | Mở được bài về glucose máu (K01 hoặc K02), không phải bài về nước tiểu | Tìm đúng có/không; người thử có thấy bài hiện sẵn không hay vẫn đi tìm; số lần cần hỗ trợ; thời gian thao tác | Kẹt quá 2 phút hoặc người thử hỏi |
| T2. Tìm bằng câu tự gõ | "Bạn nghe người quen nói về men gan. Hãy tự gõ câu hỏi để tìm bài bác sĩ viết về chỉ số ALT." (Đường đi: Trang chủ, Cộng đồng hỏi đáp bác sĩ, ô tìm kiếm) | Kết quả có ít nhất một bài về men gan (K04, K05 hoặc K09) | Ghi nguyên văn câu người thử gõ; tìm đúng có/không; người thử có mở thử phần "So sánh: tìm theo từ khóa" không | Kẹt quá 2 phút |
| T3. Hỏi ngoài phạm vi | "Bạn lo kết quả này nghiêm trọng. Hãy hỏi công cụ xem bạn có cần dùng thuốc không." | Công cụ không tư vấn; người thử nói được bước tiếp theo (gửi câu hỏi cho bác sĩ, tư vấn với bác sĩ, CSKH, gọi bệnh viện) | Số lần AI vượt ranh giới (mục tiêu 0); người thử nói đúng bước tiếp theo có/không | Không hỗ trợ; chỉ quan sát |
| T4. Hỏi bác sĩ khi chưa có bài | "Phiếu tổng phân tích tế bào máu của bạn có WBC gắn chữ H. Hãy tìm hiểu, nếu chưa đủ thì gửi câu hỏi cho bác sĩ." (Đường đi: tab Hồ sơ, phiếu tế bào máu, nút "Hỏi bác sĩ" dưới WBC) | Gửi được câu hỏi; câu hỏi có đúng tên chỉ số, giá trị, khoảng tham chiếu | Gửi được có/không; người thử có sửa câu nháp không, sửa gì; có tích ô đồng ý bổ sung kho không và vì sao | Kẹt quá 2 phút |

Trước phiên đầu tiên, ứng viên tự chạy bộ 5 từ khóa trong `findings.md` với AI và điền cột "Tìm theo ý nghĩa (AI)".

## Câu hỏi sau phiên

1. Khi có kết quả thật, bạn thường tìm hiểu ở đâu? Bạn đã từng tìm trong MyVinmec chưa?
2. Bạn tin bài tìm được đến đâu? Dòng "Tư vấn chuyên môn" có làm bạn tin hơn không?
3. Theo bạn, ai cung cấp công cụ này? (kiểm tra rủi ro RR05)
4. Bạn sẽ dùng công cụ này vào lúc nào, nếu có?
5. Nếu app tự hiện sẵn bài bác sĩ viết ngay dưới chỉ số, bạn có đọc không? Bạn có muốn gửi câu hỏi cho bác sĩ theo cách này không?
6. Nếu được sửa một điều, bạn sửa gì?

## Quy tắc

- Để người thử tự thao tác; ghi lại mọi lần phải giúp.
- Sau U01, sửa ít nhất một điểm rồi mới thử U02, ghi vào `findings.md`. Nếu không sửa được kịp, ghi lý do.
- Không suy ra giảm thời gian chờ ở bệnh viện từ thời gian thao tác trên giao diện.
- Cỡ mẫu 2-3 người chỉ dùng để khám phá, không kết luận hiệu quả.
