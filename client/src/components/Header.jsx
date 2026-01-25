import React from "react";

const Header = ({ totalBalance, activeTab, onTabChange }) => {
    const tabs = [
        {
            id: "transactions",
            label: "Транзакции",
            color: "#28a745",
            icon: "💳",
        },
        {
            id: "wallets",
            label: "Кошельки",
            color: "#ffc107",
            icon: "💼",
        },
        {
            id: "goals",
            label: "Цели",
            color: "#9b59b6",
            icon: "🎯",
        },
    ];

    return (
        <header style={{ textAlign: "center", marginBottom: 30 }}>
            <h1 style={{ color: "var(--text-color)", marginBottom: 10 }}>
                💰 Финансовый трекер
            </h1>

            <div
                style={{
                    background:
                        totalBalance >= 0
                            ? "rgba(46, 204, 113, 0.2)"
                            : "rgba(231, 76, 60, 0.2)",
                    padding: "20px",
                    borderRadius: 10,
                    border: `2px solid ${totalBalance >= 0 ? "var(--income-color)" : "var(--expense-color)"}`,
                    display: "inline-block",
                    minWidth: 200,
                    marginBottom: 20,
                }}
            >
                <h2 style={{ margin: 0, color: "var(--text-color)" }}>
                    Общий баланс
                </h2>
                <div
                    style={{
                        fontSize: "2em",
                        fontWeight: "bold",
                        color:
                            totalBalance >= 0
                                ? "var(--income-color)"
                                : "var(--expense-color)",
                    }}
                >
                    {totalBalance.toFixed(2)} ₽
                </div>
            </div>

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
                                    : "var(--card-bg)",
                                color: isActive ? "white" : tab.color,
                                border: `2px solid ${isActive ? tab.color : "var(--border-color)"}`,
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
                                        "var(--card-bg)";
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
