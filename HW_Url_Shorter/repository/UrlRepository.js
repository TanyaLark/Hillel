import { client } from '../config/db/postgresql.js';

export default class UrlRepository {
  async save(url) {
    try {
      const newUrl = await client.query(
        'INSERT INTO urls (code, name, original_url, visits, short_link, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [
          url.code,
          url.name,
          url.originalUrl,
          url.visits,
          url.shortLink,
          url.userId,
        ]
      );
      return newUrl;
    } catch (error) {
      throw new Error(`Error: ${error.message}`);
    }
  }

  async get(urlId) {
    return await client.query('SELECT * FROM urls WHERE id = $1', [urlId]);
  }

  async getAll( userId) {
    return await client.query('SELECT * FROM urls WHERE user_id = $1', [userId]);
  }

  async getUrlByCode(code) {
    const url = await client.query('SELECT * FROM urls WHERE code = $1', [
      code,
    ]);
    return url.rows[0];
  }

  async incrementVisits(url) {
    return await client.query(
      'UPDATE urls SET visits = visits + 1 WHERE id = $1',
      [url.id]
    );
  }
}
