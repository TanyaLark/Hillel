import path from 'path';
import * as constants from '../../constants.js';

// Get the name of the file from which the process was launched
const processFilename = path.basename(process.argv[1]);

function getFormattedDateForCSVFileName(dateString) {
  //example dateString = "2024-03-03T15:51:14.092Z";
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${month}_${day}_${year}`;
}

function getFileName(date, formatter) {
  const fileFormat = formatter.toLowerCase();
  if (fileFormat === constants.formatters.CSV) {
    return `app_${getFormattedDateForCSVFileName(date)}.csv`;
  }
  return `app.${fileFormat}`;
}

function getFilePath(directory, fileName) {
  return path.join(directory, fileName);
}

export default {
  processFilename,
  getFormattedDateForCSVFileName,
  getFileName,
  getFilePath,
};
