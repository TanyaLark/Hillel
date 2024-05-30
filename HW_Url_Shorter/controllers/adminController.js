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
    this.get('/users', async (req, res) => {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 2;
      const data = await this.userService.getUsersForPagination(page, limit);
      res.render('admin.njk', {
        users: data.results,
        page: page,
        totalPages: data.totalPages,
      });
    });

    this.get('/rate/limit', async (req, res) => {
      res.render('rateLimit.njk');
    });

    this.post('/create', validateMiddleware(userSchema), async (req, res) => {
      const { name, surname, email, password } = req.body;

      try {
        const createdUser = await this.userService.getByEmail(email);
        if (createdUser) {
          return res.status(401).send('User already exists');
        }

        const newUser = await this.userService.create(
          name,
          surname,
          email,
          password
        );
        res.status(201).send();
      } catch (error) {
        log.error(`Error: ${error.message}`);
        res.status(500).send('Something broke!');
      }
    });

    this.patch('/update/user', async (req, res) => {
      const { email, role } = req.body;
      if (!email || !role) {
        return res.status(400).send('Bad Request');
      }

      try {
        const updatedUser = await this.userService.updateUserRole(email, role);
        if (!updatedUser) {
          return res.status(404).send('User not found');
        }
        res.status(200).send();
      } catch (error) {
        log.error(`Error: ${error.message}`);
        res.status(500).send('Something broke!');
      }
    });

    // /admin/delete?email=example@gmail.com
    this.delete('/delete', async (req, res) => {
      const userEmail = req.query.email;
      if (!userEmail) {
        return res.status(400).send('Bad Request');
      }

      try {
        const deletedUserId = await this.userService.delete(userEmail);
        if (!deletedUserId) {
          return res.status(404).send('User not found');
        }
        res
          .status(200)
          .send(`Successfully deleted user with id: ${deletedUserId}`);
      } catch (error) {
        log.error(`Error: ${error.message}`);
        res.status(500).send('Something broke!');
      }
    });
  };
}
