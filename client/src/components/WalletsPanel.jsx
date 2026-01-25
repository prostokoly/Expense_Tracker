import React from "react";
import ErrorDisplay from "./ErrorBoundary";
import { deleteWallet } from "../services/api";

const WalletsPanel = ({ wallets, loading, error, onRetry }) => {
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
                        color: "var(--text-color)",
                        opacity: 0.7,
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
                                border: "1px solid var(--border-color)",
                                borderRadius: "4px",
                                backgroundColor: "var(--bg-color)",
                                color: "var(--text-color)",
                            }}
                        >
                            <strong>{wallet.name}</strong>
                            <span
                                style={{
                                    color:
                                        wallet.balance >= 0
                                            ? "var(--income-color)"
                                            : "var(--expense-color)",
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

export default WalletsPanel;
