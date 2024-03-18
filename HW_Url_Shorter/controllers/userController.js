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
    this.get('/', authMiddleware, (req, res) => {
      const userId = req.userId;
      const user = this.userService.getUserPublicData(userId);
      res.json(user);
    });

    this.get('/all', (req, res) => {
      const users = this.userService.getUsersPublicData();
      res.render('listUsers.njk', { users });
      // res.json(users);
    });

    this.post('/login', (req, res) => {
      const { name, password } = req.body;
      if (!name || !password) {
        throw new error.ValidationError('Name and password are required');
      }
      const user = this.userService.login(name, password);
      if (!user) {
        res.status(401).send('Invalid user name or password');
        return;
      }
      res.cookie('authorization', `${user.name}$$${password}`);
      res.status(200).json(user);
    });

    this.post('/create', (req, res) => {
      const { name, password } = req.body;
      if (!name || !password) {
        throw new error.ValidationError('Name and password are required');
      }
      res.cookie('authorization', `${name}$$${password}`);
      this.userService.create(name, password);

      res.send('Saved!');
    });
  };
}
