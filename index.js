require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();

// ✅ Разрешаем CORS **до** всех маршрутов
app.use(cors({
  origin: 'http://localhost:5173', // разрешаем твой фронтенд
  methods: ['GET', 'POST'],        // явно указываем методы
  credentials: true,               // если используешь куки или авторизацию
}));

// ✅ Позволяем серверу читать JSON из тела запроса
app.use(express.json());

// ✅ Подключаем базу
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ✅ Подключаем маршруты
const rsvpRouter = require('./routes/rspv');
app.use('/api/rsvp', rsvpRouter(pool));

// ✅ Запускаем сервер
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
