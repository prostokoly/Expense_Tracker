
const express = require("express");
const router = express.Router();
const db = require("../models");
const { Wallet, Transaction } = db;


const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};


router.get(
    "/",
    asyncHandler(async (req, res) => {
        const wallets = await Wallet.findAll({
            include: [
                {
                    model: Transaction,
                    as: "transactions",
                    attributes: ["id", "amount", "type", "date"],
                },
            ],
        });

        
        const walletsWithCalculatedBalance = wallets.map((wallet) => {
            let calculatedBalance = parseFloat(wallet.balance) || 0;

            if (wallet.transactions && wallet.transactions.length > 0) {
                wallet.transactions.forEach((transaction) => {
                    const amount = parseFloat(transaction.amount) || 0;
                    if (transaction.type === "income") {
                        calculatedBalance += amount;
                    } else if (transaction.type === "expense") {
                        calculatedBalance -= amount;
                    }
                });
            }

            return {
                ...wallet.toJSON(),
                calculatedBalance: calculatedBalance.toFixed(2),
            };
        });

        res.json(walletsWithCalculatedBalance);
    }),
);



router.get(
    "/:id",
    asyncHandler(async (req, res) => {
        const wallet = await Wallet.findByPk(req.params.id, {
            include: [
                {
                    model: Transaction,
                    as: "transactions",
                    attributes: ["id", "amount", "type", "date", "description"],
                },
            ],
        });
        if (!wallet) {
            return res.status(404).json({ message: "Кошелек не найден" });
        }
        res.json(wallet);
    }),
);


router.post(
    "/",
    asyncHandler(async (req, res) => {
        const wallet = await Wallet.create(req.body);
        res.status(201).json(wallet);
    }),
);


router.put(
    "/:id",
    asyncHandler(async (req, res) => {
        const wallet = await Wallet.findByPk(req.params.id);
        if (!wallet) {
            return res.status(404).json({ message: "Кошелек не найден" });
        }
        await wallet.update(req.body);
        res.json(wallet);
    }),
);


router.delete(
    "/:id",
    asyncHandler(async (req, res) => {
        const wallet = await Wallet.findByPk(req.params.id);
        if (!wallet) {
            return res.status(404).json({ message: "Кошелек не найден" });
        }
        await wallet.destroy();
        res.status(204).send();
    }),
);

module.exports = router;
