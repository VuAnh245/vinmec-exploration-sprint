"use strict";

// Bản mô phỏng MyVinmec v3.0.5 có thể bấm. Hai chế độ:
// - hien-trang: tái hiện đúng những gì quan sát được ngày 19/10/2026 (01-phong-van/myvinmec-observation.md)
// - de-xuat: gắn thiết kế mới (tìm theo ý nghĩa, dẫn nguồn bài bác sĩ, lối vào từ phiếu kết quả)

const state = { mode: "hien-trang", stack: [], corpus: {}, reports: [], coAi: false, saved: [], shownQuestions: [] };

const $ = (sel) => document.querySelector(sel);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const norm = (s) => String(s).toLowerCase().replace(/đ/g, "d").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim();

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

// ---------- Điều hướng ----------

function current() { return state.stack[state.stack.length - 1]; }
function push(name, params = {}) { state.stack.push({ name, params }); render(true); }
function back() { if (state.stack.length > 1) { state.stack.pop(); render(true); } }
function resetTo(name, params = {}) { state.stack = [{ name, params }]; render(true); }

function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { el.hidden = true; }, 2600);
}

function openSheet(html) { $("#sheet").innerHTML = `<div class="grab"></div>${html}`; $("#sheet").hidden = false; $("#sheet-backdrop").hidden = false; }
function closeSheet() { $("#sheet").hidden = true; $("#sheet-backdrop").hidden = true; }

function note(title, text, evidence = "") {
  $("#note-title").textContent = title;
  $("#note-text").textContent = text;
  $("#note-evidence").textContent = evidence;
}

// ---------- Màn hình ----------

function svcButton(s) {
  return `<button class="svc" data-act="service" data-id="${s.id}"><span class="ic">${s.icon}</span>${s.moi ? '<span class="moi">Mới</span>' : ""}${esc(s.label)}</button>`;
}

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
    const proposal = state.mode === "de-xuat";
    note("Cộng đồng hỏi đáp bác sĩ",
      proposal
        ? "Thiết kế đề xuất giữ nguyên màn hình, thêm gợi ý tìm theo chỉ số in trên phiếu ngay dưới ô tìm kiếm."
        : "Dựng lại theo ảnh chụp. Số liệu 20.915 câu hỏi và 21.482 chủ đề lấy đúng theo màn hình ngày 19/10/2026.",
      "Bằng chứng: O6, ảnh O6-cong-dong-hoi-dap, O6-cong-dong-chuyen-khoa");
    const spec = (n, name, cnt, ic) => `<div class="spec"><div class="img">${n || ic}</div><div class="nm">${esc(name)}</div><div class="cnt">${cnt} Câu hỏi</div></div>`;
    return `
      <div class="comm-head">
        <div class="topline"><button class="icon-btn" data-act="back">←</button><h2>Cộng đồng hỏi đáp bác sĩ</h2><button class="icon-btn" data-act="toast" data-msg="${NOT_OBSERVED}">🔖</button></div>
        <div class="illus"><span>🙋‍♀️</span><span>👨‍⚕️</span></div>
        <button class="fake-search" data-act="open-search"><span>Hãy tìm vấn đề của bạn!</span><span>🔍</span></button>
        <div class="stats"><div><b>20.915</b><span>Câu hỏi được bác sĩ giải đáp</span></div><div><b>21.482</b><span>Chủ đề sức khỏe nổi bật</span></div></div>
      </div>
      ${proposal ? `<div class="new-hint"><b>Mới (đề xuất):</b> tìm theo chỉ số in trên phiếu kết quả, gõ có dấu hay không dấu đều được.
        <div class="chips">${["GLU", "ALT", "men gan cao", "duong huyet cao"].map((q) => `<button class="chip teal" data-act="quick" data-q="${q}">${q}</button>`).join("")}</div></div>` : ""}
      <div class="sec-title">Có thể bạn quan tâm</div>
      ${[["Sàng lọc trước sinh không xâm lấn (NIPT): Hiểu đúng kết quả và giới hạn xét nghiệm", "12 ngày trước"],
         ["Sàng lọc trước mang thai: Hiểu nguy cơ di truyền trước khi có con", "12 ngày trước"],
         ["Cấy ghép tế bào gốc chữa bại não: Chẩn đoán và điều trị", "16 ngày trước"]]
        .map(([t, d]) => `<div class="q-item"><span class="qi">❔</span><div><b>${esc(t)}</b><small>${d}</small></div></div>`).join("")}
      <div class="sec-title">Chủ đề được hỏi nhiều nhất</div>
      <div class="chips" style="padding:0 16px"><span class="chip">Tiêu hóa gan mật</span><span class="chip">Ung bướu</span><span class="chip">Tim mạch</span><span class="chip">⌄</span></div>
      <div class="sec-title">Chuyên khoa nổi bật</div>
      <div class="spec-row">${spec("1", "Cơ xương khớp", "1,8K")}${spec("2", "Ung bướu - Xạ trị", "841")}${spec("3", "Tim mạch", "1,3K")}</div>
      <div class="sec-title">Vấn đề về Sản - Nhi</div>
      <div class="spec-row">${spec("", "Sản phụ khoa và Hỗ trợ sinh sản", "6,5K", "🤰")}${spec("", "Nhi", "6,8K", "🧒")}</div>
      <div class="sec-title">Sức khỏe dự phòng</div>
      <div class="spec-row">${spec("", "Sức khỏe tổng quát", "3,7K", "🩺")}${spec("", "Tim mạch", "1,3K", "❤️")}</div>`;
  },

  search(p) {
    const head = `<div class="search-bar"><button class="icon-btn" data-act="back">←</button>
      <form id="search-form"><input id="q" name="q" autocomplete="off" placeholder="Hãy tìm vấn đề của bạn!" value="${esc(p.query || "")}"><button class="go" type="submit">Tìm</button></form></div>`;
    const ctx = p.row ? `<div class="row-ctx">Từ phiếu: ${esc(p.row.ma)} · ${esc(p.row.ket_qua)} ${esc(p.row.don_vi)} · ${esc(p.row.co)}</div>` : "";
    if (!p.query) {
      note("Tìm kiếm", "Gõ một chỉ số hoặc câu hỏi rồi bấm Tìm.", "");
      return head;
    }
    return head + ctx + (state.mode === "hien-trang" ? asIsResults(p) : proposalResults(p));
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
    if (state.mode === "hien-trang") {
      note("Hồ sơ", "Tab Hồ sơ chưa quan sát được vì tài khoản chưa kết nối hồ sơ. Màn hình này dùng mẫu màn hình trống đã thấy ở Nhắc lịch uống thuốc và Sổ tiêm.", "Bằng chứng: O4, O5");
      return `<div class="empty"><div class="ill">📂</div><p>Không tìm thấy hồ sơ sức khỏe tại Vinmec</p><button class="btn-teal" data-act="toast" data-msg="Bản mô phỏng: kết nối hồ sơ cần mã PID in trên giấy tờ khám.">KẾT NỐI HỒ SƠ</button></div>`;
    }
    note("Hồ sơ (màn hình đề xuất)", "Màn hình kết quả thật chưa quan sát được, nên đây là thiết kế đề xuất với hai phiếu mô phỏng.", "Bằng chứng: O5 (giới hạn truy cập)");
    return `<div class="topbar"><h2>Hồ sơ</h2></div><div class="sec-title">Kết quả xét nghiệm</div>
      ${state.reports.map((r, i) => `<button class="report-link" data-act="open-report" data-i="${i}"><div><b>${esc(r.loai_phieu)}</b><small>${esc(r.co_so)} · dữ liệu mô phỏng</small></div><span>›</span></button>`).join("")}`;
  },

  result(p) {
    const r = state.reports[p.i];
    note("Phiếu kết quả (màn hình đề xuất)", "Mỗi chỉ số có cờ có nút \"Tìm hiểu chỉ số này\". Nút mở tìm kiếm kèm ngữ cảnh dòng trên phiếu, để AI biết GLU ở đây là glucose máu.", "Giải quyết: ĐĐ3, ĐĐ6");
    const rows = r.chi_so.map((c, j) => `<div class="lab-row"><div class="top"><span class="nm">${esc(c.ten)} <span class="muted small">(${esc(c.ma)})</span></span>
      <span class="val">${esc(c.ket_qua)} ${esc(c.don_vi)}${c.co ? `<span class="flag ${esc(c.co)}">${esc(c.co)}</span>` : ""}</span></div>
      <div class="rng">Khoảng tham chiếu: ${esc(c.khoang_tham_chieu)}</div>
      ${c.co ? `<button class="explore" data-act="explore-row" data-i="${p.i}" data-j="${j}">Tìm hiểu chỉ số này</button>` : ""}</div>`).join("");
    return `<div class="topbar"><button class="icon-btn" data-act="back">←</button><h2>${esc(r.loai_phieu)}</h2><span class="icon-btn"></span></div>
      <div class="sim-tag">DỮ LIỆU MÔ PHỎNG, không phải kết quả của người thật</div>
      <div style="height:8px"></div>${rows}<p class="muted small" style="margin:10px 16px">${esc(r.ghi_chu_phieu)}</p>`;
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

function asIsResults(p) {
  const key = norm(p.query);
  if (key === "glu") {
    note("Tìm \"GLU\" (hiện trạng)", "Kết quả thật: 2 bài trong mục Kiến thức, không bài nào về glucose máu. Bấm bài đầu sẽ mở sai bài.", "Bằng chứng: ĐĐ3, ĐĐ4, ảnh O6-tim-glu");
    return `<div class="kt-head"><span>Kiến thức</span><span>›</span></div>` +
      AS_IS_GLU.map((r) => `<button class="kt-item" data-act="${r.act}" data-id="${r.id || ""}"><div class="thumb"></div><div>${esc(r.title)}</div></button>`).join("");
  }
  note(`Tìm "${p.query}" (hiện trạng)`,
    TESTED.has(key)
      ? "Kết quả thật ngày 19/10/2026: không hiện kết quả nào, lặp lại ở lượt thử thứ hai."
      : "Từ khóa này chưa được kiểm thử trên app thật; bản mô phỏng hiện trạng chỉ tái hiện các từ khóa đã thử.",
    TESTED.has(key) ? "Bằng chứng: ĐĐ2, bảng kiểm thử tìm kiếm" : "");
  return "";
}

function proposalResults(p) {
  if (!p.result) {
    note(`Tìm "${p.query}" (đề xuất)`, "Đang gửi câu hỏi tới máy chủ của bản mô phỏng.", "");
    return `<div class="loading">Đang tìm bài bác sĩ đã viết...</div><div class="skel"></div><div class="skel"></div>`;
  }
  const r = p.result;
  state.shownQuestions = r.cau_hoi || [];
  if (r.loai === "khan_cap") {
    note("Tình huống khẩn cấp", "Câu hỏi khẩn cấp dừng ngay, không gửi tới model.", "Bằng chứng: O10 (Sàng lọc đột quỵ), RR02");
    return `<div class="alert red"><b>Nếu bạn đang có triệu chứng như vậy, hãy gọi cấp cứu 115 hoặc đến cơ sở cấp cứu gần nhất ngay.</b><br>Công cụ này không xử lý tình huống khẩn cấp.<br><button class="btn-red" data-act="toast" data-msg="Bản mô phỏng: không gọi thật. Hãy gọi 115 bằng điện thoại.">Gọi 115</button></div>`;
  }
  let html = "";
  if (r.loai === "y_khoa") html += `<div class="alert amber">Câu hỏi này cần bác sĩ trả lời dựa trên tình trạng cụ thể của bạn. Công cụ chỉ giúp tìm bài bác sĩ đã viết, không đưa lời khuyên y khoa.</div>`;
  if (r.loi_ai) html += `<div class="alert grey">Chưa kết nối được dịch vụ AI. Dưới đây là kết quả tìm theo từ khóa.</div>`;
  if (r.hieu_cau_hoi) html += `<div class="understand">Đang tìm: ${esc(r.hieu_cau_hoi)}</div>`;

  const cards = (items, withWhy) => items.map((b) => `<button class="res-card" data-act="open-article" data-id="${esc(b.id)}" data-focus="${esc(b.muc_nen_doc || "")}">
      <span class="badge ${b.loai === "Hỏi đáp bác sĩ" ? "qa" : ""}">${esc(b.loai)}</span><h4>${esc(b.tieu_de)}</h4>
      ${b.tu_van ? `<div class="meta">Tư vấn chuyên môn: ${esc(b.tu_van)}</div>` : ""}
      ${withWhy && b.ly_do ? `<div class="why">${esc(b.ly_do)}</div>` : ""}
      ${withWhy && b.muc_nen_doc ? `<div class="read">Nên đọc trước: ${esc(b.muc_nen_doc)}</div>` : ""}</button>`).join("");

  if (r.ket_qua.length) html += `<div class="sec-title">Bài bác sĩ đã viết (${r.ket_qua.length})</div>${cards(r.ket_qua, true)}`;
  else if (r.loi_ai) html += r.tu_khoa.length ? cards(r.tu_khoa, false) : `<div class="block">Không có kết quả theo từ khóa.</div>`;
  else html += `<div class="block">Chưa có bài phù hợp trong kho của bản thử.</div>`;

  if (state.shownQuestions.length) {
    html += `<div class="block"><h5>Câu hỏi mang tới bác sĩ</h5>${state.shownQuestions.map((q, i) => {
      const done = state.saved.includes(q);
      return `<div class="doc-q"><span>${esc(q)}</span><button class="mini ${done ? "done" : ""}" data-act="save-q" data-i="${i}" ${done ? "disabled" : ""}>${done ? "Đã lưu" : "Lưu"}</button></div>`;
    }).join("")}</div>`;
  }
  html += `<div class="block"><h5>Vẫn cần hỏi thêm?</h5><div class="next-steps">
      <button data-act="toast" data-msg="Bản mô phỏng: trên app thật, nút này mở luồng tư vấn với bác sĩ.">Tư vấn với bác sĩ</button>
      <button data-act="contact">Gửi yêu cầu CSKH 24/07</button>
      <button data-act="contact">Gọi bệnh viện nơi bạn khám</button></div></div>`;
  if (!r.loi_ai) {
    html += `<details class="compare"><summary>So sánh: tìm theo từ khóa trong tiêu đề (${r.tu_khoa.length} kết quả)</summary>
      ${r.tu_khoa.length ? cards(r.tu_khoa, false) : "<p>Không có kết quả.</p>"}</details>`;
  }
  note(`Tìm "${p.query}" (đề xuất)`,
    r.loi_ai ? "Máy chủ chưa có API key hoặc gọi model lỗi; đang hiện kết quả tìm theo từ khóa." : "AI chọn bài trong kho 11 trang công khai của vinmec.com; đường dẫn lấy từ kho, không do AI viết.",
    "Giải quyết: ĐĐ2, ĐĐ3, ĐĐ5, ĐĐ6");
  return html;
}

// ---------- Hành động ----------

async function runSearch(query, row = null) {
  query = query.trim();
  if (!query) return;
  const entry = current().name === "search" ? current() : null;
  const params = { query, row, result: null };
  if (entry) { entry.params = params; render(false); } else push("search", params);
  if (state.mode !== "de-xuat") return;
  try {
    const res = await fetch("/api/search", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cau_hoi: query, dong_phieu: row }) });
    if (!res.ok) throw new Error(String(res.status));
    params.result = await res.json();
  } catch {
    params.result = { loai: "trong_pham_vi", loi_ai: true, hieu_cau_hoi: "", ket_qua: [], cau_hoi: [], tu_khoa: [] };
  }
  if (current().params === params) render(false);
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
  closeSheet();
  openSheet(`<h3>Liên hệ</h3>
    <div class="contact-row"><div>Đặt lịch chủ động - nhanh - gọn<small>Chọn ngày, giờ - xác nhận lịch tự động</small></div><button class="pill-btn" data-act="toast" data-msg="${NOT_OBSERVED}">Đặt hẹn</button></div>
    <div class="contact-row"><div>Cổng dịch vụ CSKH 24/07</div><button class="pill-btn" data-act="toast" data-msg="Bản mô phỏng: không gửi yêu cầu thật.">Gửi yêu cầu</button></div>
    ${HOSPITALS.map((h) => `<div class="contact-row"><div>Bệnh viện Đa khoa Quốc tế Vinmec ${esc(h)}</div><button class="call" data-act="toast" data-msg="Bản mô phỏng: không gọi thật.">☎</button></div>`).join("")}`);
  note("Liên hệ", "Dựng lại theo ảnh chụp: không có số tổng đài chung, mỗi bệnh viện một nút gọi.", "Bằng chứng: O9");
}

function openAi() {
  openSheet(`<h3>Trợ lý AI</h3><p>Biểu tượng trợ lý AI có trên mọi màn hình của MyVinmec v3.0.5, nhưng nội dung trợ lý chưa được quan sát trong đợt này.</p>
    ${state.mode === "de-xuat" ? "<p>Thiết kế đề xuất không thay trợ lý này. Tính năng mới nằm ở ô tìm kiếm của Cộng đồng hỏi đáp và ở màn hình phiếu kết quả.</p>" : ""}
    <button class="btn-teal" data-act="close-sheet">Đóng</button>`);
}

function scenario(n) {
  closeSheet();
  if (n === "1") { setMode("hien-trang"); push("community"); runSearch("GLU"); }
  if (n === "2") { setMode("de-xuat"); resetTo("records"); push("result", { i: 0 }); }
  if (n === "3") { setMode("de-xuat"); push("community"); runSearch("men gan cao"); }
  if (n === "4") { setMode("de-xuat"); push("community"); runSearch("Bố tôi đột ngột khó nói, yếu chân tay"); }
}

function setMode(mode) {
  state.mode = mode;
  document.querySelectorAll(".mode-switch button").forEach((b) => b.classList.toggle("on", b.dataset.mode === mode));
  closeSheet();
  resetTo("home");
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

function render(scrollTop) {
  const { name, params } = current();
  const screen = $("#screen");
  screen.innerHTML = SCREENS[name](params);
  const tabScreens = { home: "home", records: "records" };
  const showTab = name in tabScreens;
  $("#tabbar").hidden = !showTab;
  screen.classList.toggle("no-tab", !showTab);
  document.querySelectorAll(".tabbar button").forEach((b) => b.classList.toggle("on", b.dataset.tab === tabScreens[name]));
  if (name === "article") screen.insertAdjacentHTML("beforeend", `<div class="article-bar"><button data-act="toast" data-msg="Bản mô phỏng: trên app thật, nút này mở luồng tư vấn với bác sĩ.">🧑‍⚕️ TƯ VẤN VỚI BÁC SĨ</button><button data-act="toast" data-msg="${NOT_OBSERVED}">📅 ĐĂNG KÝ KHÁM</button></div>`);
  if (scrollTop) screen.scrollTop = 0;
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
    case "service": openService(d.id); break;
    case "open-search": push("search", { query: "" }); break;
    case "quick": runSearch(d.q); break;
    case "open-article": closeSheet(); push("article", { id: d.id, focus: d.focus || "" }); break;
    case "open-wrong": push("article", { wrong: true }); break;
    case "open-report": push("result", { i: Number(d.i) }); break;
    case "explore-row": {
      const row = state.reports[Number(d.i)].chi_so[Number(d.j)];
      runSearch(row.ma, row);
      break;
    }
    case "save-q": {
      const q = state.shownQuestions[Number(d.i)];
      if (q && !state.saved.includes(q)) { state.saved.push(q); renderSaved(); render(false); }
      break;
    }
    case "contact": openContact(); break;
    case "ai": openAi(); break;
    case "close-sheet": closeSheet(); break;
    case "toast": toast(d.msg); break;
    case "mode": setMode(d.mode); break;
    case "scenario": scenario(d.n); break;
    case "download": download(); break;
  }
});

document.addEventListener("submit", (e) => {
  if (e.target.id !== "search-form") return;
  e.preventDefault();
  const row = current().params.row && current().params.query === $("#q").value.trim() ? current().params.row : null;
  runSearch($("#q").value, row);
});

async function init() {
  try {
    const data = await (await fetch("/api/data")).json();
    state.corpus = data.bai;
    state.reports = data.phieu;
    state.coAi = data.co_ai;
  } catch {
    toast("Không tải được dữ liệu. Hãy mở trang qua máy chủ: python 05-prototype/app/server.py");
  }
  $("#ai-status").textContent = state.coAi
    ? "Máy chủ đã có API key: chế độ đề xuất gọi AI thật."
    : "Máy chủ chưa có API key: chế độ đề xuất chỉ hiện kết quả tìm theo từ khóa.";
  resetTo("home");
  const link = location.hash.match(/^#kich-ban-([1-4])$/);
  if (link) scenario(link[1]);
}

init();
