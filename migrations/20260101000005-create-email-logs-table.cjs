'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('email_logs', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      to: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      subject: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('welcome', 'hearing_confirmation', 'hearing_alert'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('sent', 'failed'),
        allowNull: false,
      },
      error_message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      sent_at: {
        type: DataTypes.DATE,
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

    await queryInterface.addIndex('email_logs', ['to']);
    await queryInterface.addIndex('email_logs', ['type']);
    await queryInterface.addIndex('email_logs', ['status']);
    await queryInterface.addIndex('email_logs', ['sent_at']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('email_logs');
  },
};
