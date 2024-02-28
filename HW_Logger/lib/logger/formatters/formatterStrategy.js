import * as constants from '../constants.js';
import config from '../config/config.js';
import formatMessage from './format-default-txt.js';
import formatMessageJSON from './format-json.js';
import formatMessageCSV from './format-csv.js';

const formatters = {
  [constants.formatters.TEXT]: formatMessage,
  [constants.formatters.JSON]: formatMessageJSON,
  [constants.formatters.CSV]: formatMessageCSV,
  [undefined]: formatMessage,
};
function getMessage() {
  return formatters[config.logFormat];
}

export { getMessage };
