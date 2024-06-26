import UserRepository from '../repository/UserRepositoryKnex.js';
import constants from '../common/constants.js';

export const adminMiddleware = async (req, res, next) => {
  const userId = req.userId;
  const userRepository = new UserRepository();
  const user = await userRepository.get(userId);
  if (user.role === constants.ROLE.ADMIN) {
    next();
  } else {
    res.status(403).send({ error: 'User is not an admin.' });
  }
};
