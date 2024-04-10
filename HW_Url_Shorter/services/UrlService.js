import UrlRepository from '../repository/UrlRepositoryKnex.js';
import { generateHash } from '../utils/hashGenerator.js';
import logger from 'logger';

const log = logger.getLogger('UrlService.js');

export default class UrlService {
  constructor() {
    this.urlRepository = new UrlRepository();
  }

  async create(originalUrl, name, user_id, visits = 0) {
    const code = generateHash();
    const shortLink = `http://localhost:3000/code/${code}`;
    const type = 'Permanent';
    const isEnabled = true;
    let expires_at = Date.now() + 1000 * 60 * 60 * 24 * 365;
    expires_at = new Date(expires_at).toISOString();
    try {
      const url = await this.urlRepository.save(
        code,
        name,
        originalUrl,
        visits,
        shortLink,
        type,
        isEnabled,
        expires_at,
        user_id
      );
      return url;
    } catch (error) {
      log.error(`Error: ${error.message}`);
      return null;
    }
  }

  async getUrl(id) {
    return await this.urlRepository.get(id);
  }

  async getUrls(userId) {
    try {
      const urls = await this.urlRepository.getAll(userId);
      if (!urls) {
        log.error('Error: No urls found');
        return null;
      }
      return urls;
    } catch (error) {
      log.error(`Error: ${error.message}`);
      return null;
    }
  }
}
