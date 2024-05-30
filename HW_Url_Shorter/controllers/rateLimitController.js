import { Router } from 'express';
import RateLimitService from '../services/RateLimitService.js';
import logger from 'logger';

const log = logger.getLogger('rateLimitController.js');

export default class RateLimitController extends Router {
  constructor() {
    super();
    this.rateLimitService = new RateLimitService();
    this.init();
  }

  init = () => {
    this.get('/all', async (req, res) => {
      const rateLimits = await this.rateLimitService.getRateLimitsKeys();
      res.render('rateLimit.njk', { rateLimits });
    });

    this.delete('/delete', async (req, res) => {
      const key = req.query.key;
      const result = await this.rateLimitService.deleteRateLimit(key);
      if (result === 0) {
        return res.sendStatus(404);
      }

      if (!result) {
        log.error(`Error deleting rate limit for key: ${key}`);
        res.sendStatus(500);
        return;
      }

      res.sendStatus(200);
    });
  };
}
