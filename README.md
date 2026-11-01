# KONTENIN — Creator Toolkit

Website statis untuk membantu kreator pemula membuat inspirasi konten, caption, dan rencana posting.

## Fitur
- Generator ide konten berdasarkan kategori dan platform
- Caption maker berbasis template lokal
- Kalender/rencana konten dengan status
- Koleksi ide tersimpan dan pencarian
- Catatan cepat dengan penyimpanan lokal
- Ekspor data CSV
- Tampilan responsif untuk HP dan desktop

## Jalankan di Acode (Android)
1. Ekstrak ZIP proyek ini ke folder bernama `KONTENIN`.
2. Buka Acode, lalu buka folder `KONTENIN`.
3. Buka `index.html`.
4. Tekan tombol Preview/Run di Acode (nama tombol dapat berbeda menurut versi).
5. Pastikan file `style.css` dan `script.js` tetap satu folder dengan `index.html`.

Jika preview Acode tidak menjalankan file dengan benar, gunakan fitur preview/browser bawaan Acode atau buka `index.html` lewat browser setelah file diekstrak. Jangan pindahkan hanya `index.html`; ketiga file utama harus tetap bersama.

## Publikasikan ke GitHub Pages
1. Masuk ke GitHub dan buat repository baru bernama `kontenin`.
2. Pilih Public jika ingin website bisa diakses publik.
3. Upload `index.html`, `style.css`, `script.js`, dan `README.md` ke root repository.
4. Buka **Settings → Pages**.
5. Di bagian Build and deployment, pilih **Deploy from a branch**.
6. Pilih branch `main` dan folder `/(root)`, lalu tekan Save.
7. Tunggu proses deployment selesai. URL biasanya berbentuk `https://USERNAME.github.io/kontenin/`.

## Catatan penting
- Tidak membutuhkan API atau server.
- Data disimpan di LocalStorage browser yang sedang digunakan. Data tidak otomatis tersinkron ke perangkat lain dan bisa hilang jika data situs/browser dihapus.
- Generator ide/caption memakai template lokal, bukan AI online.
- GitHub Pages hanya meng-host website statis. Jangan menyimpan password, token rahasia, atau data sensitif di kode.
- Sebelum monetisasi, periksa persyaratan usia, persetujuan wali, dan ketentuan layanan iklan/afiliasi yang dipilih.
