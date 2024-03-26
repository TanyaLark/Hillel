import { client } from '../config/db/postgresql.js';

export default class UserRepository {
  async save(user) {
    const newUser = await client.query(
      'INSERT INTO users (name, password) VALUES ($1, $2) RETURNING *',
      [user.name, user.password]
    );
    return newUser;
  }

  async get(userId) {
    return await client.query('SELECT * FROM users WHERE id = $1', [userId]);
  }

  async getAll() {
    const users = await client.query('SELECT * FROM users');
    return users.rows;
  }

  async getByName(name) {
    const user = await client.query('SELECT * FROM users WHERE name = $1', [
      name,
    ]);
    return user.rows[0];
  }
}
