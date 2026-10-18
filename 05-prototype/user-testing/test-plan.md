# Kế hoạch thử người dùng

Trạng thái: ĐÃ CHỐT KẾ HOẠCH, CHƯA THỰC HIỆN. Đề yêu cầu 2-3 người; có thể mời lại người đã phỏng vấn và ghi nhận ảnh hưởng của việc họ đã quen chủ đề.

- Phiên bản prototype: proto-v1 (gắn tag `proto-v1` trước phiên đầu tiên; phiên sau sửa ghi phiên bản mới)
- Người thử: người từng nhận kết quả xét nghiệm hoặc chẩn đoán hình ảnh. Cách mời: [ỨNG VIÊN ĐIỀN]
- Hình thức: 15-20 phút, gặp trực tiếp hoặc chia sẻ màn hình; app chạy trên máy ứng viên có API key.
- Đồng ý tham gia và dùng ghi chép ẩn danh: xác nhận ở đầu mỗi phiếu U.

## Lời mở đầu (đọc nguyên văn)

> Mình đang thử một bản mẫu giúp người bệnh đọc phiếu kết quả. Đây là bài tập ứng tuyển, không phải sản phẩm của Vinmec, và phiếu trên màn hình là dữ liệu giả. Mình đang thử công cụ, không thử bạn, nên chỗ nào khó dùng là lỗi của công cụ. Bạn cứ vừa làm vừa nói suy nghĩ của mình. Đừng nhập thông tin sức khỏe thật. Mình ghi chép ẩn danh theo mã U1, U2, ghi chép nằm trong một repo GitHub công khai. Bạn có đồng ý tham gia không?

## Tác vụ

Chọn "Phiếu 01: Sinh hóa máu (mô phỏng)" cho mọi phiên để so sánh được giữa các người thử.

| Tác vụ | Tình huống mô phỏng (đọc cho người thử) | Tiêu chí hoàn thành | Chỉ số/cách đo | Khi nào người điều phối hỗ trợ |
|---|---|---|---|---|
| T1. Hiểu ký hiệu trên phiếu | "Bạn vừa nhận phiếu này. Vài chỉ số có chữ H. Hãy tìm hiểu chữ H nghĩa là gì và GLU là chỉ số gì." | Người thử tự nói lại được H nghĩa là cao hơn khoảng tham chiếu in trên phiếu, và GLU đo gì | Hoàn thành có/không; số lần cần hỗ trợ; thời gian thao tác | Kẹt quá 2 phút hoặc người thử hỏi |
| T2. Chuẩn bị câu hỏi cho bác sĩ | "Ngày mai bạn gặp bác sĩ để nghe giải thích kết quả. Hãy chuẩn bị danh sách câu hỏi về phiếu này." | Lưu ít nhất 2 câu hỏi và tải được danh sách | Số câu hỏi lưu; người thử chấm mức hữu ích của câu hỏi gợi ý (1-5) | Kẹt quá 2 phút |
| T3. Hỏi ngoài phạm vi | "Bạn lo kết quả này nghiêm trọng. Hãy hỏi công cụ xem bạn có cần dùng thuốc không." | Công cụ không tư vấn; người thử nói được bước tiếp theo (đặt tư vấn hoặc gọi tổng đài) | Số lần AI vượt ranh giới (mục tiêu 0); người thử nói đúng bước tiếp theo có/không | Không hỗ trợ; chỉ quan sát |

## Câu hỏi sau phiên

1. Trước khi dùng, bạn hiểu phiếu này ở mức nào (1-5)? Sau khi dùng thì sao?
2. Bạn tin câu trả lời của công cụ đến đâu? Vì sao?
3. Theo bạn, ai cung cấp công cụ này? (kiểm tra rủi ro RR05)
4. Bạn sẽ dùng công cụ này vào lúc nào, nếu có?
5. Nếu được sửa một điều, bạn sửa gì?

## Quy tắc

- Để người thử tự thao tác; ghi lại mọi lần phải giúp.
- Sau U01, sửa ít nhất một điểm rồi mới thử U02, ghi vào `findings.md`. Nếu không sửa được kịp, ghi lý do.
- Không suy ra giảm thời gian chờ ở bệnh viện từ thời gian thao tác trên giao diện.
- Mức hiểu trước và sau là tự đánh giá, cỡ mẫu 2-3 người; chỉ dùng để khám phá, không kết luận hiệu quả.
