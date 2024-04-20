import jwt from 'jsonwebtoken';
import constants from '../common/constants.js';
import UrlRepository from '../repository/UrlRepositoryKnex.js';
import { getUserUrlsRateLimits } from '../utils/rateLimitsStatistics.js';

const connectedUsers = new Map();

export async function addWsConnection(socket) {
  const cookie = socket.request.headers.cookie;
  const token = cookie.split('=')[1];
  if (!token) {
    socket.disconnect('Authentication failed');
    return;
  }

  try {
    const urlRepository = new UrlRepository();
    const data = jwt.verify(token, constants.JWT_SECRET);
    const userId = data.id;
    socket.userId = userId;

    console.log('a user connected');
    connectedUsers.set(socket.id, socket);

    const getAllUrlsCount = await urlRepository.getAllUrlsCount();
    const getUserUrlsCount = await urlRepository.getUserUrlsCount(userId);
    const topFiveVisitedUrls = await urlRepository.getTopFiveVisitedUrls();
    const userTopFiveVisitedUrls =
      await urlRepository.getUserTopFiveVisitedUrls(userId);
    const userUrlsRateLimits = await getUserUrlsRateLimits(userId);

    sendEventToAll('allUrlsCount', getAllUrlsCount);
    sendEventToUser(userId, 'userAllUrlsCount', getUserUrlsCount);
    sendEventToAll('allTopUrls', topFiveVisitedUrls);
    sendEventToUser(userId, 'userTopUrls', userTopFiveVisitedUrls);
    sendEventToUser(userId, 'rateLimits', userUrlsRateLimits);
  } catch (error) {
    socket.disconnect('Authentication failed');
  }

  socket.on('disconnect', () => {
    console.log('user disconnected');
    connectedUsers.delete(socket.id);
  });
}

export function sendEventToAll(eventName, data) {
  connectedUsers.forEach((socket) => {
    socket.emit(eventName, data);
  });
}

export function sendEventToUser(userId, eventName, data) {
  connectedUsers.forEach((socket) => {
    if (socket.userId === userId) {
      socket.emit(eventName, data);
    }
  });
}
