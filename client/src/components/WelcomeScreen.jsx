// src/components/WelcomeScreen.js
import React from "react";

const WelcomeScreen = ({ onStart }) => {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#667eea",
                padding: "20px",
            }}
        >
            <div
                style={{
                    textAlign: "center",
                    color: "white",
                    maxWidth: "500px",
                }}
            >
                <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>
                    💰 Финансовый трекер
                </h1>

                <p style={{ fontSize: "1.2rem", marginBottom: "40px" }}>
                    Управляйте своими деньгами легко и просто
                </p>

                <button
                    onClick={onStart}
                    style={{
                        background: "white",
                        color: "#667eea",
                        border: "none",
                        padding: "12px 35px",
                        fontSize: "1rem",
                        borderRadius: "25px",
                        cursor: "pointer",
                        fontWeight: "bold",
                    }}
                >
                    Начать работу
                </button>
            </div>
        </div>
    );
};

export default WelcomeScreen;
