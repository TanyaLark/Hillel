import UserModel from '../models/userModel.js';

export default class UserRepositoryKnex {
  async save(role, name, surname, email, hashedPassword) {
    return await UserModel.query().insert({ role, name, surname, email, hashedPassword });
  }

  async get(userId) {
    const res = await UserModel.query()
      .findById(userId)
      .withGraphFetched('urls');
    return res;
  }

  async getAll() {
    return await UserModel.query().select('*');
  }

  async getByEmail(email) {
    return await UserModel.query().findOne({ email });
  }
}
