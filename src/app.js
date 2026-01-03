const express = require('express');
const helmet = require('helmet');
const stockRoutes = require('./routes/stockRoutes');
const seedDatabase = require('./utils/seeder');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

const app = express();
const PORT = 3000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// --- JALUR DIAGNOSA (BARU) ---
// Ini biar kita bisa lihat isi mentah Swagger-nya
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpecs);
});

// Dokumentasi Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Fitur Token (Jalan Pintas)
app.get('/api/auth/token', (req, res) => {
  res.json({
    status: 'success',
    message: 'Silakan gunakan API Key ini di menu Authorize (Gembok)',
    key: 'kuncirahasia123',
    hint: 'Copy value di atas, klik gembok di pojok kanan atas, lalu paste.'
  });
});

// API Utama
app.use('/api/stocks', stockRoutes);

app.listen(PORT, async () => {
  console.log(`Layanan Mandiri RUNNING di port ${PORT}`);
  await seedDatabase();
});