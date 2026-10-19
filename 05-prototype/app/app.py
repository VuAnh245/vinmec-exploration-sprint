"""Prototype v2: tìm bài bác sĩ Vinmec đã viết cho câu hỏi về một chỉ số trên phiếu kết quả.

Giao diện mô phỏng bố cục mục "Cộng đồng hỏi đáp bác sĩ" của MyVinmec để người thử thấy quen,
nhưng không dùng tên, logo của Vinmec làm tên sản phẩm.

Chạy từ thư mục gốc repo: streamlit run 05-prototype/app/app.py
"""

import html
import json
import os
import re
from pathlib import Path

import streamlit as st
from openai import OpenAI

import guard
import search

ROOT = Path(__file__).resolve().parent.parent
MOCK_DIR = ROOT / "mock-data"
PROMPT_FILE = ROOT / "prompts" / "PR02-tim-va-dan-nguon-v1.md"

EMERGENCY_NUMBER = "115"

STYLE = """
<style>
:root { --teal: #36a99a; --teal-dark: #2b8c80; --peach: #fdebd8; --ink: #1f2933; --muted: #6b7780; }
.block-container { max-width: 760px; padding-top: 1.5rem; }
.vm-header { background: var(--teal); color: #fff; border-radius: 16px; padding: 14px 18px;
             font-size: 1.15rem; font-weight: 600; display: flex; gap: 12px; align-items: center; }
.vm-hero { background: var(--peach); border-radius: 16px; padding: 16px; margin: 12px 0;
           display: flex; gap: 12px; }
.vm-stat { flex: 1; background: #fff; border-radius: 12px; padding: 12px; text-align: center; }
.vm-stat b { display: block; color: var(--teal); font-size: 1.6rem; }
.vm-stat span { color: var(--muted); font-size: 0.85rem; }
.vm-card { background: #fff; border: 1px solid #e3e8ea; border-radius: 14px; padding: 14px 16px; margin: 10px 0; }
.vm-card h4 { margin: 0 0 6px 0; font-size: 1.02rem; color: var(--ink); }
.vm-badge { display: inline-block; font-size: 0.75rem; padding: 2px 8px; border-radius: 999px;
            background: #e6f4f2; color: var(--teal-dark); margin-right: 6px; }
.vm-meta { color: var(--muted); font-size: 0.85rem; margin: 4px 0; }
.vm-card a { color: var(--teal-dark); font-weight: 600; text-decoration: none; }
.vm-understand { color: var(--muted); font-style: italic; margin: 6px 0 2px 0; }
</style>
"""


def get_setting(name, default=None):
    value = os.environ.get(name)
    if value:
        return value
    try:
        return st.secrets[name]
    except Exception:
        return default


def load_prompts() -> tuple[str, str]:
    """Khối text đầu là system prompt, khối sau là user prompt template."""
    blocks = re.findall(r"```text\n(.*?)```", PROMPT_FILE.read_text(encoding="utf-8"), re.S)
    return blocks[0].strip(), blocks[1].strip()


def load_reports() -> dict[str, dict]:
    reports = {}
    for path in sorted(MOCK_DIR.glob("mock-phieu-ket-qua-*.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        reports[data["ten_hien_thi"]] = data
    return reports


def ask_model(query: str, row: dict | None) -> dict | None:
    api_key = get_setting("OPENAI_API_KEY")
    if not api_key:
        return None
    system_prompt, user_template = load_prompts()
    user_prompt = (user_template
                   .replace("{kho}", json.dumps(search.corpus_for_prompt(CORPUS), ensure_ascii=False))
                   .replace("{dong_phieu}", json.dumps(row, ensure_ascii=False) if row else "")
                   .replace("{cau_hoi}", query))
    response = OpenAI(api_key=api_key).chat.completions.create(
        model=get_setting("OPENAI_MODEL", "gpt-4o-mini"),
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        response_format={"type": "json_object"},
    )
    return json.loads(response.choices[0].message.content)


def article_card(item: dict, reason: str = "", section: str = "") -> str:
    parts = [f'<div class="vm-card"><span class="vm-badge">{html.escape(item["loai"])}</span>',
             f'<h4>{html.escape(item["tieu_de"])}</h4>']
    if item["tu_van"]:
        parts.append(f'<div class="vm-meta">Tư vấn chuyên môn: {html.escape(item["tu_van"])}</div>')
    if reason:
        parts.append(f"<div>{html.escape(reason)}</div>")
    if section:
        parts.append(f'<div class="vm-meta">Nên đọc trước mục: {html.escape(section)}</div>')
    parts.append(f'<a href="{html.escape(item["url"])}" target="_blank">Đọc bài trên vinmec.com</a></div>')
    return "".join(parts)


def render_result(result: dict) -> None:
    if result["loai"] == guard.KHAN_CAP:
        st.error(f"Nếu bạn đang có triệu chứng như vậy, hãy gọi cấp cứu {EMERGENCY_NUMBER} "
                 "hoặc đến cơ sở cấp cứu gần nhất ngay. Công cụ này không xử lý tình huống khẩn cấp.")
        return
    if result["loai"] == guard.Y_KHOA:
        st.warning("Câu hỏi này cần bác sĩ trả lời dựa trên tình trạng cụ thể của bạn. "
                   "Công cụ chỉ giúp tìm bài bác sĩ đã viết, không đưa lời khuyên y khoa.")
    if result["loi_ai"]:
        st.error("Chưa kết nối được dịch vụ AI. Bạn vẫn có thể xem kết quả tìm theo từ khóa "
                 "hoặc dùng phần Bước tiếp theo.")

    if result["hieu_cau_hoi"]:
        st.markdown(f'<div class="vm-understand">Đang tìm: {html.escape(result["hieu_cau_hoi"])}</div>',
                    unsafe_allow_html=True)
    if result["ket_qua"]:
        st.markdown(f"**Bài phù hợp ({len(result['ket_qua'])})**")
        for r in result["ket_qua"]:
            st.markdown(article_card(r["bai"], r["ly_do"], r["muc_nen_doc"]), unsafe_allow_html=True)
    elif not result["loi_ai"]:
        st.info("Chưa có bài phù hợp trong kho của bản thử. Bạn có thể hỏi bác sĩ ở phần Bước tiếp theo.")

    with st.expander(f"So sánh: tìm theo từ khóa trong tiêu đề ({len(result['tu_khoa'])} kết quả)"):
        st.caption("Cách tìm thông thường để so sánh: mọi từ bạn gõ phải có trong tiêu đề. "
                   "Đây không phải code của MyVinmec.")
        if not result["tu_khoa"]:
            st.markdown("Không có kết quả.")
        for item in result["tu_khoa"]:
            st.markdown(article_card(item), unsafe_allow_html=True)

    if result["cau_hoi"]:
        st.markdown("**Câu hỏi bạn có thể mang tới bác sĩ**")
    for j, q in enumerate(result["cau_hoi"]):
        col_q, col_btn = st.columns([5, 1])
        col_q.markdown(f"- {q}")
        if q in st.session_state.doctor_questions:
            col_btn.caption("Đã lưu")
        elif col_btn.button("Lưu", key=f"save-{j}"):
            st.session_state.doctor_questions.append(q)
            st.rerun()


def render_next_steps() -> None:
    st.subheader("Bước tiếp theo")
    col_doctor, col_cskh, col_call = st.columns(3)
    if col_doctor.button("Tư vấn với bác sĩ"):
        st.info("Bản mô phỏng: trên app thật, nút này mở luồng tư vấn với bác sĩ.")
    if col_cskh.button("Gửi yêu cầu CSKH 24/07"):
        st.info("Bản mô phỏng: trên MyVinmec, mục Liên hệ có Cổng dịch vụ CSKH 24/07 để gửi yêu cầu.")
    if col_call.button("Gọi bệnh viện nơi bạn khám"):
        st.info("Bản mô phỏng: trên MyVinmec, mục Liên hệ có nút gọi riêng cho từng bệnh viện.")
    st.download_button(
        "Tải danh sách câu hỏi cho bác sĩ",
        data="\n".join(f"- {q}" for q in st.session_state.doctor_questions),
        file_name="cau-hoi-cho-bac-si.txt",
        disabled=not st.session_state.doctor_questions,
    )


st.set_page_config(page_title="Hỏi đáp kết quả xét nghiệm (prototype)", layout="centered")
st.session_state.setdefault("doctor_questions", [])
st.session_state.setdefault("last", None)

CORPUS = search.load_corpus()
reports = load_reports()

st.markdown(STYLE, unsafe_allow_html=True)
st.warning("Prototype đề xuất cho bài tập ứng tuyển, không phải sản phẩm của Vinmec. "
           "Phiếu kết quả là dữ liệu mô phỏng; bài viết là trang công khai trên vinmec.com. "
           "Công cụ chỉ giúp tìm bài bác sĩ đã viết, không thay thế tư vấn của bác sĩ. "
           "Không nhập thông tin cá nhân hay kết quả thật của bạn: câu hỏi được gửi tới dịch vụ AI bên ngoài.")
st.markdown('<div class="vm-header"><span>←</span><span>Hỏi đáp kết quả xét nghiệm</span></div>',
            unsafe_allow_html=True)
st.markdown(f'<div class="vm-hero"><div class="vm-stat"><b>{len(CORPUS)}</b>'
            '<span>bài viết và hỏi đáp của bác sĩ trong bản thử</span></div>'
            f'<div class="vm-stat"><b>{len(reports)}</b><span>phiếu kết quả mô phỏng</span></div></div>',
            unsafe_allow_html=True)

with st.sidebar:
    name = st.selectbox("Phiếu kết quả mô phỏng", list(reports))
    st.markdown("**Câu hỏi để hỏi bác sĩ**")
    if not st.session_state.doctor_questions:
        st.caption("Chưa lưu câu hỏi nào.")
    for q in st.session_state.doctor_questions:
        st.markdown(f"- {q}")
report = reports[name]

pending = None
st.markdown("**Từ phiếu kết quả của bạn**")
st.caption(f"{report['ten_hien_thi']}. Bấm một chỉ số có cờ để tìm bài liên quan.")
flagged = [r for r in report["chi_so"] if r["co"]]
for col, r in zip(st.columns(len(flagged)), flagged):
    if col.button(f"{r['ma']} · {r['ket_qua']} {r['don_vi']} · {r['co']}", key=f"chip-{r['ma']}"):
        pending = (r["ma"], r)
with st.expander("Xem toàn bộ phiếu mô phỏng"):
    st.dataframe(
        [{"Mã": r["ma"], "Tên xét nghiệm": r["ten"], "Kết quả": r["ket_qua"], "Đơn vị": r["don_vi"],
          "Khoảng tham chiếu": r["khoang_tham_chieu"], "Cờ": r["co"]} for r in report["chi_so"]],
        hide_index=True,
        width="stretch",
    )
    st.caption(report["ghi_chu_phieu"])

with st.form("tim-kiem"):
    typed = st.text_input("Tìm theo chỉ số hoặc câu hỏi", placeholder="Ví dụ: GLU, men gan cao, duong huyet cao")
    submitted = st.form_submit_button("Tìm")
if submitted and typed.strip():
    pending = (typed.strip(), None)

if pending:
    query, row = pending
    with st.spinner("Đang tìm bài phù hợp..."):
        st.session_state.last = (query, search.tra_loi(query, row, CORPUS, ask_model))

if st.session_state.last:
    query, result = st.session_state.last
    st.markdown(f"#### Kết quả cho: {query}")
    render_result(result)

render_next_steps()
