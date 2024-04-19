export default {
  SALT: 10,
  JWT_SECRET: process.env.JWT_SECRET || 'secret_key',
  ROLE: {
    ADMIN: 'ADMIN',
    USER: 'USER',
  },
  URL_TYPE: {
    PERMANENT: 'PERMANENT',
    TEMPORARY: 'TEMPORARY',
    ONE_TIME: 'ONE-TIME',
  },
};
