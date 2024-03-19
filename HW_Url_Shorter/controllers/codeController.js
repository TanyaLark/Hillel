import Router from 'express';
import CodeService from '../services/CodeService.js';
import { rateLimit } from '../middlewares/rateLimitMiddleware.js';
import { rateLimitConfig } from '../config/rateLimitConfig.js';

export default class CodeController extends Router {
  constructor() {
    super();
    this.codeService = new CodeService();

    this.init();
  }

  init = () => {
    this.get(
      '/:code',
      rateLimit(rateLimitConfig.rateLimit2),
      rateLimit(rateLimitConfig.rateLimit1),
      (req, res) => {
        try {
          const visit = this.codeService.visit(req.params.code);
          const url =
            visit.url.startsWith('http://') || visit.url.startsWith('https://')
              ? visit.url
              : 'http://' + visit.url;
          res.redirect(302, url);
        } catch (error) {
          res.status(404).json({ status: 'error', message: error.message });
        }
      }
    );
  };
}
