import { Router } from 'express';
import UserService from '../services/UserService.js';
import {
  validateMiddleware,
  userSchema,
} from '../middlewares/validateMiddleware.js';
import logger from 'logger';

const log = logger.getLogger('adminController.js');

export default class AdminController extends Router {
  constructor() {
    super();
    this.userService = new UserService();
    this.init();
  }

  init = () => {
    this.post('/create', validateMiddleware(userSchema), async (req, res) => {
      const { name, surname, email, password } = req.body;

      try {
        const createdUser = await this.userService.getByEmail(email);
        if (createdUser) {
          return res.status(401).send('User already exists');
        }

        const token = await this.userService.create(
          name,
          surname,
          email,
          password
        );
        res.cookie('token', token, { httpOnly: true });
        res.status(201).send();
      } catch (error) {
        log.error(`Error: ${error.message}`);
        res.status(500).send('Something broke!');
      }
    });

    // /admin/delete?userId=id1
    this.delete('/delete', async (req, res) => {
      const id = req.query.userId;
      console.log('AdminController ==>',id);
      const deletedUserId = await this.userService.delete(id);
      res.status(200).send(`Successfully deleted user with id: ${deletedUserId}`);
    });
  };
}
