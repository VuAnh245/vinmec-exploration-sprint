"use strict";

// Bản mô phỏng MyVinmec v3.0.5 có thể bấm. Hai chế độ trên cùng một màn hình:
// - hien-trang: tái hiện đúng những gì quan sát được (01-phong-van/myvinmec-observation.md) và điều P01-P03 kể
// - de-xuat: gắn thiết kế mới; mỗi thay đổi có viền nét đứt và nhãn MỚI

const state = {
  mode: "hien-trang", stack: [], corpus: {}, reports: [], theoChiSo: {}, doctors: {}, coAi: false,
  saved: [], shownQuestions: [], chipsOpen: false, coachSeen: false,
};

const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const norm = (s) => String(s).toLowerCase().replace(/đ/g, "d").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim();
const isProposal = () => state.mode === "de-xuat";
const NEW = () => (isProposal() ? "is-new" : "");

// Từ khóa đã kiểm thử trên app thật (bảng kiểm thử tìm kiếm, O6).
const TESTED = new Set(["duong huyet luc cao", "duong huyet luc doi cao", "men gan cao", "alt", "duong huyet cao", "glu"]);
const AS_IS_GLU = [
  { title: "Công dụng thuốc Glucovance 500mg/2.5mg", act: "open-wrong" },
  { title: "Vai trò của định lượng glucose trong nước tiểu", act: "open-article", id: "K03" },
];
const WRONG_ARTICLE = {
  tieu_de: "Trẻ 26 tháng tuổi phát triển như thế nào?",
  tu_van: "",
  muc: ["Phát triển thể chất", "Phát triển nhận thức", "Phát triển cảm xúc xã hội"],
};
// 12 chủ đề đúng như danh sách quan sát được (O6b).
const TOPICS = ["Tiêu hóa gan mật", "Ung bướu", "Sản phụ khoa", "Nhi", "Cơ xương khớp", "Tim mạch", "Ung thư vú", "Tiêm chủng", "Dinh dưỡng", "Da liễu", "Nội tiết", "Làm đẹp"];
// 3 tiêu đề đầu chuyên mục Tim mạch, ngày 08/07/2024 (O6b). Không chép phần thân câu hỏi có tuổi và chỉ số của người hỏi.
const CARDIO_QA = [
  "Khó thở, tim đập nhanh khi thời tiết nóng có sao không?",
  "Người huyết áp cao nên làm gì để duy trì huyết áp ổn định?",
  "Chỉ huyết áp 123/78, nhịp tim 90 có cao không?",
];
const SERVICES = [
  { id: "lich-hen", icon: "📅", label: "Lịch hẹn" },
  { id: "lien-he", icon: "📞", label: "Liên hệ" },
  { id: "dich-vu-y-te", icon: "🩺", label: "Dịch vụ y tế", moi: true },
  { id: "so-tiem", icon: "💉", label: "Sổ tiêm" },
  { id: "don-thuoc", icon: "💊", label: "Đơn thuốc" },
  { id: "danh-muc-gia", icon: "🧾", label: "Danh mục giá & quyền lợi" },
  { id: "cbnv", icon: "🏅", label: "Quyền lợi CBNV Vingroup", moi: true },
  { id: "cong-dong", icon: "👩‍⚕️", label: "Cộng đồng hỏi đáp bác sĩ" },
  { id: "cam-nang", icon: "🤱", label: "Cẩm nang làm mẹ" },
  { id: "nhac-thuoc", icon: "⏰", label: "Nhắc lịch uống thuốc" },
  { id: "tam-ung", icon: "💵", label: "Tạm ứng viện phí" },
];
const EXTRA_SERVICES = [
  { id: "tam-ly", icon: "🎥", label: "Tham vấn tâm lý từ xa" },
  { id: "noi-tru", icon: "🛏️", label: "Theo dõi Nội trú" },
];
const HOSPITALS = ["Times City (Hà Nội)", "Smart City (Hà Nội)", "Central Park (HCM)", "Ocean Park 2", "Riverside (Hà Nội)", "Hạ Long", "Hải Phòng", "Nha Trang", "Đà Nẵng"];
const NOT_OBSERVED = "Màn hình này chưa quan sát, nằm ngoài bản mô phỏng.";
const DEFAULT_TARGET = "Bộ phận tiếp nhận câu hỏi của Vinmec, chuyển tới chuyên khoa phù hợp (mô phỏng)";

// ---------- Điều hướng và hiệu ứng ----------

function current() { return state.stack[state.stack.length - 1]; }
function push(name, params = {}) { state.stack.push({ name, params }); render("right"); }
function back() { if (state.stack.length > 1) { state.stack.pop(); render("left"); } }
function resetTo(name, params = {}) { state.stack = [{ name, params }]; render("fade"); }

function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.remove("show");
  void el.offsetWidth;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 2600);
}

function openSheet(html) {
  $("#sheet").innerHTML = `<div class="grab"></div>${html}`;
  $("#sheet").classList.add("open");
  $("#sheet-backdrop").classList.add("show");
}
function closeSheet() { $("#sheet").classList.remove("open"); $("#sheet-backdrop").classList.remove("show"); }

function flashMode() {
  const el = $("#mode-flash");
  el.textContent = isProposal() ? "Thiết kế đề xuất" : "Hiện trạng";
  el.className = `mode-flash ${isProposal() ? "proposal" : ""}`;
  void el.offsetWidth;
  el.classList.add("show");
}

function note(title, text, evidence = "") {
  $("#note-title").textContent = title;
  $("#note-text").textContent = text;
  $("#note-evidence").textContent = evidence;
}

// ---------- Thành phần dùng chung ----------

function svcButton(s) {
  return `<button class="svc" data-act="service" data-id="${s.id}"><span class="ic">${s.icon}</span>${s.moi ? '<span class="moi">Mới</span>' : ""}${esc(s.label)}</button>`;
}
function badge(b) {
  return `<span class="badge ${b.loai === "Hỏi đáp bác sĩ" ? "qa" : ""}">${esc(b.loai)}</span>`;
}
function articleCards(items, withWhy) {
  return `<div class="stagger">${items.map((b) => `<button class="res-card" data-act="open-article" data-id="${esc(b.id)}" data-focus="${esc(b.muc_nen_doc || "")}">
    ${badge(b)}<h4>${esc(b.tieu_de)}</h4>
    ${b.tu_van ? `<div class="meta">Tư vấn chuyên môn: ${esc(b.tu_van)}</div>` : ""}
    ${withWhy && b.ly_do ? `<div class="why">${esc(b.ly_do)}</div>` : ""}
    ${withWhy && b.muc_nen_doc ? `<div class="read">Nên đọc trước: ${esc(b.muc_nen_doc)}</div>` : ""}</button>`).join("")}</div>`;
}
function askCta(words, row, target, title) {
  return `<div class="cta-ask is-new">
    <b>${esc(title)}</b>
    <p>Gửi riêng tư cho bác sĩ, không cần chọn chủ đề. Câu hỏi giống nhau được gom lại để bác sĩ trả lời một lần.</p>
    <button class="btn-teal" data-act="ask" data-words="${esc(words || "")}" data-target="${esc(target || "")}" data-row="${row ? esc(JSON.stringify(row)) : ""}">✍️ Đặt câu hỏi cho bác sĩ</button></div>`;
}

// Bác sĩ (dữ liệu mô phỏng): người bệnh thấy rõ ai giỏi lĩnh vực gì trước khi hỏi.
const AVATAR_COLORS = ["#36ad9e", "#5b8def", "#e8833a", "#9b6bd6", "#d9577a", "#2f9e5b", "#c99a1e", "#4a90a4"];
function avatar(d, size = "") {
  const idx = Number(String(d.id).replace(/\D/g, "")) % AVATAR_COLORS.length;
  const letter = d.ten.replace(/^BS\.\s*/, "").charAt(0);
  return `<span class="avatar ${size}" style="background:${AVATAR_COLORS[idx]}">${esc(letter)}</span>`;
}
function doctorCard(d, { reason = "", ask = true, chosen = null } = {}) {
  const selectable = chosen !== null;
  return `<div class="doctor ${selectable && chosen === d.id ? "chosen" : ""}" ${selectable ? `data-act="choose-doctor" data-id="${esc(d.id)}"` : ""}>
    ${avatar(d)}<div class="doctor-body"><b>${esc(d.ten)}</b><span class="muted small">${esc(d.chuc_danh)} · ${esc(d.chuyen_khoa)}</span>
    <div class="tags">${d.linh_vuc.slice(0, 4).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
    <span class="muted tiny">Đã trả lời ${d.so_cau_tra_loi} câu (số liệu mô phỏng)</span>
    ${reason ? `<span class="reason">✓ ${esc(reason)}</span>` : ""}</div>
    ${selectable ? `<span class="radio">${chosen === d.id ? "●" : "○"}</span>` : ""}
    ${ask && !selectable ? `<button class="mini-ask solid" data-act="ask" data-target="${esc(d.id)}" data-words="">Hỏi</button>` : ""}</div>`;
}
function stepper(n) {
  const steps = ["Câu hỏi", "Bác sĩ phù hợp", "Xem lại và gửi"];
  return `<div class="stepper">${steps.map((s, i) => `<div class="step ${i + 1 < n ? "done" : ""} ${i + 1 === n ? "on" : ""}"><span>${i + 1 < n ? "✓" : i + 1}</span>${s}</div>`).join('<div class="step-line"></div>')}</div>`;
}
function openDoctor(id) {
  const d = state.doctors[id];
  openSheet(`<div class="profile">${avatar(d, "big")}<h3>${esc(d.ten)}</h3><p class="muted">${esc(d.chuc_danh)} · ${esc(d.chuyen_khoa)}</p></div>
    <h5>Lĩnh vực chuyên sâu</h5><div class="tags">${d.linh_vuc.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
    <p class="muted small">Đã trả lời ${d.so_cau_tra_loi} câu trong Cộng đồng hỏi đáp (số liệu mô phỏng). Bác sĩ và số liệu là giả định để thử giao diện.</p>
    <button class="btn-teal" data-act="ask" data-target="${esc(d.id)}" data-words="">✍️ Hỏi ${esc(d.ten)}</button>`);
}

// ① Bài bác sĩ đã viết hiện sẵn dưới chỉ số có cờ.
function pushBox(c, i, j) {
  const items = (state.theoChiSo[c.ma] || []).slice(0, 2).map((id) => state.corpus[id]).filter(Boolean);
  const list = items.length
    ? `<div class="push-title">📚 Bác sĩ Vinmec đã viết về ${esc(c.ma)}</div>${items.map((b) => `<button class="push-item" data-act="open-article" data-id="${esc(b.id)}">${badge(b)} ${esc(b.tieu_de)}</button>`).join("")}`
    : `<div class="push-title muted">Chưa có bài bác sĩ viết về ${esc(c.ma)} trong kho</div>`;
  return `<div class="push is-new">${list}<div class="push-actions">
    <button class="explore" data-act="explore-row" data-i="${i}" data-j="${j}">Tìm thêm</button>
    <button class="explore ask" data-act="ask-row" data-i="${i}" data-j="${j}">Hỏi bác sĩ</button></div></div>`;
}

// ---------- Màn hình ----------

const SCREENS = {
  home() {
    note("Trang chủ", "Dựng lại theo ảnh chụp trang chủ. Trang chủ không có mục nào tên là \"Kết quả\".", "Bằng chứng: O3");
    return `
      <div class="home-head"><h1>MyVinmec</h1><p>Chăm sóc bằng tài năng, y đức và sự thấu cảm</p>
        <div class="head-actions"><button class="round orange" data-act="toast" data-msg="${NOT_OBSERVED}">🎟️</button><button class="round" data-act="toast" data-msg="${NOT_OBSERVED}">🔍</button></div></div>
      <div class="banner"><b>ĐẶT LỊCH TIÊM PHÒNG NGỪA CÚM MÙA</b><span class="muted small">Bảo vệ sức khỏe cho cả gia đình</span><br><span class="pill">Ưu đãi 10%</span></div>
      <div class="grid-card">${SERVICES.map(svcButton).join("")}${svcButton({ id: "tat-ca", icon: "▦", label: "Tất cả dịch vụ" })}</div>
      <div class="sec-title">Dịch vụ mới</div>
      <div class="new-svc"><div><b>Cổng dịch vụ khách hàng</b><small>Nhanh - Tiện - Dễ dàng</small></div><span>›</span></div>
      <div class="new-svc"><div><b>Đặt lịch nhanh - Xác nhận lịch tự động</b></div><span>›</span></div>
      <div class="sec-title">Tin mới nhất</div>
      ${[["Sàng lọc trước sinh không xâm lấn (NIPT): Hiểu đúng kết quả và giới hạn xét nghiệm", "06/10/2026"],
         ["Sàng lọc trước mang thai: Hiểu nguy cơ di truyền trước khi có con", "06/10/2026"],
         ["Cấy ghép tế bào gốc chữa bại não: Chẩn đoán và điều trị", "02/10/2026"]]
        .map(([t, d]) => `<div class="news"><div class="thumb"></div><div>${esc(t)}<div class="date">${d}</div></div></div>`).join("")}`;
  },

  community() {
    const proposal = isProposal();
    note("Cộng đồng hỏi đáp bác sĩ",
      proposal
        ? "Đề xuất: gợi ý tìm theo chỉ số ngay dưới ô tìm kiếm; nút \"Đặt câu hỏi cho bác sĩ\" luôn ở đáy màn hình; đặt câu hỏi không cần chọn chủ đề."
        : "Hiện trạng: chỉ đọc và tìm; không có nút đặt câu hỏi mới. Số liệu 20.915 câu hỏi và 21.482 chủ đề lấy đúng theo màn hình.",
      "Bằng chứng: O6, O6b; I07, I08");
    const spec = (n, name, cnt, ic, act) => `<button class="spec" ${act || `data-act="toast" data-msg="${NOT_OBSERVED}"`}><div class="img">${n || ic}</div><div class="nm">${esc(name)}</div><div class="cnt">${cnt} Câu hỏi</div></button>`;
    const shownTopics = state.chipsOpen ? TOPICS : TOPICS.slice(0, 2);
    return `
      <div class="comm-head">
        <div class="topline"><button class="icon-btn" data-act="back">←</button><h2>Cộng đồng hỏi đáp bác sĩ</h2><button class="icon-btn" data-act="toast" data-msg="${NOT_OBSERVED}">🔖</button></div>
        <div class="illus"><span>🙋‍♀️</span><span>👨‍⚕️</span></div>
        <button class="fake-search" data-act="open-search"><span>Hãy tìm vấn đề của bạn!</span><span>🔍</span></button>
        <div class="stats"><div><b>20.915</b><span>Câu hỏi được bác sĩ giải đáp</span></div><div><b>21.482</b><span>Chủ đề sức khỏe nổi bật</span></div></div>
      </div>
      ${proposal ? `<div class="hero-ask is-new">
        ${state.coachSeen ? "" : `<div class="coach"><b>👋 Bắt đầu tại đây</b><span>Tìm câu trả lời bác sĩ đã viết. Chưa có thì hỏi bác sĩ đúng chuyên môn.</span><button data-act="dismiss-coach">Đã hiểu</button></div>`}
        <div class="hero-title">Bạn đang thắc mắc điều gì?</div>
        <div class="steps3"><div><span>1</span>Tìm câu trả lời có sẵn</div><div><span>2</span>Chưa có? Hỏi bác sĩ đúng chuyên môn</div><div><span>3</span>Nhận trả lời riêng tư</div></div>
        <div class="hero-actions"><button class="btn-light" data-act="open-search">🔎 Tìm câu trả lời</button><button class="btn-solid" data-act="ask" data-target="" data-words="">✍️ Hỏi bác sĩ</button></div>
        <div class="hero-try">Thử nhanh:</div>
        <div class="chips">${["GLU", "men gan cao", "duong huyet cao", "mất ngủ kéo dài"].map((q) => `<button class="chip light" data-act="quick" data-q="${q}">${q}</button>`).join("")}</div></div>
      <div class="sec-title">Bác sĩ trả lời nhiều nhất</div>
      <div class="doc-mini-row is-new">${Object.values(state.doctors).sort((a, b) => b.so_cau_tra_loi - a.so_cau_tra_loi).map((d) => `<button class="doc-mini" data-act="doctor" data-id="${esc(d.id)}">${avatar(d)}<b>${esc(d.ten.replace(" (mô phỏng)", ""))}</b><span>${esc(d.chuyen_khoa)}</span></button>`).join("")}</div>
      <p class="muted tiny" style="margin:4px 16px 0">Bác sĩ trong bản thử là dữ liệu mô phỏng.</p>` : ""}
      <div class="sec-title">Có thể bạn quan tâm</div>
      ${[["Sàng lọc trước sinh không xâm lấn (NIPT): Hiểu đúng kết quả và giới hạn xét nghiệm", "12 ngày trước"],
         ["Sàng lọc trước mang thai: Hiểu nguy cơ di truyền trước khi có con", "12 ngày trước"],
         ["Cấy ghép tế bào gốc chữa bại não: Chẩn đoán và điều trị", "16 ngày trước"]]
        .map(([t, d]) => `<div class="q-item"><span class="qi">❔</span><div><b>${esc(t)}</b><small>${d}</small></div></div>`).join("")}
      <div class="sec-title">Chủ đề được hỏi nhiều nhất</div>
      <div class="chips topics">${shownTopics.map((t) => `<button class="chip" data-act="topic" data-name="${esc(t)}">${esc(t)}</button>`).join("")}
        <button class="chip" data-act="toggle-chips">${state.chipsOpen ? "⌃" : "⌄"}</button></div>
      ${proposal ? `<div class="topic-note is-new">Không cần chọn đúng 1 trong ${TOPICS.length} chủ đề khi đặt câu hỏi: câu hỏi được chuyển tới chuyên khoa phù hợp.</div>` : ""}
      <div class="sec-title">Chuyên khoa nổi bật</div>
      <div class="spec-row">${spec("1", "Cơ xương khớp", "1,8K")}${spec("2", "Ung bướu - Xạ trị", "841")}${spec("3", "Tim mạch", "1,3K", "", `data-act="topic" data-name="Tim mạch"`)}</div>
      <div class="sec-title">Vấn đề về Sản - Nhi</div>
      <div class="spec-row">${spec("", "Sản phụ khoa và Hỗ trợ sinh sản", "6,5K", "🤰")}${spec("", "Nhi", "6,8K", "🧒")}</div>
      <div class="sec-title">Sức khỏe dự phòng</div>
      <div class="spec-row">${spec("", "Sức khỏe tổng quát", "3,7K", "🩺")}${spec("", "Tim mạch", "1,3K", "❤️", `data-act="topic" data-name="Tim mạch"`)}</div>`;
  },

  topic(p) {
    const proposal = isProposal();
    note(`Chuyên mục ${p.name}`,
      proposal
        ? "Đề xuất: thẻ bác sĩ ghi rõ chuyên khoa, lĩnh vực chuyên sâu và có nút \"Hỏi bác sĩ này\"; tìm trong chuyên mục; chỉ hiện 3 câu đầu, danh sách dài thu gọn; nút đặt câu hỏi ở đáy. Bác sĩ là dữ liệu mô phỏng."
        : "Hiện trạng: bấm thẻ bác sĩ không hỏi được; không có nút đặt câu hỏi; danh sách dài phải lướt. 3 tiêu đề đầu là tiêu đề thật ngày 08/07/2024; các thẻ xám tái hiện độ dài danh sách, không phải câu hỏi thật.",
      "Bằng chứng: O6b, ảnh O6-chuyen-muc-tim-mach; P02-02; I07");
    const cardio = Object.values(state.doctors).filter((d) => d.chuyen_khoa === p.name);
    const doctor = (i) => {
      const d = cardio[i - 1];
      if (proposal && d) {
        return `<div class="doc-card is-new">${avatar(d)}<b>${esc(d.ten)}</b><small>${esc(d.chuc_danh)} · ${esc(d.chuyen_khoa)}</small>
          <div class="tags light">${d.linh_vuc.slice(0, 3).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
          <button class="mini-ask" data-act="ask" data-target="${esc(d.id)}" data-words="">Hỏi bác sĩ này</button></div>`;
      }
      return `<div class="doc-card"><div class="doc-ava">👨‍⚕️</div><b>Bác sĩ chuyên khoa ${esc(p.name)}</b><small>Tên ẩn trong bản mô phỏng; không ghi lĩnh vực chuyên sâu</small>
        <button class="mini-ask ghost" data-act="toast" data-msg="Trên app thật, thẻ bác sĩ không mở được luồng hỏi bác sĩ đó, và không cho biết bác sĩ giỏi lĩnh vực gì (O6b, I07).">Xem</button></div>`;
    };
    const qa = (title, date) => `<button class="qa-card" data-act="toast" data-msg="${NOT_OBSERVED}"><div class="qa-top"><span class="muted small">${date}</span><span>👍 🔖</span></div><b>${esc(title)}</b><div class="line"></div><div class="line short"></div></button>`;
    const filler = (n) => Array.from({ length: n }, () => `<div class="qa-card filler"><div class="qa-top"><span class="muted small">Câu hỏi khác trong chuyên mục</span><span>👍 🔖</span></div><div class="line"></div><div class="line"></div><div class="line short"></div></div>`).join("");
    const real = CARDIO_QA.map((t) => qa(t, "08/07/2024")).join("");
    return `
      <div class="topbar"><button class="icon-btn" data-act="back">←</button><h2>${esc(p.name)} ⌄</h2><button class="icon-btn" data-act="toast" data-msg="${NOT_OBSERVED}">🔖</button></div>
      <div class="tabs"><span class="on">Hỏi đáp bác sĩ</span><span>Kiến thức</span><span>Sản phẩm gợi ý</span></div>
      <div class="doc-row"><div class="doc-card team"><b>Đội ngũ chuyên gia</b><span>100% các câu hỏi được trả lời bởi các chuyên gia y tế Vinmec</span></div>${doctor(1)}${doctor(2)}</div>
      ${proposal ? `<form class="topic-search is-new" id="topic-form"><input id="topic-q" placeholder="Tìm trong chuyên mục ${esc(p.name)}"><button class="go" type="submit">Tìm</button></form>
        <div class="sec-title small-title">3 câu mới nhất</div><div class="stagger">${real}</div>
        <details class="more is-new"><summary>Xem thêm danh sách dài (đã thu gọn)</summary>${filler(10)}</details>`
               : `<div class="stagger">${real}</div>${filler(10)}`}
      <div class="booking-banner">Dễ dàng đặt lịch · Đặt lịch thăm khám & theo dõi hồ sơ khám trực tuyến</div>`;
  },

  search(p) {
    const head = `<div class="search-bar"><button class="icon-btn" data-act="back">←</button>
      <form id="search-form"><input id="q" name="q" autocomplete="off" placeholder="Hãy tìm vấn đề của bạn!" value="${esc(p.query || "")}"><button class="go" type="submit">Tìm</button></form></div>`;
    const ctx = p.row ? `<div class="row-ctx">Từ phiếu: ${esc(p.row.ma)} · ${esc(p.row.ket_qua)} ${esc(p.row.don_vi)} · ${esc(p.row.co)}</div>` : "";
    if (!p.query) {
      note("Tìm kiếm", "Gõ một chỉ số hoặc câu hỏi rồi bấm Tìm.", "");
      return head;
    }
    return head + ctx + (isProposal() ? proposalResults(p) : asIsResults(p));
  },

  article(p) {
    const item = p.wrong ? WRONG_ARTICLE : state.corpus[p.id];
    if (p.wrong) {
      note("Bài viết mở sai", "Trên app thật, bấm \"Công dụng thuốc Glucovance 500mg/2.5mg\" mở ra bài về trẻ 26 tháng tuổi.", "Bằng chứng: ĐĐ4, ảnh O6-glu-ket-qua-1-mo-sai-bai");
    } else {
      note("Bài viết", "Bản mô phỏng chỉ có tiêu đề, người tư vấn và tên các mục; nội dung đầy đủ đọc trên vinmec.com.", `Nguồn: ${item.url} (${item.kiem_chung})`);
    }
    const sections = item.muc.map((m) => {
      const focus = p.focus && m === p.focus;
      return `<h3 class="${focus ? "focus" : ""}">${focus ? '<span class="tag">Nên đọc trước</span>' : ""}${esc(m)}</h3><div class="line"></div><div class="line"></div><div class="line short"></div>`;
    }).join("");
    return `<div class="topbar"><button class="icon-btn" data-act="back">←</button><h2></h2><button class="icon-btn" data-act="toast" data-msg="${NOT_OBSERVED}">🔖</button></div>
      <div class="article"><h1>${esc(item.tieu_de)}</h1>
        ${item.tu_van ? `<div class="doctor">Bài viết được tư vấn chuyên môn bởi ${esc(item.tu_van)}</div>` : ""}
        ${p.wrong ? "" : `<div class="src">Bản mô phỏng không chép nội dung bài. <a href="${esc(item.url)}" target="_blank" rel="noopener">Mở bài gốc trên vinmec.com ↗</a></div>`}
        ${sections}</div>`;
  },

  records() {
    if (!isProposal()) {
      note("Hồ sơ", "Tab Hồ sơ chưa quan sát được vì tài khoản chưa kết nối hồ sơ. Màn hình này dùng mẫu màn hình trống đã thấy ở Nhắc lịch uống thuốc và Sổ tiêm.", "Bằng chứng: O4, O5");
      return `<div class="empty"><div class="ill">📂</div><p>Không tìm thấy hồ sơ sức khỏe tại Vinmec</p><button class="btn-teal" data-act="toast" data-msg="Bản mô phỏng: kết nối hồ sơ cần mã PID in trên giấy tờ khám.">KẾT NỐI HỒ SƠ</button></div>`;
    }
    note("Hồ sơ (màn hình đề xuất)", "Màn hình kết quả thật chưa quan sát được, nên đây là thiết kế đề xuất với hai phiếu mô phỏng.", "Bằng chứng: O5 (giới hạn truy cập)");
    return `<div class="topbar"><h2>Hồ sơ</h2></div><div class="sec-title">Kết quả xét nghiệm</div>
      <div class="stagger">${state.reports.map((r, i) => `<button class="report-link is-new" data-act="open-report" data-i="${i}"><div><b>${esc(r.loai_phieu)}</b><small>${esc(r.co_so)} · dữ liệu mô phỏng</small></div><span>›</span></button>`).join("")}</div>`;
  },

  result(p) {
    const r = state.reports[p.i];
    note("Phiếu kết quả (màn hình đề xuất)",
      "① Bài bác sĩ đã viết hiện sẵn ngay dưới mỗi chỉ số có cờ, người bệnh không phải gõ tìm. Phần này khớp theo mã chỉ số, không cần AI. Chỉ số chưa có bài thì đi thẳng tới ② Hỏi bác sĩ.",
      "Giải quyết: ĐĐ2, ĐĐ3, ĐĐ6, ĐĐ7. Căn cứ: BP01 (lo lắng tập trung ở kết quả bất thường)");
    const rows = r.chi_so.map((c, j) => `<div class="lab-row"><div class="top"><span class="nm">${esc(c.ten)} <span class="muted small">(${esc(c.ma)})</span></span>
      <span class="val">${esc(c.ket_qua)} ${esc(c.don_vi)}${c.co ? `<span class="flag ${esc(c.co)}">${esc(c.co)}</span>` : ""}</span></div>
      <div class="rng">Khoảng tham chiếu: ${esc(c.khoang_tham_chieu)}</div>
      ${c.co ? pushBox(c, p.i, j) : ""}</div>`).join("");
    return `<div class="topbar"><button class="icon-btn" data-act="back">←</button><h2>${esc(r.loai_phieu)}</h2><span class="icon-btn"></span></div>
      <div class="sim-tag">DỮ LIỆU MÔ PHỎNG, không phải kết quả của người thật</div>
      <div style="height:8px"></div>${rows}<p class="muted small" style="margin:10px 16px">${esc(r.ghi_chu_phieu)}</p>`;
  },

  ask(p) {
    const head = `<div class="topbar"><button class="icon-btn" data-act="back">←</button><h2>Hỏi bác sĩ</h2><span class="icon-btn"></span></div>`;
    const ctx = p.row ? `<div class="row-ctx">Về chỉ số: ${esc(p.row.ten)} (${esc(p.row.ma)}) · ${esc(p.row.ket_qua)} ${esc(p.row.don_vi)} · ${esc(p.row.co)}</div>` : "";
    const chosenDoctor = p.chosen ? state.doctors[p.chosen] : null;
    if (p.stage === "urgent") {
      note("Tình huống khẩn cấp", "Lời người bệnh mô tả triệu chứng khẩn cấp: không soạn, không gửi câu hỏi.", "RR02");
      return head + `<div class="alert red pop"><b>Nếu bạn đang có triệu chứng như vậy, hãy gọi cấp cứu 115 hoặc đến cơ sở cấp cứu gần nhất ngay.</b><br>Công cụ này không xử lý tình huống khẩn cấp.</div>`;
    }
    if (p.stage === "sent") {
      note("③ Khép vòng", "Câu hỏi đã vào hàng đợi phía Vinmec. Người bệnh thấy rõ câu hỏi đang ở bước nào.", "Giải quyết: ĐĐ5, ĐĐ6, ĐĐ8");
      return head + `<div class="block sent-block"><div class="check">✓</div><h5>Đã gửi câu hỏi riêng tư</h5>
        <p class="small">Gửi tới: <b>${esc(chosenDoctor ? `${chosenDoctor.ten} · ${chosenDoctor.chuyen_khoa}` : DEFAULT_TARGET)}</b></p>
        <div class="timeline"><div class="tl done"><span>✓</span>Đã gửi</div><div class="tl"><span>2</span>Bác sĩ đang xem</div><div class="tl"><span>3</span>Có câu trả lời, báo trong mục Thông báo</div></div>
        <p class="muted tiny">Bản mô phỏng không có bác sĩ thật trả lời; hai mốc sau chỉ minh họa.</p>
        ${p.consent ? '<p class="small">Bạn đồng ý cho Vinmec dùng câu hỏi và câu trả lời đã ẩn danh: khi có câu trả lời, nội dung được bổ sung vào kho để người sau tìm thấy.</p>' : '<p class="small">Bạn không đồng ý bổ sung vào kho: câu hỏi chỉ dùng để bác sĩ trả lời riêng cho bạn.</p>'}
        <div class="row-btns"><button class="btn-light-teal" data-act="go-community">Về Cộng đồng</button><button class="btn-teal" data-act="vinmec">Xem phía Vinmec</button></div></div>`;
    }
    if (p.stage === "doctors") {
      const d = p.draft;
      const list = [...(chosenDoctor && !d.bac_si.some((x) => x.id === chosenDoctor.id) ? [chosenDoctor] : []), ...d.bac_si];
      note("② Chọn bác sĩ phù hợp",
        "Hệ thống gợi ý bác sĩ theo chuyên khoa và lĩnh vực chuyên sâu khớp với câu hỏi, kèm lý do. Người bệnh tự chọn, hoặc để Vinmec chọn giúp. Trước đó báo câu tương tự đã có bác sĩ trả lời.",
        "Giải quyết: ĐĐ8, ĐĐ9. Bác sĩ là dữ liệu mô phỏng; prompt PR03 v2");
      return head + stepper(2) + ctx
        + (d.trung.length ? `<div class="block notice"><h5>💡 Bác sĩ đã trả lời câu tương tự</h5><p class="small muted">Đọc trước, có thể không cần chờ.</p>
            ${d.trung.map((b) => `<button class="push-item" data-act="open-article" data-id="${esc(b.id)}">${badge(b)} ${esc(b.tieu_de)}</button>`).join("")}</div>` : "")
        + `<div class="block"><h5>Bác sĩ phù hợp với câu hỏi của bạn</h5>
          ${d.chuyen_khoa ? `<p class="small">Chuyên khoa gợi ý: <span class="tag strong">${esc(d.chuyen_khoa)}</span></p>` : ""}
          <div class="stagger">${list.map((x) => doctorCard(x, { reason: x.ly_do || (x.id === p.chosen ? "Bạn đã chọn bác sĩ này" : ""), chosen: p.chosen || "" })).join("")}</div>
          <div class="doctor auto ${p.chosen ? "" : "chosen"}" data-act="choose-doctor" data-id=""><span class="avatar" style="background:#8a9399">V</span><div class="doctor-body"><b>Để Vinmec chọn bác sĩ giúp tôi</b><span class="muted small">Câu hỏi được chuyển tới chuyên khoa phù hợp</span></div><span class="radio">${p.chosen ? "○" : "●"}</span></div>
          <button class="btn-teal" data-act="to-review">Tiếp tục</button></div>`;
    }
    if (p.stage === "review") {
      const d = p.draft;
      note("③ Xem lại và gửi", d.loi_ai ? "Chưa kết nối AI nên câu hỏi được soạn theo mẫu." : "AI soạn lại lời người bệnh thành câu hỏi rõ ràng; người bệnh sửa được trước khi gửi. AI không trả lời thay bác sĩ.", "Prompt PR03 v2");
      return head + stepper(3) + ctx + `<div class="send-to">${chosenDoctor ? avatar(chosenDoctor) : '<span class="avatar" style="background:#8a9399">V</span>'}<div>Gửi tới<br><b>${esc(chosenDoctor ? `${chosenDoctor.ten} · ${chosenDoctor.chuyen_khoa}` : DEFAULT_TARGET)}</b></div><button class="link" data-act="back-to-doctors">Đổi</button></div>
        <div class="block"><h5>Câu hỏi gửi bác sĩ (bạn sửa được)</h5><textarea id="draft" rows="6">${esc(p.text ?? d.cau_hoi_nhap)}</textarea>
          <div class="privacy">🔒 Gửi riêng tư, không đăng công khai lên Cộng đồng hỏi đáp.</div>
          <label class="consent"><input type="checkbox" id="consent"> Đồng ý để Vinmec dùng câu hỏi và câu trả lời đã ẩn danh, bổ sung vào kho cho người sau</label>
          <button class="btn-teal" data-act="send">Gửi câu hỏi</button></div>`;
    }
    note("① Bạn muốn hỏi gì?", "Hiện trạng không có luồng này. Người bệnh viết bằng lời của mình, không phải chọn chủ đề. Bước sau hệ thống gợi ý bác sĩ đúng chuyên môn.", "Giải quyết: ĐĐ8, ĐĐ9");
    const examples = ["Chỉ số này cao thì tôi có cần khám lại không?", "Tôi nên hỏi bác sĩ chuyên khoa nào?", "Mất ngủ kéo dài thì tôi nên khám ở đâu?"];
    return head + stepper(1) + ctx + (chosenDoctor ? `<div class="send-to">${avatar(chosenDoctor)}<div>Bạn đang hỏi<br><b>${esc(chosenDoctor.ten)} · ${esc(chosenDoctor.chuyen_khoa)}</b></div></div>` : "")
      + `<div class="block"><h5>Mô tả điều bạn thắc mắc</h5>
      <textarea id="words" rows="4" placeholder="Viết bằng lời của bạn. Không ghi tên, số điện thoại.">${esc(p.words || "")}</textarea>
      <div class="hero-try dark">Gợi ý câu hỏi:</div><div class="chips">${examples.map((x) => `<button class="chip" data-act="fill-words" data-text="${esc(x)}">${esc(x)}</button>`).join("")}</div>
      <button class="btn-teal" data-act="draft" ${p.loading ? "disabled" : ""}>${p.loading ? "Đang tìm bác sĩ phù hợp..." : "Tiếp tục: tìm bác sĩ phù hợp"}</button></div>`;
  },

  "empty-thuoc"() {
    note("Nhắc lịch uống thuốc", "Dựng lại theo ảnh chụp: tài khoản chưa kết nối hồ sơ nên không xem được đơn thuốc.", "Bằng chứng: O4, ảnh O4-don-thuoc-chua-ket-noi-ho-so");
    return `<div class="topbar"><button class="icon-btn" data-act="back">←</button><h2>Nhắc lịch uống thuốc</h2><span class="icon-btn"></span></div>
      <div class="empty"><div class="ill">📁</div><p>Không tìm thấy hồ sơ sức khỏe để xem đơn thuốc tại Vinmec</p><button class="btn-teal" data-act="toast" data-msg="Bản mô phỏng: không kết nối hồ sơ thật.">KẾT NỐI HỒ SƠ VÀ XEM ĐƠN THUỐC</button></div>`;
  },

  "empty-tiem"() {
    note("Sổ tiêm", "Dựng lại theo ảnh chụp: chưa có hồ sơ tiêm chủng.", "Bằng chứng: O4, ảnh O4-so-tiem-chua-ket-noi-ho-so");
    return `<div class="topbar"><button class="icon-btn" data-act="back">←</button><h2>Sổ tiêm</h2><span class="icon-btn"></span></div>
      <div class="empty"><p>Không có hồ sơ tiêm chủng để theo dõi.</p><div class="ill">🗂️</div><p>Sổ tiêm chủng để quản lý hồ sơ tiêm chủng tại Vinmec. Vui lòng kết nối hồ sơ y tế Vinmec để theo dõi thông tin tiêm chủng của bản thân và người thân.</p>
      <button class="btn-teal" data-act="toast" data-msg="Bản mô phỏng: không kết nối hồ sơ thật.">Kết nối hồ sơ y tế Vinmec</button></div>`;
  },
};

// Thanh cố định ở đáy màn hình.
const BOTTOM = {
  community: () => (isProposal() ? `<button class="fab-ask is-new" data-act="ask" data-target="" data-words="">✍️ Đặt câu hỏi cho bác sĩ</button>` : ""),
  topic: (p) => (isProposal() ? `<button class="fab-ask is-new" data-act="ask" data-target="Bác sĩ chuyên khoa ${esc(p.name)}" data-words="">✍️ Đặt câu hỏi cho bác sĩ ${esc(p.name)}</button>` : ""),
  article: () => `<div class="article-bar"><button data-act="toast" data-msg="Bản mô phỏng: trên app thật, nút này mở luồng tư vấn với bác sĩ.">🧑‍⚕️ TƯ VẤN VỚI BÁC SĨ</button><button data-act="toast" data-msg="${NOT_OBSERVED}">📅 ĐĂNG KÝ KHÁM</button></div>`,
};

function asIsResults(p) {
  const key = norm(p.query);
  if (key === "glu") {
    note("Tìm \"GLU\" (hiện trạng)", "Kết quả thật: 2 bài trong mục Kiến thức, không bài nào về glucose máu. Bấm bài đầu sẽ mở sai bài.", "Bằng chứng: ĐĐ3, ĐĐ4, ảnh O6-tim-glu");
    return `<div class="kt-head"><span>Kiến thức</span><span>›</span></div><div class="stagger">` +
      AS_IS_GLU.map((r) => `<button class="kt-item" data-act="${r.act}" data-id="${r.id || ""}"><div class="thumb"></div><div>${esc(r.title)}</div></button>`).join("") + "</div>";
  }
  note(`Tìm "${p.query}" (hiện trạng)`,
    TESTED.has(key)
      ? "Kết quả thật ngày 19/10/2026: không hiện kết quả nào, lặp lại ở lượt thử thứ hai. Không có nút gửi câu hỏi; người bệnh dừng ở đây."
      : "Ba người được phỏng vấn đều kể tìm câu hỏi của mình và không thấy kết quả; bản mô phỏng tái hiện màn hình trống như vậy. Từ khóa này chưa được tự kiểm thử trên app.",
    TESTED.has(key) ? "Bằng chứng: ĐĐ2, bảng kiểm thử tìm kiếm" : "Bằng chứng: P01-01, P02-01, P03-01");
  return `<div class="dead-end">Không có kết quả hiển thị.</div>`;
}

function proposalResults(p) {
  if (!p.result) {
    note(`Tìm "${p.query}" (đề xuất)`, "Đang gửi câu hỏi tới máy chủ của bản mô phỏng.", "");
    return `<div class="loading">Đang tìm bài bác sĩ đã viết...</div><div class="skel"></div><div class="skel"></div><div class="skel"></div>`;
  }
  const r = p.result;
  state.shownQuestions = r.cau_hoi || [];
  if (r.loai === "khan_cap") {
    note("Tình huống khẩn cấp", "Câu hỏi khẩn cấp dừng ngay, không gửi tới model.", "Bằng chứng: O10 (Sàng lọc đột quỵ), RR02");
    return `<div class="alert red pop"><b>Nếu bạn đang có triệu chứng như vậy, hãy gọi cấp cứu 115 hoặc đến cơ sở cấp cứu gần nhất ngay.</b><br>Công cụ này không xử lý tình huống khẩn cấp.<br><button class="btn-red" data-act="toast" data-msg="Bản mô phỏng: không gọi thật. Hãy gọi 115 bằng điện thoại.">Gọi 115</button></div>`;
  }
  const shown = r.loi_ai ? r.tu_khoa : r.ket_qua;
  let html = "";
  if (r.loai === "y_khoa") html += `<div class="alert amber">Câu hỏi này cần bác sĩ trả lời dựa trên tình trạng cụ thể của bạn. Công cụ chỉ giúp tìm bài bác sĩ đã viết, không đưa lời khuyên y khoa.</div>`;
  if (r.loi_ai) html += `<div class="alert grey">Chưa kết nối được dịch vụ AI. Dưới đây là kết quả tìm theo từ khóa.</div>`;
  if (r.hieu_cau_hoi) html += `<div class="understand">Đang tìm: ${esc(r.hieu_cau_hoi)}</div>`;

  const doctorsBlock = (r.bac_si || []).length
    ? `<div class="block is-new"><h5>👩‍⚕️ Bác sĩ đúng chuyên môn để hỏi thêm</h5><div class="stagger">${r.bac_si.map((x) => doctorCard(x, { reason: x.ly_do })).join("")}</div>
       <p class="muted tiny">Bác sĩ là dữ liệu mô phỏng.</p></div>` : "";
  if (!shown.length) {
    html += `<div class="summary none">🔍 Chưa có bài bác sĩ viết cho câu này</div>`;
    html += askCta(p.query, p.row, "", "Hỏi bác sĩ, không phải chờ ai đăng câu tương tự") + doctorsBlock;
  } else {
    html += `<div class="summary">📚 Tìm thấy ${shown.length} ${r.loi_ai ? "kết quả theo từ khóa" : "bài bác sĩ đã viết"} cho "${esc(p.query)}"</div>${articleCards(shown, !r.loi_ai)}`;
  }
  if (state.shownQuestions.length) {
    html += `<div class="block"><h5>Câu hỏi mang tới bác sĩ</h5>${state.shownQuestions.map((q, i) => {
      const done = state.saved.includes(q);
      return `<div class="doc-q"><span>${esc(q)}</span><button class="mini ${done ? "done" : ""}" data-act="save-q" data-i="${i}" ${done ? "disabled" : ""}>${done ? "Đã lưu" : "Lưu"}</button></div>`;
    }).join("")}</div>`;
  }
  if (shown.length) {
    html += doctorsBlock;
    html += `<div class="block"><h5>Vẫn cần hỏi thêm?</h5><div class="next-steps">
      <button class="is-new" data-act="ask" data-words="${esc(p.query)}" data-target="" data-row="${p.row ? esc(JSON.stringify(p.row)) : ""}">✍️ Đặt câu hỏi cho bác sĩ</button>
      <button data-act="toast" data-msg="Bản mô phỏng: trên app thật, nút này mở luồng tư vấn với bác sĩ.">Tư vấn với bác sĩ</button>
      <button data-act="contact">Gửi yêu cầu CSKH 24/07</button></div></div>`;
  }
  if (!r.loi_ai) {
    html += `<details class="compare"><summary>So sánh: tìm theo từ khóa trong tiêu đề (${r.tu_khoa.length} kết quả)</summary>
      ${r.tu_khoa.length ? articleCards(r.tu_khoa, false) : "<p>Không có kết quả.</p>"}</details>`;
  }
  note(`Tìm "${p.query}" (đề xuất)`,
    shown.length
      ? (r.loi_ai ? "Máy chủ chưa có API key hoặc gọi model lỗi; đang hiện kết quả tìm theo từ khóa." : "AI chọn bài trong kho 11 trang công khai của vinmec.com; đường dẫn lấy từ kho, không do AI viết.")
      : "Không có bài phù hợp: thay vì màn hình trống như hiện trạng, người bệnh được mời đặt câu hỏi cho bác sĩ ngay tại đây.",
    "Giải quyết: ĐĐ2, ĐĐ3, ĐĐ5, ĐĐ8");
  return html;
}

// ---------- Hành động ----------

async function postJson(path, body) {
  const res = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
}

async function runSearch(query, row = null) {
  query = query.trim();
  if (!query) return;
  const entry = current().name === "search" ? current() : null;
  const params = { query, row, result: null };
  if (entry) { entry.params = params; render("fade"); } else push("search", params);
  if (!isProposal()) return;
  try {
    params.result = await postJson("/api/search", { cau_hoi: query, dong_phieu: row });
  } catch {
    params.result = { loai: "trong_pham_vi", loi_ai: true, hieu_cau_hoi: "", ket_qua: [], cau_hoi: [], tu_khoa: [] };
  }
  if (current().params === params) render("fade");
}

async function draftQuestion() {
  const p = current().params;
  p.words = $("#words").value;
  p.loading = true;
  render(null);
  try {
    const d = await postJson("/api/draft", { loi_nguoi_benh: p.words, dong_phieu: p.row });
    if (d.loai === "khan_cap") p.stage = "urgent";
    else {
      p.draft = d;
      p.stage = "doctors";
      if (p.chosen === undefined) p.chosen = p.target || (d.bac_si[0] ? d.bac_si[0].id : "");
    }
  } catch {
    toast("Không kết nối được máy chủ của bản mô phỏng.");
  }
  p.loading = false;
  if (current().params === p) render("fade");
}

async function sendQuestion() {
  const p = current().params;
  const question = $("#draft").value.trim();
  if (!question) return toast("Câu hỏi đang trống.");
  p.consent = $("#consent").checked;
  try {
    const doc = p.chosen ? state.doctors[p.chosen] : null;
    const res = await postJson("/api/send", { cau_hoi: question, dong_phieu: p.row, gui_toi: doc ? `${doc.ten} · ${doc.chuyen_khoa}` : DEFAULT_TARGET,
      dong_y_bo_sung_kho: p.consent, trung_voi: p.draft.trung.map((b) => b.id) });
    p.stage = res.loai === "khan_cap" ? "urgent" : "sent";
    render("fade");
  } catch {
    toast("Không kết nối được máy chủ của bản mô phỏng.");
  }
}

// ③ Phía Vinmec: những gì người bệnh không tìm thấy.
async function openVinmec() {
  let v;
  try { v = await (await fetch("/api/vinmec")).json(); } catch { return toast("Không kết nối được máy chủ của bản mô phỏng."); }
  const table = (head, rows) => rows.length
    ? `<table><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr>${rows.join("")}</table>`
    : '<p class="muted">Chưa có dữ liệu trong phiên này.</p>';
  $("#vinmec-body").innerHTML = `
    <h3>Câu tìm không ra</h3>${table(["Câu tìm (đã bỏ dấu)", "Số lần"], v.tim_khong_ra.map((r) => `<tr><td>${esc(r.cau_hoi)}</td><td>${r.so_lan}</td></tr>`))}
    <h3>Chỉ số đang thiếu nội dung</h3>${table(["Mã chỉ số", "Số lần"], v.chi_so_thieu_noi_dung.map((r) => `<tr><td>${esc(r.ma)}</td><td>${r.so_lan}</td></tr>`))}
    <h3>Câu hỏi đã gửi bác sĩ (câu giống nhau gom lại, bác sĩ trả lời một lần)</h3>${table(["Câu hỏi", "Gửi tới", "Chỉ số", "Số người hỏi", "Trùng với bài", "Đồng ý bổ sung kho"], v.cau_hoi_da_gui.map((r) => `<tr><td>${esc(r.cau_hoi)}</td><td>${esc(r.gui_toi || "")}</td><td>${esc(r.ma)}</td><td>${r.so_lan}</td><td>${esc(r.trung_voi.join(", ") || "Không")}</td><td>${r.dong_y_bo_sung_kho ? "Có" : "Không"}</td></tr>`))}`;
  $("#vinmec").hidden = false;
}

function openService(id) {
  if (id === "cong-dong") return push("community");
  if (id === "lien-he") return openContact();
  if (id === "tat-ca") return openSheet(`<h3>Dịch vụ</h3><div class="grid">${[...SERVICES, ...EXTRA_SERVICES].map(svcButton).join("")}</div>`);
  if (id === "nhac-thuoc") return push("empty-thuoc");
  if (id === "so-tiem") return push("empty-tiem");
  toast(NOT_OBSERVED);
}

function openContact() {
  openSheet(`<h3>Liên hệ</h3>
    <div class="contact-row"><div>Đặt lịch chủ động - nhanh - gọn<small>Chọn ngày, giờ - xác nhận lịch tự động</small></div><button class="pill-btn" data-act="toast" data-msg="${NOT_OBSERVED}">Đặt hẹn</button></div>
    <div class="contact-row"><div>Cổng dịch vụ CSKH 24/07</div><button class="pill-btn" data-act="toast" data-msg="Bản mô phỏng: không gửi yêu cầu thật.">Gửi yêu cầu</button></div>
    ${HOSPITALS.map((h) => `<div class="contact-row"><div>Bệnh viện Đa khoa Quốc tế Vinmec ${esc(h)}</div><button class="call" data-act="toast" data-msg="Bản mô phỏng: không gọi thật.">☎</button></div>`).join("")}`);
  note("Liên hệ", "Dựng lại theo ảnh chụp: không có số tổng đài chung, mỗi bệnh viện một nút gọi.", "Bằng chứng: O9");
}

function openAi() {
  openSheet(`<h3>Trợ lý AI</h3><p>Biểu tượng trợ lý AI có trên mọi màn hình của MyVinmec v3.0.5, nhưng nội dung trợ lý chưa được quan sát trong đợt này.</p>
    ${isProposal() ? "<p>Thiết kế đề xuất không thay trợ lý này. Tính năng mới nằm ở ô tìm kiếm, trang chuyên mục, nút đặt câu hỏi và màn hình phiếu kết quả.</p>" : ""}
    <button class="btn-teal" data-act="close-sheet">Đóng</button>`);
}

function setMode(mode, keepScreen = true) {
  if (state.mode === mode && keepScreen) return;
  state.mode = mode;
  document.querySelectorAll(".mode-switch button").forEach((b) => b.classList.toggle("on", b.dataset.mode === mode));
  closeSheet();
  flashMode();
  if (!keepScreen) return;
  const here = current();
  if (here.name === "records" || here.name === "result" || here.name === "ask") {
    if (!isProposal()) return resetTo(here.name === "ask" ? "community" : "records");
  }
  if (here.name === "search" && here.params.query) return runSearch(here.params.query, here.params.row);
  render("fade");
}

function scenario(n) {
  closeSheet();
  setMode(n === "1" ? "hien-trang" : "de-xuat", false);
  if (n === "1") { resetTo("home"); push("community"); runSearch("GLU"); }
  if (n === "2") { resetTo("records"); push("result", { i: 0 }); }
  if (n === "3") { resetTo("home"); push("community"); runSearch("men gan cao"); }
  if (n === "4") { resetTo("home"); push("community"); runSearch("Bố tôi đột ngột khó nói, yếu chân tay"); }
  if (n === "5") {
    resetTo("records"); push("result", { i: 1 });
    push("ask", { row: state.reports[1].chi_so[0], stage: "input", words: "", target: "" });
  }
}

// Mỗi điểm đau: cùng một đường đi, xem ở chế độ Trước (hiện trạng) hoặc Sau (đề xuất).
function showPain(id, mode) {
  closeSheet();
  setMode(mode, false);
  state.chipsOpen = id === "chu-de";
  if (id === "glu") {
    if (mode === "hien-trang") { resetTo("home"); push("community"); runSearch("GLU"); }
    else { resetTo("records"); push("result", { i: 0 }); }
    return;
  }
  resetTo("home");
  push("community");
  if (id === "tim-khong-ra") runSearch("mất ngủ kéo dài");
  if (id === "tran-thong-tin" || id === "khong-hoi-duoc") push("topic", { name: "Tim mạch" });
  if (id === "chu-de") {
    const topics = document.querySelector(".topics");
    if (topics) $("#screen").scrollTop = topics.offsetTop - 180;
  }
}

function renderSaved() {
  $("#saved-list").innerHTML = state.saved.length
    ? state.saved.map((q) => `<li>${esc(q)}</li>`).join("")
    : '<li class="muted">Chưa lưu câu hỏi nào.</li>';
  $("#download").disabled = !state.saved.length;
}

function download() {
  const blob = new Blob([state.saved.map((q) => `- ${q}`).join("\n")], { type: "text/plain;charset=utf-8" });
  const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: "cau-hoi-cho-bac-si.txt" });
  a.click();
  URL.revokeObjectURL(a.href);
}

function render(anim) {
  const { name, params } = current();
  const screen = $("#screen");
  screen.innerHTML = `<div class="page ${anim ? `anim-${anim}` : ""}">${SCREENS[name](params)}</div>`;
  const tabScreens = { home: "home", records: "records" };
  const showTab = name in tabScreens;
  $("#tabbar").hidden = !showTab;
  document.querySelectorAll(".tabbar button").forEach((b) => b.classList.toggle("on", b.dataset.tab === tabScreens[name]));
  const bottom = BOTTOM[name] ? BOTTOM[name](params) : "";
  $("#bottom").innerHTML = bottom;
  $("#bottom").hidden = !bottom;
  screen.classList.toggle("no-tab", !showTab && !bottom);
  if (anim) screen.scrollTop = 0;
  if (name === "search" && !params.query) $("#q").focus();
}

document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-act]");
  if (!el) return;
  const d = el.dataset;
  switch (d.act) {
    case "back": back(); break;
    case "tab":
      if (d.tab === "home" || d.tab === "records") resetTo(d.tab);
      else toast(NOT_OBSERVED);
      break;
    case "service": closeSheet(); openService(d.id); break;
    case "open-search": push("search", { query: "" }); break;
    case "quick": runSearch(d.q); break;
    case "topic":
      if (d.name === "Tim mạch") push("topic", { name: d.name });
      else toast("Bản mô phỏng chỉ dựng lại chuyên mục Tim mạch (đã chụp ảnh).");
      break;
    case "toggle-chips": state.chipsOpen = !state.chipsOpen; render(null); break;
    case "open-article": closeSheet(); push("article", { id: d.id, focus: d.focus || "" }); break;
    case "open-wrong": push("article", { wrong: true }); break;
    case "open-report": push("result", { i: Number(d.i) }); break;
    case "explore-row": {
      const row = state.reports[Number(d.i)].chi_so[Number(d.j)];
      runSearch(row.ma, row);
      break;
    }
    case "ask-row": push("ask", { row: state.reports[Number(d.i)].chi_so[Number(d.j)], stage: "input", words: "", target: "" }); break;
    case "ask": closeSheet(); push("ask", { row: d.row ? JSON.parse(d.row) : null, stage: "input", words: d.words || "", target: d.target || "", chosen: d.target || undefined }); break;
    case "draft": draftQuestion(); break;
    case "fill-words": $("#words").value = d.text; break;
    case "choose-doctor": current().params.chosen = d.id; render(null); break;
    case "to-review": current().params.stage = "review"; render("right"); break;
    case "back-to-doctors": current().params.text = $("#draft").value; current().params.stage = "doctors"; render("left"); break;
    case "doctor": openDoctor(d.id); break;
    case "dismiss-coach": state.coachSeen = true; render(null); break;
    case "go-community": resetTo("home"); push("community"); break;
    case "send": sendQuestion(); break;
    case "save-q": {
      const q = state.shownQuestions[Number(d.i)];
      if (q && !state.saved.includes(q)) { state.saved.push(q); renderSaved(); render(null); toast("Đã lưu câu hỏi để hỏi bác sĩ."); }
      break;
    }
    case "contact": openContact(); break;
    case "ai": openAi(); break;
    case "close-sheet": closeSheet(); break;
    case "toast": toast(d.msg); break;
    case "mode": setMode(d.mode); break;
    case "pain": showPain(d.id, d.mode); break;
    case "scenario": scenario(d.n); break;
    case "vinmec": openVinmec(); break;
    case "close-vinmec": $("#vinmec").hidden = true; break;
    case "download": download(); break;
  }
});

document.addEventListener("submit", (e) => {
  e.preventDefault();
  if (e.target.id === "search-form") {
    const row = current().params.row && current().params.query === $("#q").value.trim() ? current().params.row : null;
    runSearch($("#q").value, row);
  }
  if (e.target.id === "topic-form") runSearch($("#topic-q").value);
});

async function init() {
  try {
    const data = await (await fetch("/api/data")).json();
    state.corpus = data.bai;
    state.reports = data.phieu;
    state.theoChiSo = data.theo_chi_so;
    state.doctors = data.bac_si;
    state.coAi = data.co_ai;
  } catch {
    toast("Không tải được dữ liệu. Hãy mở trang qua máy chủ: python 05-prototype/app/server.py");
  }
  $("#ai-status").textContent = state.coAi
    ? "Máy chủ đã có API key: chế độ đề xuất gọi AI thật."
    : "Máy chủ chưa có API key: chế độ đề xuất chỉ hiện kết quả tìm theo từ khóa và câu hỏi soạn theo mẫu.";
  resetTo("home");
  const link = location.hash.match(/^#kich-ban-([1-5])$/);
  if (link) scenario(link[1]);
  const pain = location.hash.match(/^#dau-(tim-khong-ra|tran-thong-tin|khong-hoi-duoc|chu-de|glu)-(truoc|sau)$/);
  if (pain) showPain(pain[1], pain[2] === "truoc" ? "hien-trang" : "de-xuat");
}

init();
