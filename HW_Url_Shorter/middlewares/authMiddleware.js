import UserRepository from '../repository/UserRepository.js';
import error from '../utils/customErrors.js';

const userRepository = new UserRepository();

export default async (req, res, next) => {
  // console.log('authMiddleware req cookies', req.cookies);
  const authCookieData = req.cookies.authorization;
  if (authCookieData) {
    const [username] = authCookieData.split('$$');
    const user = await userRepository.getByName(username);
    req.userId = user?.id;
    if (user) {
      next();
      return;
    } else {
      throw new error.AuthenticationError('Invalid user name or password');
    }
  }
  res.status(401).end('Auth header not provided');
};
