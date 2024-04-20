import { redisClient } from '../config/db/redis.js';
import logger from 'logger';

const log = logger.getLogger('rateLimitController.js');

export class RateLimitRepository {
  async getAllKeys() {
    try {
      const keysArray = (await redisClient.scan(0)).keys;
      return keysArray;
    } catch (error) {
      log.error(`Error getting all rate limit keys: ${error.message}`);
      return null;
    }
  }

  async getRateLimit(key) {
    try {
      const rateLimit = await redisClient.hGet(key, 'reqCount');
      if (!rateLimit) {
        return null;
      }
      let resetTime = await redisClient.hGet(key, 'resetTime');
      resetTime = new Date(+resetTime);
      return { rateLimit, resetTime };
    } catch (error) {
      log.error(`Error getting rate limit: ${error.message}`);
      return null;
    }
  }

  async deleteRateLimit(key) {
    try {
      const res = await redisClient.del(key);
      return res;
    } catch (error) {
      log.error(`Error deleting rate limit: ${error.message}`);
      return null;
    }
  }
}
