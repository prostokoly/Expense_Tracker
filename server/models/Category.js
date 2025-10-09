const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, 
    },
    type: {
      type: DataTypes.ENUM('income', 'expense'), 
    },
  });
  return Category;
};