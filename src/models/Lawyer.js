import { DataTypes } from 'sequelize';
import { ROLES } from '../constants/index.js';

export default (sequelize) => {
  const Lawyer = sequelize.define(
    'Lawyer',
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
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      specialty: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM(...Object.values(ROLES)),
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      underscored: true,
      timestamps: true,
      tableName: 'lawyers',
      defaultScope: {
        attributes: { exclude: ['password'] },
      },
      scopes: {
        withPassword: { attributes: {} },
      },
    }
  );

  Lawyer.associate = (models) => {
    Lawyer.hasMany(models.Case, { foreignKey: 'lawyer_id', as: 'cases' });
    Lawyer.hasMany(models.Hearing, { foreignKey: 'created_by', as: 'scheduledHearings' });
  };

  return Lawyer;
};
