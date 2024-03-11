import { Router } from 'express';
import UserService from '../services/UserService.js';

export default class UserController extends Router {
  constructor() {
    super();
    this.userService = new UserService();

    this.init();
  }

  init = () => {
    this.get('/id/:id', (req, res) => {
      const user = this.userService.getUserPublicData(req.params.id);
      res.json(user);
    });

    this.get('/all', (req, res) => {
      const users = this.userService.getUsersPublicData();
      res.json(users);
    });

    this.post('/create', (req, res) => {
      const { name, password } = req.body;
      this.userService.create(name, password);

      res.send('Saved!');
    });
  };
}
