import Router from 'express';
import CodeService from '../services/CodeService.js';
import { rateLimit } from '../middlewares/rateLimitMiddleware.js';
import { rateLimitConfig } from '../config/rateLimitConfig.js';
import logger from 'logger';

const log = logger.getLogger('codeController.js');

export default class CodeController extends Router {
  constructor() {
    super();
    this.codeService = new CodeService();

    this.init();
  }

  init = () => {
    this.get(
      '/:code',
      rateLimit(rateLimitConfig.forUrl),
      rateLimit(rateLimitConfig.forUserAllUrls),
      rateLimit(rateLimitConfig.forIpAddress),
      async (req, res) => {
        try {
          const visit = await this.codeService.visit(req.params.code);
          const url =
            visit.originalUrl.startsWith('http://') || visit.originalUrl.startsWith('https://')
              ? visit.originalUrl
              : 'http://' + visit.originalUrl;
          res.redirect(302, url);
        } catch (error) {
          res.status(404).json({ status: 'error', message: error.message });
        }
      }
    );
  };
}
