import React from "react";

// достаём категорию из конца описания
const getCategoryFromDesc = (desc = "") => {
    const m = desc.match(/\[(.+?)\]$/);
    return m ? m[1] : "Без категории";
};

// убираем метку из описания
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
        const amountColor = type === "income" ? "#28a745" : "#dc3545";
        const backgroundColor = type === "income" ? "#f0fff0" : "#fff0f0";

        const walletName = transaction.wallet?.name || "Не указан";

        return (
            <div
                style={{
                    padding: "12px",
                    margin: "8px 0",
                    border: "1px solid #dee2e6",
                    borderRadius: "6px",
                    backgroundColor,
                }}
            >
                <div
                    style={{
                        fontWeight: "bold",
                        marginBottom: "8px",
                        fontSize: "16px",
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
                        {localStorage.getItem("lastCategory") ||
                            "Без категории"}
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
