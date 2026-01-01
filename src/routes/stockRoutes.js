const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const verifyApiKey = require('../middlewares/auth');

// PROTEKSI SEMUA ENDPOINT DI BAWAH INI
router.use(verifyApiKey);

router.get('/search', stockController.searchStocks);
router.get('/stats/sectors', stockController.getSectorStats);
router.get('/top/big-cap', stockController.getTopBigCap);
router.get('/sort/:type', stockController.getSortedStocks);
router.get('/sector/:sectorName', stockController.getStocksBySector);
router.get('/', stockController.getAllStocks);
router.get('/:code', stockController.getStockByCode);

module.exports = router;