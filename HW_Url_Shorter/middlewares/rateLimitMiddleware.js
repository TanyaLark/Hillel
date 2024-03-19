import { redisClient } from '../config/redisConfig.js';

export function rateLimit(config) {
  return async function (req, res, next) {
    const { reqLimit, windowSec, keyGenerator } = config;
    const windowMs = windowSec * 1000;
    const key = keyGenerator(req);

    try {
      if (!key) {
        return res.status(404).json({ error: 'Not found' });
      }
      const now = Date.now();
      const rateLimits = await redisClient.hGetAll(key);

      if (!rateLimits) {
        await redisClient.hSet(key, {
          reqCount: 1,
          resetTime: now + windowMs,
        });
      } else {
        await redisClient.hIncrBy(key, 'reqCount', 1);
      }

      const reqCount = await redisClient.hGet(key, 'reqCount');
      const resetTime = await redisClient.hGet(key, 'resetTime');

      if (reqCount > reqLimit && now < resetTime) {
        return res.status(429).json({ error: 'Rate limit exceeded' });
      }

      if (now > resetTime) {
        await redisClient.hSet(key, {
          reqCount: 1,
          resetTime: now + windowMs,
        });
      }
      next();
    } catch (error) {
      console.error('Rate limiting error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}
