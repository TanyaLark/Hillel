import * as constants from "./constants.js";
import fs from "fs";

const defaultConfig = {
  logLevel: constants.level.INFO,
  scoreLevel: constants.scoreLevel[constants.level.INFO],
  appender: constants.appender.CONSOLE,
};

function setConfigLevelAndAppender(config, level, appender) {
  if (constants.level.hasOwnProperty(level?.toUpperCase())) {
    config.logLevel = level?.toUpperCase();
  }

  if (constants.appender.hasOwnProperty(appender?.toUpperCase())) {
    config.appender = appender?.toUpperCase();
  }
}

function setIfAppenderFile(config, logFormat) {
  if (!logFormat) {
    config.logFormat = constants.logFormat.TEXT;
    return;
  }

  if (constants.logFormat.hasOwnProperty(logFormat?.toUpperCase())) {
    config.logFormat = logFormat?.toUpperCase();
  } else {
    config.logFormat = constants.logFormat.TEXT;
  }
}

function getConfigFromJSONFile(filePath, config) {
  try {
    const file = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const { logLevel, appender } = file;

    setConfigLevelAndAppender(config, logLevel, appender);

    if (config.appender === constants.appender.FILE) {
      const { logFormat } = file;
      setIfAppenderFile(config, logFormat);
    }
  } catch (error) {}
}

function enrichConfig(config) {
  config.scoreLevel = constants.scoreLevel[config.logLevel];
}

function initConfig() {
  // process.env["LOG_LEVEL"] = "debug";
  // process.env["LOG_APPENDER"] = "file";
  // process.env["LOG_FORMAT"] = "json";
  // process.env["LOG_CONFIG_FILE"] = "./logger.json";

  const config = defaultConfig;

  const logLevel = process.env.LOG_LEVEL?.toUpperCase();
  const appender = process.env.LOG_APPENDER?.toUpperCase();
  const logFormat = process.env.LOG_FORMAT?.toUpperCase();
  const logConfigFile = process.env.LOG_CONFIG_FILE; //path to config file

  if (logLevel && appender) {
    setConfigLevelAndAppender(config, logLevel, appender);
    if (appender === constants.appender.FILE) {
      setIfAppenderFile(config, logFormat);
    }
  }

  if (!logLevel && !appender && logConfigFile) {
    getConfigFromJSONFile(logConfigFile, config);
  }

  enrichConfig(config);
  console.log("config ===>", config);
  return config;
}

const config = initConfig();
export default config;
