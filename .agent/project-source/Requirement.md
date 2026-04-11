# Tech Stack & Project Requirements

**Proyek:** LockIn (CC26-PS118)

Berikut adalah daftar kebutuhan sumber daya teknologi, basis data, dan landasan teoritis yang digunakan dalam pengembangan platform LockIn:

## 1. Bahasa Pemrograman

- **TypeScript (React):** Bahasa utama yang menjamin _type safety_ dan meminimalisir _bug_ saat integrasi sistem _Frontend_ dan _Backend_.

## 2. Framework & Library Frontend

- **Next.js:** _Framework_ utama (App Router) untuk membangun arsitektur antarmuka yang cepat dan responsif.
- **Tailwind CSS & Shadcn UI:** Sistem _styling_ dan pustaka komponen untuk mendesain UI/UX secara efisien dan konsisten.
- **Lenis:** Pustaka _smooth scrolling_ khusus untuk optimasi visual di halaman _Landing Page_.
- **Slate.js:** _Framework rich-text editor_ untuk membangun fitur _Notes_ interaktif.
- **React Big Calendar:** _Library_ kalender utama untuk merender "Kalender Terpusat" yang _developer-friendly_.

## 3. Database & Cloud Backend

- **Supabase:** Ekosistem _Backend-as-a-Service_ (BaaS) yang menyediakan fitur _Authentication_ dan _Storage_.
- **PostgreSQL:** Sistem manajemen basis data relasional (_database_) utama yang disediakan oleh Supabase.

## 4. API & AI (Kecerdasan Buatan)

- **OpenRouter API:** Bertindak sebagai _gateway_ utama untuk memanggil model LLM secara efisien.
  - **`google/gemini-2.0-flash-lite-001`:** Model AI untuk memproses input teks ringan, merangkum catatan pendek, dan _generate_ Flashcard.
  - **`Gemini 2.5 Flash (Multimodal)`:** Model mutakhir untuk mengeksekusi _Speech-to-Text_ (transkripsi) dari rekaman audio _meeting_ dan merangkum hasilnya.

## 5. Dataset & Testing

- **Faker.js:** _Library_ untuk men-_generate_ _dummy dataset_ (data jadwal, profil, tugas) guna keperluan pengujian (_load testing_) dan _mockup_ UI.

## 6. Source Idea & Referensi Teoritis

- **Harvard Business Review (HBR):** Artikel terkait _Context Switching_ ("Pekerja/mahasiswa kehilangan hingga 20% produktivitas") sebagai landasan utama fitur _All-in-One Workspace_.
- **Eisenhower Matrix & Time-Blocking:** Referensi teknik manajemen waktu untuk parameter penentuan _deadline_ pada fitur manajemen proyek.
- **Active Recall & Spaced Repetition:** Teori psikologi pendidikan sebagai landasan _prompt_ AI pada fitur Flashcard.
- **Jurnal NLP (ACL / IEEE):** Landasan teknis (_Large Language Models_) untuk legitimasi penggunaan API perangkum catatan dari OpenRouter.
