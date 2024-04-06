import UserModel from '../models/userModel.js';

export default class UserRepositoryKnex {
  async save(name, password) {
    return await UserModel.query().insert({ name, password });
  }

  async get(userId) {
    const res = await UserModel.query()
      .findById(userId)
      .withGraphFetched('urls');
    console.log(
      'UserRepositoryKnex: ==> Array of URLs associated with the user',
      user.urls
    );
    return res;
  }

  async getAll() {
    return await UserModel.query().select('*');
  }

  async getByName(name) {
    return await UserModel.query().findOne({ name });
  }
}
