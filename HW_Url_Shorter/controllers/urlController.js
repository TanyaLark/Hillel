import { Router } from 'express';
import UrlService from '../services/UrlService.js';
import {
  validateMiddleware,
  urlSchema,
} from '../middlewares/validateMiddleware.js';
export default class UrlController extends Router {
  constructor() {
    super();
    this.urlService = new UrlService();
    this.init();
  }

  init = () => {
    this.get('/id/:id', async (req, res) => {
      const url = await this.urlService.getUrlsByUserId(req.params.id);
      res.json(url);
    });

    this.get('/all', async (req, res) => {
      const userId = req.userId;
      const urls = await this.urlService.getUrlsByUserId(userId);
      res.render('urlShorter.njk', { urls });
    });

    this.post('/create', validateMiddleware(urlSchema), async (req, res) => {
      const userId = req.userId;
      const { originalUrl, name } = req.body;
      const url = await this.urlService.create(originalUrl, name, userId);
      if (!url) {
        return res.status(400).send('Bad request');
      }
      res.status(201).send();
    });

    this.patch('/update', async (req, res) => {
      const data = req.body;
      if (!data) {
        return res.status(400).send('Bad request');
      }
      const urlQuantity = await this.urlService.update(data);
      if (!urlQuantity) {
        return res.status(404).send('Not found');
      }
      res.status(200).send();
    });
  };
}
