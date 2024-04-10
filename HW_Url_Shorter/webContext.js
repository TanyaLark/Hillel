import express from 'express';
import cookieParser from 'cookie-parser';
import UserController from './controllers/userController.js';
import UrlController from './controllers/urlController.js';
import CodeController from './controllers/codeController.js';
import { authMiddleware } from './middlewares/jwtMiddleware.js';
import path from 'path';
import nunjucks from 'nunjucks';

function initMiddlewares(app) {
  app.use(express.json());
  app.use(cookieParser());
}

function initControllers(app) {
  app.use('/user', new UserController());
  app.use('/code', new CodeController());
  app.use(authMiddleware);
  app.use('/url', new UrlController());
}

function initPublic(app) {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, 'public')));
  nunjucks.configure(path.join(__dirname, 'public'), {
    autoescape: true,
    express: app,
    noCache: true,
  });

  app.set('view engine', 'njk');

  app.get('/', (req, res) => {
    res.render('register.njk');
  });

  app.get('/favicon.ico', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'img', 'favicon.ico'));
  });

  app.get('/login', (req, res) => {
    res.render('login.njk');
  });

  app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
  });
}

function initErrorHandling(app) {
  app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
      res.status(err.statusCode).send(err.message);
    } else if (err.name === 'AuthenticationError') {
      res.status(err.statusCode).send(err.message);
    } else {
      console.error(err.stack);
      res.status(500).send('Something broke!');
    }
  });
}

export default function (app) {
  initMiddlewares(app);
  initPublic(app);
  initControllers(app);
  initErrorHandling(app);
}
