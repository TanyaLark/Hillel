const { generateHash } = require('./utils/utils');

const hash = generateHash(8);
console.log('Generated hash ===>', hash);
