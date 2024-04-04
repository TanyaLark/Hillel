import bcrypt from 'bcrypt';
import UserRepositoryKnex from '../repository/UserRepositoryKnex.js';
import logger from 'logger';

const log = logger.getLogger('UserService.js');
const SALT_ROUNDS = 10;

export default class UserService {
  constructor() {
    this.userRepository = new UserRepositoryKnex();
  }

  async create(name, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      await this.userRepository.save(name, hashedPassword);
    } catch (error) {
      log.error(`Error: ${error.message}`);
      throw error;
    }
  }

  async login(name, password) {
    try {
      const user = await this.userRepository.getByName(name);
      if (!user) {
        log.error('User not found');
        return null;
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        log.error('Invalid password');
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
