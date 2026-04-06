This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# 🚀 LockIn: All-in-One Productivity & Adaptive Learning Workspace

[![Next.js](https://img.shields.io/badge/Next.js-16+-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Dicoding](https://img.shields.io/badge/Capstone-Dicoding_CC26--PS118-gray?style=for-the-badge)](#)

> **LockIn** adalah platform produktivitas web yang memecahkan masalah disorganisasi dengan menggabungkan penjadwalan, kolaborasi tim, dan pencatatan berbasis _Speech-to-Text_. Dilengkapi AI perangkum rapat dan pembuat _flashcard_ otomatis, aplikasi ini memastikan penggunanya dapat bekerja dan belajar dengan efisiensi maksimal.

---

## 📖 Latar Belakang (The Problem)

Mengatur prioritas seringkali menuntut pembagian fokus yang ketat. Mahasiswa, pekerja magang, _freelancer_, hingga pemilik bisnis seringkali terjebak dalam masalah **Fragmentasi Informasi** (Context Switching). Mereka harus melompat antara aplikasi kalender, aplikasi _to-do list_, dan aplikasi pencatat _meeting_. Hal ini menghambat produktivitas hingga 20%, memicu miskomunikasi, dan menunda pencapaian target.

## 💡 Solusi (The LockIn Way)

LockIn hadir sebagai ruang kerja digital terpadu (_All-in-One Workspace_) untuk mengeksekusi proyek dan pembagian waktu agar lebih terstruktur dan transparan.

### ✨ Fitur Utama

1. **🗓️ Kalender Terpusat (The Core):** Jantung utama aplikasi yang menyinkronkan seluruh tenggat waktu proyek, jadwal _meeting_, dan jadwal _review flashcard_ dalam satu tampilan komprehensif.
2. **📝 Smart Notes & AI Transcript:** Editor _rich-text_ (berbasis Slate.js) yang terintegrasi dengan perekam suara. Audio rapat akan otomatis ditranskripsi dan dirangkum menjadi _action items_ menggunakan AI (Gemini 2.5 Flash).
3. **📊 Manajemen Proyek Holistik:** Melacak proyek secara _real-time_ menggunakan indikator persentase (0-100%). Mendukung penugasan spesifik per _role_ dan _deadline_ individu.
4. **🧠 Flashcard Interaktif (Adaptive Learning):** Mengubah teks catatan panjang menjadi kartu pintar secara otomatis menggunakan AI. Dilengkapi algoritma _Spaced Repetition_ untuk memaksimalkan retensi memori belajar.

---

## 🛠️ Arsitektur Teknologi & Tech Stack

Proyek ini dibangun dengan penekanan ekstrim pada **Performa, Zero-Latency, dan DX (Developer Experience)**.

### Core Stack

- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS, Shadcn UI.
- **Backend & Database:** Supabase (PostgreSQL, Auth, Storage).
- **ORM:** Prisma Client.
- **AI Aggregator:** OpenRouter API (`minimax/minimax-m2.5:free` & `Gemini 2.5 Flash Multimodal`).
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
