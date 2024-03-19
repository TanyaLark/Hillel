import redis from 'redis';
import dotenv from 'dotenv';

dotenv.config();

export const redisClient = await redis
  .createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  })
  .on('error', (err) => console.log('Redis Client Error', err))
  .connect();

const isReady = redisClient.isReady;
console.log('Redis client`s socket is open:', isReady);

redisClient.on('end', () => {
  console.log('Connection to Redis server closed');
});

process.on('beforeExit', async () => {
  await redisClient.disconnect();
});
