// server/index.js (Важно: убедитесь, что файл действительно называется index.js)
require('dotenv').config(); // Загружаем переменные из server/.env
const express = require('express');
const cors = require('cors');
const db = require('./models'); // Импортируем все модели Sequelize

// Импорт маршрутов
const transactionRoutes = require('./routes/transactions'); // (Допустим, у вас есть этот файл)
const categoryRoutes = require('./routes/categories');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Для обработки JSON в теле запроса

// Routes
app.use('/api/transactions', transactionRoutes); // (Если у вас уже есть этот файл)
app.use('/api/categories', categoryRoutes); // Подключаем маршруты категорий

// --- Логика подключения к базе данных ---

const startServer = async () => {
  try {
    // 1. Проверка соединения
    await db.sequelize.authenticate();
    console.log('PostgreSQL connection established successfully.');

    // 2. Синхронизация моделей с БД (необязательно, но полезно при разработке)
    await db.sequelize.sync();

    // 3. Запуск сервера Express
    app.listen(PORT, () => {
      console.log(`сервер запускается в таком то порту ${PORT}`);
    });

  } catch (error) {
    console.error('Unable to connect to the database or start server:', error);
    process.exit(1); // Выход из процесса, если БД недоступна
  }
};

startServer();