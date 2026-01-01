# Stock Data Microservice (Tugas 2 - Layanan Mandiri)

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

Pastikan **Docker** dan **Docker Compose** sudah terinstall di mesin Anda.

### 1. Persiapan File
Pastikan struktur folder proyek lengkap, terutama file `DaftarSaham.csv` harus ada di folder utama (sejajar dengan `docker-compose.yml`).

### 2. Jalankan Container
Buka terminal di dalam folder proyek, lalu jalankan perintah:

```bash
docker compose up -d --build
