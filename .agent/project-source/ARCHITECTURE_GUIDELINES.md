# LockIn: Engineering & Performance Architecture Guidelines

Dokumen ini memuat standar arsitektur _frontend_ dan metrik optimasi performa yang wajib diimplementasikan selama pengembangan aplikasi LockIn untuk menjamin fluiditas antarmuka dan kecepatan muat tingkat tinggi.

## 1. Arsitektur Responsif & Makro-Layout

Untuk memastikan _dashboard_ LockIn (Kalender, Task, Notes) beradaptasi sempurna dari layar _smartphone_ terkecil hingga monitor PC _ultrawide_, terapkan prinsip berikut:

- [cite_start]**Mobile-First Approach:** Penulisan struktur kode wajib dimulai tanpa _media query_ untuk ukuran _mobile_ terkecil, dan aturan `min-width` diaplikasikan secara bertahap untuk layar yang lebih besar[cite: 234, 235, 236]. [cite_start]Ini mengurangi beban CPU pada perangkat _mobile_[cite: 237].
- [cite_start]**Transisi Layout dengan CSS Grid:** Saat mengubah arsitektur keseluruhan halaman (misal, memindahkan _sidebar_ navigasi ke samping pada versi _desktop_), gunakan manipulasi `grid-template-areas`[cite: 251, 256]. [cite_start]Transisi matriks ini mengubah alur visual antarmuka tanpa perlu memodifikasi struktur semantic HTML DOM sama sekali[cite: 258].
- **Penskalaan Cair (Fluid Scaling):** Hindari ukuran absolut untuk _typography_ dan lebar panel _Notes_. [cite_start]Gunakan fungsi matematika CSS `clamp(minimum, preferred, maximum)`[cite: 343, 345]. [cite_start]Fungsi ini menjamin elemen elastis di layar medium, namun terkunci aman agar tidak terlalu menyusut di HP atau tidak melebar tak wajar di layar 4K[cite: 350, 351, 352].

## 2. Mikro-Arsitektur & Rendering Performa Tinggi

Interaksi pengguna seperti memindahkan tugas (_drag-and-drop_) atau membuka _modal_ kalender harus terasa instan (60 FPS).

- [cite_start]**Akselerasi GPU untuk Animasi:** Jangan pernah mengubah properti `width`, `height`, `top`, atau `left` untuk animasi perpindahan, karena akan memaksa CPU browser menghitung ulang geometri (_layout calculation/reflow_) dan membuat halaman patah-patah (_jank_)[cite: 267, 268, 269]. [cite_start]Selalu gunakan properti `transform: translate`, `scale`, atau `rotate` karena kalkulasinya dialihkan secara langsung ke unit pemrosesan grafis (GPU)[cite: 270, 271].
- [cite_start]**Penempatan Elemen Modal yang Sempurna:** Untuk menempatkan _pop-up_ tepat di tengah layar secara dinamis, gunakan kombinasi posisi dan transformasi: `top: 50%`, `left: 50%`, beserta `transform: translate(-50%, -50%)`[cite: 284, 285]. [cite_start]Geometri ini menjamin elemen tetap di poros tengah terlepas dari ukuran kontainer induknya[cite: 286, 287].
- [cite_start]**Isolasi Rendering DOM Berat:** Pada daftar tugas yang sangat panjang atau catatan yang ekstensif, terapkan properti CSS `content-visibility: auto` pada kontainer[cite: 147]. [cite_start]Mesin browser akan melewati fase _layout_ dan _paint_ untuk elemen yang berada di luar layar, mempercepat waktu rilis awal antarmuka (_initial rendering_) secara drastis pada CPU ponsel menengah ke bawah[cite: 148, 150].

## 3. Eksekusi Jaringan & Pengiriman Aset (Web Vitals)

[cite_start]Fokus utama performa adalah menekan metrik _Largest Contentful Paint_ (LCP) di bawah 2.5 detik dan menjaga _Interaction to Next Paint_ (INP) tetap di bawah 200 milidetik[cite: 11, 12, 19, 20].

- [cite_start]**Format dan Prioritas Gambar:** Semua gambar wajib bermigrasi ke format modern AVIF (efisiensi kompresi memangkas ukuran hingga 50%) dengan _fallback_ WebP[cite: 54, 55, 56]. [cite_start]Gunakan atribut `fetchpriority="high"` pada elemen gambar utama (_hero image_) di _viewport_ awal [cite: 61, 62][cite_start], serta delegasikan `loading="lazy"` untuk seluruh visual di bawah lipatan layar (_below the fold_)[cite: 64].
- [cite_start]**Manajemen Font yang Agresif:** Untuk mencegah _Flash of Unstyled Text_ (FOUT) pada _text editor_, gunakan `font-display: swap`[cite: 66, 67]. [cite_start]Lakukan _algorithmic subsetting_ pada _file_ font untuk menghapus karakter unicode yang tidak terpakai, memangkas bobot muatan aset[cite: 69, 70, 71].
- [cite_start]**Pengalihan Eksekusi Thread (Off-Main-Thread):** Jika LockIn menggunakan skrip analitik atau _widget_ pihak ketiga, cegah skrip tersebut dari memonopoli _main thread_ yang menghancurkan skor INP[cite: 98, 99]. [cite_start]Implementasikan _Web Workers_ melalui teknologi seperti Partytown agar skrip tersebut berjalan di latar belakang tanpa menghalangi _rendering_ halaman utama[cite: 101, 102, 104].
- [cite_start]**Navigasi Instan:** Implementasikan View Transitions API untuk menciptakan efek animasi visual berbasis-_state_ (seperti efek memudar/_crossfade_ atau bergeser) antar halaman web tanpa bobot berlebih[cite: 124, 125]. [cite_start]Padukan dengan Speculation Rules API untuk melakukan prapemuatan (_prerender_) halaman masa depan secara prediktif ketika pengguna mengarahkan kursor (_hover_) ke sebuah tautan[cite: 109, 111, 116, 119].

## 4. Infrastruktur Lokal & Rute Indonesia

[cite_start]Karena target pengguna berada di ekosistem Indonesia, topologi jaringan merupakan faktor penentu[cite: 151, 154].

- [cite_start]Pilih penyedia platform _Edge/Serverless_ (seperti Vercel atau Cloudflare) yang memiliki titik kehadiran fisik (Points of Presence/PoPs) langsung di kota besar seperti Jakarta, Surabaya, atau Medan[cite: 155, 166, 167].
- [cite_start]Langkah ini memastikan lalu lintas pengguna dengan ISP dominan lokal (Biznet, XL Home, Telkom) dikoneksikan secara langsung (_direct peering_) dan menghindari rute kabel selam internasional (seperti di Selat Malaka) yang menyebabkan latensi tinggi (_tromboning_)[cite: 165, 169, 170, 171, 172].
