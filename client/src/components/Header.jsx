import React from "react";

const Header = ({ totalBalance, activeTab, onTabChange }) => {
    const tabs = [
        {
            id: "transactions",
            label: "Транзакции",
            color: "#28a745",
            icon: "💳",
        },
        { id: "wallets", label: "Кошельки", color: "#ffc107", icon: "💼" },
        // { id: "analytics", label: "Анализ", color: "#17a2b8", icon: "📊" },
    ];

    return (
        <header style={{ textAlign: "center", marginBottom: 30 }}>
            <h1 style={{ color: "#2c3e50", marginBottom: 10 }}>
                💰 Финансовый трекер
            </h1>

            {/* Блок баланса */}
            <div
                style={{
                    background: totalBalance >= 0 ? "#e8f5e8" : "#ffe6e6",
                    padding: "20px",
                    borderRadius: 10,
                    border: `2px solid ${totalBalance >= 0 ? "#28a745" : "#dc3545"}`,
                    display: "inline-block",
                    minWidth: 200,
                    marginBottom: 20,
                }}
            >
                <h2 style={{ margin: 0, color: "#2c3e50" }}>Общий баланс</h2>
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

            {/* Вкладки */}
            <div
                style={{
                    display: "flex",
                    gap: 10,
                    justifyContent: "center",
                    flexWrap: "wrap",
                }}
            >
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            style={{
                                padding: "10px 20px",
                                backgroundColor: isActive
                                    ? tab.color
                                    : "#f8f9fa",
                                color: isActive ? "white" : tab.color,
                                border: `2px solid ${isActive ? tab.color : "#dee2e6"}`,
                                borderRadius: 6,
                                cursor: "pointer",
                                fontWeight: 600,
                                fontSize: 16,
                                transition: "all .2s ease",
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive)
                                    e.currentTarget.style.backgroundColor =
                                        tab.color;
                                e.currentTarget.style.transform =
                                    "translateY(-2px)";
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive)
                                    e.currentTarget.style.backgroundColor =
                                        "#f8f9fa";
                                e.currentTarget.style.transform =
                                    "translateY(0)";
                            }}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    );
                })}
            </div>
        </header>
    );
};

export default Header;
