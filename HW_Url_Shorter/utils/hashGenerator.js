export function generateHash(length = 5) {
    if (!Number.isInteger(length) || length <= 0) {
      throw new Error('Length must be a positive integer greater than 0');
    }
    const charset =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }
    return result;
  }