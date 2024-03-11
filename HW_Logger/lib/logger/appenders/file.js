import * as constants from '../constants.js';
import fs from 'fs';
import config from '../config/config.js';
import { Transform } from 'stream';
import fileHelper from './helpers/fileHelper.js';
import { getTransformStream } from '../providers/streams-provider.js';

const extension = config.formatter?.toLowerCase();
const directory = constants.directory;
const errorLogFileName = constants.errorLogFileName;

function init(formatter) {
  const fileName = fileHelper.getFileName(extension);
  const filePath = fileHelper.getFilePath(directory, fileName);
  const errorLogFilePath = fileHelper.getFilePath(directory, errorLogFileName);
  const transformStream = getTransformStream();
  transformStream
    .pipe(formatter(fileHelper.processFilename))
    .pipe(fs.createWriteStream(filePath, { flags: 'a+' }));

  if (!fs.existsSync(constants.directory)) {
    fs.mkdirSync(constants.directory, { recursive: true });
  }

  transformStream
    .pipe(
      new Transform({
        transform(chunk, encoding, callback) {
          const parsedChunk = JSON.parse(chunk);
          if (parsedChunk.level === constants.level.ERROR) {
            callback(null, chunk);
          } else {
            callback();
          }
        },
      })
    )
    .pipe(formatter(fileHelper.processFilename))
    .pipe(fs.createWriteStream(errorLogFilePath, { flags: 'a+' }));

  return { log: () => {} };
}

export default init;
