import { Sequelize } from 'sequelize';
import settings from '../config/settings.js';
import defineLawyer from './Lawyer.js';
import defineClient from './Client.js';
import defineCase from './Case.js';
import defineHearing from './Hearing.js';
import defineEmailLog from './EmailLog.js';

const sequelize = new Sequelize(
  settings.db.name,
  settings.db.user,
  settings.db.password,
  {
    host: settings.db.host,
    port: settings.db.port,
    dialect: 'mysql',
    logging: false,
  }
);

const Lawyer   = defineLawyer(sequelize);
const Client   = defineClient(sequelize);
const Case     = defineCase(sequelize);
const Hearing  = defineHearing(sequelize);
const EmailLog = defineEmailLog(sequelize);

const models = { Lawyer, Client, Case, Hearing, EmailLog };
Object.values(models).forEach((m) => m.associate && m.associate(models));

export { sequelize, Sequelize, Lawyer, Client, Case, Hearing, EmailLog };
