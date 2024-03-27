import UrlRepository from '../repository/UrlRepositoryKnex.js';
import { generateHash } from '../utils/hashGenerator.js';
import logger from 'logger';

const log = logger.getLogger('UrlService.js');

export default class UrlService {
  constructor() {
    this.urlRepository = new UrlRepository();
  }

  async create(originalUrl, name, userId, visits = 0) {
    const code = generateHash();
    const shortLink = `http://localhost:3000/code/${code}`;
    const url = {
      code,
      name,
      originalUrl,
      visits,
      shortLink,
      userId,
    };
    await this.urlRepository.save(url);
  }

  async getUrl(id) {
    return await this.urlRepository.get(id);
  }

  async getUrls(userId) {
    try {
      const urls = await this.urlRepository.getAll(userId);
      return urls.rows;
    } catch (error) {
      log.error(`Error: ${error.message}`);
      return null;
    }
  }
}
