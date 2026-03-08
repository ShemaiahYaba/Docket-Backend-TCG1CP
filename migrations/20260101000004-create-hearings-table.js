'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('hearings', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      case_id: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: { model: 'cases', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
        references: { model: 'lawyers', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
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

    await queryInterface.addIndex('hearings', ['hearing_date']);
    await queryInterface.addIndex('hearings', ['case_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('hearings');
  },
};
