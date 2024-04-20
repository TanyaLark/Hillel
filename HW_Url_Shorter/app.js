import express from 'express';
import { createServer } from 'node:http';
import webContext from './webContext.js';
import dotenv from 'dotenv';
import logger from 'logger';
import { Server } from 'socket.io';
import { addWsConnection } from './common/wsConnections.js';

dotenv.config();
const port = process.env.PORT || 3000;
const log = logger.getLogger('app.js');
const app = express();
const server = createServer(app);
const io = new Server(server);

webContext(app);

io.on('connection', (socket) => {
  addWsConnection(socket);
});

server.listen(port, () => {
  log.info(`Server running on port: ${port}`);
});
