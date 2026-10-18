"""Prototype: trợ lý đọc phiếu kết quả trên dữ liệu mô phỏng.

Chạy từ thư mục gốc repo: streamlit run 05-prototype/app/app.py
"""

import json
import os
import re
from pathlib import Path

import streamlit as st
from openai import OpenAI

import guard

ROOT = Path(__file__).resolve().parent.parent
MOCK_DIR = ROOT / "mock-data"
PROMPT_FILE = ROOT / "prompts" / "PR01-giai-thich-phieu-v1.md"

EMERGENCY_NUMBER = "115"
# Nguồn: trang hướng dẫn MyVinmec trên vinmec.com. Kiểm tra lại trong app (tác vụ O9) trước khi cho người thử.
SERVICE_HOTLINE = "024 3975 6789"

QUICK_QUESTIONS = [
    "Các cột trên phiếu có nghĩa là gì?",
    "Ký hiệu H và L nghĩa là gì?",
    "Tôi nên hỏi bác sĩ những gì về phiếu này?",
]


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


def ask_model(report: dict, question: str) -> dict:
    system_prompt, user_template = load_prompts()
    user_prompt = (user_template
                   .replace("{phieu}", json.dumps(report, ensure_ascii=False))
                   .replace("{cau_hoi}", question))
    client = OpenAI(api_key=get_setting("OPENAI_API_KEY"))
    response = client.chat.completions.create(
        model=get_setting("OPENAI_MODEL", "gpt-4o-mini"),
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        response_format={"type": "json_object"},
    )
    return json.loads(response.choices[0].message.content)


def answer(report: dict, question: str) -> dict:
    kind = guard.classify_question(question)
    if kind == guard.KHAN_CAP:
        return {"loai": "khan_cap"}
    if kind == guard.Y_KHOA:
        return {"loai": "y_khoa", "cau_hoi": [question]}
    if not get_setting("OPENAI_API_KEY"):
        return {"loai": "loi"}
    try:
        result = ask_model(report, question)
    except Exception:
        return {"loai": "loi"}

    questions = [q for q in result.get("cau_hoi_cho_bac_si", [])
                 if isinstance(q, str) and guard.check_answer(q)[0]]
    if result.get("ngoai_pham_vi"):
        return {"loai": "y_khoa", "cau_hoi": questions or [question]}
    explanation = str(result.get("giai_thich", ""))
    if not guard.check_answer(explanation)[0]:
        return {"loai": "chan", "cau_hoi": questions}
    return {"loai": "ok", "giai_thich": explanation, "cau_hoi": questions}


def render_result(result: dict, idx: int) -> None:
    kind = result["loai"]
    if kind == "khan_cap":
        st.error(f"Nếu bạn đang có triệu chứng như vậy, hãy gọi cấp cứu {EMERGENCY_NUMBER} "
                 "hoặc đến cơ sở cấp cứu gần nhất ngay. Công cụ này không xử lý tình huống khẩn cấp.")
        return
    if kind == "loi":
        st.error("Chưa kết nối được dịch vụ AI. Bạn vẫn có thể đặt lịch tư vấn kết quả "
                 "hoặc gọi tổng đài ở phần Bước tiếp theo.")
    elif kind == "y_khoa":
        st.warning("Câu hỏi này cần bác sĩ trả lời dựa trên tình trạng cụ thể của bạn. "
                   "Công cụ chỉ giúp đọc phiếu, không đưa lời khuyên y khoa.")
    elif kind == "chan":
        st.warning("Câu trả lời tự động vượt quá phạm vi đọc phiếu nên đã được ẩn. "
                   "Bạn nên hỏi trực tiếp bác sĩ.")
    else:
        st.markdown(result["giai_thich"])

    if result.get("cau_hoi"):
        st.markdown("Câu hỏi bạn có thể mang tới bác sĩ:")
    for j, q in enumerate(result.get("cau_hoi", [])):
        col_q, col_btn = st.columns([5, 1])
        col_q.markdown(f"- {q}")
        if q in st.session_state.doctor_questions:
            col_btn.caption("Đã lưu")
        elif col_btn.button("Lưu", key=f"save-{idx}-{j}"):
            st.session_state.doctor_questions.append(q)
            st.rerun()


def render_next_steps() -> None:
    st.subheader("Bước tiếp theo")
    col_book, col_call, col_save = st.columns(3)
    if col_book.button("Đặt lịch tư vấn kết quả"):
        st.info("Bản mô phỏng: trên app thật, nút này mở luồng đặt lịch tư vấn kết quả với bác sĩ.")
    if col_call.button("Gọi tổng đài dịch vụ"):
        st.info(f"Tổng đài tư vấn dịch vụ: {SERVICE_HOTLINE}")
    col_save.download_button(
        "Tải danh sách câu hỏi",
        data="\n".join(f"- {q}" for q in st.session_state.doctor_questions),
        file_name="cau-hoi-cho-bac-si.txt",
        disabled=not st.session_state.doctor_questions,
    )


st.set_page_config(page_title="Đọc phiếu kết quả (prototype)", layout="wide")
st.session_state.setdefault("history", [])
st.session_state.setdefault("doctor_questions", [])

st.title("Đọc phiếu kết quả cùng trợ lý")
st.warning("Prototype đề xuất cho bài tập ứng tuyển, không phải sản phẩm của Vinmec. "
           "Phiếu dưới đây là dữ liệu mô phỏng. Công cụ chỉ giúp đọc phiếu và chuẩn bị câu hỏi, "
           "không thay thế tư vấn của bác sĩ. Không nhập thông tin cá nhân hay kết quả thật của bạn: "
           "câu hỏi được gửi tới dịch vụ AI bên ngoài để trả lời.")

reports = load_reports()
with st.sidebar:
    name = st.selectbox("Chọn phiếu mô phỏng", list(reports))
    st.markdown("**Câu hỏi để hỏi bác sĩ**")
    if not st.session_state.doctor_questions:
        st.caption("Chưa lưu câu hỏi nào.")
    for q in st.session_state.doctor_questions:
        st.markdown(f"- {q}")

report = reports[name]
if st.session_state.get("report_name") != name:
    st.session_state.report_name = name
    st.session_state.history = []

st.subheader(report["ten_hien_thi"])
st.caption(report["nhan"])
st.dataframe(
    [{"Mã": r["ma"], "Tên xét nghiệm": r["ten"], "Kết quả": r["ket_qua"], "Đơn vị": r["don_vi"],
      "Khoảng tham chiếu": r["khoang_tham_chieu"], "Cờ": r["co"]} for r in report["chi_so"]],
    hide_index=True,
    width="stretch",
)
st.caption(report["ghi_chu_phieu"])

st.subheader("Hỏi về phiếu")
pending = None
for col, q in zip(st.columns(len(QUICK_QUESTIONS)), QUICK_QUESTIONS):
    if col.button(q):
        pending = q
question = st.chat_input("Hỏi về phiếu, ví dụ: GLU là gì?") or pending
if question:
    with st.spinner("Đang đọc phiếu..."):
        st.session_state.history.append((question, answer(report, question)))

for i, (q, r) in enumerate(st.session_state.history):
    with st.chat_message("user"):
        st.markdown(q)
    with st.chat_message("assistant"):
        render_result(r, i)

render_next_steps()
