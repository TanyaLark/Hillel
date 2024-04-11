import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserRepositoryKnex from '../repository/UserRepositoryKnex.js';
import logger from 'logger';
import constants from '../common/constants.js';

const log = logger.getLogger('UserService.js');

export default class UserService {
  constructor() {
    this.userRepository = new UserRepositoryKnex();
  }

  async create(name, surname, email, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, constants.SALT);
      const users = await this.userRepository.getAll();
      const role =
        users.length === 0 ? constants.ROLE.ADMIN : constants.ROLE.USER;
      const newUser = await this.userRepository.save(
        role,
        name,
        surname,
        email,
        hashedPassword
      );

      if (!newUser) {
        log.error('User not created');
        return null;
      }

      const token = jwt.sign({ id: newUser.id }, constants.JWT_SECRET, {
        expiresIn: '1h',
      });
      return token;
    } catch (error) {
      log.error(`Error: ${error.message}`);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const user = await this.userRepository.getByEmail(email);

      if (!user) {
        log.error('User not found');
        return null;
      }

      const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

      if (!passwordMatch) {
        log.error('Invalid password');
        return null;
      }

      const token = jwt.sign({ id: user.id }, constants.JWT_SECRET, {
        expiresIn: '1h',
      });
      return token;
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

  async getByEmail(email) {
    const user = await this.userRepository.getByEmail(email);
    return user;
  }

  async delete(userId) {
    try {
      const deletedUserId = await this.userRepository.delete(userId);
      log.info(`User with id ${deletedUserId} deleted`);
      return;
    } catch (error) {
      log.error(`Error: ${error.message}`);
      return null;
    }
  }
}
