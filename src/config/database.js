const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// 1. Pastikan folder penyimpanan data ada
const dataDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dataDir)){
    fs.mkdirSync(dataDir, { recursive: true });
}

// 2. Koneksi ke File Database (stock.db)
const dbPath = path.join(dataDir, 'stock.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Gagal membuka SQLite:', err.message);
  else console.log('Terhubung ke SQLite di:', dbPath);
});

// 3. WRAPPER: Membuat SQLite terasa seperti MySQL (Promise based)
const pool = {
  execute: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      const command = sql.trim().toUpperCase();
      // Kalau SELECT pakai .all(), kalau INSERT/UPDATE pakai .run()
      if (command.startsWith('SELECT')) {
        db.all(sql, params, (err, rows) => {
          if (err) reject(err);
          else resolve([rows, null]); // Tiru format return MySQL [rows, fields]
        });
      } else {
        db.run(sql, params, function (err) {
          if (err) reject(err);
          else resolve([{ insertId: this.lastID, affectedRows: this.changes }, null]);
        });
      }
    });
  },
  // Alias agar kompatibel dengan .query()
  query: (sql, params) => pool.execute(sql, params),
  
  // Mock function jika Controller mencoba minta koneksi (Safety Net)
  getConnection: () => {
    return Promise.resolve({
      execute: (s, p) => pool.execute(s, p),
      query: (s, p) => pool.execute(s, p),
      release: () => {} // Tidak melakukan apa-apa karena SQLite file-based
    });
  },
  end: () => {} 
};

module.exports = pool;