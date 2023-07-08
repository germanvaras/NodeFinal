
const winston = require('winston');
const levels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    verbose: 5,
};
const colors = {
    fatal: 'magenta',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'cyan',
    verbose: 'gray',
};
const buildDevLogger = () => {
    const logger = winston.createLogger({
        levels,
        format: winston.format.combine(
            winston.format.colorize({ colors }),
            winston.format.simple()),
        transports: [
            new winston.transports.Console({ level: 'verbose' }),
        ]
    });
    return logger
}
const buildProdLogger = () => {
    const logger = winston.createLogger({
        levels,
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        ),
        transports: [
            new winston.transports.File({ filename: 'error.log', level: 'error' })
        ]
    })
    return logger
}
const logger = process.env.ENVIRONMENT === "PROD" ? buildProdLogger() : buildDevLogger()

const addLogger = (req, res, next) => {
    req.logger = logger;
    next()
}
module.exports = { addLogger, logger }
