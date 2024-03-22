import { Transform } from 'stream';

export function transform(newValue) {
  return new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      const dataObj = JSON.parse(chunk.toString());
      dataObj.processFilename = newValue;
      const modifiedChunk = JSON.stringify(dataObj) + '\n';
      callback(null, modifiedChunk);
    },
  });
}
