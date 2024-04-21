import redis from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisConnectionStr = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

export const redisClient = await redis
  .createClient({
    url: redisConnectionStr
  })
  .on('error', (err) => {
    console.log('Redis Client Error', err);
  })
  .connect();

const isReady = redisClient.isReady;
console.log('Redis client`s socket is open:', isReady);

redisClient.on('end', () => {
  console.log('Connection to Redis server closed');
});

process.on('beforeExit', async () => {
  await redisClient.disconnect();
});
