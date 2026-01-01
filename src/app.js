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

// Dokumentasi Swagger (Bisa diakses publik tanpa password dulu)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// API Utama (Diproteksi di dalam routes/stockRoutes.js)
app.use('/api/stocks', stockRoutes);

app.listen(PORT, async () => {
  console.log(`Layanan Mandiri RUNNING di port ${PORT}`);
  await seedDatabase();
});