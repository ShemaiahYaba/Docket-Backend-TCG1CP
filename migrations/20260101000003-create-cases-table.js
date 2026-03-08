'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('cases', {
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
        type: DataTypes.ENUM('Civil', 'Criminal', 'Corporate', 'Family', 'Property'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('Active', 'Pending', 'In Review', 'Urgent', 'Closed'),
        allowNull: false,
        defaultValue: 'Pending',
      },
      client_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: 'clients', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      lawyer_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: { model: 'lawyers', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex('cases', ['status']);
    await queryInterface.addIndex('cases', ['lawyer_id']);
    await queryInterface.addIndex('cases', ['client_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('cases');
  },
};
