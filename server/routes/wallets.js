// server/routes/wallets.js
const express = require('express');
const router = express.Router();
const db = require('../models'); // Импортируем модели из index.js
const { Wallet } = db; // Получаем модель Wallet

// Middleware для обработки ошибок
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// GET /api/wallets - Получить все кошельки
router.get('/', asyncHandler(async (req, res) => {
    const wallets = await Wallet.findAll();
    res.json(wallets);
}));

// GET /api/wallets/:id - Получить кошелек по ID
router.get('/:id', asyncHandler(async (req, res) => {
    const wallet = await Wallet.findByPk(req.params.id);
    if (!wallet) {
        return res.status(404).json({ message: 'Кошелек не найден' });
    }
    res.json(wallet);
}));

// POST /api/wallets - Создать новый кошелек
router.post('/', asyncHandler(async (req, res) => {
    const wallet = await Wallet.create(req.body);
    res.status(201).json(wallet);
}));

// PUT /api/wallets/:id - Обновить кошелек
router.put('/:id', asyncHandler(async (req, res) => {
    const wallet = await Wallet.findByPk(req.params.id);
    if (!wallet) {
        return res.status(404).json({ message: 'Кошелек не найден' });
    }
    await wallet.update(req.body);
    res.json(wallet);
}));

// DELETE /api/wallets/:id - Удалить кошелек
router.delete('/:id', asyncHandler(async (req, res) => {
    const wallet = await Wallet.findByPk(req.params.id);
    if (!wallet) {
        return res.status(404).json({ message: 'Кошелек не найден' });
    }
    await wallet.destroy();
    res.status(204).send(); // 204 No Content - успешное удаление
}));

module.exports = router;