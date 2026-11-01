/* KONTENIN v1.0 — semua data disimpan secara lokal di browser. */
(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const STORAGE = {
    saved: "kontenin_saved_v1",
    plans: "kontenin_plans_v1",
    note: "kontenin_note_v1"
  };

  const ideaBank = {
    daily: [
      ["Sehari jadi lebih teratur", "Tunjukkan 3 kebiasaan kecil yang membantu aktivitas harianmu."],
      ["Ekspektasi vs realita", "Bandingkan bayangan orang dengan pengalaman nyata secara lucu dan jujur."],
      ["Hal kecil yang bikin produktif", "Bagikan kebiasaan sederhana yang membuat harimu terasa lebih ringan."],
      ["POV: hari yang padat", "Ceritakan satu hari sibuk lewat beberapa klip pendek."]
    ],
    education: [
      ["Belajar sesuatu dalam 30 detik", "Jelaskan satu konsep sederhana dengan contoh yang mudah dipahami."],
      ["3 kesalahan pemula", "Bahas kesalahan umum dan cara memperbaikinya tanpa menghakimi."],
      ["Mitos atau fakta?", "Pilih satu anggapan populer, lalu jelaskan faktanya dengan sumber yang layak."],
      ["Tutorial langkah demi langkah", "Ajarkan satu keterampilan kecil dengan urutan yang jelas."]
    ],
    tech: [
      ["3 aplikasi gratis yang berguna", "Ulas aplikasi yang benar-benar pernah kamu coba dan jelaskan kelebihannya."],
      ["Tips HP yang jarang diketahui", "Tunjukkan pengaturan atau fitur yang bermanfaat dan aman."],
      ["Website yang membantu pelajar", "Perkenalkan situs berguna, jelaskan fungsi dan batasannya."],
      ["Teknologi sebelum dan sesudah", "Bandingkan cara lama dan cara baru menyelesaikan satu pekerjaan."]
    ],
    design: [
      ["Proses dari sketsa ke desain", "Rekam tahap awal, proses revisi, dan hasil akhir karya buatanmu."],
      ["Bedah desain sederhana", "Jelaskan pilihan warna, tipografi, komposisi, dan alasan di baliknya."],
      ["Tantangan 2 warna", "Buat karya menggunakan dua warna utama dan ceritakan pertimbangannya."],
      ["Satu brief, tiga ide", "Tunjukkan tiga arah konsep berbeda untuk brief fiktif."]
    ],
    gaming: [
      ["Momen paling berkesan", "Ceritakan momen gameplay yang seru tanpa merendahkan pemain lain."],
      ["Tips buat pemula", "Bagikan satu strategi dasar yang kamu pahami dan sudah kamu coba."],
      ["Setup atau pengaturan favorit", "Jelaskan pengaturan yang nyaman buatmu beserta alasannya."],
      ["Belajar dari kekalahan", "Bahas apa yang bisa dipelajari dari satu pertandingan."]
    ],
    business: [
      ["Ide produk digital pemula", "Tunjukkan contoh template sederhana yang bisa dibuat dengan keterampilanmu."],
      ["Di balik proses membuat karya", "Perlihatkan tahapan kerja dari brief sampai file akhir."],
      ["Cara menentukan harga karya", "Bahas waktu, tingkat kesulitan, revisi, dan riset harga secara transparan."],
      ["Portofolio dari proyek latihan", "Jelaskan bagaimana proyek fiktif bisa menunjukkan kemampuanmu."]
    ],
    story: [
      ["Pelajaran dari pengalaman", "Ceritakan pengalaman pribadi yang nyaman dibagikan dan pelajaran yang didapat."],
      ["Dulu aku berpikir...", "Ceritakan perubahan sudut pandangmu tanpa membuka informasi pribadi."],
      ["Satu keputusan kecil", "Buat cerita singkat tentang keputusan yang mengubah proses belajarmu."],
      ["Cerita di balik karya", "Ceritakan inspirasi, tantangan, dan revisi di balik sebuah karya."]
    ]
  };

  const categoryNames = {
    daily: "Keseharian", education: "Edukasi", tech: "Teknologi",
    design: "Desain & kreativitas", gaming: "Gaming", business: "Bisnis pemula", story: "Storytelling"
  };
  let savedItems = load(STORAGE.saved, []);
  let plans = load(STORAGE.plans, []);
  let currentIdeas = [];

  function load(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  }
  function persist() {
    localStorage.setItem(STORAGE.saved, JSON.stringify(savedItems));
    localStorage.setItem(STORAGE.plans, JSON.stringify(plans));
    updateStats();
  }
  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[char]));
  }
  function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2300);
  }
  function makeId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
  function goTo(viewName) {
    $$(".view").forEach(view => view.classList.toggle("active-view", view.id === `view-${viewName}`));
    $$(".nav-item").forEach(button => button.classList.toggle("active", button.dataset.view === viewName));
    const activeButton = $(`.nav-item[data-view="${viewName}"]`);
    $("#pageName").textContent = activeButton ? activeButton.textContent.trim() : "Dashboard";
    $("#sidebar").classList.remove("open");
    if (viewName === "saved") renderSaved();
    if (viewName === "planner") renderPlans();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateStats() {
    $("#statSaved").textContent = savedItems.length;
    $("#statPlans").textContent = plans.length;
    $("#statDone").textContent = plans.filter(plan => plan.status === "done").length;
  }

  function makeIdeaCard(item, index, isSaved = false) {
    return `<article class="idea-card">
      <div class="idea-card-top"><span class="tag">${escapeHTML(item.categoryName || "Inspirasi")}</span><span class="idea-number">${String(index + 1).padStart(2, "0")}</span></div>
      <h3>${escapeHTML(item.title)}</h3>
      <p>${escapeHTML(item.description || item.text || "")}</p>
      <div class="idea-actions">
        ${isSaved ? `<button class="button button-secondary button-small" data-delete-saved="${escapeHTML(item.id)}">Hapus</button>` : `<button class="button button-secondary button-small" data-save-idea="${escapeHTML(item.id)}">☆ Simpan ide</button>`}
        <button class="button button-primary button-small" data-plan-idea="${escapeHTML(item.id)}" data-source="${isSaved ? "saved" : "ideas"}">＋ Jadwalkan</button>
      </div>
    </article>`;
  }

  function generateIdeas() {
    const platform = $("#ideaPlatform").value;
    const category = $("#ideaCategory").value;
    const topic = $("#ideaTopic").value.trim();
    const pool = ideaBank[category] || ideaBank.daily;
    currentIdeas = pool.map(([title, description]) => ({
      id: makeId(),
      title: topic ? `${title}: ${topic}` : title,
      description: topic ? `${description} Kembangkan dengan fokus pada topik "${topic}".` : description,
      categoryName: categoryNames[category],
      category,
      platform
    }));
    $("#ideaResults").innerHTML = currentIdeas.map(makeIdeaCard).join("");
    $("#ideaCount").textContent = `${currentIdeas.length} inspirasi · ${platform}`;
  }

  function saveIdea(item) {
    if (!item) return;
    const duplicate = savedItems.some(saved => saved.title === item.title && saved.description === item.description);
    if (duplicate) return showToast("Ide ini sudah ada di koleksi kamu.");
    savedItems.unshift({ ...item, id: makeId(), savedAt: new Date().toISOString() });
    persist();
    renderSaved();
    showToast("Ide berhasil disimpan.");
  }

  function renderSaved() {
    const query = ($("#savedSearch")?.value || "").trim().toLowerCase();
    const filtered = savedItems.filter(item => `${item.title} ${item.description} ${item.categoryName}`.toLowerCase().includes(query));
    $("#savedResults").innerHTML = filtered.map((item, index) => makeIdeaCard(item, index, true)).join("");
    $("#savedEmpty").classList.toggle("hidden", filtered.length > 0);
  }

  function makeCaption(topic, platform, style) {
    const templates = {
      casual: `Pernah kepikiran soal ${topic} nggak? 👀\n\nAku lagi belajar dan mencoba memahami hal ini. Ternyata ada banyak hal kecil yang menarik buat dibahas.\n\nKalau kamu punya pengalaman atau tips lain, tulis di komentar, yuk!\n\n#${slug(topic)} #KreatorPemula`,
      educational: `Yuk, kenalan lebih dekat dengan ${topic}.\n\n📌 Poin penting:\n• Pahami dasarnya terlebih dahulu.\n• Coba praktikkan secara bertahap.\n• Evaluasi hasil dan cari referensi tepercaya.\n\nSimpan postingan ini kalau bermanfaat, dan cek kembali informasinya sesuai kebutuhanmu.\n\n#BelajarBareng #${slug(topic)}`,
      motivational: `Nggak harus langsung sempurna untuk mulai belajar ${topic}. 🌱\n\nMulai dari satu langkah kecil, konsisten berlatih, dan beri ruang buat diri sendiri untuk berkembang. Proses setiap orang berbeda.\n\nHari ini, coba satu hal baru. Besok, lanjut lagi.\n\n#ProsesBelajar #Berkembang`,
      story: `Awalnya aku ingin memahami ${topic}, tapi ternyata prosesnya nggak selalu langsung mudah.\n\nDari mencoba, membuat kesalahan, lalu memperbaiki lagi, aku belajar bahwa proses juga bagian penting dari hasil.\n\nIni masih perjalanan. Kalau kamu juga sedang belajar hal serupa, kita bisa saling berbagi pengalaman.\n\n#CeritaProses #${slug(topic)}`,
      promo: `Lagi mengerjakan sesuatu tentang ${topic} dan ingin berbagi prosesnya. ✨\n\nKalau kamu tertarik dengan topik ini, semoga konten ini bisa jadi referensi awal. Detail dan hasilnya tetap bisa kamu sesuaikan dengan kebutuhanmu.\n\nPunya pertanyaan? Tulis di komentar atau kirim pesan dengan sopan.\n\n#KaryaKreatif #${slug(topic)}`
    };
    let result = templates[style] || templates.casual;
    if (platform === "LinkedIn") result = result.replace(/👀|🌱|✨/g, "").replace(/#KreatorPemula/g, "#Pembelajaran");
    if (platform === "YouTube") result += "\n\nTonton sampai selesai dan tulis pendapatmu di komentar.";
    return result;
  }
  function slug(text) {
    const clean = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 24);
    return clean || "konten";
  }

  function addPlan(title, platform, date, status = "draft") {
    plans.unshift({ id: makeId(), title, platform, date, status });
    persist();
    renderPlans();
  }
  function renderPlans() {
    const sorted = [...plans].sort((a, b) => (a.date || "").localeCompare(b.date || ""));
    if (!sorted.length) {
      $("#plannerList").innerHTML = `<div class="empty-state"><span>▦</span><h3>Belum ada rencana</h3><p>Tambahkan ide dan tanggal agar rencana kontenmu lebih teratur.</p></div>`;
      return;
    }
    const statusLabels = { draft: "Ide", progress: "Sedang dibuat", done: "Selesai" };
    $("#plannerList").innerHTML = sorted.map(plan => `<div class="plan-item">
      <div><div class="plan-title">${escapeHTML(plan.title)}</div><div class="plan-meta">${escapeHTML(plan.platform)} · ${formatDate(plan.date)}</div></div>
      <div class="plan-controls">
        <select class="status-select" data-plan-status="${escapeHTML(plan.id)}" aria-label="Status ${escapeHTML(plan.title)}">
          ${Object.entries(statusLabels).map(([value, label]) => `<option value="${value}" ${plan.status === value ? "selected" : ""}>${label}</option>`).join("")}
        </select>
        <button class="delete-button" data-delete-plan="${escapeHTML(plan.id)}" aria-label="Hapus ${escapeHTML(plan.title)}">Hapus</button>
      </div>
    </div>`).join("");
  }
  function formatDate(value) {
    if (!value) return "Tanggal belum ditentukan";
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(date);
  }
  function downloadCSV(filename, rows) {
    if (!rows.length) return showToast("Belum ada data untuk diekspor.");
    const csv = rows.map(row => row.map(value => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast("File CSV mulai diunduh.");
  }

  // Navigation
  $$(".nav-item").forEach(button => button.addEventListener("click", () => goTo(button.dataset.view)));
  $$("[data-go]").forEach(button => button.addEventListener("click", () => goTo(button.dataset.go)));
  $("#menuToggle").addEventListener("click", () => $("#sidebar").classList.toggle("open"));
  document.addEventListener("click", event => {
    if (window.innerWidth <= 700 && $("#sidebar").classList.contains("open") &&
        !$("#sidebar").contains(event.target) && !$("#menuToggle").contains(event.target)) {
      $("#sidebar").classList.remove("open");
    }
  });

  // Quick note autosave
  $("#quickNote").value = load(STORAGE.note, "");
  $("#quickNote").addEventListener("input", () => {
    localStorage.setItem(STORAGE.note, $("#quickNote").value);
    $("#noteStatus").textContent = "Catatan tersimpan.";
  });
  $("#clearNote").addEventListener("click", () => {
    $("#quickNote").value = "";
    localStorage.removeItem(STORAGE.note);
    $("#noteStatus").textContent = "Catatan dihapus.";
    showToast("Catatan sudah dihapus.");
  });

  // Ideas
  $("#generateIdeas").addEventListener("click", generateIdeas);
  $("#ideaResults").addEventListener("click", event => {
    const saveButton = event.target.closest("[data-save-idea]");
    const planButton = event.target.closest("[data-plan-idea]");
    if (saveButton) saveIdea(currentIdeas.find(item => item.id === saveButton.dataset.saveIdea));
    if (planButton) {
      const item = currentIdeas.find(idea => idea.id === planButton.dataset.planIdea);
      if (!item) return;
      $("#planTitle").value = item.title;
      $("#planPlatform").value = item.platform;
      $("#planDate").value = new Date().toISOString().slice(0, 10);
      goTo("planner");
      showToast("Ide dimasukkan ke formulir jadwal. Lengkapi lalu tambahkan.");
    }
  });

  // Caption
  $("#captionForm").addEventListener("submit", event => {
    event.preventDefault();
    const topic = $("#captionTopic").value.trim();
    if (!topic) return showToast("Isi topik caption terlebih dahulu.");
    $("#captionOutput").value = makeCaption(topic, $("#captionPlatform").value, $("#captionStyle").value);
    $("#captionLength").textContent = `${$("#captionOutput").value.length} karakter`;
    showToast("Caption berhasil dibuat. Silakan edit sesuai kebutuhan.");
  });
  $("#captionOutput").addEventListener("input", () => $("#captionLength").textContent = `${$("#captionOutput").value.length} karakter`);
  $("#copyCaption").addEventListener("click", async () => {
    const value = $("#captionOutput").value;
    if (!value.trim()) return showToast("Buat caption terlebih dahulu.");
    try {
      await navigator.clipboard.writeText(value);
      showToast("Caption berhasil disalin.");
    } catch (error) {
      $("#captionOutput").focus();
      $("#captionOutput").select();
      showToast("Pilih teks caption lalu salin secara manual.");
    }
  });
  $("#saveCaption").addEventListener("click", () => {
    const text = $("#captionOutput").value.trim();
    if (!text) return showToast("Belum ada caption untuk disimpan.");
    saveIdea({ title: `Caption: ${$("#captionTopic").value.trim() || "Tanpa judul"}`, description: text, categoryName: "Caption", category: "caption", platform: $("#captionPlatform").value });
  });

  // Planner
  $("#planDate").value = new Date().toISOString().slice(0, 10);
  $("#planForm").addEventListener("submit", event => {
    event.preventDefault();
    const title = $("#planTitle").value.trim();
    const date = $("#planDate").value;
    if (!title || !date) return showToast("Lengkapi judul dan tanggal rencana.");
    addPlan(title, $("#planPlatform").value, date, $("#planStatus").value);
    $("#planForm").reset();
    $("#planDate").value = new Date().toISOString().slice(0, 10);
    showToast("Rencana konten ditambahkan.");
  });
  $("#plannerList").addEventListener("change", event => {
    const select = event.target.closest("[data-plan-status]");
    if (!select) return;
    const plan = plans.find(item => item.id === select.dataset.planStatus);
    if (plan) {
      plan.status = select.value;
      persist();
      renderPlans();
      showToast("Status rencana diperbarui.");
    }
  });
  $("#plannerList").addEventListener("click", event => {
    const button = event.target.closest("[data-delete-plan]");
    if (!button) return;
    const plan = plans.find(item => item.id === button.dataset.deletePlan);
    if (plan && window.confirm(`Hapus rencana "${plan.title}"?`)) {
      plans = plans.filter(item => item.id !== plan.id);
      persist();
      renderPlans();
      showToast("Rencana dihapus.");
    }
  });
  $("#exportPlans").addEventListener("click", () => downloadCSV("kontenin-rencana.csv", [["Judul", "Platform", "Tanggal", "Status"], ...plans.map(p => [p.title, p.platform, p.date, p.status])]));

  // Saved library
  $("#savedSearch").addEventListener("input", renderSaved);
  $("#savedResults").addEventListener("click", event => {
    const deleteButton = event.target.closest("[data-delete-saved]");
    const planButton = event.target.closest("[data-plan-idea]");
    if (deleteButton) {
      const item = savedItems.find(saved => saved.id === deleteButton.dataset.deleteSaved);
      if (item && window.confirm(`Hapus "${item.title}" dari koleksi?`)) {
        savedItems = savedItems.filter(saved => saved.id !== item.id);
        persist();
        renderSaved();
        showToast("Ide dihapus dari koleksi.");
      }
    }
    if (planButton) {
      const item = savedItems.find(saved => saved.id === planButton.dataset.planIdea);
      if (!item) return;
      $("#planTitle").value = item.title;
      $("#planPlatform").value = item.platform || "TikTok";
      $("#planDate").value = new Date().toISOString().slice(0, 10);
      goTo("planner");
      showToast("Ide dimasukkan ke formulir jadwal.");
    }
  });
  $("#exportSaved").addEventListener("click", () => downloadCSV("kontenin-ide-tersimpan.csv", [["Judul", "Deskripsi", "Kategori", "Platform"], ...savedItems.map(item => [item.title, item.description, item.categoryName, item.platform || ""])]));

  // First render
  generateIdeas();
  updateStats();
  renderPlans();
  renderSaved();
})();
