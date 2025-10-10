// client/src/components/TransactionForm.js
import React, { useState, useEffect } from 'react';
import { createTransaction, getAllCategories, getAllWallets } from '../services/api';

const TransactionForm = ({ onTransactionCreated }) => {
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        date: new Date().toISOString().slice(0, 10),
        type: 'expense',
        categoryId: '',
        walletId: ''
    });
    const [categories, setCategories] = useState([]);
    const [wallets, setWallets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Красивые категории с иконками
    const expenseCategories = [
        { id: '1', name: '🛒 Шоппинг', type: 'expense' },
        { id: '2', name: '🍕 Еда', type: 'expense' },
        { id: '3', name: '📞 Телефон', type: 'expense' },
        { id: '4', name: '🎭 Развлечения', type: 'expense' },
        { id: '5', name: '🎓 Образование', type: 'expense' },
        { id: '6', name: '💄 Красота', type: 'expense' },
        { id: '7', name: '⚽ Спорт', type: 'expense' },
        { id: '8', name: '🚗 Транспорт', type: 'expense' },
        { id: '9', name: '👕 Одежда', type: 'expense' },
        { id: '10', name: '🏠 Жилье', type: 'expense' },
        { id: '11', name: '🎁 Подарки', type: 'expense' },
        { id: '12', name: '❤️ Здоровье', type: 'expense' }
    ];

    const incomeCategories = [
        { id: '13', name: '💰 Зарплата', type: 'income' },
        { id: '14', name: '📈 Инвестиции', type: 'income' },
        { id: '15', name: '🎁 Награды', type: 'income' },
        { id: '16', name: '💼 Фриланс', type: 'income' }
    ];

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const walletsResponse = await getAllWallets();
                setWallets(walletsResponse.data);

                // Используем красивые категории вместо API
                setCategories([...expenseCategories, ...incomeCategories]);

                // Устанавливаем первые значения по умолчанию
                if (walletsResponse.data.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        walletId: walletsResponse.data[0].id.toString()
                    }));
                }
                if (expenseCategories.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        categoryId: expenseCategories[0].id
                    }));
                }

            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
                setError('Не удалось загрузить кошельки');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTypeChange = (type) => {
        setFormData(prev => ({
            ...prev,
            type,
            categoryId: '' // Сбрасываем категорию при смене типа
        }));
    };

    const handleCategorySelect = (categoryId) => {
        setFormData(prev => ({
            ...prev,
            categoryId
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Валидация
        if (!formData.description.trim()) {
            setError('Введите описание транзакции');
            setLoading(false);
            return;
        }
        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            setError('Введите корректную сумму');
            setLoading(false);
            return;
        }
        if (!formData.categoryId) {
            setError('Выберите категорию');
            setLoading(false);
            return;
        }
        if (!formData.walletId) {
            setError('Выберите кошелек');
            setLoading(false);
            return;
        }

        const transactionData = {
            description: formData.description.trim(),
            amount: parseFloat(formData.amount),
            date: formData.date,
            type: formData.type,
            category_id: formData.categoryId,
            wallet_id: parseInt(formData.walletId),
        };

        try {
            await createTransaction(transactionData);
            console.log('Транзакция успешно создана!');
            
            // Сброс формы
            setFormData({
                description: '',
                amount: '',
                date: new Date().toISOString().slice(0, 10),
                type: 'expense',
                categoryId: expenseCategories[0]?.id || '',
                walletId: wallets.length > 0 ? wallets[0].id.toString() : ''
            });

            if (onTransactionCreated) {
                onTransactionCreated();
            }
        } catch (error) {
            console.error('Ошибка при создании транзакции:', error);
            setError(error.message || 'Ошибка при создании транзакции');
        } finally {
            setLoading(false);
        }
    };

    const currentCategories = formData.type === 'expense' ? expenseCategories : incomeCategories;

    return (
        <form onSubmit={handleSubmit} style={{ 
            maxWidth: '500px', 
            margin: '20px auto',
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '15px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: '1px solid #e0e0e0'
        }}>
            <h3 style={{ 
                textAlign: 'center', 
                marginBottom: '25px',
                color: '#2c3e50',
                fontSize: '24px',
                fontWeight: '600'
            }}>
                💰 Новая транзакция
            </h3>
            
            {error && (
                <div style={{ 
                    color: '#d63031', 
                    backgroundColor: '#ffeaa7',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    textAlign: 'center',
                    fontWeight: '500'
                }}>
                    ⚠️ {error}
                </div>
            )}
            
            {/* Выбор типа транзакции */}
            <div style={{ 
                display: 'flex', 
                gap: '10px', 
                marginBottom: '25px',
                justifyContent: 'center'
            }}>
                <button
                    type="button"
                    onClick={() => handleTypeChange('expense')}
                    style={{
                        padding: '12px 20px',
                        border: `2px solid ${formData.type === 'expense' ? '#e74c3c' : '#bdc3c7'}`,
                        borderRadius: '10px',
                        backgroundColor: formData.type === 'expense' ? '#e74c3c' : 'white',
                        color: formData.type === 'expense' ? 'white' : '#2c3e50',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600',
                        flex: 1,
                        transition: 'all 0.3s ease'
                    }}
                >
                    📤 Расход
                </button>
                <button
                    type="button"
                    onClick={() => handleTypeChange('income')}
                    style={{
                        padding: '12px 20px',
                        border: `2px solid ${formData.type === 'income' ? '#27ae60' : '#bdc3c7'}`,
                        borderRadius: '10px',
                        backgroundColor: formData.type === 'income' ? '#27ae60' : 'white',
                        color: formData.type === 'income' ? 'white' : '#2c3e50',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600',
                        flex: 1,
                        transition: 'all 0.3s ease'
                    }}
                >
                    📥 Доход
                </button>
            </div>
            
            {/* Поле описания */}
            <div style={{ marginBottom: '20px' }}>
                <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#2c3e50'
                }}>
                    📝 Описание:
                </label>
                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Например: Покупка продуктов"
                    required
                    style={{ 
                        width: '100%', 
                        padding: '12px',
                        border: '2px solid #dfe6e9',
                        borderRadius: '8px',
                        fontSize: '16px',
                        transition: 'border 0.3s ease'
                    }}
                />
            </div>
            
            {/* Поле суммы */}
            <div style={{ marginBottom: '20px' }}>
                <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#2c3e50'
                }}>
                    💰 Сумма:
                </label>
                <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0.01"
                    required
                    style={{ 
                        width: '100%', 
                        padding: '12px',
                        border: '2px solid #dfe6e9',
                        borderRadius: '8px',
                        fontSize: '18px',
                        fontWeight: 'bold'
                    }}
                />
            </div>
            
            {/* Выбор категории */}
            <div style={{ marginBottom: '20px' }}>
                <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#2c3e50'
                }}>
                    🏷️ Категория:
                </label>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '10px',
                    maxHeight: '200px',
                    overflowY: 'auto'
                }}>
                    {currentCategories.map((category) => (
                        <button
                            key={category.id}
                            type="button"
                            onClick={() => handleCategorySelect(category.id)}
                            style={{
                                padding: '12px 8px',
                                border: `2px solid ${formData.categoryId === category.id ? '#3498db' : '#dfe6e9'}`,
                                borderRadius: '8px',
                                backgroundColor: formData.categoryId === category.id ? '#e3f2fd' : 'white',
                                color: '#2c3e50',
                                cursor: 'pointer',
                                fontSize: '14px',
                                textAlign: 'center',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Выбор кошелька */}
            <div style={{ marginBottom: '25px' }}>
                <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#2c3e50'
                }}>
                    💼 Кошелек:
                </label>
                <select
                    name="walletId"
                    value={formData.walletId}
                    onChange={handleChange}
                    required
                    style={{ 
                        width: '100%', 
                        padding: '12px',
                        border: '2px solid #dfe6e9',
                        borderRadius: '8px',
                        fontSize: '16px',
                        backgroundColor: 'white'
                    }}
                >
                    <option value="">Выберите кошелек</option>
                    {wallets.map((wallet) => (
                        <option key={wallet.id} value={wallet.id}>
                            {wallet.name} • {wallet.balance} {wallet.currency}
                        </option>
                    ))}
                </select>
            </div>
            
            {/* Дата */}
            <div style={{ marginBottom: '25px' }}>
                <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: '600',
                    color: '#2c3e50'
                }}>
                    📅 Дата:
                </label>
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    style={{ 
                        width: '100%', 
                        padding: '12px',
                        border: '2px solid #dfe6e9',
                        borderRadius: '8px',
                        fontSize: '16px'
                    }}
                />
            </div>
            
            {/* Кнопка отправки */}
            <button 
                type="submit" 
                disabled={loading}
                style={{ 
                    width: '100%',
                    padding: '15px',
                    backgroundColor: loading ? '#bdc3c7' : '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '18px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.3s ease'
                }}
            >
                {loading ? '⏳ Добавление...' : '✅ Добавить транзакцию'}
            </button>
        </form>
    );
};

export default TransactionForm;