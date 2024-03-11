const map = new Map();

export default class UrlRepository {
  save(url) {
    map.set(url.urlId, url);
  }

  get(urlId) {
    return map.get(urlId);
  }

  getAll() {
    return map.values();
  }

  getUrlByCode(code) {
    return Array.from(map.values()).find((url) => url.code === code);
  }

  incrementVisits(url) {
    url.visits++;
    map.set(url.urlId, url);
  }
}
