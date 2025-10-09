const { Sequelize } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Category = require('./Category')(sequelize, Sequelize.DataTypes);
db.Transaction = require('./Transaction')(sequelize, Sequelize.DataTypes);

db.Transaction.associate(db); 

module.exports = db;