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
  }

  async get(urlId) {
    return await UrlModel.query().findById(urlId);
  }

  async getAll(userId) {
    return await UrlModel.query().where('user_id', userId);
  }

  async getUrlByCode(code) {
    try {
      const url = await UrlModel.query().findOne({ code });
      return url;
    } catch (error) {
      log.error(error.message);
      return null;
    }
  }

  async incrementVisits(urlId) {
    await UrlModel.query().findById(urlId).increment('visits', 1);
  }
}
