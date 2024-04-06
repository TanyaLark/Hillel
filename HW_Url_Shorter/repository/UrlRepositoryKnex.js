import UrlModel from '../models/urlModel.js';

export default class UrlRepository {
  async save(url) {
    return await UrlModel.query().insert(url);
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
