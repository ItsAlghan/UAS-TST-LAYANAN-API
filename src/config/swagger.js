const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Stock Microservice API (Final)',
      version: '1.0.5', // Versi Baru
      description: `
### PANDUAN LOGIN (WAJIB DIBACA):

Karena sistem ini menggunakan keamanan (Auth), Anda harus Login dulu:

1. Copy Key ini: **kuncirahasia123**
2. Klik tombol **Authorize** di kanan.
3. Paste di kolom Value, lalu klik **Authorize**.
4. Klik **Close**.

Sekarang Anda bisa mencoba semua fitur di bawah!
      `,
      contact: { name: 'Mahasiswa TST' },
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
      // Endpoint Token kita masukkan ke dokumentasi juga biar muncul
      '/api/auth/token': {
        get: {
          summary: 'Cek Kunci Rahasia',
          tags: ['Auth'],
          security: [], 
          responses: {
            200: { description: 'Berhasil', content: { 'application/json': { schema: { type: 'object', properties: { key: { type: 'string', example: 'kuncirahasia123' } } } } } }
          }
        }
      },
      // ... Endpoint lainnya ...
       '/api/stocks/search': {
        get: {
          summary: 'Cari Saham (Search)',
          tags: ['Stocks'],
          parameters: [
            { name: 'q', in: 'query', schema: { type: 'string' }, required: true, description: 'Keyword' }
          ],
          responses: { 200: { description: 'Sukses' } }
        }
      },
      '/api/stocks': {
        get: {
          summary: 'Ambil Semua Data',
          tags: ['Stocks'],
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer' } }
          ],
          responses: { 200: { description: 'Sukses' } }
        }
      }
      // (Anda bisa menambahkan endpoint lain jika perlu, tapi yang Auth Token ini yang paling penting muncul dulu)
    }
  },
  apis: [], 
};

module.exports = swaggerJsdoc(options);