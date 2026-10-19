# Kế hoạch thử người dùng

Trạng thái: ĐÃ CHỐT KẾ HOẠCH CHO PROTO-V2, CHƯA THỰC HIỆN. Đề yêu cầu 2-3 người; có thể mời lại người đã phỏng vấn và ghi nhận ảnh hưởng của việc họ đã quen chủ đề.

- Phiên bản prototype: proto-v2 (gắn tag `proto-v2` trước phiên đầu tiên; phiên sau sửa ghi phiên bản mới)
- Người thử: người từng nhận kết quả xét nghiệm hoặc chẩn đoán hình ảnh. Cách mời: [ỨNG VIÊN ĐIỀN]
- Hình thức: 15-20 phút, gặp trực tiếp hoặc chia sẻ màn hình; app chạy trên máy ứng viên có API key.
- Đồng ý tham gia và dùng ghi chép ẩn danh: xác nhận ở đầu mỗi phiếu U.

## Lời mở đầu (đọc nguyên văn)

> Mình đang thử một bản mẫu giúp người bệnh tìm bài giải thích chỉ số trên phiếu kết quả. Đây là bài tập ứng tuyển, không phải sản phẩm của Vinmec; phiếu trên màn hình là dữ liệu giả, bài viết là trang công khai của Vinmec. Mình đang thử công cụ, không thử bạn, nên chỗ nào khó dùng là lỗi của công cụ. Bạn cứ vừa làm vừa nói suy nghĩ của mình. Đừng nhập thông tin sức khỏe thật. Mình ghi chép ẩn danh theo mã U1, U2, ghi chép nằm trong một repo GitHub công khai. Bạn có đồng ý tham gia không?

## Tác vụ

Chọn "Phiếu 01: Sinh hóa máu (mô phỏng)" cho mọi phiên để so sánh được giữa các người thử.

| Tác vụ | Tình huống mô phỏng (đọc cho người thử) | Tiêu chí hoàn thành | Chỉ số/cách đo | Khi nào người điều phối hỗ trợ |
|---|---|---|---|---|
| T1. Tìm từ phiếu | "Phiếu của bạn có chỉ số GLU gắn chữ H. Hãy tìm một bài giải thích chỉ số này." | Mở được bài về glucose máu (K01 hoặc K02), không phải bài về nước tiểu | Tìm đúng có/không; số lần cần hỗ trợ; thời gian thao tác | Kẹt quá 2 phút hoặc người thử hỏi |
| T2. Tìm bằng câu tự gõ | "Bạn nghe người quen nói về men gan. Hãy tự gõ câu hỏi để tìm bài bác sĩ viết về chỉ số ALT." | Kết quả có ít nhất một bài về men gan (K04, K05 hoặc K09) | Ghi nguyên văn câu người thử gõ; tìm đúng có/không; người thử có mở thử phần "So sánh: tìm theo từ khóa" không | Kẹt quá 2 phút |
| T3. Hỏi ngoài phạm vi | "Bạn lo kết quả này nghiêm trọng. Hãy hỏi công cụ xem bạn có cần dùng thuốc không." | Công cụ không tư vấn; người thử nói được bước tiếp theo (tư vấn với bác sĩ, CSKH, gọi bệnh viện) | Số lần AI vượt ranh giới (mục tiêu 0); người thử nói đúng bước tiếp theo có/không | Không hỗ trợ; chỉ quan sát |

Trước phiên đầu tiên, ứng viên tự chạy bộ 5 từ khóa trong `findings.md` với AI và điền cột "Tìm theo ý nghĩa (AI)".

## Câu hỏi sau phiên

1. Khi có kết quả thật, bạn thường tìm hiểu ở đâu? Bạn đã từng tìm trong MyVinmec chưa?
2. Bạn tin bài tìm được đến đâu? Dòng "Tư vấn chuyên môn" có làm bạn tin hơn không?
3. Theo bạn, ai cung cấp công cụ này? (kiểm tra rủi ro RR05)
4. Bạn sẽ dùng công cụ này vào lúc nào, nếu có?
5. Nếu được sửa một điều, bạn sửa gì?

## Quy tắc

- Để người thử tự thao tác; ghi lại mọi lần phải giúp.
- Sau U01, sửa ít nhất một điểm rồi mới thử U02, ghi vào `findings.md`. Nếu không sửa được kịp, ghi lý do.
- Không suy ra giảm thời gian chờ ở bệnh viện từ thời gian thao tác trên giao diện.
- Cỡ mẫu 2-3 người chỉ dùng để khám phá, không kết luận hiệu quả.
