import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const EmailLog = sequelize.define(
    'EmailLog',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
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
    },
    {
      tableName: 'email_logs',
      underscored: true,
      timestamps: true,
    }
  );

  EmailLog.associate = () => {
    // No associations — standalone audit log table
  };

  return EmailLog;
};
