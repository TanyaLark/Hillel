const map = new Map();

export default class UrlRepository {
  save(url) {
    console.log(url);
    map.set(url.urlId, url);
    console.log(map.get(url.urlId));
  }

  get(urlId) {
    return map.get(urlId);
  }

  getAll() {
    return map.values();
  }
}
