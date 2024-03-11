import UrlRepository from '../repository/UrlRepository.js';
import UrlModel from '../models/urlModel.js';
import { generate } from '../utils/storageGenerators.js';
import { generateHash } from '../utils/hashGenerator.js';

const sequenceName = 'urlId';

export default class UrlService {
  constructor() {
    this.urlRepository = new UrlRepository();
  }

  create(name, originalUrl, userId, visits = 0,) {
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
    return this.urlRepository.getAll();
  }
}
