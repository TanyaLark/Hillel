import express from 'express';
import webContext from './webContext.js';
import dotenv from 'dotenv';
import logger from 'logger';
import sequelize from './config/db/sequelize.js';

dotenv.config();
const port = process.env.PORT || 3000;
const log = logger.getLogger('app.js');
const app = express();

webContext(app);

try {
  await sequelize.authenticate();
  log.info('Postgres connection has been established successfully.');
} catch (error) {
  log.error('Unable to connect to the postgres database:', error);
}

app.listen(port, () => {
  log.info(`Server is running on port ${port}`);
});
