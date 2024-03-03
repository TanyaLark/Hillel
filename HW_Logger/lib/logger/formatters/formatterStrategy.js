import * as constants from '../constants.js';
import { formatMessage as formatMessageTXT } from './format-default-txt.js';
import { formatMessage as formatMessageJSON } from './format-json.js';
import { formatMessage as formatMessageCSV } from './format-csv.js';

const formatters = {
  [constants.formatters.TEXT]: formatMessageTXT,
  [constants.formatters.JSON]: formatMessageJSON,
  [constants.formatters.CSV]: formatMessageCSV,
  [undefined]: formatMessageTXT,
};
function getFormatter(formatter) {
  return formatters[formatter];
}

export { getFormatter };
