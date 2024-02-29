import * as constants from '../constants.js';
import * as messageStrategy from '../formatters/formatterStrategy.js';
import fs from 'fs';
import path from 'path';
import config from '../config/config.js';
import setTextMessage from '../formatters/format-default-txt.js';

const messageFromStrategy = messageStrategy.getMessage();

function getFileName(config) {
  const fileFormat = config.formatter.toLowerCase();

  if (config.formatter === constants.formatters.CSV) {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}_${
      currentDate.getMonth() + 1
    }_${currentDate.getFullYear()}`;
    return `app.${formattedDate}.csv`;
  }
  return `app.${fileFormat}`;
}

export function getFilePath(config) {
  const fileName = getFileName(config);
  return path.join(constants.directory, fileName);
}

function log(date, level, category, message) {
  const filePath = getFilePath(config);

  const logMessage = messageFromStrategy.formatMessage(
    date,
    level,
    category,
    message
  );

  if (!fs.existsSync(constants.directory)) {
    fs.mkdirSync(constants.directory, { recursive: true });
  }

  if (level === constants.level.ERROR) {
    const errLogMessage = setTextMessage.formatMessage(
      date,
      level,
      category,
      message
    );
    logError(errLogMessage);
  }

  fs.writeFile(filePath, logMessage, { flag: 'a+' }, (err) => {
    if (err) {
      console.error('Error writing log file:', err);
      return;
    }
  });
}

function logError(logMessage) {
  const errorLogFilePath = path.join(
    constants.directory,
    constants.errorLogFileName
  );

  fs.writeFile(errorLogFilePath, logMessage, { flag: 'a+' }, (err) => {
    if (err) {
      console.error('Error writing log file:', err);
      return;
    }
  });
}

export default { log };
