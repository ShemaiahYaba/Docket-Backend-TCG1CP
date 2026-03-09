import { DataTypes } from 'sequelize';
import { CASE_STATUS, CASE_TYPE } from '../constants/index.js';

export default (sequelize) => {
  const Case = sequelize.define(
    'Case',
    {
      id: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(300),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      case_type: {
        type: DataTypes.ENUM(...Object.values(CASE_TYPE)),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(CASE_STATUS)),
        allowNull: false,
        defaultValue: CASE_STATUS.PENDING,
      },
      client_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      lawyer_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      filed_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      closed_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
    },
    {
      underscored: true,
      timestamps: true,
      tableName: 'cases',
    }
  );

  Case.associate = (models) => {
    Case.belongsTo(models.Client, { foreignKey: 'client_id', as: 'client' });
    Case.belongsTo(models.Lawyer, { foreignKey: 'lawyer_id', as: 'lawyer' });
    Case.hasMany(models.Hearing, { foreignKey: 'case_id', as: 'hearings' });
  };

  return Case;
};
