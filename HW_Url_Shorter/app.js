import express from 'express';
import webContext from './webContext.js';
import dotenv from 'dotenv';
import logger from 'logger';

dotenv.config();
const port = process.env.PORT || 3000;
const log = logger.getLogger('app.js');
const app = express();

webContext(app);

app.listen(port, () => {
  log.info(`Server is running on port ${port}`);
});
