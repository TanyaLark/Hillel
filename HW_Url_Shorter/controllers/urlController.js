import { Router } from 'express';
import UrlService from '../services/UrlService.js';
export default class UrlController extends Router {
  constructor() {
    super();
    this.urlService = new UrlService();
    this.init();
  }

  init = () => {
    this.get('/id/:id', async (req, res) => {
      const url = await this.urlService.getUrl(req.params.id);
      res.json(url);
    });

    this.get('/all', async (req, res) => {
      const userId = req.userId;
      const urls = await this.urlService.getUrls(userId);
      res.render('urlShorter.njk', { urls });
    });

    this.post('/create', async (req, res) => {
      const userId = req.userId;
      const { originalUrl, name } = req.body;
      await this.urlService.create(originalUrl, name, userId);

      res.send('Saved!');
    });
  };
}
