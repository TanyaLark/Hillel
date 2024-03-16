import { Router } from 'express';
import UrlService from '../services/UrlService.js';
export default class UrlController extends Router {
  constructor() {
    super();
    this.urlService = new UrlService();

    this.init();
  }

  init = () => {
    this.get('/id/:id', (req, res) => {
      const url = this.urlService.getUrl(req.params.id);
      res.json(url);
    });

    this.get('/all', (req, res) => {
      const urls = this.urlService.getUrls();
      console.log(urls);
      res.render('urlShorter.njk', { urls });
      // res.json(urls);
    });

    this.post('/create', (req, res) => {
      const userId = req.userId;
      const { originalUrl, name } = req.body;
      this.urlService.create(originalUrl, name,  userId);

      res.send('Saved!');
    });
  };
}
