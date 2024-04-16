import UrlRepository from '../repository/UrlRepositoryKnex.js';

export default class CodeService {
  constructor() {
    this.urlRepository = new UrlRepository();
  }

  async visit(code) {
    const url = await this.urlRepository.getUrlByCode(code);
    if (!url) {
      throw new Error('URL not found');
    } else {
      const urlId = url.id;
      await this.urlRepository.incrementVisits(urlId);
    }
    return url;
  }
}
