// client/src/App.js
import React, { useState, useEffect } from 'react';
import { getAllCategories, getAllTransactions, getAllWallets, createCategory, createTransaction, createWallet } from './services/api';
import CategoryForm from './components/CategoryForm';
import TransactionForm from './components/TransactionForm';
import './App.css';

// Улучшенная безопасная функция загрузки данных
const safeApiCall = async (apiFunction, defaultData = []) => {
  try {
    const response = await apiFunction();
    console.log('📊 API Response received:', response);
    
    let data = response?.data;
    
    // Если data undefined, возможно response уже является данными
    if (data === undefined) {
      data = response;
    }
    
    // Если data все еще не массив, но является объектом, попробуем извлечь массив
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      // Попробуем найти массив в объекте
      const arrayKeys = Object.keys(data).filter(key => Array.isArray(data[key]));
      if (arrayKeys.length > 0) {
        data = data[arrayKeys[0]];
        console.log('📊 Found array in key:', arrayKeys[0]);
      }
    }
    
    if (Array.isArray(data)) {
      console.log('✅ Data is valid array, length:', data.length);
      return { data, error: null };
    } else {
      console.warn('⚠️ Data is not array, returning default:', data);
      return { data: defaultData, error: null };
    }
  } catch (error) {
    // Игнорируем ошибки из reportWebVitals
    if (error.message === 'Server Error' && error.stack?.includes('reportWebVitals')) {
      console.log('⚠️ Ignoring reportWebVitals error');
      return { data: defaultData, error: null };
    }
    
    console.error('❌ API Error:', error);
    return { 
      data: defaultData, 
      error: error instanceof Error ? error : new Error(String(error))
    };
  }
};

// Компонент для отображения ошибок
const ErrorDisplay = ({ error, onRetry, title }) => (
  <div style={{ 
    color: '#721c24', 
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    padding: '15px', 
    borderRadius: '8px', 
    margin: '10px 0'
  }}>
    <strong>❌ {title}:</strong><br />
    {error?.message || 'Неизвестная ошибка'}
    {onRetry && (
      <button 
        onClick={onRetry}
        style={{ 
          marginLeft: '10px', 
          padding: '5px 15px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        Повторить попытку
      </button>
    )}
  </div>
);

// Компонент для отображения транзакции
const TransactionItem = ({ transaction }) => {
  if (!transaction || typeof transaction !== 'object') {
    return null;
  }

  try {
    const amount = parseFloat(transaction.amount) || 0;
    const type = transaction.type || 'expense';
    const description = transaction.description || 'Без описания';
    const date = transaction.date ? new Date(transaction.date).toLocaleDateString('ru-RU') : 'Не указана';
    const categoryName = transaction.category?.name || transaction.categoryId || 'Не указана';
    const walletName = transaction.wallet?.name || transaction.walletId || 'Не указан';

    const displayAmount = type === 'income' ? `+${amount.toFixed(2)}` : `-${amount.toFixed(2)}`;
    const amountColor = type === 'income' ? '#28a745' : '#dc3545';
    const backgroundColor = type === 'income' ? '#f0fff0' : '#fff0f0';

    return (
      <div style={{
        padding: '12px',
        margin: '8px 0',
        border: '1px solid #dee2e6',
        borderRadius: '6px',
        backgroundColor: backgroundColor
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>{description}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '14px' }}>
          <div>
            <strong>Сумма:</strong> 
            <span style={{ color: amountColor, fontWeight: 'bold', marginLeft: '5px' }}>
              {displayAmount} ₽
            </span>
          </div>
          <div><strong>Дата:</strong> {date}</div>
          <div><strong>Категория:</strong> {categoryName}</div>
          <div><strong>Кошелек:</strong> {walletName}</div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Ошибка рендеринга транзакции:', transaction, error);
    return null;
  }
};

function App() {
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState({ categories: false, transactions: false, wallets: false });
  const [error, setError] = useState({ categories: null, transactions: null, wallets: null });
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showWalletForm, setShowWalletForm] = useState(false);
  const [newWallet, setNewWallet] = useState({ name: '', balance: '', currency: 'RUB' });

  const loadCategories = async () => {
    setLoading(prev => ({ ...prev, categories: true }));
    const result = await safeApiCall(getAllCategories, []);
    setCategories(result.data);
    setError(prev => ({ ...prev, categories: result.error }));
    setLoading(prev => ({ ...prev, categories: false }));
  };

  const loadTransactions = async () => {
    setLoading(prev => ({ ...prev, transactions: true }));
    const result = await safeApiCall(getAllTransactions, []);
    setTransactions(result.data);
    setError(prev => ({ ...prev, transactions: result.error }));
    setLoading(prev => ({ ...prev, transactions: false }));
  };

  const loadWallets = async () => {
    setLoading(prev => ({ ...prev, wallets: true }));
    const result = await safeApiCall(getAllWallets, []);
    setWallets(result.data);
    setError(prev => ({ ...prev, wallets: result.error }));
    setLoading(prev => ({ ...prev, wallets: false }));
  };

  useEffect(() => {
    loadCategories();
    loadTransactions();
    loadWallets();
  }, []);

  // Форма для добавления кошелька
  const WalletForm = () => (
    <div style={{ 
      marginBottom: '20px', 
      padding: '15px', 
      border: '1px solid #dee2e6', 
      borderRadius: '8px',
      backgroundColor: '#f8f9fa'
    }}>
      <h3 style={{ marginTop: 0 }}>💼 Добавить кошелек</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '10px', alignItems: 'end' }}>
        <div>
          <label>Название:</label>
          <input
            type="text"
            placeholder="Название кошелька"
            value={newWallet.name}
            onChange={(e) => setNewWallet({...newWallet, name: e.target.value})}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div>
          <label>Баланс:</label>
          <input
            type="number"
            placeholder="0.00"
            value={newWallet.balance}
            onChange={(e) => setNewWallet({...newWallet, balance: e.target.value})}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div>
          <label>Валюта:</label>
          <select
            value={newWallet.currency}
            onChange={(e) => setNewWallet({...newWallet, currency: e.target.value})}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="RUB">RUB</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <button 
          onClick={handleAddWallet}
          style={{ 
            padding: '8px 15px', 
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Добавить
        </button>
      </div>
    </div>
  );

  const handleAddWallet = async () => {
    try {
      await createWallet({
        ...newWallet,
        balance: parseFloat(newWallet.balance) || 0
      });
      setNewWallet({ name: '', balance: '', currency: 'RUB' });
      setShowWalletForm(false);
      loadWallets();
    } catch (error) {
      console.error('Ошибка добавления кошелька:', error);
    }
  };

  // Безопасный расчет баланса
  const totalBalance = transactions.reduce((sum, transaction) => {
    try {
      const amount = parseFloat(transaction?.amount) || 0;
      const type = transaction?.type || 'expense';
      return type === 'income' ? sum + amount : sum - amount;
    } catch (error) {
      return sum;
    }
  }, 0);

  return (
    <div className="App" style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>💰 Финансовый трекер</h1>
        
        <div style={{ 
          background: totalBalance >= 0 ? '#e8f5e8' : '#ffe6e6',
          padding: '20px', 
          borderRadius: '10px', 
          border: `2px solid ${totalBalance >= 0 ? '#28a745' : '#dc3545'}`,
          display: 'inline-block',
          minWidth: '200px'
        }}>
          <h2 style={{ margin: '0', color: '#2c3e50' }}>Общий баланс</h2>
          <div style={{ 
            fontSize: '2em', 
            fontWeight: 'bold',
            color: totalBalance >= 0 ? '#28a745' : '#dc3545'
          }}>
            {totalBalance.toFixed(2)} ₽
          </div>
        </div>
      </header>

      {/* Кнопки управления */}
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '20px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        <button 
          onClick={() => setShowCategoryForm(!showCategoryForm)}
          style={{ 
            padding: '10px 20px',
            backgroundColor: showCategoryForm ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {showCategoryForm ? '✖' : '📁'} Категории
        </button>
        <button 
          onClick={() => setShowTransactionForm(!showTransactionForm)}
          style={{ 
            padding: '10px 20px',
            backgroundColor: showTransactionForm ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {showTransactionForm ? '✖' : '💳'} Транзакции
        </button>
        <button 
          onClick={() => setShowWalletForm(!showWalletForm)}
          style={{ 
            padding: '10px 20px',
            backgroundColor: showWalletForm ? '#6c757d' : '#ffc107',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {showWalletForm ? '✖' : '💼'} Кошельки
        </button>
      </div>

      {/* Формы */}
      {showCategoryForm && (
        <div style={{ marginBottom: '20px' }}>
          <CategoryForm onCategoryCreated={loadCategories} />
        </div>
      )}
      
      {showTransactionForm && (
        <div style={{ marginBottom: '20px' }}>
          <TransactionForm 
            onTransactionCreated={() => {
              loadTransactions();
              loadWallets();
            }} 
          />
        </div>
      )}
      
      {showWalletForm && <WalletForm />}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '30px',
        alignItems: 'start'
      }}>
        {/* Левая колонка - Категории и Кошельки */}
        <div>
          {/* Категории */}
          <div style={{ 
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            marginBottom: '20px'
          }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>📁 Категории</h2>
            
            {loading.categories ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div>🔄 Загрузка категорий...</div>
              </div>
            ) : error.categories ? (
              <ErrorDisplay 
                error={error.categories} 
                onRetry={loadCategories}
                title="Ошибка загрузки категорий"
              />
            ) : categories.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>
                📭 Нет категорий
              </div>
            ) : (
              <div>
                {categories.map(category => (
                  <div key={category.id} style={{
                    padding: '10px',
                    margin: '5px 0',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    backgroundColor: category.type === 'income' ? '#f0f8ff' : '#fff0f0'
                  }}>
                    <strong>{category.name}</strong>
                    <span style={{ 
                      color: category.type === 'income' ? '#28a745' : '#dc3545',
                      marginLeft: '10px'
                    }}>
                      ({category.type === 'income' ? 'доход' : 'расход'})
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Кошельки */}
          <div style={{ 
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>💼 Кошельки</h2>
            
            {loading.wallets ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div>🔄 Загрузка кошельков...</div>
              </div>
            ) : error.wallets ? (
              <ErrorDisplay 
                error={error.wallets} 
                onRetry={loadWallets}
                title="Ошибка загрузки кошельков"
              />
            ) : wallets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>
                📭 Нет кошельков
              </div>
            ) : (
              <div>
                {wallets.map(wallet => (
                  <div key={wallet.id} style={{
                    padding: '10px',
                    margin: '5px 0',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    backgroundColor: '#f8f9fa'
                  }}>
                    <strong>{wallet.name}</strong>
                    <span style={{ 
                      color: wallet.balance >= 0 ? '#28a745' : '#dc3545',
                      marginLeft: '10px',
                      fontWeight: 'bold'
                    }}>
                      {wallet.balance} {wallet.currency}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Правая колонка - Транзакции */}
        <div>
          <div style={{ 
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>💳 Транзакции</h2>
            
            {loading.transactions ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div>🔄 Загрузка транзакций...</div>
              </div>
            ) : error.transactions ? (
              <ErrorDisplay 
                error={error.transactions} 
                onRetry={loadTransactions}
                title="Ошибка загрузки транзакций"
              />
            ) : transactions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>
                📭 Нет транзакций
              </div>
            ) : (
              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {transactions.map(transaction => (
                  <TransactionItem key={transaction.id} transaction={transaction} />
                )).filter(Boolean)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;