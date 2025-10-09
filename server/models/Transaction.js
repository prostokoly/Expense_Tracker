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
    },
  });

  Transaction.associate = (models) => {
    Transaction.belongsTo(models.Category, {
      foreignKey: 'category_id', 
      as: 'category',            
    });
  };

  return Transaction;
};