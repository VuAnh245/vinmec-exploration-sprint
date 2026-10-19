# Tổng hợp thử nghiệm

Trạng thái: ĐÃ THỬ VỚI 3 NGƯỜI (U01-U03, 19/10/2026), cả ba là người đã phỏng vấn (P01-P03). Ghi chép phiên là diễn ý do ứng viên tóm tắt sau phiên. Trước khi thử có 5 lần điều chỉnh và một lượt chạy thử nội bộ; sau U01 có 1 lần sửa nhỏ (nhật ký bên dưới).

| Phát hiện | Phiên/tác vụ hỗ trợ | Mức ảnh hưởng | Quyết định | Trạng thái sửa | Đã thử lại? |
|---|---|---|---|---|---|
| Cả ba người thử hoàn thành T1-T4, không cần người điều phối hỗ trợ | [U01](U01.md), [U02](U02.md), [U03](U03.md); T1-T4 | Tích cực; mẫu nhỏ, người thử đã quen chủ đề | Giữ luồng ① và ② như proto-v3.2 | Không cần sửa | Không áp dụng |
| Cả ba cho rằng các điểm nghẹn họ từng gặp được giải quyết đúng chỗ đau (diễn ý) | U01-U03, nhận xét chung | Tích cực; là nhận định của người thử | Ghi nhận; chưa đủ để kết luận hiệu quả | Không cần sửa | Không áp dụng |
| U01 và U03 cho rằng cách làm này giúp đỡ mất thêm các khoản phí phụ và thời gian (diễn ý) | U01, U03, nhận xét chung | Chưa đo; không suy ra giảm thời gian hay chi phí thật từ phiên thử | Đưa vào giả thuyết cần đo ở bước sau (mục Tác động dự kiến) | Không áp dụng | Chưa |
| U02 hài lòng hơn về cách hiển thị và thông tin mang lại (diễn ý) | U02, nhận xét chung | Tích cực, gắn với ĐĐ7 (tràn thông tin) | Giữ cách chỉ hiện vài bài đúng chỉ số | Không cần sửa | Không áp dụng |
| Vài lỗi hiệu ứng nhỏ trên giao diện | U01 | Thấp | Sửa trước U02 | Đã sửa | Có, U02-U03 không ghi nhận lỗi |

## Nhật ký điều chỉnh

| Ngày | Bằng chứng dẫn tới sửa | Trước | Sau | File/commit/version | Kiểm chứng lại và kết quả |
|---|---|---|---|---|---|
| 19/10/2026 | Kiểm thử tìm kiếm trên MyVinmec: 6/7 lượt không có kết quả, GLU ra 2 bài lệch ý, một kết quả mở sai bài; app đã có trợ lý AI và nhiều kênh hỗ trợ (O1, O6, O9). Need statement đổi theo | proto-v1: AI tự giải thích phiếu (PR01); một số tổng đài chung | proto-v2: AI chọn bài bác sĩ Vinmec đã viết và dẫn link (PR02); lối ra dịch vụ theo đúng MyVinmec; thêm từ khóa khẩn cấp theo công cụ Sàng lọc đột quỵ | `app.py`, `search.py`, `guard.py`, PR02; proto-v2 | 41/41 test tự động đạt; chưa thử với người dùng |
| 19/10/2026 | Ứng viên muốn người thử bấm trên giao diện giống MyVinmec thật để so hiện trạng và đề xuất | Giao diện Streamlit, bố cục gần giống mục Cộng đồng hỏi đáp | Bản mô phỏng điện thoại dựng lại 8 màn hình MyVinmec đã chụp, có hai chế độ Hiện trạng và Thiết kế đề xuất; thêm lối vào từ phiếu kết quả (màn hình đề xuất); Streamlit giữ làm giao diện kỹ thuật | `app/mobile/`, `server.py`, `llm.py`; proto-v2 | 45/45 test tự động đạt; ảnh chụp 4 kịch bản trong `screenshots/`; chưa thử với người dùng |
| 19/10/2026 | Đánh giá của ứng viên: chỉ tìm kiếm tốt hơn thì giá trị nhỏ; tìm kiếm không giúp được khi kho chưa có câu trả lời (ĐĐ5), một phần lỗi sửa được không cần AI (ĐĐ4). Need statement đổi sang v2 | proto-v2: người bệnh tự tìm; hành trình dừng khi không tìm thấy | proto-v3: vòng khép kín. ① bài hiện sẵn dưới chỉ số có cờ; ② AI soạn câu hỏi gửi bác sĩ, báo câu tương tự đã có (PR03), gửi riêng tư, đồng ý bổ sung kho mặc định tắt; ③ bảng phía Vinmec gom câu tìm không ra, chỉ số thiếu nội dung, câu hỏi trùng | `search.py`, `guard.py`, `llm.py`, `server.py`, `app/mobile/`, PR03; proto-v3 | 55/55 test tự động đạt; ảnh chụp ①②③ trong `screenshots/`; chưa thử với người dùng |
| 19/10/2026 | Ứng viên xem bản demo: chuyển màn hình không có hiệu ứng, đổi chế độ quay về trang chủ nên không so được trước và sau, các điểm đau từ phỏng vấn (ĐĐ7, ĐĐ8, ĐĐ9) chưa hiện trong demo | Không có trang chuyên mục; đổi chế độ về trang chủ; không có nút đặt câu hỏi ở Cộng đồng | Trang chuyên mục Tim mạch dựng theo ảnh O6b; nút "Hỏi bác sĩ này" và "Đặt câu hỏi cho bác sĩ"; màn hình tìm không ra mời đặt câu hỏi; đổi chế độ giữ màn hình; bảng Điểm đau → thay đổi với nút Trước/Sau; hiệu ứng chuyển màn hình; ghi "gửi tới" ở phía Vinmec | `app/mobile/`, `server.py`; proto-v3.1 | 56/56 test tự động đạt; ảnh trước và sau trong `screenshots/v3-dau-*`; chưa thử với người dùng |
| 19/10/2026 | Ứng viên xem proto-v3.1: hỏi bác sĩ chưa có tác dụng lớn vì không biết bác sĩ giỏi lĩnh vực gì; giao diện đơn điệu, người dùng không biết bắt đầu từ đâu | Thẻ bác sĩ không ghi lĩnh vực; luồng hỏi một màn hình; Cộng đồng chỉ có gợi ý nhỏ | Hồ sơ bác sĩ (mô phỏng) có chuyên khoa, lĩnh vực, số câu đã trả lời; gợi ý bác sĩ phù hợp kèm lý do (`search.match_doctors`, PR03 v2 gợi ý chuyên khoa); luồng hỏi 3 bước có thanh tiến trình; khung mở đầu "Bạn đang thắc mắc điều gì?", gợi ý "Bắt đầu tại đây"; màn hình đã gửi có mốc trạng thái. Sửa thêm: máy chủ báo lỗi khi cổng đang bận thay vì để máy chủ cũ trả lời | `search.py`, `server.py`, `llm.py`, `app/mobile/`, `mock-data/mock-bac-si.json`, PR03 v2; proto-v3.2 | 61/61 test tự động đạt; ảnh `screenshots/v3.2-*`; chưa thử với người dùng |
| 19/10/2026 | Phiên U01: ứng viên thấy vài lỗi hiệu ứng nhỏ trên giao diện | Lỗi hiệu ứng nhỏ (ứng viên không ghi chi tiết) | Đã sửa | `app/mobile/`; proto-v3.2 (không ghi nhận commit riêng) | U02, U03 hoàn thành T1-T4 không cần hỗ trợ; 61/61 test tự động đạt khi chạy lại sau các phiên |
| 19/10/2026 | OpenAI trả lỗi 429 (hết credit) ở mọi lượt gọi trong ngày, kể cả sau hai lần đổi key; cột AI và chế độ AI của phiên thử không xác nhận được | OpenAI `gpt-4o-mini` | Gemini `gemini-3.5-flash` qua endpoint tương thích OpenAI; key đặt qua `GEMINI_API_KEY`; đọc JSON chịu được khối ```json | `llm.py`, `server.py`, `app.py`, `test_llm.py`; proto-v3.2 | 64/64 test tự động đạt; `gemini-2.5-flash` báo không còn cho người dùng mới nên dùng `gemini-3.5-flash`; bộ 5 từ khóa đạt 5/5 (mục Chỉ số thực đo) |

Ghi cả quyết định chưa sửa và lý do. Không viết lại log để tạo cảm giác đã thử nghiệm nhiều vòng.

## Chỉ số thực đo

Tỷ lệ tìm đúng với cùng bộ từ khóa. "Đúng" nghĩa là có ít nhất một kết quả nói về đúng chỉ số trong máu mà người hỏi muốn tìm.

| Từ khóa | MyVinmec (quan sát 19/10/2026) | Tìm theo từ khóa trong prototype (`test_search.py`) | Tìm theo ý nghĩa (AI) trong prototype |
|---|---|---|---|
| đường huyết lúc đói cao | Không có kết quả | Không có kết quả | Đúng (K02, K01, K09) |
| men gan cao | Không có kết quả | Đúng (K04) | Đúng (K04, K05, K09) |
| GLU | 2 kết quả, 0 đúng (thuốc Glucovance, glucose nước tiểu) | Không có kết quả | Đúng (K01, K02, K09) |
| ALT | Không có kết quả | Đúng (K05) | Đúng (K05, K04, K09) |
| duong huyet cao | Không có kết quả | Không có kết quả | Đúng (K01, K02, K09) |
| Tỷ lệ tìm đúng | 0/5 | 2/5 | 5/5 |

Cột AI: chạy ngày 19/10/2026 với Gemini `gemini-3.5-flash`, không kèm dòng phiếu, qua `llm.ask` và `search.clean_result`. Bài trong ngoặc theo thứ tự model chọn; K09 là bài tổng hợp chỉ số sinh hóa máu. Ở lượt gọi liên tiếp đầu tiên, 3/5 câu (GLU, ALT, duong huyet cao) rơi vào nhánh lỗi AI; chạy lại có giãn cách thì cả 5 câu đều có kết quả. Nguyên nhân lỗi chưa xác định, có thể do giới hạn số lượt gọi của gói miễn phí. Trước đó OpenAI `gpt-4o-mini` trả lỗi 429 (hết credit) ở mọi lượt gọi trong ngày, kể cả sau hai lần đổi key. Cùng ngày, PR03 v2 với dòng WBC soạn được câu hỏi có đủ tên chỉ số, giá trị 11.2 G/L, khoảng tham chiếu 4.0 - 10.0 và cờ H, gợi ý bài K08 và BS. Minh (mô phỏng).

Bài hiện sẵn trên phiếu (bước ①, không dùng AI): 5/6 chỉ số có cờ trong hai phiếu mô phỏng có bài (GLU, CHOL, LDL-C, NEUT%, PLT); WBC chưa có bài và đi thẳng tới "Hỏi bác sĩ". Con số này phụ thuộc vào kho 11 bài của bản thử.

Cột MyVinmec tìm trên toàn bộ kho của app; hai cột prototype chỉ tìm trong 11 bài của kho nguồn. Vì vậy ba cột không cùng mẫu số về nội dung, chỉ so được cách tìm với cùng câu hỏi. Kết quả thử với người dùng ghi ở phiếu U01-U03.

## Chạy thử nội bộ trước phiên (ứng viên, không phải người thử)

Ngày 19/10/2026, proto-v3.2. Ứng viên tự chạy T1-T4 bằng các hàm của prototype (`search.py`, `guard.py`, `llm.py`) với hai phiếu mô phỏng. API báo hết credit nên mọi bước có AI đều rơi vào nhánh dự phòng. Đây là kiểm tra đường đi và tiêu chí trước khi mời người thử, không thay cho kết quả U01-U03. 61/61 test tự động đạt.

| Tác vụ | Đầu vào ứng viên dùng | Kết quả | Đạt tiêu chí trong test-plan? |
|---|---|---|---|
| T1 | Phiếu Sinh hóa máu, dòng GLU (H) | Bài hiện sẵn K01 "Vai trò của định lượng glucose trong máu", K02 "Xét nghiệm đường huyết là gì?"; không cần AI | Đạt, kể cả khi không có AI |
| T2 | "ALT là chỉ số gì" | Tìm theo từ khóa ra K05 "Chỉ số AST, ALT là chỉ số gì?" | Đạt |
| T2 | "chỉ số men gan ALT" | Không có kết quả: tìm theo từ khóa đòi mọi từ có trong tiêu đề, và không có AI để tìm theo ý nghĩa | Không đạt khi không có AI |
| T3 | "Kết quả này có nghiêm trọng không, tôi có cần dùng thuốc không?" (dòng GLU) | Phân loại là câu hỏi y khoa; không có câu trả lời tư vấn; câu được đưa vào gợi ý hỏi bác sĩ | Đạt phần "không tư vấn"; phần người thử nói được bước tiếp theo chỉ đo được trong phiên |
| T4 | "WBC của tôi cao, tôi muốn hỏi bác sĩ" (dòng WBC) | Câu nháp theo mẫu có tên chỉ số, giá trị 11.2 G/L, khoảng tham chiếu 4.0 - 10.0, cờ H; qua lớp kiểm tra câu hỏi; không có bài trùng (WBC chưa có bài); gợi ý chuyên khoa Huyết học - Xét nghiệm, BS. Minh (mô phỏng) với lý do "lĩnh vực khớp: bạch cầu, WBC" | Đạt |
| T4, khẩn cấp | "tôi đang đau ngực dữ dội, khó thở" | Phân loại khẩn cấp, dừng soạn câu hỏi | Đạt (RR10) |

Rút ra trước phiên:
- Khi không có AI, T2 thành công hay không tùy cách người thử gõ. Nếu chưa nạp credit, ghi chế độ "không có AI" trong phiếu U và đọc kết quả T2 theo giới hạn này.
- T1 và T4 không phụ thuộc AI, nên vẫn thử được ngay cả khi API lỗi.
- Lượt chạy kiểm chứng RR06 với một lỗi API thật (429), không chỉ với trường hợp thiếu key: vẫn có kết quả từ khóa, câu hỏi theo mẫu và gợi ý bác sĩ.

## Tác động dự kiến

Giả thuyết, chưa đo, không trình bày như tác động đã đạt:

- Người bệnh có câu trả lời đáng tin sớm hơn, vì bài bác sĩ đã viết hiện sẵn dưới chỉ số có cờ (5/6 chỉ số trên phiếu mô phỏng) và chỗ chưa có bài thì gửi được câu hỏi cho bác sĩ. Căn cứ hiện có: 3/3 người thử hoàn thành T1 và T4 không cần hỗ trợ.
- Bớt chi phí và thời gian phát sinh khi người bệnh phải gọi tổng đài, đặt lịch hoặc chờ tái khám chỉ để hỏi một câu (I12). Căn cứ hiện có: nhận định của U01 và U03; chưa đo.
- Cách đo ở bước sau: thời gian từ lúc có câu hỏi đến lúc có câu trả lời; số người phải gọi tổng đài hoặc đặt lịch chỉ để hỏi.

## Giới hạn / kết quả không thuận lợi

- Chỉ có 3 phiên thử, cả ba người thử là người đã phỏng vấn (P01-P03), đã quen chủ đề và quen ứng viên; phản hồi có thể thiên về tích cực.
- Ghi chép phiên là tóm tắt diễn ý sau phiên: không có thời gian thao tác, câu gõ nguyên văn hay lời nguyên văn. Câu hỏi kiểm tra RR05 (ai cung cấp công cụ) chưa ghi nhận.
- Chế độ AI trong các phiên chưa xác nhận: ứng viên ghi có AI, nhưng lần gọi kiểm tra cùng ngày vẫn trả lỗi 429. Nếu AI lỗi, T2 và T3 chạy ở nhánh dự phòng.
- Cột tìm theo ý nghĩa (AI) đo bằng Gemini sau các phiên thử, không phải bằng model chạy trong phiên. Kho chỉ có 11 bài nên 5/5 chưa nói được gì về kho lớn của app.
- Gọi liên tiếp nhiều lần có thể rơi vào nhánh lỗi AI (3/5 câu ở lượt đầu); khi đó app vẫn hiện kết quả từ khóa.
- Không có AI, câu "chỉ số men gan ALT" không ra kết quả trong prototype.
- Kho nguồn chỉ có 11 bài; tỷ lệ bài hiện sẵn (5/6 chỉ số có cờ) phụ thuộc vào kho này.
- Không có kết quả không thuận lợi nào được ghi nhận trong U01-U03; với cách ghi chép trên, điều này chưa có nghĩa là không có khó khăn.
