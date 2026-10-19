# Vinmec Exploration Sprint: Bài ứng tuyển

> TRẠNG THÁI: KHUNG LÀM VIỆC, CHƯA PHẢI BÀI NỘP HOÀN CHỈNH.
> Các ô [CHƯA ĐIỀN] và các file mẫu không phải bằng chứng đã thu thập.

- Họ tên / khóa: Vũ Xuân Anh, K3
- Khoảnh khắc duy nhất được chọn: Nhận kết quả, từ lúc người bệnh biết đã có kết quả xét nghiệm hoặc chẩn đoán hình ảnh đến lúc họ biết cần làm gì tiếp về mặt dịch vụ.
- Nhóm người dùng: người bệnh vừa nhận kết quả xét nghiệm, tự đọc phiếu trước khi được bác sĩ giải thích.
- Need statement (bản nháp v1, chờ đối chiếu phỏng vấn): Cách để tăng tỷ lệ tìm được lời giải thích đáng tin, đúng với chỉ số trên phiếu, cho người bệnh vừa nhận kết quả xét nghiệm mà không tìm được nội dung phù hợp trong kho kiến thức và hỏi đáp bác sĩ có sẵn.
- Demo / phiên bản thử: [CHƯA ĐIỀN]
- Kết quả thực tế và giới hạn: [CHƯA ĐIỀN]

## Mục lục cho người chấm

| Thành phần | Vị trí |
|---|---|
| Quan sát MyVinmec | [Ghi chép](01-phong-van/myvinmec-observation.md) |
| Phỏng vấn | [Bộ câu hỏi](01-phong-van/interview-guide.md), [P01](01-phong-van/interviews/P01.md), [P02](01-phong-van/interviews/P02.md), [P03](01-phong-van/interviews/P03.md) |
| Insight | [Tổng hợp](01-phong-van/insights.md) |
| Hành trình và điểm đau | [Workflow và phân tích điểm đau](02-journey-map/journey-map.md) |
| Nhu cầu và bằng chứng | [Need statement](03-need-statement/need-statement.md) |
| Nghiên cứu quốc tế | [Ba best practice và nguồn](04-best-practice/best-practice.md) |
| Prototype | [Hướng dẫn và thiết kế](05-prototype/README.md), [Prompt PR02](05-prototype/prompts/PR02-tim-va-dan-nguon-v1.md), [Kho nguồn](05-prototype/nguon-noi-dung/kho-bai-viet-vinmec.json) |
| Thử nghiệm và điều chỉnh | [Kế hoạch thử](05-prototype/user-testing/test-plan.md), [U01](05-prototype/user-testing/U01.md), [U02](05-prototype/user-testing/U02.md), [U03](05-prototype/user-testing/U03.md), [Tổng hợp và thay đổi](05-prototype/user-testing/findings.md) |
| Rủi ro và đạo đức | [Rủi ro và quản lý dữ liệu](06-rui-ro-dao-duc/risk-register.md), [Chuyển tuyến khẩn cấp](06-rui-ro-dao-duc/escalation.md) |
| Coach plan | [Kế hoạch một trang](07-coach-plan/coach-plan.md) |
| AI hỗ trợ | [Mục "Phần do AI hỗ trợ"](#phần-do-ai-hỗ-trợ) |
| Slide | Chưa tạo; xuất slides.pdf ở thư mục gốc, tối đa 10 slide |

## Phần do AI hỗ trợ

Khung repo và biểu mẫu ban đầu được ChatGPT hỗ trợ tạo ngày 17/10/2026 dựa trên nội dung đề đã đọc và trao đổi với ứng viên. Chưa có bằng chứng thực địa, mã ứng dụng hay kết quả thử được tạo trong khung này.

| File / nội dung | Công cụ, model nếu biết | AI hỗ trợ gì | Người kiểm tra và cách kiểm tra | Trạng thái |
|---|---|---|---|---|
| Khung repo và biểu mẫu | ChatGPT; không ghi model khi chưa xác minh | Tổ chức file, câu hỏi gợi ý, checklist | Ứng viên cần đọc và đối chiếu đề trước khi dùng | CHỜ RÀ SOÁT |
| Quy ước đặt tên, `.gitattributes`, tinh gọn cấu trúc repo | Claude Code, Claude Opus 5.5 | Đề xuất quy ước tên file, mã P/U, prompt, commit; gộp các file trùng ý theo cấu trúc đề | Ứng viên duyệt trước khi commit | ĐÃ DUYỆT |
| `01-phong-van/interview-guide.md` v1, `myvinmec-observation.md`, phiếu P01-P03 | Claude Code, Claude Opus 5.5 | Soạn câu hỏi theo khoảnh khắc "Nhận kết quả", lời xin đồng ý, danh sách tác vụ quan sát O1-O9, mẫu phiếu có dòng thời gian | Ứng viên đọc, chỉnh lời theo cách nói của mình trước khi phỏng vấn | CHỜ RÀ SOÁT |
| `05-prototype/` proto-v1 (PR01) và proto-v2: `app.py`, `search.py`, `guard.py`, test, prompt PR02, 2 phiếu mô phỏng | Claude Code, Claude Opus 5.5 | Viết code giao diện mô phỏng bố cục Cộng đồng hỏi đáp, tìm kiếm và hai lớp chặn; soạn system prompt; tạo dữ liệu mô phỏng; viết 41 test | Chạy test tự động (41/41 đạt); ứng viên chạy app với API key, chạy bộ 5 từ khóa và đọc lại prompt trước khi cho người thử | CHỜ RÀ SOÁT |
| `05-prototype/nguon-noi-dung/kho-bai-viet-vinmec.json` | Claude Code, Claude Opus 5.5 | Tìm và mở 10 trang trên vinmec.com, ghi tiêu đề, đường dẫn, người tư vấn, tên mục; bài thứ 11 lấy từ ảnh ứng viên chụp trong app | Ứng viên mở thử vài link để xác nhận | CHỜ RÀ SOÁT |
| `02-journey-map/journey-map.md`, `01-phong-van/insights.md` | Claude Code, Claude Opus 5.5 | Dựng workflow có sơ đồ, phân tích 6 điểm đau và nguyên nhân có thể từ nhật ký quan sát; tổng hợp 4 insight từ quan sát | Ứng viên đối chiếu với ảnh chụp; cột cảm xúc và insight phỏng vấn chờ P1-P3 | CHỜ RÀ SOÁT |
| `01-phong-van/myvinmec-observation.md`, `03-need-statement/need-statement.md` (nháp v1) | Claude Code, Claude Opus 5.5 | Ghi nhật ký O1-O10 và bảng kiểm thử tìm kiếm từ ảnh chụp và ghi nhận của ứng viên; soạn nháp need statement và bảng bằng chứng | Ứng viên tự dùng app, chụp ảnh, kiểm thử tìm kiếm hai lượt; đọc lại nhật ký so với ảnh | CHỜ RÀ SOÁT |
| `04-best-practice/best-practice.md` | Claude Code, Claude Opus 5.5 | Tìm và mở nguồn, tóm tắt số liệu, đề xuất bài học cho Vinmec | Ứng viên mở lại 3 nguồn và bài gốc trên JAMA Network Open để đối chiếu số liệu | CHỜ RÀ SOÁT |
| `06-rui-ro-dao-duc/risk-register.md`, `escalation.md` | Claude Code, Claude Opus 5.5 | Lập danh mục rủi ro RR01-RR06 gắn với code, bảng quản lý dữ liệu, thông điệp chuyển tuyến | Ứng viên xác minh số tổng đài trong app, điền thời điểm xóa ghi chép thô | CHỜ RÀ SOÁT |
| `05-prototype/user-testing/test-plan.md`, phiếu U01-U03 | Claude Code, Claude Opus 5.5 | Soạn 3 tác vụ thử, tiêu chí, chỉ số, lời mở đầu, câu hỏi sau phiên | Ứng viên đọc thử lời mở đầu và chạy thử 3 tác vụ trước phiên đầu | CHỜ RÀ SOÁT |
| `07-coach-plan/coach-plan.md` | Claude Code, Claude Opus 5.5 | Soạn lịch theo khung 6 tuần, cách gỡ vướng, kiểm tra chất lượng | Ứng viên thêm ví dụ thật từ AI20K và chỉnh theo cách mình sẽ làm | CHỜ RÀ SOÁT |

Bổ sung từng phần phát sinh. Không dùng AI để giả lời phỏng vấn hoặc kết quả người dùng. Không đưa thông tin sức khỏe/cá nhân vào prompt. Phân biệt AI hỗ trợ làm bài với chức năng AI của prototype.

## Quy ước đặt tên

| Đối tượng | Quy ước | Ví dụ |
|---|---|---|
| Thư mục từng bước | `NN-ten-khong-dau`, đánh số theo thứ tự bước trong đề | `01-phong-van/` |
| File nội dung | Chữ thường, không dấu, nối bằng `-` | `interview-guide.md` |
| Người được phỏng vấn | `P` + 2 chữ số, theo thứ tự thời gian | `interviews/P01.md` |
| Người thử prototype | `U` + 2 chữ số; ghi trong phiếu nếu trùng một người P | `user-testing/U01.md` |
| Prompt | `PRNN-mo-ta-vN.md`, tăng `vN` khi đổi nội dung | `prompts/PR01-giai-thich-phieu-v1.md` |
| Dữ liệu mô phỏng | `mock-` + mô tả + số thứ tự | `mock-data/mock-phieu-ket-qua-01.json` |
| Ảnh chụp prototype | `vN-ten-man-hinh.png`, `vN` là phiên bản prototype | `screenshots/v1-hoi-dap.png` |
| Phiên bản prototype | Tag git `proto-vN` tại commit dùng khi thử | `proto-v1` |
| Slide | Đúng tên đề yêu cầu, đặt ở thư mục gốc | `slides.pdf` |

Thư mục con trong `05-prototype/` (`app/`, `mock-data/`, `screenshots/`) chỉ tạo khi có nội dung thật.

Commit: `<loại>(<phạm vi>): <mô tả ngắn>`, với loại là `docs`, `research`, `proto`, `test`, `fix` hoặc `chore`. Ví dụ: `research(01-phong-van): thêm ghi chép P01`.

## Phạm vi và giới hạn

- Đây là prototype đề xuất; không mặc định đã tích hợp MyVinmec.
- Chỉ công bố kết quả có bằng chứng; dữ liệu mô phỏng phải được gắn nhãn.
- Phân biệt quan sát, diễn giải, giả thuyết và dữ liệu mô phỏng.
- Cỡ mẫu nhỏ phục vụ khám phá; không đại diện cho toàn bộ người bệnh Vinmec.
