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

import logger from "./lib/logger/logger.js";

import color from "./test_data/color.js";
import fruit from "./test_data/fruit.js";
import { add } from "./test_data/handler.js";

import fs from "fs";

const log = logger.getLogger("app.js");

log.info(color);
log.warn(fruit);
log.error("ERROR occur: My log");

// add(3, 5);

// const file = JSON.parse(fs.readFileSync("./logger.json", "utf-8"));

// const file = fs.readFile("./logger.json", "utf-8", (err, data) => {
//   if (err) {
//     log.error(err);
//   }
//   console.log(data);
//   return data;
// });

(async () => {
  const file = await fs.promises.readFile("./logger.json", "utf-8");
  //   console.log(file);
})();

// fs.writeFileSync("./logger2.txt", "\ntesttest", { flag: "a+" });
// fs.appendFileSync("./logger2.txt", "\ntesttest");
