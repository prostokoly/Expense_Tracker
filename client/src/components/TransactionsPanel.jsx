import React, { useState } from "react";
import ErrorDisplay from "./ErrorBoundary";
import TransactionItem from "./TransactionItem";
import { deleteTransaction } from "../services/api";

const TransactionsPanel = ({ transactions, loading, error, onRetry }) => {
    const [sortBy, setSortBy] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");

    const sortedTransactions = [...transactions].sort((a, b) => {
        let comparison = 0;
        if (sortBy === "date") {
            comparison = new Date(a.date) - new Date(b.date);
        } else if (sortBy === "amount") {
            comparison = a.amount - b.amount;
        }
        return sortOrder === "asc" ? comparison : -comparison;
    });

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("desc");
        }
    };

    const getArrow = (field) => {
        if (sortBy !== field) return "↕️";
        return sortOrder === "asc" ? "↑" : "↓";
    };

    return (
        <div
            style={{
                backgroundColor: "var(--card-bg)",
                color: "var(--text-color)",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "var(--shadow)",
            }}
        >
            <h2 style={{ color: "var(--text-color)", marginBottom: "20px" }}>
                💳 Транзакции
            </h2>

            {!loading && !error && transactions.length > 0 && (
                <div
                    style={{
                        marginBottom: "15px",
                        display: "flex",
                        gap: "10px",
                    }}
                >
                    <button
                        onClick={() => handleSort("date")}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "5px",
                            border: "1px solid var(--border-color)",
                            backgroundColor:
                                sortBy === "date"
                                    ? "var(--button-bg)"
                                    : "var(--card-bg)",
                            color:
                                sortBy === "date"
                                    ? "var(--button-text)"
                                    : "var(--text-color)",
                            cursor: "pointer",
                            fontSize: "14px",
                        }}
                    >
                        Дата {getArrow("date")}
                    </button>
                    <button
                        onClick={() => handleSort("amount")}
                        style={{
                            padding: "8px 16px",
                            borderRadius: "5px",
                            border: "1px solid var(--border-color)",
                            backgroundColor:
                                sortBy === "amount"
                                    ? "var(--button-bg)"
                                    : "var(--card-bg)",
                            color:
                                sortBy === "amount"
                                    ? "var(--button-text)"
                                    : "var(--text-color)",
                            cursor: "pointer",
                            fontSize: "14px",
                        }}
                    >
                        Сумма {getArrow("amount")}
                    </button>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: "center", padding: "20px" }}>
                    <div>🔄 Загрузка транзакций...</div>
                </div>
            ) : error ? (
                <ErrorDisplay
                    error={error}
                    onRetry={onRetry}
                    title="Ошибка загрузки транзакций"
                />
            ) : transactions.length === 0 ? (
                <div
                    style={{
                        textAlign: "center",
                        padding: "20px",
                        color: "var(--text-color)",
                        opacity: 0.7,
                    }}
                >
                    📭 Нет транзакций
                </div>
            ) : (
                <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                    {sortedTransactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "8px 0",
                                borderBottom: "1px solid var(--border-color)",
                            }}
                        >
                            <TransactionItem transaction={transaction} />
                            <button
                                onClick={async () => {
                                    if (!window.confirm("Удалить транзакцию?"))
                                        return;
                                    try {
                                        await deleteTransaction(transaction.id);
                                        onRetry();
                                    } catch (e) {
                                        alert(e.message);
                                    }
                                }}
                                style={{
                                    marginLeft: 10,
                                    color: "#e74c3c",
                                    fontSize: 12,
                                    backgroundColor: "transparent",
                                    border: "1px solid #e74c3c",
                                    borderRadius: "4px",
                                    padding: "4px 8px",
                                    cursor: "pointer",
                                }}
                            >
                                Удалить
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TransactionsPanel;
