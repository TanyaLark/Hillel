import { getTransformStream } from '../providers/streams-provider.js';
import helper from './helpers/fileHelper.js';

function init(formatter) {
  const transformStream = getTransformStream();
  transformStream.pipe(formatter(helper.processFilename)).pipe(process.stdout);
  return { log: () => {} };
}

export default init;
