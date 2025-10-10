// server/models/Category.js
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
            allowNull: false,
        },
    }, {
        tableName: 'Categories',
        timestamps: true,
        //underscored: true, // Добавляем эту опцию
    });

    Category.associate = (models) => {
        Category.hasMany(models.Transaction, {
            foreignKey: 'category_id', // Меняем на snake_case
            as: 'transactions',
            onDelete: 'CASCADE',
        });
    };

    return Category;
};