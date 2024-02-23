import * as helper from "../helpers/message.helper.js";
import * as constants from "../constants.js";
import fs from "fs";
import path from "path";

function writeLogInFile(date, level, category, message) {
  const directory = `./log_output`;
  const fileName = `app.log`;
  const filePath = path.join(directory, fileName);
  const logMessage = helper.formatMessage(date, level, category, message);

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }

  if (level === constants.level.ERROR) {
    writeErrorLogInFile(directory, JSON.stringify(logMessage));
  }

  fs.writeFileSync(filePath, `${logMessage}\n`, { flag: "a+" }, (err) => {
    if (err) {
      console.error("Error writing log file:", err);
      return;
    }
  });
}

function writeErrorLogInFile(directory, logMessage) {
  const errorLogFileName = `app_error.js`;
  const errorLogFilePath = path.join(directory, errorLogFileName);

  fs.writeFileSync(
    errorLogFilePath,
    `${logMessage}\n`,
    { flag: "a+" },
    (err) => {
      if (err) {
        console.error("Error writing log file:", err);
        return;
      }
    }
  );
}

export default { writeLogInFile };
