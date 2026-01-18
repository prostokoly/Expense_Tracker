// src/components/TransactionItem.js
import React from "react";

const TransactionItem = ({ transaction }) => {
    if (!transaction || typeof transaction !== "object") {
        return null;
    }

    try {
        const amount = parseFloat(transaction.amount) || 0;
        const type = transaction.type || "expense";
        const description = transaction.description || "Без описания";
        const date = transaction.date
            ? new Date(transaction.date).toLocaleDateString("ru-RU")
            : "Не указана";
        const categoryName =
            transaction.category?.name ||
            transaction.categoryId ||
            "Не указана";
        const walletName =
            transaction.wallet?.name || transaction.walletId || "Не указан";

        const displayAmount =
            type === "income"
                ? `+${amount.toFixed(2)}`
                : `-${amount.toFixed(2)}`;
        const amountColor = type === "income" ? "#28a745" : "#dc3545";
        const backgroundColor = type === "income" ? "#f0fff0" : "#fff0f0";

        return (
            <div
                style={{
                    padding: "12px",
                    margin: "8px 0",
                    border: "1px solid #dee2e6",
                    borderRadius: "6px",
                    backgroundColor: backgroundColor,
                }}
            >
                <div
                    style={{
                        fontWeight: "bold",
                        marginBottom: "8px",
                        fontSize: "16px",
                    }}
                >
                    {description}
                </div>
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "8px",
                        fontSize: "14px",
                    }}
                >
                    <div>
                        <strong>Сумма:</strong>
                        <span
                            style={{
                                color: amountColor,
                                fontWeight: "bold",
                                marginLeft: "5px",
                            }}
                        >
                            {displayAmount} ₽
                        </span>
                    </div>
                    <div>
                        <strong>Дата:</strong> {date}
                    </div>
                    <div>
                        <strong>Категория:</strong> {categoryName}
                    </div>
                    <div>
                        <strong>Кошелек:</strong> {walletName}
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error("Ошибка рендеринга транзакции:", transaction, error);
        return null;
    }
};

export default TransactionItem;
