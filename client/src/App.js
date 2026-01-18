// src/App.js
import React, { useState, useEffect } from "react";
import {
    getAllCategories,
    getAllTransactions,
    getAllWallets,
} from "./services/api";
import { safeApiCall } from "./utils/apiHelper";
import CategoryForm from "./components/CategoryForm";
import TransactionForm from "./components/TransactionForm";
import WalletForm from "./components/WalletForm";
import WelcomeScreen from "./components/WelcomeScreen";
import Header from "./components/Header";
import CategoriesPanel from "./components/CategoriesPanel";
import WalletsPanel from "./components/WalletsPanel";
import TransactionsPanel from "./components/TransactionsPanel";
import "./App.css";

function App() {
    // Состояние для приветственного экрана
    const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);

    // Данные
    const [categories, setCategories] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [wallets, setWallets] = useState([]);

    // Состояние загрузки
    const [loading, setLoading] = useState({
        categories: false,
        transactions: false,
        wallets: false,
    });

    // Ошибки
    const [error, setError] = useState({
        categories: null,
        transactions: null,
        wallets: null,
    });

    // Единое состояние для активной вкладки
    const [activeTab, setActiveTab] = useState(null); // null, 'categories', 'transactions', 'wallets'

    // Вычисляемые значения для отображения форм
    const showCategoryForm = activeTab === "categories";
    const showTransactionForm = activeTab === "transactions";
    const showWalletForm = activeTab === "wallets";

    // Функции загрузки данных
    const loadCategories = async () => {
        setLoading((prev) => ({ ...prev, categories: true }));
        const result = await safeApiCall(getAllCategories, []);
        setCategories(result.data);
        setError((prev) => ({ ...prev, categories: result.error }));
        setLoading((prev) => ({ ...prev, categories: false }));
    };

    const loadTransactions = async () => {
        setLoading((prev) => ({ ...prev, transactions: true }));
        const result = await safeApiCall(getAllTransactions, []);
        setTransactions(result.data);
        setError((prev) => ({ ...prev, transactions: result.error }));
        setLoading((prev) => ({ ...prev, transactions: false }));
    };

    const loadWallets = async () => {
        setLoading((prev) => ({ ...prev, wallets: true }));
        const result = await safeApiCall(getAllWallets, []);
        setWallets(result.data);
        setError((prev) => ({ ...prev, wallets: result.error }));
        setLoading((prev) => ({ ...prev, wallets: false }));
    };

    // Обработчики вкладок
    const handleTabChange = (tab) => {
        // Если нажимаем на уже активную вкладку - закрываем её
        // Иначе открываем новую вкладку
        setActiveTab(activeTab === tab ? null : tab);
    };

    useEffect(() => {
        if (!showWelcomeScreen) {
            loadCategories();
            loadTransactions();
            loadWallets();
        }
    }, [showWelcomeScreen]);

    const calculateTotalBalance = () => {
        return transactions.reduce((sum, transaction) => {
            try {
                const amount = parseFloat(transaction?.amount) || 0;
                const type = transaction?.type || "expense";
                return type === "income" ? sum + amount : sum - amount;
            } catch (error) {
                return sum;
            }
        }, 0);
    };

    if (showWelcomeScreen) {
        return <WelcomeScreen onStart={() => setShowWelcomeScreen(false)} />;
    }

    const totalBalance = calculateTotalBalance();

    return (
        <div
            className="App"
            style={{
                padding: "20px",
                fontFamily: "Arial, sans-serif",
                maxWidth: "1200px",
                margin: "0 auto",
            }}
        >
            <Header
                totalBalance={totalBalance}
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />

            {/* Форма категорий */}
            {showCategoryForm && (
                <div style={{ marginBottom: "20px" }}>
                    <CategoryForm onCategoryCreated={loadCategories} />
                </div>
            )}

            {/* Форма транзакций */}
            {showTransactionForm && (
                <div style={{ marginBottom: "20px" }}>
                    <TransactionForm
                        onTransactionCreated={() => {
                            loadTransactions();
                            loadWallets();
                        }}
                    />
                </div>
            )}

            {showWalletForm && (
                <div style={{ marginBottom: "20px" }}>
                    <WalletForm onWalletCreated={loadWallets} />
                </div>
            )}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "30px",
                    alignItems: "start",
                }}
            >
                <div>
                    <CategoriesPanel
                        categories={categories}
                        loading={loading.categories}
                        error={error.categories}
                        onRetry={loadCategories}
                    />
                    <WalletsPanel
                        wallets={wallets}
                        loading={loading.wallets}
                        error={error.wallets}
                        onRetry={loadWallets}
                    />
                </div>

                <div>
                    <TransactionsPanel
                        transactions={transactions}
                        loading={loading.transactions}
                        error={error.transactions}
                        onRetry={loadTransactions}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
