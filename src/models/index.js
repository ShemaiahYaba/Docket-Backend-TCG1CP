'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};

db.Lawyer  = require('./Lawyer')(sequelize, DataTypes);
db.Client  = require('./Client')(sequelize, DataTypes);
db.Case    = require('./Case')(sequelize, DataTypes);
db.Hearing = require('./Hearing')(sequelize, DataTypes);

Object.values(db).forEach((model) => {
  if (model.associate) model.associate(db);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
