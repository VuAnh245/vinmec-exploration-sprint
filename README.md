# Vinmec Exploration Sprint: Bài ứng tuyển

> TRẠNG THÁI: BÀI NỘP NGÀY 19/10/2026. Đã có quan sát app, 3 phỏng vấn, workflow, need statement, best practice, prototype chạy được, rủi ro và coach plan.
> Đã thử với 3 người (U01-U03), cả ba là người đã phỏng vấn; ghi chép phiên là diễn ý; các phiên chạy không có AI. Tìm theo ý nghĩa bằng AI (Gemini, đo sau các phiên thử) đúng 5/5 với bộ 5 từ khóa.

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
| Phần tự làm và AI hỗ trợ | [Phần ứng viên tự làm](#phần-ứng-viên-tự-làm), [Phần do AI hỗ trợ](#phần-do-ai-hỗ-trợ) |
| Slide | [slides.pdf](slides.pdf), 10 slide |

## Phần ứng viên tự làm

- Chọn khoảnh khắc "Nhận kết quả" (17/10/2026). Sau khi tự dùng app, tìm ra ngách Cộng đồng hỏi đáp bác sĩ và chốt đi theo hướng này.
- Cài và dùng MyVinmec v3.0.5, chụp 17 ảnh màn hình ([anh-myvinmec/](01-phong-van/anh-myvinmec/)). Tự kiểm thử tìm kiếm hai lượt ngày 19/10/2026 và phát hiện kết quả "GLU" mở sai bài.
- Phỏng vấn trực tiếp 3 người tại Vinmec Ocean Park 2 ngày 18/10/2026 (30, 25 và 35 phút): xin đồng ý, giữ cam kết không ghi tên vấn đề sức khỏe. Ngày 19/10/2026 hồi tưởng và xác nhận từng dòng bổ sung trong phiếu P.
- Quyết định các lần đổi hướng của prototype:
  - bỏ việc để AI tự giải thích phiếu (v1 sang v2);
  - nhận định "chỉ tìm kiếm tốt hơn thì giá trị nhỏ", dẫn tới vòng khép kín (v3);
  - yêu cầu hiệu ứng chuyển trạng thái và hiện rõ điểm đau trước và sau (v3.1);
  - chỉ ra rằng người bệnh không biết bác sĩ giỏi lĩnh vực nào và giao diện quá đơn điệu (v3.2).
- Điều phối 3 phiên thử U01-U03 ngày 19/10/2026; sửa lỗi hiệu ứng nhỏ sau U01.
- Cung cấp API key. Quyết định chuyển sang Gemini khi tài khoản OpenAI hết credit.
- Cung cấp kinh nghiệm thật cho coach plan (dự án P09, Lab Coach AI Thực Chiến).
- Đọc lại và duyệt nội dung trước mỗi commit; tự chạy các lệnh git.

## Phần do AI hỗ trợ

Công cụ: Claude Code, model Claude Opus 5.5. Ứng viên quyết định hướng đi và duyệt kết quả; AI soạn thảo, viết code và tổng hợp theo yêu cầu của ứng viên.

| File / nội dung | AI làm gì | Ứng viên quyết định và kiểm tra | Trạng thái |
|---|---|---|---|
| Quy ước đặt tên, `.gitattributes`, cấu trúc repo | Đề xuất quy ước tên file, mã P/U, prompt, commit; gộp các file trùng ý theo cấu trúc đề | Chọn quy ước, duyệt trước khi commit | ĐÃ DUYỆT |
| `01-phong-van/interview-guide.md` v1, mẫu phiếu P01-P03 | Soạn câu hỏi theo khoảnh khắc "Nhận kết quả", lời xin đồng ý, mẫu phiếu có dòng thời gian | Chọn khoảnh khắc; chỉnh lời theo cách nói của mình; tự phỏng vấn | ĐÃ DUYỆT |
| `01-phong-van/myvinmec-observation.md` | Ghi nhật ký O1-O10 và bảng kiểm thử tìm kiếm từ ảnh chụp và ghi nhận của ứng viên | Tự dùng app, chụp ảnh, kiểm thử tìm kiếm hai lượt; đối chiếu nhật ký với ảnh | ĐÃ DUYỆT |
| Phiếu P01-P03, insight I05-I14, need statement v3 (E05-E09), ĐĐ7-ĐĐ10, quan sát O6b | Chép tóm tắt phỏng vấn của ứng viên vào phiếu dạng diễn ý, bỏ tên vấn đề sức khỏe; soạn câu chữ cho phần bổ sung câu 4-15 của guide; tổng hợp insight; đề xuất câu chữ need statement | Cung cấp nội dung phỏng vấn; ngày 19/10/2026 rà từng dòng bổ sung và xác nhận khớp với trí nhớ; chọn đổi need statement | ĐÃ DUYỆT |
| `02-journey-map/journey-map.md`, `01-phong-van/insights.md` (I01-I04), need statement nháp v1 | Dựng workflow có sơ đồ, phân tích điểm đau và nguyên nhân có thể; tổng hợp insight từ quan sát; soạn nháp need statement và bảng bằng chứng | Đối chiếu với ảnh chụp và phỏng vấn; chọn phiên bản need statement | ĐÃ DUYỆT |
| `05-prototype/` proto-v1 đến proto-v3.2: bản mô phỏng điện thoại, `server.py`, `app.py`, `search.py`, `guard.py`, `llm.py`, test, prompt PR02 và PR03, dữ liệu mô phỏng | Dựng lại giao diện MyVinmec từ ảnh ứng viên chụp; viết hai chế độ hiện trạng và đề xuất, vòng khép kín, tìm kiếm, hai lớp chặn, máy chủ; soạn system prompt; tạo dữ liệu mô phỏng; viết 64 test; chuyển model sang Gemini | Quyết định từng lần đổi hướng (mục trên); chạy bản mô phỏng với API key; đọc lại prompt; 64/64 test đạt | ĐÃ DUYỆT |
| `05-prototype/nguon-noi-dung/kho-bai-viet-vinmec.json` | Tìm và mở 10 trang trên vinmec.com, ghi tiêu đề, đường dẫn, người tư vấn, tên mục | Bài thứ 11 lấy từ ảnh ứng viên chụp trong app; mở thử link để xác nhận | ĐÃ DUYỆT |
| `04-best-practice/best-practice.md` | Tìm và mở nguồn, tóm tắt số liệu, đề xuất bài học cho Vinmec | Mở lại 3 nguồn để đối chiếu số liệu | ĐÃ DUYỆT |
| `06-rui-ro-dao-duc/risk-register.md`, `escalation.md` | Lập danh mục rủi ro RR01-RR12 gắn với code, bảng quản lý dữ liệu, thông điệp chuyển tuyến | Xác minh số tổng đài trong app; chốt thời điểm xóa ghi chép thô | ĐÃ DUYỆT |
| `05-prototype/user-testing/` (test-plan, U01-U03, findings) | Soạn 4 tác vụ thử, tiêu chí, lời mở đầu; chạy thử nội bộ và bộ 5 từ khóa; chép tóm tắt sau phiên của ứng viên vào phiếu U dạng diễn ý, ô không có thông tin ghi "Không ghi nhận" | Tự điều phối 3 phiên thử, cung cấp tóm tắt; xác nhận chế độ chạy không có AI; đọc lại phiếu | ĐÃ DUYỆT |
| `07-coach-plan/coach-plan.md` | Soạn lịch theo khung 6 tuần, cách gỡ vướng, kiểm tra chất lượng; biên tập lời kể kinh nghiệm của ứng viên | Cung cấp kinh nghiệm thật; duyệt bản biên tập | ĐÃ DUYỆT |
| `slides.pdf` | Dựng 10 slide từ nội dung repo (HTML xuất PDF bằng Chrome) | Đọc lại số liệu trên slide so với file nguồn; diễn tập 10 phút | ĐÃ DUYỆT |

Không dùng AI để giả lời phỏng vấn hoặc kết quả người dùng. Không đưa thông tin sức khỏe hay thông tin cá nhân vào prompt. Phân biệt AI hỗ trợ làm bài với chức năng AI của prototype.

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
