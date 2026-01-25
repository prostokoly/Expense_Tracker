const db = require("../models");

exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await db.Transaction.findAll({
            include: [
                {
                    model: db.Category,
                    as: "category",
                    attributes: ["id", "name", "type"],
                },
                {
                    model: db.Wallet,
                    as: "wallet",
                    attributes: ["id", "name", "balance"],
                },
            ],
            order: [["date", "DESC"]],
        });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
exports.createTransaction = async (req, res) => {
    const t = await db.sequelize.transaction();
    try {
        const { wallet_id, amount, type, category_id } = req.body;
        const numericAmount = parseFloat(amount) || 0;

        let finalCategoryId = category_id;
        if (finalCategoryId) {
            const cat = await db.Category.findByPk(finalCategoryId, {
                transaction: t,
            });
            if (!cat) finalCategoryId = null;
        }
        if (!finalCategoryId) {
            const defaultCat = await db.Category.findOne({
                where: { type: type || "income" },
                transaction: t,
            });
            finalCategoryId = defaultCat ? defaultCat.id : null;
        }

        const wallet = await db.Wallet.findByPk(wallet_id, { transaction: t });
        if (!wallet) {
            await t.rollback();
            return res.status(404).json({ message: "Wallet not found" });
        }

        let newBalance = parseFloat(wallet.balance) || 0;
        if (type === "income") newBalance += numericAmount;
        else if (type === "expense") newBalance -= numericAmount;
        await wallet.update({ balance: newBalance }, { transaction: t });

        const transaction = await db.Transaction.create(
            { ...req.body, category_id: finalCategoryId },
            { transaction: t },
        );

        await t.commit();

        const result = await db.Transaction.findByPk(transaction.id, {
            include: [
                {
                    model: db.Category,
                    as: "category",
                    attributes: ["id", "name", "type"],
                },
                {
                    model: db.Wallet,
                    as: "wallet",
                    attributes: ["id", "name", "balance"],
                },
            ],
        });
        res.status(201).json(result);
    } catch (error) {
        await t.rollback();
        if (error.name === "SequelizeForeignKeyConstraintError") {
            res.status(400).json({
                message: "Invalid category or wallet",
                error: error.parent?.detail || error.message,
            });
        } else {
            res.status(500).json({
                message: "Server Error",
                error: error.message,
            });
        }
    }
};

exports.deleteTransaction = async (req, res) => {
    const t = await db.sequelize.transaction();

    try {
        const tx = await db.Transaction.findByPk(req.params.id, {
            transaction: t,
            include: [
                { model: db.Category, as: "category", attributes: ["type"] },
                {
                    model: db.Wallet,
                    as: "wallet",
                    attributes: ["id", "balance"],
                },
            ],
        });

        if (!tx) {
            await t.rollback();
            return res.status(404).json({ message: "Transaction not found" });
        }

        const amount = parseFloat(tx.amount) || 0;
        let balance = parseFloat(tx.wallet.balance) || 0;

        if (tx.category?.type === "income") balance -= amount;
        else balance += amount;

        await tx.wallet.update({ balance }, { transaction: t });

        await tx.destroy({ transaction: t });
        await t.commit();

        res.status(204).send();
    } catch (err) {
        await t.rollback();
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};
