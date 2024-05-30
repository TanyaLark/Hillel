import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserRepositoryKnex from '../repository/UserRepositoryKnex.js';
import UrlRepository from '../repository/UrlRepositoryKnex.js';
import { RateLimitRepository } from '../repository/RateLimitRepository.js';
import logger from 'logger';
import constants from '../common/constants.js';
import { sendEventToAll } from '../common/wsConnections.js';
import {
  hashUserPassword,
  verifyUserPassword,
} from '../utils/hashUserPassword.js';

const log = logger.getLogger('UserService.js');

export default class UserService {
  constructor() {
    this.userRepository = new UserRepositoryKnex();
    this.urlRepository = new UrlRepository();
    this.rateLimitRepository = new RateLimitRepository();
  }

  async create(name, surname, email, password) {
    try {
      const hashedPassword = await hashUserPassword(password);
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

      const passwordMatch = await verifyUserPassword(password, user.hashedPassword);

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

  async getUsersForPagination(page, limit) {
    const paginatedUsers = await this.userRepository.getForPagination(page, limit);
    const publicData = paginatedUsers.results.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }));
    paginatedUsers.results = publicData;
    paginatedUsers.totalPages = Math.ceil(paginatedUsers.total / limit);
    return paginatedUsers;
  }

  async getByEmail(email) {
    const user = await this.userRepository.getByEmail(email);
    return user;
  }

  async delete(userEmail) {
    try {
      const userByEmail = await this.userRepository.getByEmail(userEmail);
      const userId = userByEmail.id;
      const allUserUrls = await this.urlRepository.getAllUrlByUserId(userId);
      for (const url of allUserUrls) {
        const redisRateLimitKey = `urlCode:${url.code}`;
        await this.rateLimitRepository.deleteRateLimit(redisRateLimitKey);
      }

      const deletedUserId = await this.userRepository.deleteByEmail(userEmail);
      log.info(`User with id ${deletedUserId} deleted`);

      const getAllUrlsCount = await this.urlRepository.getAllUrlsCount();
      const topFiveVisitedUrls =
        await this.urlRepository.getTopFiveVisitedUrls();

      sendEventToAll('allUrlsCount', getAllUrlsCount);
      sendEventToAll('allTopUrls', topFiveVisitedUrls);

      return deletedUserId;
    } catch (error) {
      log.error(`Error: ${error.message}`);
      return null;
    }
  }

  async updateUserRole(email, role) {
    try {
      const updatedUser = await this.userRepository.updateRole(email, role);
      return updatedUser;
    } catch (error) {
      log.error(`Error: ${error.message}`);
      return null;
    }
  }
}
