import fs from 'fs';
import * as constants from '../constants.js';
import { validateLogLevel, validateAppenders } from './validator.js';

export function getConfigFromFile(filePath) {
  const config = {};

  if (!filePath) {
    return config;
  }

  try {
    const file = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const logLevel = file.logLevel?.toUpperCase();
    const appenders = file.appenders?.toUpperCase();
    const logFormat = file.formatter?.toUpperCase();

    if (validateLogLevel(logLevel)) {
      config.logLevel = logLevel;
    }

    if (appenders) {
      const validAppenders = validateAppenders(appenders);
      if (validAppenders.length > 0) {
        config.appenders = validAppenders;
      }
    }

    if (
      config.appenders &&
      config.appenders.includes(constants.appender.FILE)
    ) {
      config.formatter =
        constants.formatters[logFormat] || constants.formatters.TEXT;
    }

    if (
      config.appenders &&
      config.appenders.includes(constants.appender.NETWORK)
    ) {
      //todo: validate port and host
      const port = file.appenderPort;
      console.log('port:', port);
      const host = file.appenderHost?.toLowerCase();

      if (!port) {
        console.warn('No appender port provided');
        console.warn('Using default port:', constants.defaultNetworkConfig.PORT);
        config.appenderPort = constants.defaultNetworkConfig.PORT;
      } else {
        config.appenderPort = port;
      }

      if (!host) {
        console.warn('No appender host provided');
        console.warn('Using default host:', constants.defaultNetworkConfig.HOST);
        config.appenderHost = constants.defaultNetworkConfig.HOST;
      } else {
        config.appenderHost = host;
      }
    }
  } catch (error) {
    console.warn('Error reading config file ', error.message);
  }

  return config;
}
