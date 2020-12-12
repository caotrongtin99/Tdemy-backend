const { createLogger, format, transports } = require('winston');
const logger = createLogger({
//   level: "info",
//   format: format.combine(
//     format.errors({ stack: true }),
//     format.splat(),
//     format.json()
//   ),
  transports: [
    // new transports.File({ filename: "quick-start-error.log", level: "error" }),
    // new transports.File({ filename: "quick-start-combined.log" }),
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.json(),
        format.simple(),
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" })
      ),
    }),
  ],
});
module.exports=logger;