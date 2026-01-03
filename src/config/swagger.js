const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Stock Microservice API (Final)',
      version: '1.0.5',
      description: `
### PANDUAN LOGIN:
1. Copy Key ini: **kuncirahasia123**
2. Klik tombol **Authorize** di kanan.
3. Paste di kolom Value, lalu klik **Authorize**.
4. Klik **Close**.

Sekarang Anda bisa mencoba semua fitur di bawah!
      `,
      contact: { name: 'Kelompok TST' },
    },
    servers: [
      { 
        url: 'https://alghan.ibayderikfariqalghanzaka.my.id', 
        description: 'Public Server (Cloudflare)' 
      },
      { 
        url: 'http://localhost:3000', 
        description: 'Local Development' 
      }
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key'
        }
      },
      schemas: {
        Stock: {
          type: 'object',
          properties: {
            code: { type: 'string', example: 'BBCA' },
            name: { type: 'string', example: 'Bank Central Asia' },
            sector: { type: 'string', example: 'Financials' },
            last_price: { type: 'number', example: 9500 },
            market_cap: { type: 'number', example: 1200000000000 }
          }
        }
      }
    },
    security: [ { ApiKeyAuth: [] } ],
    paths: {
      // 1. AUTH TOKEN (HELPER)
      '/api/auth/token': {
        get: {
          summary: 'Cek Kunci Rahasia',
          tags: ['Auth'],
          security: [], 
          responses: {
            200: { description: 'Menampilkan API Key untuk demo' }
          }
        }
      },
      
      // 2. SEARCH
      '/api/stocks/search': {
        get: {
          summary: '🔍 Cari Saham',
          tags: ['Stocks'],
          parameters: [
            { name: 'q', in: 'query', schema: { type: 'string' }, required: true, description: 'Kata kunci (misal: Bank)' }
          ],
          responses: { 200: { description: 'Hasil pencarian' } }
        }
      },

      // 3. STATISTIK SEKTOR
      '/api/stocks/stats/sectors': {
        get: {
          summary: 'Statistik Sektor',
          tags: ['Analytics'],
          responses: { 200: { description: 'Jumlah emiten dan rata-rata harga per sektor' } }
        }
      },

      // 4. TOP BIG CAP
      '/api/stocks/top/big-cap': {
        get: {
          summary: 'Top 10 Big Cap',
          tags: ['Analytics'],
          responses: { 200: { description: '10 Saham dengan Market Cap terbesar' } }
        }
      },

      // 5. SORTING
      '/api/stocks/sort/{type}': {
        get: {
          summary: 'tas Urutkan Harga',
          tags: ['Filter'],
          parameters: [
            { 
              name: 'type', 
              in: 'path', 
              schema: { type: 'string', enum: ['expensive', 'cheap'] }, 
              required: true,
              description: 'Pilih "expensive" (Termahal) atau "cheap" (Termurah)'
            }
          ],
          responses: { 200: { description: 'Daftar saham terurut' } }
        }
      },

      // 6. FILTER BY SECTOR
      '/api/stocks/sector/{sectorName}': {
        get: {
          summary: 'Filter per Sektor',
          tags: ['Filter'],
          parameters: [
            { name: 'sectorName', in: 'path', schema: { type: 'string' }, required: true, example: 'Financials' }
          ],
          responses: { 200: { description: 'Daftar saham dalam sektor tersebut' } }
        }
      },

      // 7. GET ALL STOCKS
      '/api/stocks': {
        get: {
          summary: 'Ambil Semua Data (Paging)',
          tags: ['Stocks'],
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 }, description: 'Halaman ke berapa' }
          ],
          responses: { 200: { description: 'List saham (20 per halaman)' } }
        }
      },

      // 8. GET DETAIL (Taruh paling bawah biar ga konflik path)
      '/api/stocks/{code}': {
        get: {
          summary: 'Detail Satu Saham',
          tags: ['Stocks'],
          parameters: [
            { name: 'code', in: 'path', schema: { type: 'string' }, required: true, example: 'BBCA' }
          ],
          responses: { 
            200: { description: 'Detail lengkap saham' },
            404: { description: 'Saham tidak ditemukan' }
          }
        }
      }
    }
  },
  apis: [], 
};

module.exports = swaggerJsdoc(options);