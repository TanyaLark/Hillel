import Router from 'express';
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
      res.json(urls);
    });

    this.post('/create', (req, res) => {
      const { url, name, userId } = req.body;
      this.urlService.create(url, name, userId);

      res.send('Saved!');
    });
  };
}
