
const db = require("../models");


exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await db.Transaction.findAll({
            include: [
                { model: db.Category, as: "category" },
                { model: db.Wallet, as: "wallet" },
            ],
            order: [["date", "DESC"]],
        });
        res.status(200).json(transactions);
    } catch (error) {
        console.error("Get transactions error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


exports.createTransaction = async (req, res) => {
    const t = await db.sequelize.transaction();

    try {
        console.log("Create transaction body:", req.body);

        const { wallet_id, amount, type } = req.body;
        const numericAmount = parseFloat(amount) || 0;

        
        if (req.body.category_id) {
            const category = await db.Category.findByPk(req.body.category_id, {
                transaction: t,
            });
            if (!category) {
                const defaultCategory = await db.Category.findOne({
                    where: { type: req.body.type || "income" },
                    transaction: t,
                });
                req.body.category_id = defaultCategory
                    ? defaultCategory.id
                    : null;
            }
        }

        
        const wallet = await db.Wallet.findByPk(wallet_id, { transaction: t });
        if (!wallet) {
            await t.rollback();
            return res.status(404).json({ message: "Wallet not found" });
        }

        
        let newBalance = parseFloat(wallet.balance) || 0;
        if (type === "income") {
            newBalance += numericAmount;
        } else if (type === "expense") {
            newBalance -= numericAmount;
        }

        await wallet.update({ balance: newBalance }, { transaction: t });

        
        const transaction = await db.Transaction.create(req.body, {
            transaction: t,
        });

        
        await t.commit();

        
        const result = await db.Transaction.findByPk(transaction.id, {
            include: [
                { model: db.Category, as: "category" },
                { model: db.Wallet, as: "wallet" },
            ],
        });

        res.status(201).json(result);
    } catch (error) {
        await t.rollback();
        console.error("Create transaction error:", error);

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
        const transaction = await db.Transaction.findByPk(req.params.id, {
            transaction: t,
            include: [{ model: db.Wallet, as: "wallet" }],
        });

        if (!transaction) {
            await t.rollback();
            return res.status(404).json({ message: "Transaction not found" });
        }

        
        if (transaction.wallet) {
            const wallet = transaction.wallet;
            const amount = parseFloat(transaction.amount) || 0;
            let newBalance = parseFloat(wallet.balance) || 0;

            
            if (transaction.type === "income") {
                newBalance -= amount; 
            } else if (transaction.type === "expense") {
                newBalance += amount; 
            }

            await wallet.update({ balance: newBalance }, { transaction: t });
        }

        
        await transaction.destroy({ transaction: t });

        await t.commit();
        res.status(204).send();
    } catch (error) {
        await t.rollback();
        console.error("Delete transaction error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
