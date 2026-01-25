import React, { useState, useEffect } from "react";

const GoalsPanel = () => {
    const [goals, setGoals] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newGoalName, setNewGoalName] = useState("");
    const [newGoalTarget, setNewGoalTarget] = useState("");
    const [addAmount, setAddAmount] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem("expenseTrackerGoals");

            if (saved && saved !== "undefined" && saved !== "null") {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    setGoals(parsed);
                }
            }
        } catch (error) {
            console.error("Ошибка загрузки:", error);
            setGoals([]);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (!isLoaded) return;

        try {
            localStorage.setItem("expenseTrackerGoals", JSON.stringify(goals));
        } catch (error) {
            console.error("Ошибка сохранения:", error);
        }
    }, [goals, isLoaded]);

    const addGoal = (e) => {
        e.preventDefault();
        if (!newGoalName.trim() || !newGoalTarget || newGoalTarget <= 0) {
            alert("Введите название и положительную сумму");
            return;
        }

        const goal = {
            id: Date.now(),
            name: newGoalName.trim(),
            target: parseFloat(newGoalTarget),
            current: 0,
        };

        console.log("Добавляю цель:", goal);

        setGoals((prevGoals) => [...prevGoals, goal]);
        setNewGoalName("");
        setNewGoalTarget("");
        setShowForm(false);
    };

    const deleteGoal = (id) => {
        if (window.confirm("Удалить цель?")) {
            setGoals((prevGoals) => prevGoals.filter((g) => g.id !== id));
        }
    };

    const addToGoal = (id) => {
        const amount = parseFloat(addAmount[id]);
        if (!amount || amount <= 0) {
            alert("Введите положительную сумму");
            return;
        }

        setGoals((prevGoals) =>
            prevGoals.map((goal) => {
                if (goal.id === id) {
                    const newCurrent = Math.min(
                        goal.current + amount,
                        goal.target,
                    );
                    return { ...goal, current: newCurrent };
                }
                return goal;
            }),
        );

        setAddAmount((prev) => ({ ...prev, [id]: "" }));
    };

    const getProgress = (current, target) => {
        if (!target || target <= 0) return "0.0";
        return Math.min((current / target) * 100, 100).toFixed(1);
    };

    const getBarColor = (progress) => {
        const p = parseFloat(progress);
        if (p >= 100) return "#2ecc71";
        if (p >= 50) return "#f39c12";
        return "#3498db";
    };

    if (!isLoaded) {
        return (
            <div style={{ textAlign: "center", padding: "20px" }}>
                Загрузка...
            </div>
        );
    }

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
                🎯 Цели накопления
            </h2>

            <button
                onClick={() => setShowForm(!showForm)}
                style={{
                    padding: "10px 20px",
                    backgroundColor: "var(--button-bg)",
                    color: "var(--button-text)",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    marginBottom: "15px",
                    fontSize: "14px",
                }}
            >
                {showForm ? "✕ Отмена" : "+ Добавить цель"}
            </button>

            {showForm && (
                <form
                    onSubmit={addGoal}
                    style={{
                        marginBottom: "20px",
                        padding: "15px",
                        backgroundColor: "var(--bg-color)",
                        borderRadius: "8px",
                    }}
                >
                    <div style={{ marginBottom: "10px" }}>
                        <input
                            type="text"
                            placeholder="Название цели (например: Новый ноутбук)"
                            value={newGoalName}
                            onChange={(e) => setNewGoalName(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "4px",
                                border: "1px solid var(--border-color)",
                                backgroundColor: "var(--card-bg)",
                                color: "var(--text-color)",
                                fontSize: "14px",
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="Целевая сумма (₽)"
                            value={newGoalTarget}
                            onChange={(e) => setNewGoalTarget(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px",
                                borderRadius: "4px",
                                border: "1px solid var(--border-color)",
                                backgroundColor: "var(--card-bg)",
                                color: "var(--text-color)",
                                fontSize: "14px",
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#27ae60",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                            fontSize: "14px",
                        }}
                    >
                        ✓ Создать цель
                    </button>
                </form>
            )}

            {goals.length === 0 ? (
                <div
                    style={{
                        textAlign: "center",
                        padding: "20px",
                        opacity: 0.7,
                    }}
                >
                    📭 Нет целей. Создайте первую!
                </div>
            ) : (
                <div>
                    {goals.map((goal) => {
                        const progress = getProgress(goal.current, goal.target);
                        const barColor = getBarColor(progress);
                        const isCompleted = parseFloat(progress) >= 100;

                        return (
                            <div
                                key={goal.id}
                                style={{
                                    padding: "15px",
                                    margin: "10px 0",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: "8px",
                                    backgroundColor: "var(--bg-color)",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "10px",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "16px",
                                        }}
                                    >
                                        {isCompleted ? "✅ " : "🎯 "}
                                        {goal.name}
                                    </span>
                                    <button
                                        onClick={() => deleteGoal(goal.id)}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            color: "#e74c3c",
                                            cursor: "pointer",
                                            fontSize: "18px",
                                        }}
                                    >
                                        🗑️
                                    </button>
                                </div>

                                <div
                                    style={{
                                        height: "20px",
                                        backgroundColor: "var(--card-bg)",
                                        borderRadius: "10px",
                                        overflow: "hidden",
                                        marginBottom: "10px",
                                        border: "1px solid var(--border-color)",
                                    }}
                                >
                                    <div
                                        style={{
                                            height: "100%",
                                            width: `${progress}%`,
                                            backgroundColor: barColor,
                                            transition: "width 0.3s ease",
                                        }}
                                    />
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        fontSize: "14px",
                                        marginBottom: "10px",
                                    }}
                                >
                                    <span>
                                        <strong>
                                            {goal.current.toFixed(2)} ₽
                                        </strong>
                                        {" / "}
                                        {goal.target.toFixed(2)} ₽
                                    </span>
                                    <span
                                        style={{
                                            fontWeight: "bold",
                                            color: barColor,
                                        }}
                                    >
                                        {progress}%
                                    </span>
                                </div>

                                {!isCompleted && (
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "10px",
                                            alignItems: "center",
                                        }}
                                    >
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0.01"
                                            placeholder="Сумма"
                                            value={addAmount[goal.id] || ""}
                                            onChange={(e) =>
                                                setAddAmount({
                                                    ...addAmount,
                                                    [goal.id]: e.target.value,
                                                })
                                            }
                                            style={{
                                                flex: 1,
                                                padding: "8px",
                                                borderRadius: "4px",
                                                border: "1px solid var(--border-color)",
                                                backgroundColor:
                                                    "var(--card-bg)",
                                                color: "var(--text-color)",
                                            }}
                                        />
                                        <button
                                            onClick={() => addToGoal(goal.id)}
                                            style={{
                                                padding: "8px 15px",
                                                backgroundColor: "#27ae60",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            + Пополнить
                                        </button>
                                    </div>
                                )}

                                {isCompleted && (
                                    <div
                                        style={{
                                            textAlign: "center",
                                            color: "#2ecc71",
                                            fontWeight: "bold",
                                            padding: "10px",
                                        }}
                                    >
                                        🎉 Цель достигнута!
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default GoalsPanel;
