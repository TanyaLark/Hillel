import { Readable } from 'stream';
import fileHelper from './helpers/fileHelper.js';

function log(formatter) {
  return function (date, level, category, message) {
    const logData = `${JSON.stringify({ date, level, category, message })}`;
    const inputStream = new Readable({
      read() {
        this.push(logData);
        this.push(null);
      },
    });

    inputStream
      .pipe(formatter(fileHelper.processFilename))
      .pipe(process.stdout);

    inputStream.on('error', (err) => {
      console.error('readable error:', err);
    });
  };
}

function init(formatter) {
  return { log: log(formatter) };
}

export default init;
