require("dotenv").config();
const PORT = process.env.PORT || 4200;
const { httpServer } = require("./src/socket");
const {logger} = require("./src/middlewares/logger")
httpServer.listen(PORT, ()=> logger.info(`Server listening on port ${httpServer.address().port}`))
httpServer.on("error", error => logger.error(error))