const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/TransactionController');

// Убедитесь, что ВСЕ эти функции существуют в TransactionController
router.get('/', TransactionController.getAllTransactions);
router.post('/', TransactionController.createTransaction);
//router.get('/:id', TransactionController.getTransactionById);
//router.put('/:id', TransactionController.updateTransaction);
router.delete('/:id', TransactionController.deleteTransaction);

module.exports = router;