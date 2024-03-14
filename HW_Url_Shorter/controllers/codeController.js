import Router from 'express';
import CodeService from '../services/CodeService.js';

export default class CodeController extends Router {
  constructor() {
    super();
    this.codeService = new CodeService();

    this.init();
  }

  init = () => {
    this.get('/:code', (req, res) => {
      try {
        const url = this.codeService.getUrlByCode(req.params.code);
        res.redirect(302, url.url);
      } catch (error) {
        res.status(404).json({ status: 'error', message: error.message });
      }
    });
  };
}
