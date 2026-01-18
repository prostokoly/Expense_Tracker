// src/components/TransactionsPanel.js
import React from "react";
import ErrorDisplay from "./ErrorBoundary";
import TransactionItem from "./TransactionItem";
import { deleteTransaction } from "../services/api"; // ✅ 1

const TransactionsPanel = ({ transactions, loading, error, onRetry }) => {
    return (
        <div
            style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
        >
            <h2 style={{ color: "#2c3e50", marginBottom: "20px" }}>
                💳 Транзакции
            </h2>

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
                        color: "#6c757d",
                    }}
                >
                    📭 Нет транзакций
                </div>
            ) : (
                <div style={{ maxHeight: "500px", overflowY: "auto" }}>
                    {transactions
                        .map((transaction) => (
                            <div
                                key={transaction.id}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "8px 0",
                                    borderBottom: "1px solid #eee",
                                }}
                            >
                                <TransactionItem transaction={transaction} />
                                {/* ✅ 2 кнопка удаления */}
                                <button
                                    onClick={async () => {
                                        if (
                                            !window.confirm(
                                                "Удалить транзакцию?",
                                            )
                                        )
                                            return;
                                        try {
                                            await deleteTransaction(
                                                transaction.id,
                                            );
                                            onRetry(); // перезагружаем список
                                        } catch (e) {
                                            alert(e.message);
                                        }
                                    }}
                                    style={{
                                        marginLeft: 10,
                                        color: "red",
                                        fontSize: 12,
                                    }}
                                >
                                    Удалить
                                </button>
                            </div>
                        ))
                        .filter(Boolean)}
                </div>
            )}
        </div>
    );
};

export default TransactionsPanel;
