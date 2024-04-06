import jwt from 'jsonwebtoken';
import constants from '../common/constants.js';

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Authorization failed' });
  }

  jwt.verify(token, constants.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Authorization failed' });
    }
    req.userId = decoded.id;
    next();
  });
};
