import * as constants from '../constants.js';
import config from '../config/config.js';
import { existsSync } from 'node:fs';
import fileHelper from '../appenders/helpers/fileHelper.js';

export function formatMessage(date, level, category, message, processFilename) {
  try {
    const escapedMessage = JSON.stringify(message).replace(/"/g, '""');
    const extension = config.formatter?.toLowerCase();
    const fileName = fileHelper.getFileName(date, extension);
    const filePath = fileHelper.getFilePath(constants.directory, fileName);
    let headersAdded = existsSync(filePath);

    if (!headersAdded) {
      headersAdded = true;
      return `Date,Category,Level,Message,Filename\n${date},${category},${level},"${escapedMessage}","${processFilename}"\n`;
    }

    return `${date},${category},${level},"${escapedMessage}","${processFilename}"\n`;
  } catch (error) {
    console.error('Error in csv formatter: ', error.message);
  }
}
