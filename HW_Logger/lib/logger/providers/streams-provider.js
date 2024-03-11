import { Transform } from 'stream';

let transformStream = null;

export function getTransformStream() {
  if (!transformStream) {
    transformStream = new Transform({
      objectMode: true,
      transform(chunk, encoding, callback) {
        this.push(chunk);
        callback();
      },
    });
  }
  return transformStream;
}

function closeTransformStream() {
  if (transformStream) {
    transformStream.end();
    transformStream = null;
  }
}

process.on('beforeExit', () => {
  closeTransformStream();
});
