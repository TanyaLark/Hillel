import express from 'express';
import UserController from './controllers/userController.js';

const app = express();

app.use(express.json());
app.use('/user', new UserController());

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
