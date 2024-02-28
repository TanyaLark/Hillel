import * as constants from "./constants.js";
import fs from "fs";

const defaultConfig = {
  logLevel: constants.level.INFO,
  scoreLevel: constants.scoreLevel[constants.level.INFO],
  appenders: [constants.appender.CONSOLE],
};

function setConfigLevel(config, level) {
  const logLevel = level?.toUpperCase();
  if (constants.level.hasOwnProperty(logLevel)) {
    config.logLevel = logLevel;
  }
}

function setConfigAppender(config, appenders, logFormat) {
  config.appenders = [];
  appenders.map((appender) => {
    const appenderUpper = appender.toUpperCase();
    if (constants.appender.hasOwnProperty(appenderUpper)) {
      config.appenders.push(appenderUpper);
    }
    if (appenderUpper === constants.appender.FILE) {
      if (!logFormat) {
        logFormat = constants.logFormat.TEXT;
      }
      setIfAppenderFile(config, logFormat);
    }
  });
}

function setIfAppenderFile(config, logFormat) {
  const logFormatUpper = logFormat?.toUpperCase();
  if (constants.logFormat.hasOwnProperty(logFormatUpper)) {
    config.logFormat = constants.logFormat[logFormatUpper];
  } else {
    config.logFormat = constants.logFormat.TEXT;
  }
}

function getConfigFromJSONFile(filePath, config) {
  try {
    const file = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const { logLevel, appenders, logFormat } = file;

    setConfigLevel(config, logLevel);
    setConfigAppender(config, appenders, logFormat);
  } catch (error) {}
}

function enrichConfig(config) {
  config.scoreLevel = constants.scoreLevel[config.logLevel];
}

function initConfig() {
  // process.env["LOG_LEVEL"] = "debug";
  // process.env["LOG_APPENDERS"] = ["console","file"];
  // process.env["LOG_FORMAT"] = "json";
  // process.env["LOG_CONFIG_FILE"] = "./logger.json";

  const config = defaultConfig;

  const logLevel = process.env.LOG_LEVEL?.toUpperCase();
  const appenders = process.env.LOG_APPENDERS?.toUpperCase().split(",");
  const logFormat = process.env.LOG_FORMAT?.toUpperCase();
  const logConfigFile = process.env.LOG_CONFIG_FILE; //path to config file

  //set config from environment variables
  if (logLevel && appenders) {
    setConfigLevel(config, logLevel);
    setConfigAppender(config, appenders, logFormat);
  }

  //set config from file
  if (logConfigFile) {
    getConfigFromJSONFile(logConfigFile, config);
  }

  enrichConfig(config);
  console.log("config ===>", config);
  return config;
}

const config = initConfig();
export default config;
