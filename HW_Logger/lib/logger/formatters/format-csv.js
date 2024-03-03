import config from '../config/config.js';
import { getFilePath } from '../appenders/file.js';
import { existsSync } from 'node:fs';

function formatMessage(date, level, category, message) {
  try {
    const escapedMessage = JSON.stringify(message).replace(/"/g, '""');
    const filePath = getFilePath(config);
    let headersAdded = existsSync(filePath);

    if (!headersAdded) {
      headersAdded = true;
      return `Date,Category,Level,Message\n${date},${category},${level},"${escapedMessage}"\n`;
    }

    return `${date},${category},${level},"${escapedMessage}"\n`;
  } catch (error) {
    console.error('Error in csv formatter: ', error.message);
  }
}

export default { formatMessage };
