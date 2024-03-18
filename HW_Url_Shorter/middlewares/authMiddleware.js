import UserRepository from '../repository/UserRepository.js';
import error from '../utils/customErrors.js';

const userRepository = new UserRepository();

export default (req, res, next) => {
  // console.log('authMiddleware req cookies', req.cookies);
  const authCookieData = req.cookies.authorization;
  if (authCookieData) {
    const [username, password] = authCookieData.split('$$');
    const user = userRepository.getByNameAndPassword(username, password);
    req.userId = user?.userId;
    if (user) {
      next();
      return;
    } else {
      throw new error.AuthenticationError('Invalid user name or password');
    }
  }
  res.status(401).end('Auth header not provided');
};
