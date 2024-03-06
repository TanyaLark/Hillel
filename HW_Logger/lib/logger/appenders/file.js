import * as constants from '../constants.js';
import fs from 'fs';
import config from '../config/config.js';
import { Readable } from 'stream';
import fileHelper from './helpers/fileHelper.js';

const extension = config.formatter?.toLowerCase();
const directory = constants.directory;
const errorLogFileName = constants.errorLogFileName;

const log = (formatter) => (date, level, category, message) => {
  const logData = `${JSON.stringify({ date, level, category, message })}`;
  const fileName = fileHelper.getFileName(date, extension);
  const filePath = fileHelper.getFilePath(directory, fileName);
  const errorLogFilePath = fileHelper.getFilePath(directory, errorLogFileName);
  const inputStream = new Readable({
    read() {
      this.push(logData);
      this.push(null);
    },
  });

  inputStream
    .pipe(formatter(fileHelper.processFilename))
    .pipe(fs.createWriteStream(filePath, { flags: 'a+' }));

  inputStream.on('error', (err) => {
    console.error('readable error:', err);
  });

  inputStream.on('end', () => {});

  if (!fs.existsSync(constants.directory)) {
    fs.mkdirSync(constants.directory, { recursive: true });
  }

  if (level === constants.level.ERROR) {
    const writeStream = fs.createWriteStream(errorLogFilePath, {
      flags: 'a+',
    });
    inputStream.pipe(writeStream);
  }
};

function init(formatter) {
  return { log: log(formatter) };
}

export default init;
