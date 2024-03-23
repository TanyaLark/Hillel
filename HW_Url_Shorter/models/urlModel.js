export default class UrlModel {
  code;
  name;
  originalUrl;
  visits;
  shortLink;
  userId;

  constructor(code, name, originalUrl, visits, shortLink, userId) {
    this.code = code;
    this.name = name;
    this.originalUrl = originalUrl;
    this.visits = visits;
    this.shortLink = shortLink;
    this.userId = userId;
  }
}
