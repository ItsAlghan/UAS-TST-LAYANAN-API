const pool = require('../config/database');

exports.getAllStocks = async (req, res) => {
  try {
    const limit = 20;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    const [rows] = await pool.query('SELECT * FROM stocks LIMIT ? OFFSET ?', [limit, offset]);
    const [count] = await pool.query('SELECT COUNT(*) as total FROM stocks');
    
    res.json({ status: "success", page, total_data: count[0].total, data: rows });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.searchStocks = async (req, res) => {
  try {
    const keyword = `%${req.query.q || ''}%`;
    const [rows] = await pool.query('SELECT * FROM stocks WHERE code LIKE ? OR name LIKE ? LIMIT 50', [keyword, keyword]);
    res.json({ status: "success", found: rows.length, data: rows });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getTopBigCap = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM stocks ORDER BY market_cap DESC LIMIT 10');
    res.json({ status: "success", data: rows });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getSortedStocks = async (req, res) => {
  try {
    const order = req.params.type === 'cheap' ? 'ASC' : 'DESC';
    const [rows] = await pool.query(`SELECT * FROM stocks ORDER BY last_price ${order} LIMIT 20`);
    res.json({ status: "success", sort: req.params.type, data: rows });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getStocksBySector = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM stocks WHERE sector LIKE ? LIMIT 50', [`%${req.params.sectorName}%`]);
    res.json({ status: "success", data: rows });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getSectorStats = async (req, res) => {
  try {
    const query = `SELECT sector, COUNT(*) as total, AVG(last_price) as avg_price FROM stocks GROUP BY sector ORDER BY total DESC`;
    const [rows] = await pool.query(query);
    res.json({ status: "success", data: rows });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getStockByCode = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM stocks WHERE code = ?', [req.params.code.toUpperCase()]);
    if (rows.length === 0) return res.status(404).json({ message: "Saham tidak ditemukan" });
    res.json({ status: "success", data: rows[0] });
  } catch (err) { res.status(500).json({ error: err.message }); }
};