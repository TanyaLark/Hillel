import net from 'net';
import config from '../config/config.js';
import { Readable } from 'stream';
import fileHelper from './helpers/fileHelper.js';

let client;

function streamToString(stream) {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

const log = (formatter) => async (date, level, category, message) => {
  const logData = `${JSON.stringify({ date, level, category, message })}`;
  const inputStream = new Readable({
    read() {
      this.push(logData);
      this.push(null);
    },
  });

  const res = inputStream.pipe(formatter(fileHelper.processFilename));

  await streamToString(res).then((data) => {
    client.write(data);
  });
};

function init(formatter) {
  client = net.connect({ port: config.appenderPort }, () => {
    console.log('Connected');
  });

  process.on('exit', () => {
    client.exit();
  });

  return { log: log(formatter) };
}

export default init;
