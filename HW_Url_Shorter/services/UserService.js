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

      return newUser;
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

      return user;
    } catch (error) {
      log.error(`Error: ${error.message}`);
      return null;
    }
  }

  async getToken(id) {
    try {
      const token = jwt.sign({ id }, constants.JWT_SECRET, {
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
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }));
  }

  async getByEmail(email) {
    const user = await this.userRepository.getByEmail(email);
    return user;
  }

  async delete(userEmail) {
    try {
      const deletedUserId = await this.userRepository.deleteByEmail(userEmail);
      log.info(`User with id ${deletedUserId} deleted`);
      return deletedUserId;
    } catch (error) {
      log.error(`Error: ${error.message}`);
      return null;
    }
  }
}
