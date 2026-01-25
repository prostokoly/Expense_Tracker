import React, { useState } from "react";
import { createWallet } from "../services/api";

const WalletForm = ({ onWalletCreated }) => {
    const [newWallet, setNewWallet] = useState({
        name: "",
        balance: "",
        currency: "RUB",
    });

    const handleAddWallet = async () => {
        try {
            await createWallet({
                ...newWallet,
                balance: parseFloat(newWallet.balance) || 0,
            });
            setNewWallet({ name: "", balance: "", currency: "RUB" });
            if (onWalletCreated) onWalletCreated();
        } catch (error) {
            console.error("Ошибка добавления кошелька:", error);
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "8px",
        borderRadius: "4px",
        border: "1px solid var(--border-color)",
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
        fontSize: "14px",
    };

    const labelStyle = {
        display: "block",
        marginBottom: "5px",
        color: "var(--text-color)",
        fontSize: "14px",
    };

    return (
        <div
            style={{
                marginBottom: "20px",
                padding: "15px",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                backgroundColor: "var(--card-bg)",
                color: "var(--text-color)",
            }}
        >
            <h3 style={{ marginTop: 0, color: "var(--text-color)" }}>
                💼 Добавить кошелек
            </h3>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr auto",
                    gap: "10px",
                    alignItems: "end",
                }}
            >
                <div>
                    <label style={labelStyle}>Название:</label>
                    <input
                        type="text"
                        placeholder="Название кошелька"
                        value={newWallet.name}
                        onChange={(e) =>
                            setNewWallet({ ...newWallet, name: e.target.value })
                        }
                        style={inputStyle}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Баланс:</label>
                    <input
                        type="number"
                        placeholder="0.00"
                        value={newWallet.balance}
                        onChange={(e) =>
                            setNewWallet({
                                ...newWallet,
                                balance: e.target.value,
                            })
                        }
                        style={inputStyle}
                    />
                </div>
                <div>
                    <label style={labelStyle}>Валюта:</label>
                    <select
                        value={newWallet.currency}
                        onChange={(e) =>
                            setNewWallet({
                                ...newWallet,
                                currency: e.target.value,
                            })
                        }
                        style={inputStyle}
                    >
                        <option value="RUB">RUB</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                    </select>
                </div>
                <button
                    onClick={handleAddWallet}
                    style={{
                        padding: "8px 15px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                    }}
                >
                    Добавить
                </button>
            </div>
        </div>
    );
};

export default WalletForm;
