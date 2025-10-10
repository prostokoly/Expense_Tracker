// server/controllers/TransactionController.js
const db = require('../models');

exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await db.Transaction.findAll();
        res.status(200).json(transactions);
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


exports.deleteTransaction = async (req, res) => {
    try {
        const deleted = await db.Transaction.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            return res.status(204).send();
        }
        return res.status(404).json({ message: 'Transaction not found' });
    } catch (error) {
        console.error('Delete transaction error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};