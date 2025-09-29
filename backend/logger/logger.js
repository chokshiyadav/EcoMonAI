import winston from "winston";
const { combine, timestamp, json,printf } = winston.format;

const myFormat = printf(({ level, message, timestamp, ...metadata }) => {
  return JSON.stringify({
      timestamp,
      level,
      message,
      ...metadata,
  });
});



const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    json() // Outputs logs as JSON format
  ),
  transports: [
    new winston.transports.Console(), // Log to the console
    new winston.transports.File({ filename: 'logs/server.log' }) // Log to a file
  ],
});

export default logger;