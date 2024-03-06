import * as constants from '../constants.js';
import config from '../config/config.js';
import { existsSync } from 'node:fs';
import fileHelper from '../appenders/helpers/fileHelper.js';
import { Transform } from 'node:stream';

export function transform(newValue) {
  const transformStream = new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      const date = JSON.parse(chunk.toString()).date;
      const level = JSON.parse(chunk.toString()).level;
      const category = JSON.parse(chunk.toString()).category;
      const message = JSON.parse(chunk.toString()).message;

      const escapedMessage = JSON.stringify(message).replace(/"/g, '""');
      const extension = config.formatter?.toLowerCase();
      const fileName = fileHelper.getFileName(date, extension);
      const filePath = fileHelper.getFilePath(constants.directory, fileName);
      let headersAdded = existsSync(filePath);
      let str;

      if (!headersAdded) {
        headersAdded = true;
        str = `Date,Category,Level,Message,Filename\n${date},${category},${level},"${escapedMessage}","${newValue}"\n`;
      } else {
        str = `${date},${category},${level},"${escapedMessage}","${newValue}"\n`;
      }

      callback(null, str);
    },
  });
  return transformStream;
}
