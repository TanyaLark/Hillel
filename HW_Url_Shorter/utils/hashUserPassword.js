import crypto from 'node:crypto';
import constants from '../common/constants.js';

export async function hashUserPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto
      .randomBytes(constants.HASH_PASSWORD.PASSWORD_SALT_LENGTH)
      .toString(constants.HASH_PASSWORD.BYTE_TO_STRING_ENCODING);
    crypto.pbkdf2(
      password,
      salt,
      constants.HASH_PASSWORD.PASSWORD_HASH_ITERATIONS,
      constants.HASH_PASSWORD.PASSWORD_LENGTH,
      constants.HASH_PASSWORD.DIGEST,
      (error, hash) => {
        if (error) {
          reject(error);
        } else {
          const result =
            'pbkdf2$' +
            constants.HASH_PASSWORD.PASSWORD_HASH_ITERATIONS +
            '$' +
            hash.toString(constants.HASH_PASSWORD.BYTE_TO_STRING_ENCODING) +
            '$' +
            salt;
          resolve(result);
        }
      }
    );
  });
}

export async function verifyUserPassword(receivedPassword, hashedPassword) {
  return new Promise((resolve, reject) => {
    try {
      const passwordHashParts = hashedPassword.split('$');
      const alg = passwordHashParts[0];
      const iterations = parseInt(passwordHashParts[1]);
      const passwordHash = passwordHashParts[2];
      const salt = passwordHashParts[3];
      if (
        passwordHashParts.length !== 4 ||
        alg !== 'pbkdf2' ||
        iterations !== constants.HASH_PASSWORD.PASSWORD_HASH_ITERATIONS
      ) {
        resolve(false);
      }
      crypto.pbkdf2(
        receivedPassword,
        salt,
        iterations,
        constants.HASH_PASSWORD.PASSWORD_LENGTH,
        constants.HASH_PASSWORD.DIGEST,
        (error, hash) => {
          if (error) {
            reject(error);
          } else {
            try {
              const hashToString = hash.toString(
                constants.HASH_PASSWORD.BYTE_TO_STRING_ENCODING
              );
              const result = crypto.timingSafeEqual(
                Buffer.from(passwordHash),
                Buffer.from(hashToString)
              );
              resolve(result);
            } catch (e) {
              resolve(false);
            }
          }
        }
      );
    } catch (e) {
      resolve(false);
    }
  });
}
