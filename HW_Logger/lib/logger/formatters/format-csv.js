import * as constants from '../constants.js';
import config from '../config/config.js';
import { getFilePath, getFileName } from '../appenders/file.js';
import { existsSync } from 'node:fs';

export function formatMessage(date, level, category, message) {
  try {
    const escapedMessage = JSON.stringify(message).replace(/"/g, '""');
    const extension = config.formatter?.toLowerCase();
    const fileName = getFileName(date, extension);
    const filePath = getFilePath(constants.directory, fileName);
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
