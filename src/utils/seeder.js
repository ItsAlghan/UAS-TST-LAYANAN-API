const fs = require('fs');
const csv = require('csv-parser');
const pool = require('../config/database');
const path = require('path');

const cleanNumber = (str) => {
  if (!str) return 0;
  let cleanStr = str.toString().replace(/[^0-9.,-]/g, '');
  if (cleanStr.indexOf('.') > -1 && cleanStr.split('.')[1].length === 3) cleanStr = cleanStr.replace(/\./g, '');
  return parseFloat(cleanStr) || 0;
};

const seedDatabase = async () => {
  console.log(`>> Memeriksa Database SQLite...`);

  try {
    // 1. Buat Tabel (Syntax SQLite: INTEGER/REAL/TEXT)
    await pool.query(`CREATE TABLE IF NOT EXISTS stocks (
      code TEXT PRIMARY KEY, 
      name TEXT, 
      sector TEXT,
      last_price REAL, 
      market_cap REAL, 
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // 2. Cek Data
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM stocks');
    if (rows[0].count > 0) { 
        console.log('>> DB Aman (Sudah ada data).'); 
        return; 
    }

    console.log('>> DB Kosong. Import CSV...');
    const results = [];
    const csvPath = path.join(__dirname, '../../DaftarSaham.csv');
    
    fs.createReadStream(csvPath).pipe(csv()).on('data', (data) => {
      const price = data.LastPrice || data.Last || '0';
      const mcap = data.MarketCap || data['Market Cap'] || '0';
      
      if(data.Code) results.push({
          code: data.Code, 
          name: data.Name, 
          sector: data.Sector || 'Misc', 
          last_price: cleanNumber(price), 
          market_cap: cleanNumber(mcap)
      });
    }).on('end', async () => {
      
      // 3. Insert Loop (SQLite Wrapper simple tidak support bulk insert array 2D)
      console.log(`>> Mulai import ${results.length} baris...`);
      let inserted = 0;
      for (const row of results) {
          try {
            // Pakai INSERT OR IGNORE (Khas SQLite)
            await pool.query(
                'INSERT OR IGNORE INTO stocks (code, name, sector, last_price, market_cap) VALUES (?, ?, ?, ?, ?)', 
                [row.code, row.name, row.sector, row.last_price, row.market_cap]
            );
            inserted++;
          } catch (err) {
            console.error(`Gagal insert ${row.code}:`, err.message);
          }
      }
      console.log(`>> SELESAI. ${inserted} saham sukses diimport.`);
    });

  } catch (error) { 
      console.error('Seeder Error:', error); 
  }
};

module.exports = seedDatabase;