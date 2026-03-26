import { Sequelize } from 'sequelize';
import config from '../../config.json';

export const sequelize = new Sequelize(
  config.database.database,
  config.database.user,
  config.database.password,
  {
    host:    config.database.host,
    port:    config.database.port,
    dialect: 'mysql',
    logging: false
  }
);

export async function initDb(): Promise<void> {
  await sequelize.authenticate();
  console.log('MySQL connected.');
  await sequelize.sync({ alter: true });
  console.log('Database synced.');
}
