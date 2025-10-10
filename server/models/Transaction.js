// server/models/Transaction.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Transaction = sequelize.define('Transaction', {
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('income', 'expense'),
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'Transactions',
        timestamps: true,
        //underscored: true, // Добавляем эту опцию для snake_case
    });

    Transaction.associate = (models) => {
        Transaction.belongsTo(models.Wallet, {
            foreignKey: 'wallet_id', // Меняем на snake_case
            as: 'wallet',
        });
        Transaction.belongsTo(models.Category, {
            foreignKey: 'category_id', // Меняем на snake_case
            as: 'category',
        });
    };

    return Transaction;
};