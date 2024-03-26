import net from 'net';
import http from 'http';

let logCache = [];
const httpPort = 3001;
const socketPort = 3000;

export const httpServer = http.createServer((req, res) => {
  if (req.url === '/logs' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.statusCode = 200;
    res.end(JSON.stringify(logCache));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.statusCode = 404;
    res.end('Not Found');
  }
});

export const socketServer = net.createServer((socket) => {
  console.log('Socket connected');

  socket.on('data', (data) => {
    const log = data.toString();
    console.log('Received new log:', log);
    logCache.push(log);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  socket.on('end', () => {
    console.log('Socket disconnected');
  });
});

httpServer.listen(httpPort, () => {
  console.log(`HTTP server running on port ${httpPort}`);
});

socketServer.listen(socketPort, () => {
  console.log(`Socket server running on port ${socketPort}`);
});
