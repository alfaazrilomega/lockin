# Dokumen Project Plan

**Coding Camp 2026 powered by DBS Foundation**

**ID Tim Capstone Project:** CC26-PS118
**Tema Capstone:** Accessible & Adaptive Learning
**Nama/Judul Proyek:** LockIn

**List Anggota:**

1. (CFS015D6Y085) - Redho Rizkiansyah - Full Stack - **[Aktif]**
2. (CFS234D6X204) - Gwen Dwi Widya Putri - Full Stack - **[Aktif]**
3. (CFS149D6Y599) - R. Achmad Fadhil I’Tishom - Full Stack - **[Aktif]**
4. (CFS058D6Y016) - Azril Al Fajri - Full Stack - **[Aktif]**
5. (CFS058D6X031) - Althafa Ulya Rohani - Full Stack - **[Aktif]**

---

## A. Ringkasan Eksekutif: LockIn Tim CC26-PS118

**Latar Belakang:** Mengatur prioritas pekerjaan seringkali menuntut pembagian fokus yang ketat dan memakan banyak waktu, terutama bagi siswa, mahasiswa, pekerja magang, _freelancer_, hingga pemilik bisnis yang menangani proyek berskala besar. Target pengguna ini seringkali kesulitan melakukan manajemen waktu dan manajemen proyek secara bersamaan. Saat ini, banyak perusahaan dan individu menggunakan aplikasi yang terpisah untuk mencatat _meeting_, melacak tugas, dan mengatur jadwal harian. Hal ini menimbulkan masalah fragmentasi informasi yang menghambat produktivitas, memicu miskomunikasi, dan membuat target sulit tercapai.

**Problem Statement:** Bagaimana kita bisa mengembangkan platform manajemen kerja terpusat yang secara efektif mengatasi masalah fragmentasi informasi dan inefisiensi alur kerja, sehingga eksekusi proyek dan pembagian waktu menjadi terstruktur dan transparan bagi individu maupun tim dalam perusahaan?

**Research Questions:**

1. Bagaimana mekanisme pelacakan _real-time_ berbasis persentase capaian proyek dan penentuan _deadline_ spesifik per _role_ dapat diimplementasikan untuk secara terukur menekan angka penundaan tugas?
2. Sejauh mana sinkronisasi otomatis antara pembagian peran (_role_), tenggat waktu (_deadline_), dan kalender utama dapat meminimalisir keterlambatan dan meningkatkan pencapaian proyek?

**Mengapa Kami Memilih Proyek Ini:** Alih-alih sekadar membuat aplikasi pencatat biasa, tim kami memilih untuk membangun **LockIn**, sebuah platform web komprehensif yang berfungsi sebagai ruang kerja digital terpadu. Proyek ini adalah solusi untuk efisiensi waktu dan manajemen proyek dalam tim. LockIn menawarkan integrasi fitur yang langsung menyelesaikan kendala operasional harian:

- **Kalender Terpusat:** Menjadi fitur utama yang menyambungkan seluruh aktivitas dan tenggat waktu pengguna ke dalam satu tampilan utuh.
- **Notes Meeting & Perangkum:** Menyediakan perekaman _meeting_ yang langsung ditranskripsi menjadi teks, memastikan tidak ada poin penting perusahaan yang terlewat. Platform ini juga berfungsi sebagai perangkum materi dan catatan.
- **Manajemen Proyek Holistik:** Menyediakan indikator persentase untuk memantau capaian proyek secara _real-time_, lengkap dengan pengaturan _deadline_ dan pembagian tugas yang spesifik untuk tiap anggota tim.
- **Flashcard Interaktif:** Membantu proses pembelajaran pengguna dengan mengambil data langsung dari catatan materi yang telah mereka buat.

Dengan LockIn, pengguna tidak perlu lagi berpindah-pindah aplikasi; semua kebutuhan dari perencanaan hingga eksekusi terselesaikan di satu tempat.

---

## B. Cakupan Proyek dan Hasil Kerja

**1. Garis Besar Batas-Batas Proyek dan Tanggung Jawab Tim** Proyek LockIn dibatasi pada pengembangan aplikasi web responsif yang berfokus pada integrasi empat fitur utama: kalender terpusat, manajemen proyek (_role_ & _deadline_), _notes_ (beserta _record transcript_), dan _flashcard_ pembelajaran. Cakupan tanggung jawab dibagi secara spesifik kepada setiap anggota tim:

- **Azril Al Fajri (Team Leader):** Merangkap sebagai Project Manager, Frontend, dan Backend. Bertanggung jawab memimpin arah arsitektur proyek, mengeksekusi antarmuka UI interaktif (Frontend), serta mengatur logika integrasi sistem dengan Backend.
- **R. Achmad Fadhil I’Tishom:** Project Manager dan UI/UX. Bertugas merancang pengalaman dan antarmuka pengguna (_wireframe_ & _prototyping_), serta mengelola kelengkapan dokumen manajerial proyek.
- **Gwen Dwi Widya Putri:** Project Manager dan UI/UX. Mendukung riset desain, pembuatan aset komponen visual, dan memastikan jadwal/milestone tim terpenuhi.
- **Althafa Ulya Rohani:** Backend. Fokus merancang arsitektur database (ERD), membuat API _endpoints_ untuk fitur inti (kalender, tugas, _notes_), dan mengelola _server-side_.
- **Redho Rizkiansyah:** Frontend / QA. Membantu implementasi kode antarmuka (_slicing_ UI) dan melakukan pengujian fungsionalitas (_testing_) aplikasi sebelum rilis.

**2. Cakupan Proyek dan Milestone (Estimasi 5 Minggu)** Untuk memastikan proyek dapat di-_delivery_ tepat waktu, tim menggunakan kerangka kerja mingguan (_weekly milestone_) selama 5 minggu pengerjaan:

- **Minggu 1 (Perencanaan & Desain):** Riset alur pengguna, penyelesaian _High-Fidelity_ UI/UX Design, perancangan _database_, dan inisialisasi _repository_ proyek.
- **Minggu 2 (Pengembangan Dasar):** _Slicing_ desain menjadi kode Frontend untuk halaman utama dan _dashboard_. Di saat bersamaan, Backend menyelesaikan sistem _Authentication_ dan API CRUD dasar untuk manajemen tugas.
- **Minggu 3 (Integrasi Fitur Inti):** Menyambungkan Frontend dan Backend untuk fitur Kalender Terpusat dan Manajemen Proyek (persentase capaian & pengaturan _deadline_ per _role_).
- **Minggu 4 (Pengembangan Fitur Lanjutan):** Implementasi fitur Notes (termasuk fungsi transkripsi) dan sinkronisasi data catatan materi untuk generator _Flashcard_ interaktif.
- **Minggu 5 (Pengujian & Finalisasi):** Melakukan _usability testing_ internal, perbaikan _bug_ (_bug fixing_), optimasi performa, dan _deployment_ aplikasi ke _cloud server_ untuk presentasi akhir.

---

## C. Jadwal Pengerjaan

| Pekan | Tanggal            | Kegiatan                                                                                                                          | Output                                              |
| :---: | :----------------- | :-------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------- |
| **1** | 8 - 14 Maret       | **Fase Perencanaan & Riset:** Finalisasi _User Flow_, pembuatan _Wireframe_ di Figma, dan riset teknologi API AI untuk rangkuman. | _Flowchart_, _User Flow_, dan Desain UI/UX selesai. |
| **2** | 15 - 21 Maret      | **Fase Development I (Core):** Setup _database_ dan pembuatan fitur manajemen tugas (_To-Do List_) serta kalender dasar.          | Struktur _database_ siap dan fitur tugas berfungsi. |
| **3** | 22 - 28 Maret      | **Fase Development II (AI Features):** Integrasi API untuk fitur _Notes_ dan pengaktifan sistem perangkum otomatis.               | Fitur catatan dengan bantuan AI selesai.            |
| **4** | 29 Maret - 4 April | **Fase Development III (Adaptive Learning):** Pengembangan fitur Flashcards berdasarkan data dari rangkuman catatan.              | Sistem belajar Flashcard terintegrasi.              |
| **5** | 5 - 12 April       | **Fase Finishing & Submission:** _Bug fixing_, pengujian aplikasi secara menyeluruh, dan pembuatan video demo proyek.             | Aplikasi Live dan seluruh berkas siap kumpul.       |

---

## D. Uraian Rencana Penugasan/Job Desk Setiap Learning Path

Seluruh anggota tim CC26-PS118 terdaftar dalam _learning path_ **Full Stack**. Oleh karena itu, rencana penugasan difokuskan pada pembagian eksekusi proyek dari _end-to-end_, mulai dari perancangan antarmuka, pengembangan sisi klien (_frontend_), hingga pengelolaan basis data dan _server_ (_backend_). Untuk memaksimalkan efisiensi pengerjaan dalam waktu 5 minggu, implementasi _learning path_ Full Stack ini diuraikan ke dalam spesialisasi penugasan berikut:

- **Azril Al Fajri (Full Stack — Team Leader, Project Manager, Frontend & Backend):** Mengaplikasikan keahlian _full stack_ secara menyeluruh dengan memimpin arah arsitektur sistem dan manajemen proyek. Bertanggung jawab mengeksekusi antarmuka UI interaktif (_Frontend_) secara cepat, mengatur logika integrasi sistem dengan Backend API, serta mengawasi keseluruhan siklus pengembangan agar sesuai dengan _timeline_.
- **R. Achmad Fadhil I’Tishom (Full Stack — Project Manager & UI/UX):** Memanfaatkan pemahaman teknis _frontend_ untuk memastikan desain yang dibuat dapat diimplementasikan ke dalam kode. Bertugas merancang pengalaman dan antarmuka pengguna (_wireframe_ & _prototyping_), serta mengelola kelengkapan dokumen manajerial proyek.
- **Gwen Dwi Widya Putri (Full Stack — Project Manager & UI/UX):** Mendukung dari sisi riset desain antarmuka berbasis kebutuhan teknis, pembuatan aset komponen visual, dan memastikan seluruh anggota tim memenuhi tenggat waktu (_milestone_) harian dan mingguan.
- **Althafa Ulya Rohani (Full Stack — Backend):** Mengimplementasikan keahlian sisi _server-side_ dari _learning path_ Full Stack. Berkolaborasi dalam perancangan arsitektur Backend, pembuatan dan optimalisasi API, pengelolaan _database_, serta memastikan alur logika data berjalan lancar dengan fokus pada fitur-fitur inti (seperti kalender, manajemen tugas, dan _notes_) dan juga beberapa fitur-fitur yang lebih kompleks.
- **Redho Rizkiansyah (Full Stack — Backend):** Mengimplementasikan keahlian pengembangan sisi _server-side_ secara spesifik. Bekerja sama secara erat dalam perancangan arsitektur Backend, pembuatan dan optimalisasi API, pengelolaan _database_, serta memastikan alur logika data berjalan lancar untuk mendukung integrasi fitur-fitur yang lebih kompleks pada aplikasi.

---

## E. Sumber Daya Proyek

**1. Bahasa Pemrograman**

- **TypeScript (React):** Bahasa pemrograman utama yang diimplementasikan di atas ekosistem React. Bertujuan untuk menjamin keamanan tipe data (_type safety_), meminimalisir _bug_ saat pengembangan lintas peran (Frontend & Backend), dan membuat struktur kode lebih mudah dimengerti.

**2. Framework & Library UI/UX (Frontend)**

- **Next.js (App Router):** _Framework_ utama untuk membangun arsitektur aplikasi berbasis React, menjamin _routing_ halaman yang cepat, dan mendukung pembuatan API internal yang efisien.
- **Tailwind CSS & Shadcn UI:** Digunakan sebagai sistem _styling_ dan pustaka komponen responsif untuk membangun antarmuka web (seperti _modal_, _progress bar_, _card_, dll) secara cepat, konsisten, dan berstandar profesional.
- **Lenis:** Pustaka _smooth scrolling_ yang hanya diaktifkan pada halaman _Landing Page_ untuk memberikan pengalaman visual interaktif yang premium (akan dinonaktifkan di dalam _dashboard_ agar navigasi produktivitas tetap instan).
- **React Big Calendar:** _Library_ kalender berbasis React yang sangat ramah _developer_ (_DX friendly_), digunakan untuk membangun fitur "Kalender Terpusat" yang ringan dan mudah disesuaikan dengan tema aplikasi.
- **Slate.js:** _Framework rich-text editor_ canggih yang memungkinkan tim membangun fitur pencatatan (_Notes_) interaktif yang dapat dimodifikasi secara mendalam sesuai kebutuhan ruang kerja aplikasi.

**3. Database, ORM, & Cloud Backend**

- **Supabase (PostgreSQL):** Berfungsi sebagai _Cloud Backend-as-a-Service_ (BaaS) utama. Menyediakan sistem manajemen basis data relasional (PostgreSQL) yang tangguh, sekaligus menangani _Authentication_ pengguna dan _Storage_ (untuk mengelola _file_ audio rekaman).
- **Prisma ORM:** _Object-Relational Mapper_ yang berfungsi sebagai jembatan penghubung yang aman dan terstruktur antara kode aplikasi Next.js dengan basis data di Supabase.

**4. API & Kecerdasan Buatan (AI)**

- **OpenRouter API:** Bertindak sebagai _gateway_ AI utama (_aggregator_ LLM) yang efisien secara biaya, memungkinkan aplikasi memanggil berbagai model AI sesuai tingkat kerumitan tugas:
  - **`google/gemini-2.0-flash-lite-001`:** Digunakan untuk eksekusi logika ringan yang membutuhkan respons sangat cepat, seperti memproses teks masukan pengguna, merangkum catatan pendek, dan menyusun teks Flashcard.
  - **`Gemini 2.5 Flash (Multimodal)`:** Digunakan khusus untuk fitur transkripsi berkinerja tinggi. Model ini memproses masukan _file_ rekaman rapat (_audio_), mengeksekusi _Speech-to-Text_, dan merangkum poin-poin penting (Notulensi) secara bersamaan tanpa bergantung pada batasan _browser_ pengguna.

**5. Dataset**

- **Faker.js (Mock Dataset):** Pustaka untuk men-_generate_ ribuan data buatan (_dummy data_) berbentuk profil pengguna, jadwal, dan catatan, yang berfungsi untuk pengujian beban sistem (_load testing_) dan tampilan antarmuka saat fase pengembangan.
- **Parameter AI Dataset:** Kumpulan data teks instruksional (berisi pedoman akademis manajemen waktu dan metode belajar) yang diintegrasikan langsung ke dalam _System Prompt_ AI untuk menjaga akurasi respons Flashcard dan pembagian tugas.

**6. Referensi Teoritis (Paper/Journals/Articles)**

- **Harvard Business Review (HBR) - _Context Switching_:** Artikel yang menyoroti bahwa pekerja/mahasiswa dapat kehilangan hingga 20% produktivitas akibat kelelahan berpindah antar aplikasi. Ini menjadi landasan teori urgensi pembuatan aplikasi "All-in-One Workspace".
- **Prinsip Manajemen Proyek (Agile/Scrum & Eisenhower Matrix):** Referensi literatur terkait _time-blocking_ dan prioritas tugas yang digunakan sebagai logika penentuan _deadline_ dan indikator metrik pada _dashboard_ manajemen proyek.
- **Jurnal Psikologi Pendidikan (_Active Recall & Spaced Repetition_):** Landasan sains kognitif yang disuntikkan sebagai parameter AI agar pertanyaan yang dihasilkan pada fitur Flashcard benar-benar optimal untuk meningkatkan retensi memori pengguna.
- **Jurnal NLP (_Natural Language Processing_) & LLM (ACL/IEEE):** Referensi teknis terkait kemampuan AI dalam ekstraksi informasi dan _Meeting Summarization_ untuk mendukung keabsahan penggunaan API OpenRouter dalam fitur transkrip pintar.

---

## F. Rencana Manajemen Risiko dan Isu

### 1. Analysis SWOT

**Strength (Kekuatan)**

- **Teknologi modern dan fleksibel:** Penggunaan _framework_ React memungkinkan pengembangan aplikasi yang responsif, modular, serta mudah dikembangkan di masa depan.
- **Integrasi fitur yang saling terhubung:** Fitur kalender yang menjadi pusat sistem mampu menghubungkan fitur lain seperti notes _meeting_, manajemen proyek, dan flashcard sehingga memudahkan pengguna dalam mengelola waktu dan tugas.
- **Fitur pembelajaran berbasis catatan:** Flashcard yang dibuat dari materi catatan pengguna memberikan nilai tambah bagi sistem karena dapat membantu proses belajar pengguna secara efektif.
- **Fitur pencatatan meeting dengan transcript:** Sistem dapat membantu pengguna mencatat hasil _meeting_ secara otomatis sehingga meningkatkan produktivitas pengguna.
- **Sistem manajemen proyek tim:** Fitur pembagian _role_, pengaturan _deadline_, serta indikator progres proyek membantu tim dalam mengelola pekerjaan secara lebih terstruktur.

**Weakness (Kelemahan)**

- **Kompleksitas integrasi fitur:** Banyaknya fitur yang saling terhubung dapat meningkatkan kompleksitas dalam pengembangan sistem.
- **Keterbatasan pengalaman tim dalam teknologi tertentu:** Beberapa teknologi seperti pengolahan _transcript_ atau sistem rekomendasi flashcard mungkin memerlukan pembelajaran tambahan.
- **Ketergantungan pada teknologi pihak ketiga:** Beberapa fitur seperti _transcript meeting_ atau _summarization_ menggunakan API eksternal.
- **Manajemen data yang cukup kompleks:** Sistem harus mengelola berbagai jenis data seperti catatan, tugas proyek, jadwal kalender, dan flashcard.

**Opportunity (Peluang)**

- **Meningkatnya kebutuhan aplikasi manajemen waktu:** Banyak pengguna seperti mahasiswa, pekerja, dan tim proyek membutuhkan sistem yang membantu mengatur jadwal dan tugas.
- **Perkembangan teknologi AI dan otomatisasi:** Teknologi AI dapat dimanfaatkan untuk meningkatkan fitur seperti _transcript meeting_ dan peringkasan catatan.
- **Potensi pengembangan fitur di masa depan:** Sistem dapat dikembangkan lebih lanjut dengan fitur tambahan seperti notifikasi otomatis, integrasi _email_, atau kolaborasi tim yang lebih kompleks.

**Threat (Ancaman)**

- **Kompetitor aplikasi serupa:** Sudah terdapat beberapa aplikasi populer seperti Google Calendar, Notion, atau Trello yang memiliki fungsi serupa.
- **Masalah keamanan data pengguna:** Penyimpanan data catatan dan jadwal pengguna harus dijaga keamanannya agar tidak terjadi kebocoran data.
- **Keterbatasan waktu pengerjaan proyek:** Jika tidak dikelola dengan baik, banyaknya fitur dapat menyebabkan proyek tidak selesai tepat waktu.
- **Ketergantungan pada koneksi internet dan layanan API:** Jika layanan eksternal mengalami gangguan, maka beberapa fitur mungkin tidak dapat berjalan dengan optimal.

### 2. Identifikasi Risiko Menggunakan Risk Management Framework

| Risiko                                               | Penyebab                                           | Dampak                                | Tingkat Risiko | Tindakan Mitigasi                                                       |
| :--------------------------------------------------- | :------------------------------------------------- | :------------------------------------ | :------------: | :---------------------------------------------------------------------- |
| **Integrasi antar fitur tidak berjalan dengan baik** | Kompleksitas sistem yang tinggi.                   | Sistem tidak berjalan optimal.        |     Tinggi     | Menggunakan arsitektur sistem modular dan melakukan integrasi bertahap. |
| **Keterlambatan penyelesaian proyek**                | Manajemen waktu yang kurang efektif.               | Proyek tidak selesai tepat waktu.     |     Tinggi     | Membuat _timeline_ pengembangan dan pembagian tugas yang jelas.         |
| **Kurangnya pemahaman teknologi**                    | Tim belum familiar dengan teknologi tertentu.      | Pengembangan menjadi lambat.          |     Sedang     | Melakukan riset teknologi serta memanfaatkan dokumentasi dan tutorial.  |
| **Bug atau error pada sistem**                       | Kurangnya pengujian selama pengembangan.           | Sistem tidak stabil.                  |     Tinggi     | Melakukan _testing_ berkala pada setiap modul sistem.                   |
| **Masalah performa aplikasi**                        | Banyaknya fitur dan data yang diproses.            | Aplikasi menjadi lambat.              |     Sedang     | Melakukan optimasi kode serta penggunaan _database_ yang efisien.       |
| **Kehilangan data pengguna**                         | Kesalahan sistem atau kegagalan penyimpanan.       | Data pengguna hilang.                 |     Sedang     | Menyediakan mekanisme _backup_ dan validasi data.                       |
| **Kesalahan hasil transcript meeting**               | Akurasi teknologi _speech-to-text_ tidak sempurna. | Informasi _meeting_ tidak akurat.     |     Sedang     | Menyediakan fitur edit manual pada hasil _transcript_.                  |
| **Kesalahan dalam peringkasan catatan**              | Algoritma _summarization_ kurang akurat.           | Informasi penting terlewat.           |     Rendah     | Memberikan opsi edit manual pada hasil ringkasan.                       |
| **Ketergantungan pada layanan API eksternal**        | Gangguan layanan pihak ketiga.                     | Beberapa fitur tidak dapat digunakan. |     Sedang     | Menyediakan _fallback system_ atau alternatif API.                      |
| **Ketidaksesuaian fitur dengan kebutuhan pengguna**  | Analisis kebutuhan kurang tepat.                   | Sistem kurang efektif digunakan.      |     Rendah     | Melakukan analisis kebutuhan pengguna sebelum pengembangan.             |

### 3. Strategi Manajemen Risiko

Untuk memastikan proyek dapat berjalan dengan baik, tim akan menerapkan beberapa strategi manajemen risiko sebagai berikut:

1. **Perencanaan Proyek yang Terstruktur:** Tim akan membuat perencanaan proyek yang jelas meliputi pembagian tugas, penentuan prioritas fitur, serta _timeline_ pengembangan. Dengan perencanaan yang baik, risiko keterlambatan proyek dapat diminimalisir.
2. **Pengembangan Sistem Secara Bertahap:** Pengembangan sistem dilakukan secara bertahap dimulai dari fitur utama yaitu kalender sebagai pusat sistem, kemudian dilanjutkan dengan fitur lainnya seperti _notes meeting_, manajemen proyek, flashcard, dan peringkasan catatan.
3. **Pengujian Sistem Secara Berkala:** Setiap fitur yang telah dikembangkan akan diuji secara berkala untuk memastikan sistem berjalan dengan baik dan bebas dari _bug_ yang dapat mengganggu kinerja aplikasi.
4. **Koordinasi dan Komunikasi Tim:** Tim proyek akan melakukan diskusi dan evaluasi secara rutin untuk memantau perkembangan proyek serta mengatasi masalah yang muncul selama proses pengembangan.
5. **Dokumentasi Proyek:** Seluruh proses pengembangan sistem akan didokumentasikan dengan baik, termasuk desain sistem, struktur _database_, serta dokumentasi kode program. Hal ini bertujuan untuk memudahkan pemeliharaan dan pengembangan sistem di masa mendatang.
