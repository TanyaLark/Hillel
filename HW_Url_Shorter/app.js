import express from 'express';
import UserController from './controllers/userController.js';
import UrlController from './controllers/urlController.js';

const app = express();

app.use(express.json());
app.use('/user', new UserController());
app.use('/url', new UrlController());
// app.use('/code', new CodeController());

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
