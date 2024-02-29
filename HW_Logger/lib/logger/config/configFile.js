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

    if (config.appenders && config.appenders.includes('FILE')) {
      config.formatter =
        constants.formatters[logFormat] || constants.formatters.TEXT;
    }
  } catch (error) {
    console.warn('Error reading config file ', error.message);
  }

  return config;
}
