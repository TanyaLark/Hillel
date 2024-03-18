import UrlRepository from '../repository/UrlRepository.js';

export default class CodeService {
  constructor() {
    this.urlRepository = new UrlRepository();
  }

  visit(code) {
    const url = this.urlRepository.getUrlByCode(code);
    if (!url) {
      throw new Error('URL not found');
    } else {
      this.urlRepository.incrementVisits(url);
    }
    return url;
  }
}
