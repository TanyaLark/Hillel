import UserRepository from '../repository/UserRepository.js';
import UserModel from '../models/userModel.js';
import logger from 'logger';

const log = logger.getLogger('UserService.js');

export default class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async create(name, password) {
    try {
      const user = new UserModel(name, password);
      await this.userRepository.save(user);
    } catch (error) {
      log.error(`Error: ${error.message}`);
      throw error;
    }
  }

  async login(name, password) {
    try {
      const user = await this.userRepository.getByName(name, password);
      if (user.password !== password.toString()) {
        log.error('Invalid user name or password');
        return null;
      }
      return {
        id: user.id,
        name: user.name,
        created_time: user.created_time,
      };
    } catch (error) {
      log.error(`Error: ${error.message}`);
      return null;
    }
  }

  async getUserPublicData(id) {
    const user = await this.userRepository.get(id);

    return {
      id: user.id,
      name: user.name,
      created_time: user.created_time,
    };
  }

  async getUsersPublicData() {
    const users = await this.userRepository.getAll();
    const result = [];

    for (const user of users) {
      result.push({
        id: user.id,
        name: user.name,
      });
    }

    return result;
  }

  async getByName(name) {
    const user = await this.userRepository.getByName(name);
    return user;
  }
}
