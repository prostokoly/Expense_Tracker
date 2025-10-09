const db = require('../models'); 
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await db.Transaction.findAll({
            include: [db.Category] // Включаем информацию о категории
        });
        res.status(200).json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.createTransaction = async (req, res) => {
    try {
        const { description, amount, date, categoryId } = req.body;
        const newTransaction = await db.Transaction.create({
            description,
            amount,
            date,
            categoryId
        });
        const transaction = await db.Transaction.findByPk(newTransaction.id, {
            include: [db.Category]
        });
        res.status(201).json(transaction); // 201 Created
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await db.Transaction.findByPk(req.params.id, {
            include: [db.Category]
        });
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.updateTransaction = async (req, res) => {
    try {
        const { description, amount, date, categoryId } = req.body;
        const [updated] = await db.Transaction.update({
            description,
            amount,
            date,
            categoryId
        }, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedTransaction = await db.Transaction.findByPk(req.params.id, {
                include: [db.Category]
            });
            return res.status(200).json(updatedTransaction);
        }
        return res.status(404).json({ message: 'Transaction not found' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const deleted = await db.Transaction.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            return res.status(204).send(); // 204 No Content
        }
        return res.status(404).json({ message: 'Transaction not found' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};