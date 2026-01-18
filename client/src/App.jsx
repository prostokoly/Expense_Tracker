// src/App.js
import React, { useState, useEffect } from "react";
import {
    getAllCategories,
    getAllTransactions,
    getAllWallets,
} from "./services/api";
import { safeApiCall } from "./utils/apiHelper";
// import CategoryForm from "./components/CategoryForm";
import TransactionForm from "./components/TransactionForm";
import WalletForm from "./components/WalletForm";
import WelcomeScreen from "./components/WelcomeScreen";
import Header from "./components/Header";
// import CategoriesPanel from "./components/CategoriesPanel";
import WalletsPanel from "./components/WalletsPanel";
import TransactionsPanel from "./components/TransactionsPanel";
import "./App.css";
// import AnalyticsPanel from "./components/AnalyticsPanel";

function App() {
    const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
    // const [categories, setCategories] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [wallets, setWallets] = useState([]);

    const [loading, setLoading] = useState({
        categories: false,
        transactions: false,
        wallets: false,
    });

    const [error, setError] = useState({
        categories: null,
        transactions: null,
        wallets: null,
    });

    const [activeTab, setActiveTab] = useState(null); // null, 'categories', 'transactions', 'wallets'

    //const showCategoryForm = activeTab === "categories";
    const showTransactionForm = activeTab === "transactions";
    const showWalletForm = activeTab === "wallets";

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

    const handleTabChange = (tab) => {
        setActiveTab(activeTab === tab ? null : tab);
    };
    const showAnalytics = activeTab === "analytics";
    useEffect(() => {
        if (!showWelcomeScreen) {
            // loadCategories();
            loadTransactions();
            loadWallets();
        }
    }, [showWelcomeScreen]);

    const calculateTotalBalance = () =>
        wallets.reduce((sum, w) => sum + (parseFloat(w.balance) || 0), 0);

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

            {/* {showCategoryForm && (
                <div style={{ marginBottom: "20px" }}>
                    <CategoryForm onCategoryCreated={loadCategories} />
                </div>
            )} */}

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
            {/* {showAnalytics && (
                <div style={{ marginBottom: "20px" }}>
                    <AnalyticsPanel transactions={transactions} />
                </div>
            )} */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "30px",
                    alignItems: "start",
                }}
            >
                <div>
                    {/* <CategoriesPanel
                        categories={categories}
                        loading={loading.categories}
                        error={error.categories}
                        onRetry={loadCategories}
                    /> */}
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
