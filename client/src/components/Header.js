// src/components/Header.js
import React from "react";

const Header = ({ totalBalance, activeTab, onTabChange }) => {
    const tabs = [
        {
            id: "categories",
            label: " Категории",
            color: "#007bff",
            icon: "📁",
        },
        {
            id: "transactions",
            label: " Транзакции",
            color: "#28a745",
            icon: "💳",
        },
        {
            id: "wallets",
            label: " Кошельки",
            color: "#ffc107",
            icon: "💼",
        },
    ];

    return (
        <header style={{ textAlign: "center", marginBottom: "30px" }}>
            <h1 style={{ color: "#2c3e50", marginBottom: "10px" }}>
                💰 Финансовый трекер
            </h1>

            {/* Блок с балансом */}
            <div
                style={{
                    background: totalBalance >= 0 ? "#e8f5e8" : "#ffe6e6",
                    padding: "20px",
                    borderRadius: "10px",
                    border: `2px solid ${totalBalance >= 0 ? "#28a745" : "#dc3545"}`,
                    display: "inline-block",
                    minWidth: "200px",
                    marginBottom: "20px",
                }}
            >
                <h2 style={{ margin: "0", color: "#2c3e50" }}>Общий баланс</h2>
                <div
                    style={{
                        fontSize: "2em",
                        fontWeight: "bold",
                        color: totalBalance >= 0 ? "#28a745" : "#dc3545",
                    }}
                >
                    {totalBalance.toFixed(2)} ₽
                </div>
            </div>

            {/* Кнопки-вкладки */}
            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "center",
                    flexWrap: "wrap",
                }}
            >
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const buttonText = isActive
                        ? `✖ ${tab.label}`
                        : `${tab.icon} ${tab.label}`;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            style={{
                                padding: "10px 20px",
                                backgroundColor: isActive
                                    ? "#6c757d"
                                    : tab.color,
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                fontWeight: "bold",
                                fontSize: "16px",
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.opacity = "0.9";
                                    e.currentTarget.style.transform =
                                        "translateY(-2px)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.opacity = "1";
                                    e.currentTarget.style.transform =
                                        "translateY(0)";
                                }
                            }}
                        >
                            {buttonText}
                        </button>
                    );
                })}
            </div>
        </header>
    );
};

export default Header;
