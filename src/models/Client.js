'use strict';

const { DataTypes } = require('sequelize');
const { CLIENT_TYPE } = require('../constants');

module.exports = (sequelize) => {
  const Client = sequelize.define(
    'Client',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      full_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      client_type: {
        type: DataTypes.ENUM(...Object.values(CLIENT_TYPE)),
        allowNull: false,
      },
    },
    {
      underscored: true,
      timestamps: true,
      tableName: 'clients',
    }
  );

  Client.associate = (models) => {
    Client.hasMany(models.Case, { foreignKey: 'client_id', as: 'cases' });
  };

  return Client;
};
