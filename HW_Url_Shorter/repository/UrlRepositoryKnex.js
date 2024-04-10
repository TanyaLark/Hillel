import UrlModel from '../models/urlModel.js';

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
      const url = await UrlModel.query().insert({
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
      return url;
    } catch (error) {
      console.log('UrlRepository error ===>', error);
    }
  }

  async get(urlId) {
    return await UrlModel.query().findById(urlId);
  }

  async getAll(userId) {
    return await UrlModel.query().where('user_id', userId);
  }

  async getUrlByCode(code) {
    return await UrlModel.query().findOne({ code });
  }

  async incrementVisits(urlId) {
    await UrlModel.query().findById(urlId).increment('visits', 1);
  }
}
