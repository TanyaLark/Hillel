import UrlRepository from '../repository/UrlRepositoryKnex.js';
import constants from '../common/constants.js';
import logger from 'logger';

const log = logger.getLogger('CodeService.js');

export default class CodeService {
  constructor() {
    this.urlRepository = new UrlRepository();
  }

  async visit(code) {
    try {
      const url = await this.urlRepository.getUrlByCode(code);
      if (!url) {
        throw new Error('URL not found');
      }

      if (url.type === constants.URL_TYPE.TEMPORARY) {
        const currentTime = new Date().getTime();
        const expiresAt = new Date(url.expires_at).getTime();

        if (currentTime > expiresAt) {
          const updatedRes = await this.urlRepository.updateUrlIsEnabled({
            shortLink: url.shortLink,
            isEnabled: false,
          });
          if (!updatedRes) {
            log.error('Error: URL not found');
          }

          return await this.urlRepository.getUrlByCode(code);
        } else {
          const urlId = url.id;
          await this.urlRepository.incrementVisits(urlId);
          return url;
        }
      }

      if (url.type === constants.URL_TYPE.PERMANENT) {
        const urlId = url.id;
        await this.urlRepository.incrementVisits(urlId);
        return url;
      }

      if (url.type === constants.URL_TYPE.ONE_TIME && url.visits < 1) {
        const urlId = url.id;
        await this.urlRepository.incrementVisits(urlId);
        return url;
      } else if (url.type === constants.URL_TYPE.ONE_TIME && url.visits >= 1) {
        const updatedRes = await this.urlRepository.updateUrlIsEnabled({
          shortLink: url.shortLink,
          isEnabled: false,
        });
        if (!updatedRes) {
          log.error('Error: URL not found');
        }
        return await this.urlRepository.getUrlByCode(code);
      }
    } catch (error) {
      log.error(`Error: ${error.message}`);
      throw error;
    }
  }
}
