import UrlRepository from '../repository/UrlRepositoryKnex.js';
import { RateLimitRepository } from '../repository/RateLimitRepository.js';
import { generateHash } from '../utils/hashGenerator.js';
import constants from '../common/constants.js';
import logger from 'logger';
import { sendEventToAll, sendEventToUser } from '../common/wsConnections.js';
import { getUserUrlsRateLimits } from '../utils/rateLimitsStatistics.js';

const log = logger.getLogger('UrlService.js');

export default class UrlService {
  constructor() {
    this.urlRepository = new UrlRepository();
    this.rateLimitRepository = new RateLimitRepository();
  }

  async create(
    originalUrl,
    name,
    user_id,
    codeLength = 5,
    customUrl = null,
    visits = 0
  ) {
    let code = generateHash(Number(codeLength));
    if (customUrl) {
      code = customUrl;
    }
    const appAddress = process.env.APP_ADDRESS || 'http://localhost:3000';
    const shortLink = `${appAddress}/code/${code}`;
    const type = constants.URL_TYPE.PERMANENT;
    const isEnabled = true;
    let expires_at;

    if (
      type === constants.URL_TYPE.PERMANENT ||
      type === constants.URL_TYPE.ONE_TIME
    ) {
      expires_at = null;
    }

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
      throw error;
    } finally {
      const allUrlsCount = await this.urlRepository.getAllUrlsCount();
      const userAllUrlsCount = await this.urlRepository.getUserUrlsCount(
        user_id
      );
      sendEventToAll('allUrlsCount', allUrlsCount);
      sendEventToUser(user_id, 'userAllUrlsCount', userAllUrlsCount);
    }
  }

  async getUrl(id) {
    return await this.urlRepository.get(id);
  }

  getAllUrls() {
    return this.urlRepository.getAll();
  }

  async getUrlsByUserId(userId, page, limit) {
    try {
      const urls = await this.urlRepository.getAllUrlByUserId(
        userId,
        page,
        limit
      );

      if (!urls) {
        log.error('Error: No urls found');
        return null;
      }

      const publicData = urls.results.map((url) => {
        if (url.expires_at) {
          url.expires_at = new Date(url.expires_at).toISOString();
        }
        return url;
      });

      urls.results = publicData;
      urls.totalPages = Math.ceil(urls.total / limit);
      return urls;
    } catch (error) {
      log.error(`Error: ${error.message}`);
      return null;
    }
  }

  async getUrlByCode(code) {
    try {
      const url = await this.urlRepository.getUrlByCode(code);
      return url;
    } catch (error) {
      log.error(`Error: ${error.message}`);
      throw error;
    }
  }

  async updateUrlIsEnabled(data) {
    const { shortLink, isEnabled } = data;
    try {
      const urlByShortLink = await this.urlRepository.getUrlByShortLink(
        shortLink
      );

      if (!urlByShortLink) {
        throw new Error('URL not found');
      }

      if (urlByShortLink.type === constants.URL_TYPE.TEMPORARY) {
        const currentTime = new Date().getTime();
        const expiresAt = new Date(urlByShortLink.expires_at).getTime();

        if (currentTime > expiresAt) {
          const res = await this.urlRepository.updateUrlIsEnabled({
            shortLink: urlByShortLink.shortLink,
            isEnabled: false,
          });
          if (isEnabled) {
            throw new Error('URL expired');
          }
          return res;
        }
      }

      const urlQuantity = await this.urlRepository.updateUrlIsEnabled(data);
      return urlQuantity;
    } catch (error) {
      if (error.message === 'URL not found') {
        throw error;
      }

      if (error.message === 'URL expired') {
        throw error;
      }
      log.error(`Error: ${error.message}`);
      throw error;
    }
  }

  async updateUrlType(data) {
    const { type } = data;

    if (!Object.values(constants.URL_TYPE).includes(type)) {
      log.error('Error: Invalid url type');
      return null;
    }

    if (type === constants.URL_TYPE.TEMPORARY) {
      const { ttl } = data; // ttl = time to live, minutes
      if (!ttl) {
        log.error('Error: ttl is required for temporary url');
        return null;
      }

      const expires_at = Date.now() + 60000 * (ttl + 180); // 60000 ms = 1 minute +
      data.expires_at = new Date(expires_at).toISOString();

      try {
        const res = await this.urlRepository.updateIfUrlTemporary(data);
        return res;
      } catch (error) {
        log.error(`Error: ${error.message}`);
        return null;
      }
    }

    if (type === constants.URL_TYPE.PERMANENT) {
      try {
        const res = await this.urlRepository.updateIfUrlPermanent(data);
        return res;
      } catch (error) {
        log.error(`Error: ${error.message}`);
        return null;
      }
    }

    if (type === constants.URL_TYPE.ONE_TIME) {
      try {
        const res = await this.urlRepository.updateIfUrlOneTime(data);
        return res;
      } catch (error) {
        log.error(`Error: ${error.message}`);
        return null;
      }
    }

    try {
      const urlQuantity = await this.urlRepository.updateUrlType(data);
      return urlQuantity;
    } catch (error) {
      log.error(`Error: ${error.message}`);
      return null;
    }
  }

  async delete(urlId) {
    try {
      const urlById = await this.urlRepository.get(urlId);
      if (urlById) {
        const redisRateLimitKey = `urlCode:${urlById.code}`;
        await this.rateLimitRepository.deleteRateLimit(redisRateLimitKey);
      }

      const res = await this.urlRepository.delete(urlId);

      const allUrlsCount = await this.urlRepository.getAllUrlsCount();
      const getUserUrlsCount = await this.urlRepository.getUserUrlsCount(
        userId
      );
      const userUrlsRateLimits = await getUserUrlsRateLimits(userId);

      sendEventToAll('allUrlsCount', allUrlsCount);
      sendEventToUser(userId, 'userAllUrlsCount', getUserUrlsCount);
      sendEventToUser(userId, 'rateLimits', userUrlsRateLimits);
      return res;
    } catch (error) {
      log.error(`Error: ${error.message}`);
      throw error;
    }
  }
}
