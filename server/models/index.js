const { Sequelize } = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

//const sequelize = new Sequelize(config.database, config.username, config.password, config);
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...config,
    define: {
      underscored: true, // Автоматически использует snake_case
      timestamps: true
    }
  }
);
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Category = require('./Category')(sequelize, Sequelize.DataTypes);
db.Transaction = require('./Transaction')(sequelize, Sequelize.DataTypes);
db.Wallet = require('./Wallet')(sequelize, Sequelize.DataTypes);


Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;