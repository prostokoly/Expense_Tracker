'use strict';


module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('income', 'expense'),
        allowNull: false
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      categoryId: { 
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Categories', 
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      walletId: { 
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Wallets', 
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Transactions');
  }
};
