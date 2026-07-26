# 📌 BREAFING PLANING LOCKIN PROJECT — 100% MASTER SPECIFICATION & AGREEMENTS

> **Status**: APPROVED & LOCKED (Ready for Execution)  
> **Target Deadline**: Minggu Malam, 26 Juli 2026  
> **Deployment Target**: Cloudflare Pages (`lockin.pages.dev` — 100% Gratis)  
> **Working Directory**: `D:\lockincapstone\lockin`  

---

## 🎯 1. PROJECT OVERVIEW & UTAMA GOAL

Menggabungkan aplikasi **HR Task Manager** (`D:\lockincapstone\wordpress-miniproject\hr-task-manager`) ke dalam repositori utama **LockIn** (`D:\lockincapstone\lockin`), menggunakan **LockIn Supabase Database** (`pbbnhgjftmktxhjemrih`) sebagai *single source of truth*.

**Aturan Kritis (Non-Negotiable)**:
1. **Landing Page LockIn (`app/page.tsx`) 100% DIJAGA**: DILARANG merubah, mengedit, atau menyentuh kode landing page asli LockIn.
2. **Standardisasi Nama Produk**: Di Product Hunt & LinkedIn, produk dinamai **"LockIn — AI-Powered Task Management Platform"** (tanpa kata "HR").
3. **Target Launch**: Product Hunt & LinkedIn Launch pada **Minggu malam, 26 Juli 2026**.

---

## 📂 2. DEEP TECHNICAL & ARCHITECTURAL SPECIFICATIONS

### A. Repository & Route Preservation
- **Target Repo**: `D:\lockincapstone\lockin`
- **Landing Page**: `app/page.tsx` & komponen di `components/` tidak boleh tersentuh.
- **Middleware Update (`src/middleware.ts`)**: Route `/`, `/contact`, `/feature`, `/robots.txt`, `/sitemap.xml` bisa diakses publik tanpa login. Route `/[workspaceSlug]/` wajib terproteksi Supabase Auth.

### B. Database & Prisma 7 Compatibility (KRITIS!)
- **Primary Database**: Supabase LockIn (`pbbnhgjftmktxhjemrih` - ACTIVE_HEALTHY).
- **Prisma Version Mismatch Solution**:
  - LockIn menggunakan **Prisma 7 CLI** (`@prisma/client@7.4.2`).
  - ATURAN PRISMA 7: `url` dan `directUrl` **DILARANG ADAPUN** di dalam `prisma/schema.prisma`.
  - Semua URL koneksi dikelola secara eksklusif oleh `prisma.config.ts`.
- **Merged Prisma Schema (`prisma/schema.merged.prisma`)**:
  - Menyediakan seluruh tabel LockIn (`User`, `Project`, `Task`, `Workspace`, `Note`, `Chat`, dll).
  - Menyediakan seluruh tabel HR Task Manager dengan prefix `HR` (`HRProfile`, `HRWorkspace`, `HRTask`, `HRTaskComment`, `HRActivityLog`, dll).
  - Menyediakan tabel AI Meeting Extensions (`ClientProfile`, `MeetingSession`, `PreMeetingPrep`, `MeetingTranscript`, `GeneratedInvoice`, `GeneratedEmail`, `RecipeTemplate`, `WorkspaceAgentLog`).

---

## 🤖 3. AI AUTONOMOUS WORKSPACE AGENT (GEMINI FUNCTION CALLING)

Gemini bukan sekadar AI Chat pasif, melainkan **AUTONOMOUS WORKSPACE OPERATOR** via Tool/Function Calling:
- *"Gemini, ubah semua task high priority dari meeting ini ke Budi dan set deadline ke Selasa depan."* → Ter-eksekusi otomatis di DB!
- *"Gemini, buatkan Project baru 'Client Onboarding' dan buat 5 subtask dari note ini."* → Ter-eksekusi otomatis di DB!
- *"Gemini, bersihkan tugas yang sudah selesai lebih dari 30 hari."* → Ter-eksekusi otomatis di DB!

---

## 🎙️ 4. AI MEETING NOTES (GRANOLA-LIKE END-TO-END LIFECYCLE)

### A. Non-Intrusive Audio Capture (No Bot)
- Audio ditangkap dari tingkat sistem/browser (`getDisplayMedia` mic + system audio).
- Tidak ada bot pengganggu yang masuk ke Zoom/Meet/Teams.

### B. Cakupan 4 Fase Meeting Complete:
1. **Before Meeting**: 
   - AI mendeteksi riwayat klien (`client_profiles`) & meeting sebelumnya.
   - 1-klik menyusun **Agenda & Talking Points** otomatis (`pre_meeting_preps`).
2. **During Meeting**:
   - Live Audio Stream, Visual Waveform visualizer real-time.
   - Audio Chunking per 30 detik (anti-crash).
   - Verbatim Transcripts real-time.
3. **After Meeting (Zero-Friction Admin)**:
   - **Verbatim-First**: Transkrip utuh 100% tersimpan untuk dibaca & diverifikasi sebelum AI summary.
   - **Direct Task Execution**: Highlight kalimat di transkrip → 1-klik ubah jadi Live Task di Kanban Board LockIn (`hr_tasks`).
   - **Invoice Auto-Generator**: Deteksi obrolan harga → 1-klik buat PDF Invoice resmi (`generated_invoices`).
   - **Client Email Follow-Up**: 1-klik susun & kirim email rangkuman via Nodemailer (`GMAIL_USER` & `GMAIL_APP_PASSWORD`).
   - **Multi-Platform Distribution**: 1-klik sync hasil meeting ke **Notion** via `@notionhq/client` SDK (`notion_sync_logs`), Slack, atau Google Docs/PDF.
4. **Across Meetings**:
   - AI Assistant yang dapat di-query untuk melacak riwayat keputusan antar-meeting, deal pipeline, dan to-do list mingguan.

---

## 🏪 5. GRANOLA RECIPE MARKETPLACE FORUM & AUTO-CRM DIRECTORY

### A. Recipe Marketplace Forum (`app/recipes/`)
- Forum terbuka tempat pengguna bisa browsing, download, create, dan share Recipe/Template AI.
- **Featured Expert Recipes**: Template ternama (Lenny Rachitsky PRD, YC Pitch Discovery Call, Sales Objection Handling, 1-on-1 Feedback).
- **Kategori**: Before Meeting, During Meeting, After Meeting, Across Meetings, Product Management, Sales, Engineering.
- **Social Features**: Upvotes, forks, shareable recipe link.

### B. People & Companies Auto-CRM Directory (`app/directory/`)
- Otomatis membuat profil untuk setiap Orang & Perusahaan yang ditemui di meeting/kalender.
- Klik "Perusahaan: Acme Corp" → Lihat linimasa meeting, transkrip, total invoice revenue, stakeholder kunci, dan tugas aktif.

---

## ⚡ 6. SPEECH-TO-TEXT & LLM ENGINE SELECTION

### A. STT Audio Engine (Audio → Text & Multi-Tier Scale Protection):
- **Primary**: **Deepgram Nova-3 API** ($200 Credit Gratis = ~45.000 menit / 750 jam meeting gratis! Akurasi 98%+, speaker diarization, Bahasa Indonesia & Inggris).
- **Automated Edge Fallback**: **Cloudflare Workers AI (`whisper-large-v3-turbo`)** (10.000 Neuron/hari = ~214 menit/hari gratis di Cloudflare Pages, reset setiap hari).
- **Automated Client Fallback**: **In-Browser Transformers.js / WebGPU Whisper** (0 biaya server, 100% private, unlimited minutes running directly in user's browser).
- **Optional BYOK**: Power users can enter their own Deepgram/OpenAI API key in Settings.
- **Skalabilitas Traffic Publik**: Jika kuota $200 Deepgram habis akibat lonjakan ribuan user publik, sistem **otomatis berpindah ke Cloudflare AI / In-Browser Whisper tanpa pernah mengalami downtime atau teks terputus!**

### B. LLM Engine (Brain — Rangkuman, Invoice, Email, Task, Workspace Execution):
- **Primary**: **Google Gemini 3.6 Flash / 3.5 Flash** (`GEMINI_API_KEY` di `.env`, 100% GRATIS, Context Window 1 Juta Token, Structured JSON Mode & Function Calling).
- **5-Layer Fallback Chain**:
  `Gemini 3.6 Flash` → `Gemini 3.5 Flash` → `Gemini 3.5 Flash-Lite` → `Gemini 3.1 Pro` → `Groq Llama-3.3-70B` / Open-Source AI.

### C. Minimal 1-Time Setup Concept:
- Pengguna hanya perlu melakukan **Setup 1-Kali di Awal** (menghubungkan Google Calendar, Notion OAuth, dan Email Nodemailer di menu Settings).
- Setelah setup 1-kali ini selesai, seluruh workflow AI Autonomous Workspace dan Meeting Lifecycle berjalan **100% otonom**.

---

## 🛡️ 7. PERFORMANCE, RELIABILITY & UX ARCHITECTURE

1. **Dual-Layer State Architecture (Zero-Lag UI)**:
   - *Layer 1 (0ms Instant)*: Browser terima chunk audio 30s → transkrip → LANGSUNG update React UI state & save ke `IndexedDB` dalam 0ms. User merasakan aplikasi super cepat tanpa delay!
   - *Layer 2 (Background Sync)*: Data di-sync ke Supabase DB secara silent tiap 2-3 menit via background worker tanpa menggangu kecepatan layar.
2. **Auto Crash Recovery**: Save lokal `IndexedDB` per detik. Jika browser terdeteksi crash/ditutup, user dapat me-restore 100% catatan saat halaman dibuka kembali.
3. **Chrome Energy Saver Protection**: Menggunakan `Page Visibility API` + `Screen Wake Lock API` agar tab LockIn tidak di-suspend Chrome saat meeting 2 jam.

---

## 🌐 8. HOSTING & DEPLOYMENT (CLOUDFLARE PAGES)

- **Platform**: Cloudflare Pages (100% GRATIS, unlimited bandwidth, 500 build/bulan, 300+ edge PoP global, DDoS protection, DNS & domain management).
- **Files Config**: `wrangler.toml`, script `build:cf` di `package.json`, `@cloudflare/next-on-pages`.

---

## 📢 9. LINKEDIN NARRATIVE (BERBASIS DATA REAL INDUSTRI)

```markdown
Mengapa Kami Membangun LockIn di Tengah Pasar Productivity Tools yang Sudah Jenuh?

Ketika pasar dipenuhi platform besar seperti Notion, Asana, hingga Granola, pertanyaan utamanya adalah: *Masalah mana di sepanjang alur meeting yang belum benar-benar terselesaikan?*

Berdasarkan fakta dan riset di lapangan, hambatan utama tim terjadi di seluruh fase siklus meeting (Before, During, After, & Across Meetings):

1️⃣ BEFORE MEETING: Masuk Pertemuan Tanpa Konteks
Banyak profesional masuk ke sesi meeting tanpa agenda terstruktur atau lupa riwayat kesepakatan dengan klien dari sesi 3 minggu lalu, sehingga membuang waktu di awal sesi.

2️⃣ DURING MEETING: Dilema Antara Mendengar vs Mencatat
Pengguna sering kali harus memilih: fokus mendengarkan klien atau panik mencatat detail teknis agar tidak lupa.

3️⃣ AFTER MEETING: Beban Admin Post-Meeting yang Sangat Menyita Waktu
Ini adalah friksi terbesar. Setelah meeting selesai, pekerja masih harus membuang waktu 30-60 menit untuk:
• Menyusun ulang kata-kata dari rangkuman AI agar layak diubah menjadi Tugas/PRD.
• Membuat invoice atau draft proposal secara manual berdasarkan kesepakatan harga di meeting.
• Mengetik ulang email follow-up resmi ke klien atau meng-sync catatan ke Notion/Slack.

4️⃣ ACROSS MEETINGS: Terisolasinya Riwayat Keputusan
Setelah puluhan meeting dengan berbagai klien, pelacakan riwayat kesepakatan, deal pipeline, dan sisa to-do list menjadi berantakan karena tersebar di berbagai tempat.

---

🛠️ Solusi Terintegrasi di LockIn (End-to-End Meeting Lifecycle):

LockIn tidak sekadar mencatat, melainkan menyediakan ekosistem AI Recipes & Direct Execution untuk setiap fase:

• 📋 Before Meeting: Template AI otomatis untuk menyiapkan agenda, brief klien, dan menarik riwayat konteks dari meeting sebelumnya.
• 🎙️ During Meeting: Merekam audio secara non-intrusif dari tingkat sistem (tanpa bot pengganggu) dengan visual gelombang suara real-time.
• 📜 After Meeting (Zero-Friction Admin): 
  - Verbatim-First: Transkrip utuh 100% tersimpan untuk verifikasi kebenaran percakapan.
  - Smart AI Recipes: 1-klik untuk generate Invoice draft, Email follow-up resmi, atau menyusun PRD.
  - Direct Task Execution: Highlight kalimat apa saja → ubah langsung jadi Live Task di Kanban Board LockIn.
  - Multi-Platform Sync: 1-klik sync hasil meeting & tugas ke Notion atau kirim ke Slack.
• 📊 Across Meetings: AI Assistant yang dapat di-query untuk melacak riwayat keputusan antar-meeting, deal pipeline, dan to-do list mingguan.

---

LockIn dibangun untuk memangkas beban administrasi post-meeting dan menghadirkan alur kerja yang tenang, terstruktur, dan berfokus pada eksekusi nyata.

#Productivity #BuildInPublic #SaaS #AI #Nextjs #ProductHunt #ProductDesign #GranolaAI
```

---

## 📅 10. HOUR-BY-HOUR EXECUTION ROADMAP (Jumat – Minggu)

- **Jumat (Hari 1)**: Phase 0 & Phase 1 — Merge Prisma 7 Schema (`schema.merged.prisma`), Copy Task Manager routes, Fix Middleware, Initial Cloudflare Deploy.
- **Sabtu (Hari 2)**: Phase 2 & Phase 3 — AI Meeting Engine (Audio Chunking 30s, Deepgram Nova-3, Dual-Pane UI, 1-Click Task Creation, Autonomous Gemini Workspace Agent).
- **Minggu (Hari 3)**: Phase 4, 5, & Launch — Recipe Forum Marketplace, People & Companies Auto-CRM, Invoice Generator, Email Nodemailer, Notion 1-Click Sync, E2E Test Verification, Product Hunt & LinkedIn Launch!
