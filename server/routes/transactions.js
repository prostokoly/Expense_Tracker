const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/TransactionController');

router.get('/', TransactionController.getAllTransactions);

оrouter.post('/', TransactionController.createTransaction);

router.get('/:id', TransactionController.getTransactionById);

router.put('/:id', TransactionController.updateTransaction);

router.delete('/:id', TransactionController.deleteTransaction);

module.exports = router;