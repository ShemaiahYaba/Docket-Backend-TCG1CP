'use strict';

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Hearing = sequelize.define(
    'Hearing',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      case_id: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      hearing_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      hearing_time: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      court_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      outcome: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      underscored: true,
      timestamps: true,
      tableName: 'hearings',
    }
  );

  Hearing.associate = (models) => {
    Hearing.belongsTo(models.Case, { foreignKey: 'case_id', as: 'case' });
    Hearing.belongsTo(models.Lawyer, { foreignKey: 'created_by', as: 'scheduledBy' });
  };

  return Hearing;
};
