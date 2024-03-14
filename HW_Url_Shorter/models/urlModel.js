export default class UrlModel {
  urlId;
  code;
  name;
  url;
  visits;
  created_time;
  userId;

  constructor(urlId, code, name, url, visits, userId) {
    this.urlId = urlId;
    this.code = code;
    this.name = name;
    this.url = url;
    this.visits = visits;
    this.created_time = new Date();
    this.userId = userId;
  }
}
