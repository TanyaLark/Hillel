import { Router } from 'express';
import UserService from '../services/UserService.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import error from '../utils/customErrors.js';

export default class UserController extends Router {
  constructor() {
    super();
    this.userService = new UserService();

    this.init();
  }

  init = () => {
    this.get('/id/:id', authMiddleware, (req, res) => {
      const user = this.userService.getUserPublicData(req.params.id);
      res.json(user);
    });

    this.get('/all', authMiddleware, (req, res) => {
      const users = this.userService.getUsersPublicData();
      res.json(users);
    });

    this.post('/create', (req, res) => {
      const { name, password } = req.body;
      if (!name || !password) {
        throw new error.ValidationError('Name and password are required');
      }
      this.userService.create(name, password);

      res.send('Saved!');
    });
  };
}
