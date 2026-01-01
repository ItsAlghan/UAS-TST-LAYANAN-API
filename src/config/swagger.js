const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Stock Microservice API (Final)',
      version: '1.0.0',
      description: 'Layanan Mandiri Data Saham (Tugas 2) dengan Auth & Lengkap.',
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
      '/api/stocks/stats/sectors': {
        get: {
          summary: 'Statistik Sektor (Analytics)',
          tags: ['Analytics'],
          responses: { 200: { description: 'Sukses' } }
        }
      },
      '/api/stocks/top/big-cap': {
        get: {
          summary: 'Top 10 Big Cap',
          tags: ['Analytics'],
          responses: { 200: { description: 'Sukses' } }
        }
      },
      '/api/stocks/sort/{type}': {
        get: {
          summary: 'Sort Harga (Mahal/Murah)',
          tags: ['Analytics'],
          parameters: [
            { name: 'type', in: 'path', schema: { type: 'string', enum: ['expensive', 'cheap'] }, required: true }
          ],
          responses: { 200: { description: 'Sukses' } }
        }
      },
      '/api/stocks/sector/{sectorName}': {
        get: {
          summary: 'Filter by Sektor',
          tags: ['Analytics'],
          parameters: [
            { name: 'sectorName', in: 'path', schema: { type: 'string' }, required: true }
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
      },
      '/api/stocks/{code}': {
        get: {
          summary: 'Detail Satu Saham',
          tags: ['Stocks'],
          parameters: [
            { name: 'code', in: 'path', schema: { type: 'string' }, required: true }
          ],
          responses: { 200: { description: 'Sukses' }, 404: { description: 'Not Found' } }
        }
      }
    }
  },
  apis: [], 
};

const specs = swaggerJsdoc(options);
module.exports = specs;