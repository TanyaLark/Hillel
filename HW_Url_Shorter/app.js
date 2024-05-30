import express from 'express';
import { createServer } from 'node:http';
import webContext from './webContext.js';
import dotenv from 'dotenv';
import logger from 'logger';
import { Server } from 'socket.io';
import { addWsConnection } from './common/wsConnections.js';
import helmet from 'helmet';
import cors from 'cors';

dotenv.config();
const port = process.env.PORT || 3000;
const appAddress = process.env.APP_ADDRESS || `http://localhost:${port}`;
const log = logger.getLogger('app.js');
const app = express();
const server = createServer(app);
const io = new Server(server);
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net', 'https://cdn.socket.io'],
      },
    },
  })
);
const corsOptions = {
  origin: appAddress,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

webContext(app);

io.on('connection', (socket) => {
  addWsConnection(socket);
});

server.listen(port, () => {
  log.info(`Server running on port: ${port}`);
});
