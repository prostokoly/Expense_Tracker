
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Wallet = sequelize.define('Wallet', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        balance: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.0,
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'RUB',
        },
    }, {
        tableName: 'Wallets',
        timestamps: true,
       
    });

    Wallet.associate = (models) => {
        Wallet.hasMany(models.Transaction, {
            foreignKey: 'wallet_id', 
            as: 'transactions',
            onDelete: 'CASCADE',
        });
    };

    return Wallet;
};
