# Vinmec Exploration Sprint — Bài ứng tuyển

> TRẠNG THÁI: KHUNG LÀM VIỆC, CHƯA PHẢI BÀI NỘP HOÀN CHỈNH.
> Các ô [CHƯA ĐIỀN] và các file mẫu không phải bằng chứng đã thu thập.

- Họ tên / khóa: [CHƯA ĐIỀN]
- Khoảnh khắc duy nhất được chọn: [CHƯA ĐIỀN]
- Nhóm người dùng: [CHƯA ĐIỀN]
- Need statement: [CHƯA ĐIỀN]
- Demo / phiên bản thử: [CHƯA ĐIỀN]
- Kết quả thực tế và giới hạn: [CHƯA ĐIỀN]

## Hướng dẫn bắt đầu

1. Đọc [đối chiếu yêu cầu](REQUIREMENTS.md) và [kế hoạch](WORKPLAN.md).
2. Chọn một khoảnh khắc, quan sát MyVinmec, phỏng vấn ít nhất 3 người có sự đồng ý.
3. Tổng hợp bằng chứng, viết need statement rồi chọn giải pháp.
4. Làm prototype có AI, click được; thử với 2–3 người, ghi nhận và sửa.
5. Hoàn thiện rủi ro, coach plan, slides.pdf và checklist nộp.

## Mục lục cho người chấm

| Thành phần | Vị trí |
|---|---|
| Quan sát MyVinmec | [Ghi chép](01-phong-van/myvinmec-observation.md) |
| Phỏng vấn | [Bộ câu hỏi](01-phong-van/interview-guide.md), [P01](01-phong-van/interviews/P01.md), [P02](01-phong-van/interviews/P02.md), [P03](01-phong-van/interviews/P03.md) |
| Insight | [Tổng hợp](01-phong-van/insights.md) |
| Hành trình | [Journey map](02-journey-map/journey-map.md) |
| Nhu cầu và bằng chứng | [Need statement](03-need-statement/need-statement.md), [Truy vết](03-need-statement/evidence-matrix.md) |
| Nghiên cứu quốc tế | [So sánh](04-best-practice/comparison.md), [Nguồn](04-best-practice/references.md) |
| Prototype và thử nghiệm | [Hướng dẫn](05-prototype/README.md), [Kết quả thử](05-prototype/user-testing/findings.md) |
| Rủi ro | [Danh mục](06-rui-ro-dao-duc/risk-register.md) |
| Coach plan | [Kế hoạch một trang](07-coach-plan/coach-plan.md) |
| AI hỗ trợ | [Khai báo](AI_USAGE.md) |
| Slide | Chưa tạo; xuất slides.pdf ở thư mục gốc, tối đa 10 slide |

## Quy ước đặt tên

| Đối tượng | Quy ước | Ví dụ |
|---|---|---|
| Thư mục từng bước | `NN-ten-khong-dau`, đánh số theo thứ tự bước trong đề | `01-phong-van/` |
| File nội dung | Chữ thường, không dấu, nối bằng `-` | `interview-guide.md` |
| File điều phối ở gốc | Chữ hoa, nối bằng `_` | `SUBMISSION_CHECKLIST.md` |
| Người được phỏng vấn | `P` + 2 chữ số, theo thứ tự thời gian | `interviews/P01.md` |
| Người thử prototype | `U` + 2 chữ số; ghi trong phiếu nếu trùng một người P | `user-testing/U01.md` |
| Prompt | `PRNN-mo-ta-vN.md`, tăng `vN` khi đổi nội dung | `prompts/PR01-giai-thich-phieu-v1.md` |
| Dữ liệu mô phỏng | `mock-` + mô tả + số thứ tự | `mock-data/mock-phieu-ket-qua-01.json` |
| Ảnh chụp prototype | `vN-ten-man-hinh.png`, `vN` là phiên bản prototype | `screenshots/v1-hoi-dap.png` |
| Phiên bản prototype | Tag git `proto-vN` tại commit dùng khi thử | `proto-v1` |
| Slide | Đúng tên đề yêu cầu, đặt ở thư mục gốc | `slides.pdf` |

Commit: `<loại>(<phạm vi>): <mô tả ngắn>`, với loại là `docs`, `research`, `proto`, `test`, `fix` hoặc `chore`. Ví dụ: `research(01-phong-van): thêm ghi chép P01`.

## Phạm vi và giới hạn

- Đây là prototype đề xuất; không mặc định đã tích hợp MyVinmec.
- Chỉ công bố kết quả có bằng chứng; dữ liệu mô phỏng phải được gắn nhãn.
- Phân biệt quan sát, diễn giải, giả thuyết và dữ liệu mô phỏng.
- Cỡ mẫu nhỏ phục vụ khám phá; không đại diện cho toàn bộ người bệnh Vinmec.

Nguồn yêu cầu: [Đề ứng tuyển](https://docs.google.com/document/d/1f2XCxK1NnLgVlRF2VGL0dtoxBSOKcls6/view), nội dung được đọc ngày 17/10/2026. Chưa thấy rubric điểm chi tiết trong nội dung đã đọc.
