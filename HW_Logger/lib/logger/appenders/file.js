import * as constants from '../constants.js';
import fs from 'fs';
import path from 'path';
import config from '../config/config.js';
import { formatMessage } from '../formatters/format-default-txt.js';

const extension = config.formatter?.toLowerCase();
const directory = constants.directory;
const errorLogFileName = constants.errorLogFileName;

function log(formatter) {
  return function (date, level, category, message) {
    const fileName = getFileName(date, extension);
    const filePath = getFilePath(directory, fileName);
    const errorLogFilePath = getFilePath(directory, errorLogFileName);
    const logMessage = formatter(date, level, category, message);

    if (!fs.existsSync(constants.directory)) {
      fs.mkdirSync(constants.directory, { recursive: true });
    }

    if (level === constants.level.ERROR) {
      const errLogMessage = formatMessage(date, level, category, message);
      writeLog(errorLogFilePath, errLogMessage);
    }

    writeLog(filePath, logMessage);
  };
}

function writeLog(filePath, message) {
  fs.writeFile(filePath, message, { flag: 'a+' }, (err) => {
    if (err) {
      console.error('Error writing log file:', err);
      return;
    }
  });
}

function getFormattedDateForCSVFileName(dateString) {
  //example dateString = "2024-03-03T15:51:14.092Z";
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${month}_${day}_${year}`;
}

export function getFileName(date, formatter) {
  const fileFormat = formatter.toUpperCase();

  if (fileFormat === constants.formatters.CSV) {
    return `app_${getFormattedDateForCSVFileName(date)}.csv`;
  }
  return `app.${fileFormat}`;
}

export function getFilePath(directory, fileName) {
  return path.join(directory, fileName);
}

function init(formatter) {
  return {
    log: log(formatter),
  };
}

export default init;
