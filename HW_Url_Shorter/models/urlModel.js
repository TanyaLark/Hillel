export default class UrlModel {
  urlId;
  code;
  name;
  url;
  visits;
  created_time;
  userId;
  shortLink;

  constructor(urlId, code, url, name, visits, userId) {
    this.urlId = urlId;
    this.code = code;
    this.name = name;
    this.url = url;
    this.visits = visits;
    this.created_time = new Date();
    this.userId = userId;
    this.shortLink = `http://localhost:3000/code/${code}`;
  }
}
