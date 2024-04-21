import { Router } from 'express';
import UserService from '../services/UserService.js';
import { authMiddleware } from '../middlewares/jwtMiddleware.js';
import {
  validateMiddleware,
  userSchema,
  loginSchema,
} from '../middlewares/validateMiddleware.js';
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

    this.post('/login', validateMiddleware(loginSchema), async (req, res) => {
      const { email, password } = req.body;

      try {
        const user = await this.userService.login(email, password);
        if (!user) {
          return res.status(401).send('Invalid user name or password');
        }
        const token = await this.userService.getToken(user.id);
        if (!token) {
          return res.status(500).send('Token not created');
        }
        res.cookie('token', token, { httpOnly: true });
        res.status(200).send();
      } catch (error) {
        res.status(500).send('Something broke!');
      }
    });

    this.post('/create', validateMiddleware(userSchema), async (req, res) => {
      const { name, surname, email, password } = req.body;

      try {
        const existingUser = await this.userService.getByEmail(email);
        
        if (existingUser) {
          return res.status(401).send('User already exists');
        }
  
        const newUser = await this.userService.create(
          name,
          surname,
          email,
          password
        );
        console.log("🚀 ~ UserController ~ this.post ~ newUser:", newUser)

        if (!newUser) {
          return res.status(500).send('User not created');
        }

        const token = await this.userService.getToken(newUser.id);
        if (!token) {
          return res.status(500).send('Token not created');
        }
        res.cookie('token', token, { httpOnly: true });
        res.status(201).send();
      } catch (error) {
        log.error(`Error: ${error.message}`);
        res.status(500).send('Something broke!');
      }
    });

    this.delete('/delete', authMiddleware, async (req, res) => {
      const userId = req.userId;
      const user = await this.userService.delete(userId);
      res.status(200).send();
    });
  };
}
