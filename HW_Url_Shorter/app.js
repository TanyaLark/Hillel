import express from 'express';
import UserController from './controllers/userController.js';
import UrlController from './controllers/urlController.js';
import CodeController from './controllers/codeController.js';
import authMiddleware from './middlewares/authMiddleware.js';

const app = express();

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
