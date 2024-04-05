import { Router } from 'express';
import UserService from '../services/UserService.js';
import { authMiddleware } from '../middlewares/jwtMiddleware.js';
import error from '../utils/customErrors.js';
import logger from 'logger';

const log = logger.getLogger('userController.js');

export default class UserController extends Router {
  constructor() {
    super();
    this.userService = new UserService();
    this.init();
  }

  init = () => {
    this.get('/', authMiddleware, async (req, res) => {
      const userId = req.userId;
      const user = await this.userService.getUserPublicData(userId);
      res.json(user);
    });

    this.get('/all', async (req, res) => {
      const users = await this.userService.getUsersPublicData();
      res.render('listUsers.njk', { users });
    });

    this.post('/login', async (req, res) => {
      const { name, password } = req.body;
      if (!name || !password) {
        log.error('Name and password are required');
        throw new error.ValidationError('Name and password are required');
      }
      try {
        const token = await this.userService.login(name, password);
        if (!token) {
          return res.status(401).send('Invalid user name or password');
        }
        res.cookie('token', token, { httpOnly: true });
        res.status(200).send();
      } catch (error) {
        res.status(500).send('Something broke!');
      }
    });

    this.post('/create', async (req, res) => {
      const { name, password } = req.body;
      if (!name || !password) {
        log.error('Name and password are required');
        throw new error.ValidationError('Name and password are required');
      }

      try {
        const createdUser = await this.userService.getByName(name);
        if (createdUser) {
          return res.status(401).send('User already exists');
        }

        const token = await this.userService.create(name, password);
        res.cookie('token', token, { httpOnly: true });
        res.status(201).send();
      } catch (error) {
        log.error(`Error: ${error.message}`);
        res.status(500).send('Something broke!');
      }
    });
  };
}
