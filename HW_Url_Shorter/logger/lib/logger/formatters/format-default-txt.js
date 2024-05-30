import { Transform } from 'stream';

export function transform(newValue) {
  const transformStream = new Transform({
    objectMode: true,
    transform(chunk, encoding, callback) {
      const date = JSON.parse(chunk.toString()).date;
      const level = JSON.parse(chunk.toString()).level;
      const category = JSON.parse(chunk.toString()).category;
      const message = JSON.parse(chunk.toString()).message;
      const modifiedChunk =
        `Date: ${date}, category:${category}, level:${level}, message:${JSON.stringify(
          message
        )},` + ` processFilename: ${newValue} \n`;
      callback(null, modifiedChunk);
    },
  });
  return transformStream;
}
