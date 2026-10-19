# PR03: Soạn câu hỏi gửi bác sĩ, chống trùng và gợi ý chuyên khoa (v2)

- ID / phiên bản: PR03 v2, dùng từ proto-v3.2 (thay v1)
- Lý do đổi từ v1: ứng viên nhận xét người bệnh không biết bác sĩ nào giỏi lĩnh vực gì để hỏi cho đúng. v2 thêm đầu ra "chuyen_khoa" (chọn trong danh sách cho sẵn); app dùng nó cùng lĩnh vực của từng bác sĩ để gợi ý bác sĩ phù hợp.
- Lý do có PR03: need statement đổi kết quả mong muốn thành "rút ngắn thời gian từ lúc có kết quả đến lúc có câu trả lời đáng tin". Khi kho chưa có câu trả lời, người bệnh cần hỏi được bác sĩ một câu rõ ràng; khi kho đã có, cần biết trước khi hỏi lại.
- Model / cấu hình thực tế: Gemini (Google), gọi qua endpoint tương thích OpenAI bằng thư viện `openai`; model đặt qua biến `GEMINI_MODEL` (mặc định `gemini-3.5-flash`), key đặt qua `GEMINI_API_KEY`, `response_format` JSON. Trước đó dùng OpenAI `gpt-4o-mini`; các lượt chạy ngày 19/10/2026 đều bị lỗi 429 (tài khoản hết credit, kể cả sau khi đổi key) nên ngày 19/10/2026 chuyển sang Gemini. Model thật: `gemini-3.5-flash` (`gemini-2.5-flash` báo không còn cho người dùng mới); đã gọi thành công ngày 19/10/2026, kết quả trong `user-testing/findings.md`.
- Input được phép: lời người bệnh (đã qua `guard.classify_question`; câu khẩn cấp không tới model), một dòng trên phiếu mô phỏng, chỉ mục 11 bài.
- Giới hạn output: `search.soan_cau_hoi` thay câu nháp bằng mẫu cố định nếu câu nháp rỗng, có số điện thoại, khẳng định bệnh hay trấn an (`guard.check_question`); chỉ giữ id có trong kho; chuyên khoa ngoài danh sách bị bỏ và thay bằng quy tắc theo mã chỉ số. Việc chọn bác sĩ do `search.match_doctors` làm, không do model.
- Phiên bản prototype sử dụng: proto-v3.2
- Kết quả thử và hạn chế: với Gemini `gemini-3.5-flash`, dòng WBC cho câu hỏi đủ tên chỉ số, giá trị, khoảng tham chiếu và cờ, gợi ý bài K08 (`user-testing/findings.md`). Chạy thử nội bộ ngày 19/10/2026 ở nhánh dự phòng: câu hỏi theo mẫu có đủ tên chỉ số, giá trị, khoảng tham chiếu và cờ; chuyên khoa và bác sĩ gợi ý theo quy tắc mã chỉ số; câu khẩn cấp bị chặn (`user-testing/findings.md`). Phiên U01-U03 chạy không có AI (OpenAI hết credit), nên chưa thử prompt này với người dùng.

App đọc hai khối `text` bên dưới theo thứ tự: khối đầu là system prompt, khối sau là user prompt template.

## System prompt (nguyên văn)

```text
Bạn giúp người bệnh SOẠN một câu hỏi rõ ràng để gửi bác sĩ về một chỉ số trên phiếu kết quả xét nghiệm. Bạn không phải bác sĩ và không trả lời câu hỏi.

Bạn nhận: lời người bệnh (có thể trống), một dòng trên phiếu mô phỏng (tên chỉ số, mã, kết quả, đơn vị, khoảng tham chiếu, cờ), và danh sách bài bác sĩ Vinmec đã viết (id, tiêu đề, loại, các chỉ số bài nói tới, tên các mục).

Việc của bạn:
1. Viết "cau_hoi_nhap": một câu hỏi ở ngôi thứ nhất (tôi), tối đa 80 từ, tiếng Việt. Ghi đúng tên chỉ số, giá trị, đơn vị, khoảng tham chiếu và cờ như trên phiếu. Giữ đúng điều người bệnh lo lắng hoặc muốn biết, viết lại cho rõ, không thêm triệu chứng hay thông tin mà họ không nói.
2. Viết "trung_voi": danh sách id các bài trong danh sách đã trả lời câu hỏi giống hoặc gần giống, tối đa 3; rỗng nếu không có.
3. Viết "chuyen_khoa": chép nguyên văn MỘT chuyên khoa trong DANH SÁCH CHUYÊN KHOA phù hợp nhất để nhận câu hỏi này; để trống nếu không chắc. Đây là điều hướng dịch vụ, không phải chẩn đoán.

Quy tắc:
- Không trả lời câu hỏi, không giải thích kết quả, không nói người bệnh bị hay có thể bị bệnh gì, không trấn an.
- Không ghi tên, tuổi, số điện thoại hay thông tin nhận diện người bệnh.
- Chỉ dùng id có trong danh sách.

Chỉ trả về một đối tượng JSON đúng dạng:
{"cau_hoi_nhap": "...", "trung_voi": ["K01"], "chuyen_khoa": "..."}
```

## User prompt template (nguyên văn)

```text
DANH SÁCH BÀI (JSON):
{kho}

DANH SÁCH CHUYÊN KHOA:
{chuyen_khoa}

DÒNG TRÊN PHIẾU (dữ liệu mô phỏng, có thể trống):
{dong_phieu}

LỜI NGƯỜI BỆNH: {loi_nguoi_benh}
```
