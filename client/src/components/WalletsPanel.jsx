// src/components/WalletsPanel.js
import React from "react";
import ErrorDisplay from "./ErrorBoundary";
import { deleteWallet } from "../services/api";
const WalletsPanel = ({ wallets, loading, error, onRetry }) => {
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
                💼 Кошельки
            </h2>

            {loading ? (
                <div style={{ textAlign: "center", padding: "20px" }}>
                    <div>🔄 Загрузка кошельков...</div>
                </div>
            ) : error ? (
                <ErrorDisplay
                    error={error}
                    onRetry={onRetry}
                    title="Ошибка загрузки кошельков"
                />
            ) : wallets.length === 0 ? (
                <div
                    style={{
                        textAlign: "center",
                        padding: "20px",
                        color: "#6c757d",
                    }}
                >
                    📭 Нет кошельков
                </div>
            ) : (
                <div>
                    {wallets.map((wallet) => (
                        <div
                            key={wallet.id}
                            style={{
                                padding: "10px",
                                margin: "5px 0",
                                border: "1px solid #dee2e6",
                                borderRadius: "4px",
                                backgroundColor: "#f8f9fa",
                            }}
                        >
                            <strong>{wallet.name}</strong>

                            <span
                                style={{
                                    color:
                                        wallet.balance >= 0
                                            ? "#28a745"
                                            : "#dc3545",
                                    marginLeft: "10px",
                                    fontWeight: "bold",
                                }}
                            >
                                {wallet.balance} {wallet.currency}
                            </span>
                            <button
                                onClick={async () => {
                                    if (
                                        !window.confirm(
                                            `Удалить кошелёк «${wallet.name}»?`,
                                        )
                                    )
                                        return;
                                    try {
                                        await deleteWallet(wallet.id);
                                        onRetry(); // перезагружает список
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
                    ))}
                </div>
            )}
        </div>
    );
};

export default WalletsPanel;
