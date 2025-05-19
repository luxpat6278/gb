// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();

// Список разрешённых доменов
const allowedOrigins = [
  'http://localhost:5173',
  'https://graduation-bmpx.vercel.app',
  'https://gb-tu0w.onrender.com'
];

// Параметры CORS
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

// Подключаем CORS до всех маршрутов
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Обработка preflight

// Парсинг JSON
app.use(express.json());

// Настройка пула MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Монтируем роутер RSVP
const rsvpRouter = require('./routes/rspv');
app.use('/api/rsvp', rsvpRouter(pool));

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
