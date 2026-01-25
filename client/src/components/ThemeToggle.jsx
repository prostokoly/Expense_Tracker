import React from "react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                padding: "10px 15px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "var(--button-bg)",
                color: "var(--button-text)",
                fontSize: "20px",
                cursor: "pointer",
                boxShadow: "var(--shadow)",
                zIndex: 1000,
                transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
            {isDark ? "☀️" : "🌙"}
        </button>
    );
};

export default ThemeToggle;
