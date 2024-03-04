import * as constants from '../constants.js';
import fs from 'fs';
import config from '../config/config.js';
import { formatMessage } from '../formatters/format-default-txt.js';
import { Writable } from 'stream';
import fileHelper from './helpers/fileHelper.js';

const extension = config.formatter?.toLowerCase();
const directory = constants.directory;
const errorLogFileName = constants.errorLogFileName;

function log(formatter) {
  return function (date, level, category, message, processFilename) {
    const fileName = fileHelper.getFileName(date, extension);
    const filePath = fileHelper.getFilePath(directory, fileName);
    const errorLogFilePath = fileHelper.getFilePath(
      directory,
      errorLogFileName
    );
    const logMessage = formatter(
      date,
      level,
      category,
      message,
      processFilename
    );

    if (!fs.existsSync(constants.directory)) {
      fs.mkdirSync(constants.directory, { recursive: true });
    }

    if (level === constants.level.ERROR) {
      const errLogMessage = formatMessage(
        date,
        level,
        category,
        message,
        processFilename
      );
      writeToStream(errorLogFilePath, errLogMessage);
    }
    writeToStream(filePath, logMessage);
  };
}

function writeToStream(filePath, message) {
  const stream = fs.createWriteStream(filePath, { flags: 'a+' });
  const writableStream = new Writable({
    write(chunk, encoding, callback) {
      if (!stream.write(chunk)) {
        stream.once('drain', callback);
      } else {
        callback();
      }
    },
  });
  writableStream.write(message);
  writableStream.end();
}

function init(formatter) {
  const logWithFilename = (date, level, category, message) => {
    const payload = fileHelper.transformPayload(
      date,
      level,
      category,
      message,
      fileHelper.processFilename
    );
    log(formatter)(
      payload.date,
      payload.level,
      payload.category,
      payload.message,
      payload.filename
    );
  };
  return {
    log: logWithFilename,
  };
}

export default init;
