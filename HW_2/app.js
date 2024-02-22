/**
 * Logger:
 *  log_level: info, warn, error, trace, debug
 *  log_score: {
 *      none: ??? 0
 *      error: 1
 *      warn: 2
 *      info: 3
 *      debug: 4
 *      trace: 5
 *  }
 *  appenders: console, file, queue, elastic...
 */

// appenders - це куди пишемо логи
// log_score - це пріоритет логів, які логи ми хочемо виводити
// category - це назва файлу, звідки будуть писатися логи

import logger from "./lib/logger/logger.js";

import color from "./test_data/color.js";
import fruit from "./test_data/fruit.js";
import { add } from "./test_data/handler.js";

const log = logger.getLogger("app.js");

log.info(color);
log.warn(fruit);
log.error("ERROR occur: My log");
log.debug(color);
log.trace(fruit);

add(3, 5);

// fs.writeFileSync("./logger2.txt", "\ntesttest", { flag: "a+" });
// fs.appendFileSync("./logger2.txt", "\ntesttest");
