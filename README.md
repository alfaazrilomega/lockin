# 🚀 LockIn: All-in-One Productivity & Adaptive Learning Workspace

[![Next.js](https://img.shields.io/badge/Next.js-16+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Dicoding](https://img.shields.io/badge/Capstone-Dicoding_CC26--PS118-gray?style=for-the-badge)](#)

> **LockIn** adalah platform produktivitas web yang menggabungkan penjadwalan, kolaborasi tim, dan pencatatan berbasis *Speech-to-Text* dengan kecerdasan buatan. Aplikasi ini dirancang untuk memecahkan masalah fragmentasi informasi dengan mengintegrasikan seluruh alur kerja produktivitas (pencatatan, penjadwalan, dan pembelajaran adaptif) ke dalam satu ruang kerja digital yang premium.

---

## 🛠️ Petunjuk Setup Environment

Ikuti langkah-langkah di bawah ini untuk menyiapkan lingkungan pengembangan lokal Anda:

### 1. Prasyarat
- Node.js versi 20.x atau lebih baru.
- Akun [Supabase](https://supabase.com/) untuk database dan autentikasi.
- API Key dari [OpenRouter](https://openrouter.ai/) atau Google Gemini.

### 2. Konfigurasi Variabel Lingkungan
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Isi variabel-variabel di dalam `.env` dengan kredensial Anda (Database URL, Supabase Keys, API AI, dll.).

### 3. Instalasi Dependensi
```bash
npm install
```

### 4. Konfigurasi Database (Prisma)
Jalankan perintah berikut untuk menghasilkan client Prisma dan menyinkronkan skema ke database Anda:
```bash
npx prisma generate
npx prisma db push
```

---

## 🤖 Cara Menjalankan Aplikasi

### Mode Pengembangan (Development)
Jalankan server pengembangan lokal:
```bash
npm run dev
```
Akses aplikasi melalui browser di [http://localhost:3001](http://localhost:3001).

### Mode Produksi (Build & Start)
Untuk menjalankan aplikasi dalam lingkungan produksi:
```bash
npm run build
npm run start
```

---

## 🧠 Model Machine Learning (ML)
LockIn mengadopsi arsitektur **Hybrid Cloud AI**. Aplikasi ini tidak memerlukan pengunduhan bobot model (weights) lokal yang besar, melainkan berinteraksi dengan model state-of-the-art melalui API:

- **Cognitive Engine:** Menggunakan API **OpenRouter** (dengan model seperti `openrouter/free`) untuk proses perangkuman rapat dan pembuatan kartu belajar (*flashcard*) secara otomatis.
- **Transkripsi:** Menggunakan **Groq AI (Whisper-large-v3)** untuk mengubah rekaman suara menjadi teks secara *real-time* dengan performa tinggi dan latensi rendah.

---

## 🦾 Ekosistem AI Agent (Submission Metadata)
Proyek ini dibangun menggunakan metodologi **Agent-First Development**. Seluruh proses pengembangan diarahkan oleh orkestrator kecerdasan buatan yang menyimpan context dan logikanya di dalam repositori ini.

Folder metadata berikut disertakan sesuai dengan persyaratan penugasan:
- **`.agent/` & `.agents/`**: Berisi "Skills" dan internal rules yang melatih asisten AI (Antigravity) untuk memahami domain proyek.
- **`everything-claude-code/`**: Matriks logika ECC untuk otomasi workflow developer.
- **`.antigravity-agents.md`**: Master Reference yang mendikte persona dan protokol operasional seluruh sub-agent AI.
- **`.cursorrules`**: File jembatan untuk memastikan inspektur atau asisten AI lainnya dapat langsung memuat seluruh konteks proyek secara instan.

---

## ✨ Fitur Utama
1. **🗓️ Kalender Terpusat:** Sinkronisasi tenggat waktu proyek, jadwal meeting, dan review flashcard.
2. **📝 Smart Notes & AI Transcript:** Editor rich-text terintegrasi dengan perekam suara dan transkripsi **Groq Whisper**.
3. **📊 Manajemen Proyek:** Pelacak progress proyek real-time dengan status indikator visual.
4. **🧠 Flashcard Interaktif:** Sistem pembelajaran adaptif menggunakan algoritma *Spaced Repetition*.

---

## 🛠️ Stack Teknologi
- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS, Shadcn UI.
- **Backend:** Supabase (Database, Auth, Storage).
- **ORM:** Prisma.
- **AI Integrations:** **Groq API** (Transcription), **OpenRouter API** (LLM).
- **Performance:** GPU-Accelerated CSS (Zero Framer Motion/WebGL policy).

---

## 🛠️ Arsitektur Teknologi & Tech Stack

Proyek ini dibangun dengan penekanan ekstrim pada **Performa, Zero-Latency, dan DX (Developer Experience)**.

### Core Stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS, Shadcn UI.
- **Backend & Database:** Supabase (PostgreSQL, Auth, Storage).
- **ORM:** Prisma Client.
- **AI Aggregator:** OpenRouter API (`minimax/minimax-m2.5:free` & `Groq Whisper-large-v3`).
- **Micro-Libraries:** React Big Calendar, Slate.js, Lenis (Khusus Landing Page).

### ⚡ Filosofi Performa (Wajib Dibaca oleh Tim Dev)

Untuk menjaga skor _Interaction to Next Paint_ (INP) tetap sempurna di bawah 200ms, tim sepakat menerapkan aturan berikut:

1. **NO Heavy JS Animations:** Dilarang menggunakan Framer Motion, WebGL, atau 3D Canvas di dalam Dashboard.
2. **GPU Acceleration Only:** Animasi _modal/popover_ HANYA boleh menggunakan CSS `transform` dan `opacity` (via `tailwindcss-animate`).
3. **Instant Navigation:** Mengandalkan _View Transitions API_ dan _Speculation Rules API_ untuk perpindahan antar halaman tanpa _loading screen_.

---

## 🤖 Panduan Multi-Agent AI (Skills Directory)

Proyek ini mengadopsi alur kerja **AI-Assisted Development**. Jika Anda menggunakan Cursor, Copilot, atau Claude, AI diwajibkan untuk membaca direktori `skills/` sebelum menulis kode.

**Struktur `skills/` yang tersedia:**

- `planning-mode.md` - Arsitektur & Edge Cases.
- `shadcn-ui.md` & `react-components.md` - Standar UI dan Next.js Server Components.
- `theme-factory.md` - Panduan CSS Variable (Notion-like Theme).
- `enhance-prompt.md` - Standar prompt API LLM.

(Note: Baca file `RULES.md` dan `design-system.md` untuk aturan main selengkapnya).

---
