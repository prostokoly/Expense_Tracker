import React from "react";

const getCategoryFromDesc = (desc = "") => {
    const m = desc.match(/\[(.+?)\]$/);
    return m ? m[1] : "Без категории";
};

const getCleanDesc = (desc = "") => {
    return desc.replace(/\s*\[.+?\]$/, "").trim() || "Без описания";
};

const TransactionItem = ({ transaction }) => {
    if (!transaction || typeof transaction !== "object") return null;

    try {
        const amount = parseFloat(transaction.amount) || 0;
        const type = transaction.type || "expense";
        const date = transaction.date
            ? new Date(transaction.date).toLocaleDateString("ru-RU")
            : "Не указана";

        const cleanDesc = getCleanDesc(transaction.description);
        const category = getCategoryFromDesc(transaction.description);

        const displayAmount =
            type === "income"
                ? `+${amount.toFixed(2)}`
                : `-${amount.toFixed(2)}`;

        // Используем CSS-переменные для цветов
        const amountColor =
            type === "income" ? "var(--income-color)" : "var(--expense-color)";

        // Фон адаптируется под тему
        const backgroundColor =
            type === "income"
                ? "rgba(46, 204, 113, 0.1)" // полупрозрачный зелёный
                : "rgba(231, 76, 60, 0.1)"; // полупрозрачный красный

        const walletName = transaction.wallet?.name || "Не указан";

        return (
            <div
                style={{
                    padding: "12px",
                    margin: "8px 0",
                    border: "1px solid var(--border-color)",
                    borderRadius: "6px",
                    backgroundColor,
                    color: "var(--text-color)",
                }}
            >
                <div
                    style={{
                        fontWeight: "bold",
                        marginBottom: "8px",
                        fontSize: "16px",
                        color: "var(--text-color)",
                    }}
                >
                    {cleanDesc}
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "8px",
                        fontSize: "14px",
                        color: "var(--text-color)",
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
                        <strong>Категория:</strong>{" "}
                        {category || "Без категории"}
                    </div>
                    <div>
                        <strong>Кошелек:</strong> {walletName}
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        return null;
    }
};

export default TransactionItem;
