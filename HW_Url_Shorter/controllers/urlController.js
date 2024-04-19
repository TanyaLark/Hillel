import e, { Router } from 'express';
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
      const { originalUrl, name, codeLength, customUrl } = req.body;
      const length = codeLength ? Number(codeLength) : 5;
      try {
        const existedUrl = await this.urlService.getUrlByCode(customUrl);
        if (existedUrl) {
          return res.status(400).send({ message: 'Custom URL already exists' });
        }

        const url = await this.urlService.create(
          originalUrl,
          name,
          userId,
          length,
          customUrl
        );

        res.status(201).send();
      } catch (error) {
        res.status(500).send('Internal server error');
      }
    });

    this.patch('/update', async (req, res) => {
      const data = req.body;
      if (!data) {
        return res.status(400).send('Bad request');
      }

      try {
        await this.urlService.updateUrlIsEnabled(data);
        res.status(200).send();
      } catch (error) {
        if (error.message === 'URL not found') {
          return res.status(404).send({ message: 'Not found' });
        }

        if (error.message === 'URL expired') {
          return res.status(400).send({ message: 'URL expired' });
        }
        return res.status(500).send('Internal server error');
      }
    });

    this.patch('/update/type', async (req, res) => {
      const data = req.body;
      if (!data) {
        return res.status(400).send('Bad request');
      }

      if (!data.type || !data.shortLink) {
        return res.status(400).send('Bad request');
      }
      const resUpdateUrl = await this.urlService.updateUrlType(data);

      if (!resUpdateUrl) {
        return res.status(404).send('Not found');
      }
      res.status(200).send();
    });

    this.delete('/delete', async (req, res) => {
      const urlId = req.query.id;
      if (!urlId) {
        return res.status(400).send({ message: 'Bad request' });
      }
      try {
        const result = await this.urlService.delete(urlId);
        return res.status(200).send();
      } catch (error) {
        return res.status(500).send();
      }
    });
  };
}
