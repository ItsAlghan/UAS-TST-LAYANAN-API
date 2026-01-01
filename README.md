# Stock Data Microservice

Ini adalah layanan Microservice yang menyediakan API untuk pengelolaan data saham. Layanan ini dibangun menggunakan **Node.js** dan **MySQL**, dikemas dalam **Docker Container**, dan dilengkapi dengan dokumentasi interaktif **Swagger UI**.

Proyek ini dibuat untuk memenuhi **Tugas 2**.

---

## Fitur Utama

1.  **Manajemen Data Saham**: Menampilkan data saham dengan pagination.
2.  **Pencarian Canggih**: Mencari saham berdasarkan Kode Emiten atau Nama Perusahaan.
3.  **Analitik & Statistik**:
    * Top 10 Big Cap (Kapitalisasi Pasar Terbesar).
    * Statistik jumlah emiten per Sektor.
    * Sorting harga (Termahal/Termurah).
4.  **Auto-Seeding**: Database otomatis terisi data dari file `DaftarSaham.csv` saat container pertama kali dijalankan.
5.  **Dokumentasi API (Swagger)**: Antarmuka UI untuk mencoba API tanpa Postman.
6.  **Keamanan (Bonus)**: Proteksi Endpoint menggunakan **API Key**.
7.  **Anti-Crash**: Mekanisme *Healthcheck* dan *Retry Connection* untuk koneksi database yang stabil.

---

## Teknologi yang Digunakan

* **Runtime**: Node.js (Express.js)
* **Database**: MySQL 8.0
* **Containerization**: Docker & Docker Compose
* **Documentation**: Swagger UI Express
* **Tools Lain**: CSV-Parser, Helmet (Security)

---

## Cara Install & Menjalankan (Deployment)

### 1. Prasyarat
Pastikan **Docker** dan **Docker Compose** sudah terinstall di mesin Anda.

### 2. Persiapan File
Pastikan struktur folder proyek lengkap dan file `DaftarSaham.csv` berada di root folder (sejajar dengan `docker-compose.yml`).

### 3. Menjalankan Container
Buka terminal di dalam folder proyek, lalu jalankan perintah:

```bash
docker compose up -d --build

Tunggu beberapa saat. Docker akan mendownload image, membangun container, dan melakukan import data CSV ke database secara otomatis.

### 4. Cek Status
Pastikan layanan berjalan dengan melihat log:Bashdocker compose logs -f app
Indikator sukses adalah munculnya pesan: Layanan Mandiri RUNNING di port 3000.

## Cara Mengakses Layanan
Setelah container berjalan, layanan dapat diakses melalui Browser.
### 1. Halaman Status ServerBuka URL berikut untuk memastikan server online:👉 http://localhost:3000 (atau http://[IP_STB]:3000)
### 2. Dokumentasi API (Swagger UI) - REKOMENDASICara termudah dan terlengkap untuk mencoba API adalah melalui Swagger:👉 http://localhost:3000/api-docs🔐

## Autentikasi (API Key)
Layanan ini menerapkan prosedur authentication (Tantangan/Bonus). Setiap permintaan ke API harus menyertakan API Key yang valid.API Key Default: kuncirahasia123 (Dikonfigurasi di dalam file docker-compose.yml pada variabel API_KEY)
Cara Login (Authorize) di Swagger:
1. Buka halaman Swagger UI (/api-docs).
2. Klik tombol Authorize (Ikon Gembok) di bagian kanan atas.
3. Masukkan value: kuncirahasia123
4. Klik tombol Authorize lalu Close.
5. Sekarang gembok akan tertutup dan Anda bisa mencoba semua fitur (Klik Try it out -> Execute).


## Daftar Endpoint API
Berikut adalah daftar lengkap endpoint yang tersedia
GET	/api/stocks	Mengambil semua data saham (mendukung pagination ?page=n).
GET	/api/stocks/search?q={keyword}	Mencari saham berdasarkan Kode atau Nama Perusahaan.
GET	/api/stocks/{code}	Melihat detail satu saham spesifik (Contoh: /api/stocks/BBCA).
GET	/api/stocks/top/big-cap	Menampilkan 10 saham dengan Market Cap terbesar.
GET	/api/stocks/stats/sectors	Statistik jumlah emiten dan rata-rata harga per sektor.
GET	/api/stocks/sector/{nama}	Filter saham berdasarkan nama sektor (Contoh: Energy).
GET	/api/stocks/sort/{type}	Mengurutkan harga saham. Ganti {type} dengan expensive atau cheap.


## Struktur Folder ProyekPlaintext.
├── DaftarSaham.csv          # Sumber Data CSV (Raw Data)
├── docker-compose.yml       # Konfigurasi Orkestrasi Docker
├── Dockerfile               # Konfigurasi Image Node.js
├── package.json             # Daftar Library (Dependencies)
├── public/                  # Halaman Web Statis (Landing Page)
│   └── index.html
└── src/
    ├── app.js               # Entry Point Aplikasi Server
    ├── config/
    │   ├── database.js      # Konfigurasi Koneksi MySQL Pool
    │   └── swagger.js       # Konfigurasi Dokumentasi API (JSON Format)
    ├── controllers/         # Logika Bisnis (Search, Sort, Analytics)
    │   └── stockController.js
    ├── middlewares/         # Middleware Keamanan
    │   └── auth.js          # Verifikasi API Key
    ├── routes/              # Routing URL API
    │   └── stockRoutes.js
    └── utils/
        └── seeder.js        # Script Otomatis Import CSV ke Database


## Troubleshooting
Masalah: Muncul error "Database Error: connect ECONNREFUSED" di log.
Solusi: Ini normal terjadi saat container baru pertama kali dinyalakan (MySQL butuh waktu untuk booting). Aplikasi ini sudah dilengkapi fitur Auto-Retry. Tunggu sekitar 10-20 detik, aplikasi akan mencoba koneksi ulang secara otomatis hingga berhasil.

Masalah: Data saham kosong atau harga 0.
Solusi: Pastikan file DaftarSaham.csv ada di folder utama sebelum menjalankan docker compose up. Jika file CSV diubah, jalankan docker compose down -v (untuk menghapus volume lama) lalu build ulang.
