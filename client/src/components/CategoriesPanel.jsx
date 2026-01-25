import React from "react";
import ErrorDisplay from "./ErrorBoundary";
import { deleteCategory } from "../services/api";
const CategoriesPanel = ({ categories, loading, error, onRetry }) => {
    return (
        <div
            style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                marginBottom: "20px",
            }}
        >
            <h2 style={{ color: "#2c3e50", marginBottom: "20px" }}>
                📁 Категории
            </h2>

            {loading ? (
                <div style={{ textAlign: "center", padding: "20px" }}>
                    <div>🔄 Загрузка категорий...</div>
                </div>
            ) : error ? (
                <ErrorDisplay
                    error={error}
                    onRetry={onRetry}
                    title="Ошибка загрузки категорий"
                />
            ) : categories.length === 0 ? (
                <div
                    style={{
                        textAlign: "center",
                        padding: "20px",
                        color: "#6c757d",
                    }}
                >
                    📭 Нет категорий
                </div>
            ) : (
                <div>
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            style={{
                                padding: "10px",
                                margin: "5px 0",
                                border: "1px solid #dee2e6",
                                borderRadius: "4px",
                                backgroundColor:
                                    category.type === "income"
                                        ? "#f0f8ff"
                                        : "#fff0f0",
                            }}
                        >
                            <strong>{category.name}</strong>

                            <span
                                style={{
                                    color:
                                        category.type === "income"
                                            ? "#28a745"
                                            : "#dc3545",
                                    marginLeft: "10px",
                                }}
                            >
                                (
                                {category.type === "income"
                                    ? "доход"
                                    : "расход"}
                                )
                            </span>
                            <button
                                onClick={async () => {
                                    if (
                                        !window.confirm(
                                            `Удалить категорию «${category.name}»?`,
                                        )
                                    )
                                        return;
                                    try {
                                        await deleteCategory(category.id);
                                        onRetry();
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

export default CategoriesPanel;
