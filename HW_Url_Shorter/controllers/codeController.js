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
          const urlEntity = await this.codeService.visit(req.params.code);
          if (urlEntity.isEnabled === false) {
            res.status(404).json({ status: 'error', message: 'Not found' });
            return;
          }
          const url =
            urlEntity.originalUrl.startsWith('http://') ||
            urlEntity.originalUrl.startsWith('https://')
              ? urlEntity.originalUrl
              : 'http://' + urlEntity.originalUrl;
          res.redirect(302, url);
        } catch (error) {
          res.status(404).json({ status: 'error', message: error.message });
        }
      }
    );
  };
}
