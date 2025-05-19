require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();

const allowedOrigins = ['http://localhost:5173', 'https://graduation-bmpx.vercel.app',  'https://gb-tu0w.onrender.com'];

const corsOptions = {
  origin: function (origin, callback) {
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

// ✅ Применяем CORS ДО всех маршрутов
app.use(cors(corsOptions));

// ✅ Явная обработка preflight
app.options('*', cors(corsOptions));

// Обязательно до маршрутов
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ✅ Роутер должен использовать `res.json` / `res.send` — но CORS уже применён!
const rsvpRouter = require('./routes/rspv');
app.use('/api/rsvp', rsvpRouter(pool));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

