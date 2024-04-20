import e from 'express';
import UrlModel from '../models/urlModel.js';
import logger from 'logger';

const log = logger.getLogger('UrlRepository.js');

export default class UrlRepository {
  async save(
    code,
    name,
    originalUrl,
    visits,
    shortLink,
    type,
    isEnabled,
    expires_at,
    user_id
  ) {
    try {
      return await UrlModel.query().insert({
        code,
        name,
        originalUrl,
        visits,
        shortLink,
        type,
        isEnabled,
        expires_at,
        user_id,
      });
    } catch (error) {
      log.error(error.message);
      throw new Error(error.message);
    }
  }

  async get(urlId) {
    return await UrlModel.query().findById(urlId);
  }

  async getAll() {
    return await UrlModel.query();
  }

  async getAllUrlsCount() {
    try {
      return await UrlModel.query().resultSize();
    } catch (error) {
      log.error(error.message);
      throw new Error(error.message);
    }
  }

  async getUserUrlsCount(userId) {
    try {
      return await UrlModel.query().where('user_id', userId).resultSize();
    } catch (error) {
      log.error(error.message);
      throw new Error(error.message);
    }
  }

  async getTopFiveVisitedUrls() {
    try {
      const topFiveVisitedUrls = await UrlModel.query().orderBy('visits', 'desc').limit(5);
      return topFiveVisitedUrls.map((url) => {
        return {
          shortLink: url.shortLink,
          visits: url.visits,
        };
      });
    } catch (error) {
      log.error(error.message);
      throw new Error(error.message);
    }
  }

  async getUserTopFiveVisitedUrls(userId) {
    try {
      const topFiveVisitedUrls = await UrlModel.query()
        .where('user_id', userId)
        .orderBy('visits', 'desc')
        .limit(5);
      return topFiveVisitedUrls.map((url) => {
        return {
          shortLink: url.shortLink,
          visits: url.visits,
        };
      });
    } catch (error) {
      log.error(error.message);
      throw new Error(error.message);
    }
  }

  async getAllUrlByUserId(userId) {
    return await UrlModel.query().where('user_id', userId);
  }

  async getUrlByCode(code) {
    try {
      const url = await UrlModel.query().findOne({ code });
      return url;
    } catch (error) {
      log.error(error.message);
      throw new Error(error.message);
    }
  }

  async getUrlByShortLink(shortLink) {
    try {
      const url = await UrlModel.query().findOne({ shortLink });
      return url;
    } catch (error) {
      log.error(error.message);
      return null;
    }
  }

  async incrementVisits(urlId) {
    await UrlModel.query().findById(urlId).increment('visits', 1);
  }

  async updateUrlIsEnabled(data) {
    const { shortLink, isEnabled } = data;
    try {
      return await UrlModel.query()
        .patch({ isEnabled })
        .where('shortLink', shortLink);
    } catch (error) {
      log.error(error.message);
      return null;
    }
  }

  async updateIfUrlTemporary(data) {
    const { type, shortLink, expires_at } = data;
    try {
      return await UrlModel.query()
        .patch({ type, expires_at })
        .where('shortLink', shortLink);
    } catch (error) {
      log.error(error.message);
      return null;
    }
  }

  async updateIfUrlOneTime(data) {
    const { type, shortLink } = data;
    try {
      return await UrlModel.query()
        .patch({ type, visits: 0, expires_at: null })
        .where('shortLink', shortLink);
    } catch (error) {
      log.error(error.message);
      return null;
    }
  }

  async updateIfUrlPermanent(data) {
    const { type, shortLink } = data;
    try {
      return await UrlModel.query()
        .patch({ type, expires_at: null })
        .where('shortLink', shortLink);
    } catch (error) {
      log.error(error.message);
      return null;
    }
  }

  async delete(urlId) {
    try {
      const res = await UrlModel.query().deleteById(urlId);
      return res;
    } catch (error) {
      log.error(error.message);
      throw new Error(error.message);
    }
  }
}
