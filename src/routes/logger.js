const { Router } = require('express');
const loggerRouter = Router();
loggerRouter.get("/", (req, res) => {
    const loggers = [
        req.logger.fatal("Test Fatal"),
        req.logger.error("Test Error"),
        req.logger.warn("Test Warn"),
        req.logger.info("Test Info"),
        req.logger.http("Test HTTP"),
        req.logger.verbose("Test Verbose"),
    ]
    res.redirect("/")
    return loggers
    
})
module.exports = loggerRouter