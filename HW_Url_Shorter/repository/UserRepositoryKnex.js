import UserModel from '../models/userModel.js';

export default class UserRepositoryKnex {
  async save(role, name, surname, email, hashedPassword) {
    return await UserModel.query().insert({
      role,
      name,
      surname,
      email,
      hashedPassword,
    });
  }

  async get(userId) {
    const res = await UserModel.query().findById(userId);
    return res;
  }

  async getAll() {
    return await UserModel.query().select('*');
  }

  async getByEmail(email) {
    return await UserModel.query().findOne({ email });
  }

  async deleteByEmail(userEmail) {
    const deletedUser = await UserModel.query()
      .delete()
      .where('email', userEmail)
      .returning('id');
    const deletedUserId = deletedUser[0].id;
    if (!deletedUserId) {
      return null;
    }
    return deletedUserId;
  }
}
