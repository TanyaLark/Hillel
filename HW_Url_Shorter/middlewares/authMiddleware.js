import UserRepository from '../repository/UserRepository.js';
import error from '../utils/customErrors.js';

const userRepository = new UserRepository();
const users = {
  tetiana: 'admin',
};

function decodeBasicAuthCredentials(encodedCredentials) {
  const decodedString = Buffer.from(encodedCredentials, 'base64').toString(
    'utf-8'
  );
  const [username, password] = decodedString.split(':');
  return { username, password };
}

export default (req, res, next) => {
  const auth = req.header('Authorization');
  if (auth?.startsWith('Basic ')) {
    const [name] = auth.substring(6, auth.length).split(':');
    const { username, password } = decodeBasicAuthCredentials(name);
    const user = userRepository.getByNameAndPassword(username, password);
    if (user || users[username] === password) {
      next();
      return;
    } else {
      throw new error.AuthenticationError('Invalid user name or password');
    }
  }

  res.status(401).end('Auth header not provided');
};
