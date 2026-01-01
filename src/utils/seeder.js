const fs = require('fs');
const csv = require('csv-parser');
const pool = require('../config/database');
const path = require('path');
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const cleanNumber = (str) => {
  if (!str) return 0;
  let cleanStr = str.toString().replace(/[^0-9.,-]/g, '');
  if (cleanStr.indexOf('.') > -1 && cleanStr.split('.')[1].length === 3) cleanStr = cleanStr.replace(/\./g, '');
  return parseFloat(cleanStr) || 0;
};

const seedDatabase = async () => {
  let connection;
  let retries = 10;
  while (retries > 0) {
    try {
      console.log(`>> Mencoba koneksi DB (${retries})...`);
      connection = await pool.getConnection();
      break;
    } catch (err) {
      retries -= 1;
      await wait(3000);
    }
  }
  if (!connection) { console.error(">> GAGAL DB"); process.exit(1); }

  try {
    await connection.query(`CREATE TABLE IF NOT EXISTS stocks (
      code VARCHAR(10) PRIMARY KEY, name VARCHAR(255), sector VARCHAR(100),
      last_price DECIMAL(20, 2), market_cap DECIMAL(30, 2), updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    
    // Cek isi data
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM stocks');
    if (rows[0].count > 0) { console.log('>> DB Aman (Sudah ada data).'); connection.release(); return; }

    console.log('>> DB Kosong. Import CSV...');
    const results = [];
    const csvPath = path.join(__dirname, '../../DaftarSaham.csv');
    
    fs.createReadStream(csvPath).pipe(csv()).on('data', (data) => {
      const price = data.LastPrice || data.Last || '0';
      const mcap = data.MarketCap || data['Market Cap'] || '0';
      if(data.Code) results.push([data.Code, data.Name, data.Sector || 'Misc', cleanNumber(price), cleanNumber(mcap)]);
    }).on('end', async () => {
      if (results.length > 0) await connection.query('INSERT IGNORE INTO stocks (code, name, sector, last_price, market_cap) VALUES ?', [results]);
      console.log(`>> SELESAI. ${results.length} saham diimport.`);
      connection.release();
    });
  } catch (error) { console.error('Seeder Error:', error); if(connection) connection.release(); }
};
module.exports = seedDatabase;