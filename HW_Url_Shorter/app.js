import express from 'express';
import path from 'path';
import UserController from './controllers/userController.js';
import UrlController from './controllers/urlController.js';
import CodeController from './controllers/codeController.js';
import authMiddleware from './middlewares/authMiddleware.js';
import nunjucks from 'nunjucks';
import cookieParser from 'cookie-parser';

const app = express();

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));
nunjucks.configure(path.join(__dirname, 'public'), {
  autoescape: true,
  express: app,
  noCache: true,
});
app.use(cookieParser());

app.get('/', (req, res) => {
  res.render('index.njk');
});

app.get('/login', (req, res) => {
  res.render('login.html');
});

app.get('/logout', (req, res) => {
  res.clearCookie('authorization');
  res.redirect('/login');
});

app.use(express.json());
app.use('/user', new UserController());
app.use(authMiddleware);
app.use('/url', new UrlController());
app.use('/code', new CodeController());

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

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
