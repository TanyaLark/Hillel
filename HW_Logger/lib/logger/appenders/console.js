import { Writable } from 'stream';
import transform from './helpers/fileHelper.js';

function log(formatter) {
  return function (date, level, category, message, filename) {
    const formattedMessage = formatter(
      date,
      level,
      category,
      message,
      filename
    );
    process.stdout.write(formattedMessage + '\n');
  };
}

function init(formatter) {
  const logger = new Writable({
    write(chunk, encoding, callback) {
      process.stdout.write(chunk);
      callback();
    },
  });

  const logWithFilename = (date, level, category, message) => {
    const payload = transform.transformPayload(
      date,
      level,
      category,
      message,
      transform.processFilename
    );
    log(formatter)(
      payload.date,
      payload.level,
      payload.category,
      payload.message,
      payload.filename
    );
  };

  process.on('exit', () => {
    logger.end();
  });

  return {
    log: logWithFilename,
    stream: logger,
  };
}

export default init;
