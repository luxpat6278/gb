// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();

// Логирование всех запросов (для отладки)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Разрешённые источники для CORS
const allowedOrigins = [
  'http://localhost:5173',
  'https://graduation-bmpx.vercel.app',
  'https://gb-tu0w.onrender.com'
];

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
  optionsSuccessStatus: 200
};

// CORS
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// JSON body parsing
app.use(express.json());

// MySQL pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Подключение маршрута /api/rsvp
const rsvpRouter = require('./routes/rsvp');
app.use('/api/rsvp', rsvpRouter(pool));

// Отдача статических файлов React сборки
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Обработка остальных маршрутов (для SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
