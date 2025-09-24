// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config(); // Загружаем переменные из .env файла

const app = express();
const PORT = process.env.PORT || 5000; // Используем порт из .env или 5000 по умолчанию

// Middlewares
app.use(cors()); // Разрешаем CORS
app.use(express.json()); // Для парсинга JSON тел запросов

// Пример простого роута
app.get('/', (req, res) => {
  res.send('Finance Tracker Backend is running!');
});

// Запускаем сервер
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});