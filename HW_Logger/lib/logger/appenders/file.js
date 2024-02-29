import * as constants from '../constants.js';
import * as messageStrategy from '../formatters/formatterStrategy.js';
import fs from 'fs';
import path from 'path';
import config from '../config/config.js';
import setTextMessage from '../formatters/format-default-txt.js';

const directory = `./log_output`;
const errorLogFileName = `app_error.js`;
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

function log(date, level, category, message) {
  const fileName = getFileName(config);
  const filePath = path.join(directory, fileName);
  const logMessage = messageFromStrategy.formatMessage(
    date,
    level,
    category,
    message
  );

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
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
  const errorLogFilePath = path.join(directory, errorLogFileName);

  fs.writeFile(errorLogFilePath, logMessage, { flag: 'a+' }, (err) => {
    if (err) {
      console.error('Error writing log file:', err);
      return;
    }
  });
}

export default { log };
