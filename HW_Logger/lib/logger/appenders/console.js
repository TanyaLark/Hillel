import { Writable } from 'stream';

function log(formatter) {
  return function (date, level, category, message) {
    const formattedMessage = formatter(date, level, category, message);
    process.stdout.write(formattedMessage + '\n');
  };
}

function init(formatter) {
  const logger = new Writable({
    write(chunk, callback) {
      process.stdout.write(chunk);
      callback();
    },
  });

  process.on('exit', () => {
    logger.end();
  });

  return {
    log: log(formatter),
  };
}

export default init;
