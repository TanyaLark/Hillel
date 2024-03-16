import UrlRepository from '../repository/UrlRepository.js';
import UrlModel from '../models/urlModel.js';
import { generate } from '../utils/storageGenerators.js';
import { generateHash } from '../utils/hashGenerator.js';

const sequenceName = 'urlId';

export default class UrlService {
  constructor() {
    this.urlRepository = new UrlRepository();
  }

  create(originalUrl, name,  userId, visits = 0) {
    const url = new UrlModel(
      generate(sequenceName).toString(),
      generateHash(),
      originalUrl,
      name,
      visits,
      userId
    );
    this.urlRepository.save(url);
  }

  getUrl(id) {
    return this.urlRepository.get(id);
  }

  getUrls() {
    const urls = this.urlRepository.getAll();

    const result = [];
    for (const url of urls) {
      result.push({
        id: url.urlId,
        code: url.code,
        name: url.name,
        url: url.url,
        visits: url.visits,
        userId: url.userId,
        shortLink: url.shortLink,
      });
    }

    return result;
  }
}
