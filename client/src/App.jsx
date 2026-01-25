import React, { useState, useEffect } from "react";
import { getAllTransactions, getAllWallets } from "./services/api";
import { safeApiCall } from "./utils/apiHelper";
import TransactionForm from "./components/TransactionForm";
import WalletForm from "./components/WalletForm";
import WelcomeScreen from "./components/WelcomeScreen";
import Header from "./components/Header";
import WalletsPanel from "./components/WalletsPanel";
import TransactionsPanel from "./components/TransactionsPanel";
import GoalsPanel from "./components/GoalsPanel";
import ThemeToggle from "./components/ThemeToggle";
import { ThemeProvider } from "./context/ThemeContext";
import "./App.css";

function AppContent() {
    const [showWelcomeScreen, setShowWelcomeScreen] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [wallets, setWallets] = useState([]);

    const [loading, setLoading] = useState({
        transactions: false,
        wallets: false,
    });

    const [error, setError] = useState({
        transactions: null,
        wallets: null,
    });

    const [activeTab, setActiveTab] = useState(null);

    const showTransactionForm = activeTab === "transactions";
    const showWalletForm = activeTab === "wallets";
    const showGoals = activeTab === "goals";

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

    useEffect(() => {
        if (!showWelcomeScreen) {
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
                minHeight: "100vh",
            }}
        >
            <ThemeToggle />

            <Header
                totalBalance={totalBalance}
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />

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

            {showGoals && (
                <div
                    style={{
                        marginBottom: "20px",
                        maxWidth: "600px",
                        margin: "0 auto 20px",
                    }}
                >
                    <GoalsPanel />
                </div>
            )}

            {!showGoals && (
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "30px",
                        alignItems: "start",
                    }}
                >
                    <div>
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
            )}
        </div>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
}

export default App;
