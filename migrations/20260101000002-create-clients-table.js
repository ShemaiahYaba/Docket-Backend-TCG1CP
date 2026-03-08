'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('clients', {
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
        type: DataTypes.ENUM('individual', 'corporate'),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('clients');
  },
};
