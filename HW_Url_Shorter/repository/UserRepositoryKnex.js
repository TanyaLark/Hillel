import UserModel from '../models/userModel.js';
import logger from 'logger';

const log = logger.getLogger('UserRepository.js');

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
    try {
      return await UserModel.query().findOne({ email });
    } catch (error) {
      log.error(error.message);
      throw new Error(error.message);
    }
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

  async updateRole(email, role) {
    const updatedUser = await UserModel.query()
      .patch({ role })
      .where('email', email)
      .returning('*');
    if (!updatedUser) {
      return null;
    }
    return updatedUser;
  }
}
