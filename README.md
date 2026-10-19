# Vinmec Exploration Sprint: Bài ứng tuyển

> TRẠNG THÁI: BÀI NỘP NGÀY 19/10/2026. Đã có quan sát app, 3 phỏng vấn, workflow, need statement, best practice, prototype chạy được, rủi ro và coach plan.
> Đã thử với 3 người (U01-U03), cả ba là người đã phỏng vấn; ghi chép phiên là diễn ý. Tìm theo ý nghĩa bằng AI (Gemini, đo sau các phiên thử) đúng 5/5 với bộ 5 từ khóa. Các ô [CHƯA ...] đánh dấu phần chưa có bằng chứng, không phải kết quả.

- Họ tên / khóa: Vũ Xuân Anh, K3
- Khoảnh khắc duy nhất được chọn: Nhận kết quả, từ lúc người bệnh biết đã có kết quả xét nghiệm hoặc chẩn đoán hình ảnh đến lúc họ biết cần làm gì tiếp về mặt dịch vụ.
- Nhóm người dùng: người bệnh đã nhận kết quả khám (xét nghiệm, chẩn đoán hình ảnh hoặc kết luận của bác sĩ), tự tìm hiểu trước hoặc sau khi được bác sĩ giải thích.
- Need statement (v3): Cách để rút ngắn thời gian từ lúc có kết quả đến lúc có câu trả lời đáng tin, cho người bệnh đã nhận kết quả khám có câu hỏi về kết quả của mình mà không tìm được nội dung phù hợp, cũng không gửi được câu hỏi mới, trong kho kiến thức và hỏi đáp bác sĩ có sẵn.
- Giải pháp đề xuất (proto-v3): vòng khép kín trên MyVinmec. ① Bài bác sĩ đã viết hiện sẵn dưới chỉ số có cờ. ② Chưa đủ thì AI soạn câu hỏi rõ ràng gửi bác sĩ, báo câu tương tự đã có câu trả lời. ③ Vinmec thấy câu tìm không ra và chỉ số thiếu nội dung để bổ sung kho.
- Demo / phiên bản thử: proto-v3.2, chạy local bằng `python 05-prototype/app/server.py` (hướng dẫn trong [05-prototype/README.md](05-prototype/README.md)); ảnh chụp trong [screenshots/](05-prototype/screenshots/). Chưa deploy.
- Kết quả thực tế và giới hạn: với cùng 5 từ khóa, MyVinmec tìm đúng 0/5, tìm theo từ khóa trong prototype 2/5, tìm theo ý nghĩa bằng AI (Gemini) 5/5 (đều trên kho 11 bài); 5/6 chỉ số có cờ trên phiếu mô phỏng có bài hiện sẵn, không cần AI; 64/64 test tự động đạt. Model chuyển từ OpenAI sang Gemini vì OpenAI hết credit. Thử với 3 người: cả ba hoàn thành T1-T4 không cần hỗ trợ và cho rằng điểm nghẹn được giải quyết đúng chỗ; hai người cho rằng đỡ phí phụ và thời gian (nhận định, chưa đo). Mẫu nhỏ, người thử đã quen chủ đề ([findings.md](05-prototype/user-testing/findings.md)).

## Mục lục cho người chấm

| Thành phần | Vị trí |
|---|---|
| Quan sát MyVinmec | [Ghi chép](01-phong-van/myvinmec-observation.md) |
| Phỏng vấn | [Bộ câu hỏi](01-phong-van/interview-guide.md), [P01](01-phong-van/interviews/P01.md), [P02](01-phong-van/interviews/P02.md), [P03](01-phong-van/interviews/P03.md) |
| Insight | [Tổng hợp](01-phong-van/insights.md) |
| Hành trình và điểm đau | [Workflow và phân tích điểm đau](02-journey-map/journey-map.md) |
| Nhu cầu và bằng chứng | [Need statement](03-need-statement/need-statement.md) |
| Nghiên cứu quốc tế | [Ba best practice và nguồn](04-best-practice/best-practice.md) |
| Prototype | [Hướng dẫn và thiết kế](05-prototype/README.md), [Prompt PR02](05-prototype/prompts/PR02-tim-va-dan-nguon-v1.md), [Prompt PR03 v2](05-prototype/prompts/PR03-soan-cau-hoi-bac-si-v2.md), [Kho nguồn](05-prototype/nguon-noi-dung/kho-bai-viet-vinmec.json) |
| Thử nghiệm và điều chỉnh | [Kế hoạch thử](05-prototype/user-testing/test-plan.md), [U01](05-prototype/user-testing/U01.md), [U02](05-prototype/user-testing/U02.md), [U03](05-prototype/user-testing/U03.md), [Tổng hợp và thay đổi](05-prototype/user-testing/findings.md) |
| Rủi ro và đạo đức | [Rủi ro và quản lý dữ liệu](06-rui-ro-dao-duc/risk-register.md), [Chuyển tuyến khẩn cấp](06-rui-ro-dao-duc/escalation.md) |
| Coach plan | [Kế hoạch một trang](07-coach-plan/coach-plan.md) |
| AI hỗ trợ | [Mục "Phần do AI hỗ trợ"](#phần-do-ai-hỗ-trợ) |
| Slide | [slides.pdf](slides.pdf), 10 slide |

## Phần do AI hỗ trợ

Khung repo và biểu mẫu ban đầu được ChatGPT hỗ trợ tạo ngày 17/10/2026 dựa trên nội dung đề đã đọc và trao đổi với ứng viên. Chưa có bằng chứng thực địa, mã ứng dụng hay kết quả thử được tạo trong khung này.

| File / nội dung | Công cụ, model nếu biết | AI hỗ trợ gì | Người kiểm tra và cách kiểm tra | Trạng thái |
|---|---|---|---|---|
| Khung repo và biểu mẫu | ChatGPT; không ghi model khi chưa xác minh | Tổ chức file, câu hỏi gợi ý, checklist | Ứng viên cần đọc và đối chiếu đề trước khi dùng | CHỜ RÀ SOÁT |
| Quy ước đặt tên, `.gitattributes`, tinh gọn cấu trúc repo | Claude Code, Claude Opus 5.5 | Đề xuất quy ước tên file, mã P/U, prompt, commit; gộp các file trùng ý theo cấu trúc đề | Ứng viên duyệt trước khi commit | ĐÃ DUYỆT |
| `01-phong-van/interview-guide.md` v1, `myvinmec-observation.md`, phiếu P01-P03 | Claude Code, Claude Opus 5.5 | Soạn câu hỏi theo khoảnh khắc "Nhận kết quả", lời xin đồng ý, danh sách tác vụ quan sát O1-O9, mẫu phiếu có dòng thời gian | Ứng viên đọc, chỉnh lời theo cách nói của mình trước khi phỏng vấn | CHỜ RÀ SOÁT |
| `05-prototype/` proto-v1 (PR01), proto-v2 và proto-v3: bản mô phỏng điện thoại (`app/mobile/`, `server.py`), `app.py`, `search.py`, `guard.py`, `llm.py`, test, prompt PR02 và PR03, 2 phiếu mô phỏng | Claude Code, Claude Opus 5.5 | Dựng lại giao diện MyVinmec từ ảnh ứng viên chụp; viết hai chế độ hiện trạng và đề xuất; vòng khép kín (bài hiện sẵn, soạn câu hỏi gửi bác sĩ, bảng phía Vinmec); tìm kiếm, hai lớp chặn, máy chủ; soạn system prompt; tạo dữ liệu mô phỏng; viết 64 test; chuyển model từ OpenAI sang Gemini; chụp màn hình kiểm tra trước và sau | Chạy test tự động (64/64 đạt); ứng viên chọn hướng vòng khép kín; ứng viên chạy bản mô phỏng với API key, chạy bộ 5 từ khóa và đọc lại prompt trước khi cho người thử | CHỜ RÀ SOÁT |
| `05-prototype/nguon-noi-dung/kho-bai-viet-vinmec.json` | Claude Code, Claude Opus 5.5 | Tìm và mở 10 trang trên vinmec.com, ghi tiêu đề, đường dẫn, người tư vấn, tên mục; bài thứ 11 lấy từ ảnh ứng viên chụp trong app | Ứng viên mở thử vài link để xác nhận | CHỜ RÀ SOÁT |
| `02-journey-map/journey-map.md`, `01-phong-van/insights.md` | Claude Code, Claude Opus 5.5 | Dựng workflow có sơ đồ, phân tích 6 điểm đau và nguyên nhân có thể từ nhật ký quan sát; tổng hợp 4 insight từ quan sát | Ứng viên đối chiếu với ảnh chụp; cột cảm xúc và insight phỏng vấn chờ P01-P03 | CHỜ RÀ SOÁT |
| `01-phong-van/myvinmec-observation.md`, `03-need-statement/need-statement.md` (nháp v1) | Claude Code, Claude Opus 5.5 | Ghi nhật ký O1-O10 và bảng kiểm thử tìm kiếm từ ảnh chụp và ghi nhận của ứng viên; soạn nháp need statement và bảng bằng chứng | Ứng viên tự dùng app, chụp ảnh, kiểm thử tìm kiếm hai lượt; đọc lại nhật ký so với ảnh | CHỜ RÀ SOÁT |
| Phiếu P01-P03, insight I05-I14, need statement v3 (E05-E09), ĐĐ7-ĐĐ10 và cột cảm xúc trong workflow, quan sát O6b | Claude Code, Claude Opus 5.5 | Chép tóm tắt phỏng vấn của ứng viên vào phiếu dạng diễn ý, bỏ tên vấn đề sức khỏe theo cam kết; soạn câu chữ cho phần bổ sung câu 4-15 của guide; tổng hợp insight; đề xuất câu chữ need statement | Ứng viên tự phỏng vấn, xác nhận sự đồng ý; ngày 19/10/2026 rà soát từng dòng bổ sung và xác nhận khớp với trí nhớ về buổi phỏng vấn; chọn đổi need statement | ĐÃ DUYỆT |
| `04-best-practice/best-practice.md` | Claude Code, Claude Opus 5.5 | Tìm và mở nguồn, tóm tắt số liệu, đề xuất bài học cho Vinmec | Ứng viên mở lại 3 nguồn và bài gốc trên JAMA Network Open để đối chiếu số liệu | CHỜ RÀ SOÁT |
| `06-rui-ro-dao-duc/risk-register.md`, `escalation.md` | Claude Code, Claude Opus 5.5 | Lập danh mục rủi ro RR01-RR12 gắn với code, bảng quản lý dữ liệu, thông điệp chuyển tuyến | Ứng viên xác minh số tổng đài trong app, điền thời điểm xóa ghi chép thô | CHỜ RÀ SOÁT |
| `05-prototype/user-testing/test-plan.md`, phiếu U01-U03 | Claude Code, Claude Opus 5.5 | Soạn 4 tác vụ thử (T1-T4), tiêu chí, chỉ số, lời mở đầu, câu hỏi sau phiên | Ứng viên đọc thử lời mở đầu và chạy thử 4 tác vụ trước phiên đầu | CHỜ RÀ SOÁT |
| `slides.pdf`, chạy thử nội bộ T1-T4 trong `findings.md`, phiếu U01-U03 dạng điền nhanh | Claude Code, Claude Opus 5.5 | Dựng 10 slide từ nội dung repo theo dàn ý; chạy các hàm của prototype với 5 từ khóa và T1-T4 (API trả lỗi 429); in sẵn đường đi đúng và tiêu chí trong phiếu U | Ứng viên đọc lại số liệu trên slide so với file nguồn và diễn tập 10 phút; phiếu U chỉ điền sau phiên thử thật | CHỜ RÀ SOÁT |
| Phiếu U01-U03 sau phiên, cập nhật `findings.md` và cột phiên thử trong need statement | Claude Code, Claude Opus 5.5 | Chép tóm tắt sau phiên của ứng viên vào phiếu dạng diễn ý; ô ứng viên không cung cấp ghi "Không ghi nhận"; ghi giới hạn của phiên | Ứng viên tự điều phối 3 phiên ngày 19/10/2026 và cung cấp tóm tắt; đọc lại phiếu trước khi nộp | CHỜ RÀ SOÁT |
| `07-coach-plan/coach-plan.md` | Claude Code, Claude Opus 5.5 | Soạn lịch theo khung 6 tuần, cách gỡ vướng, kiểm tra chất lượng | Ứng viên thêm ví dụ thật từ AI20K và chỉnh theo cách mình sẽ làm | CHỜ RÀ SOÁT |

Không dùng AI để giả lời phỏng vấn hoặc kết quả người dùng. Không đưa thông tin sức khỏe/cá nhân vào prompt. Phân biệt AI hỗ trợ làm bài với chức năng AI của prototype.

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
