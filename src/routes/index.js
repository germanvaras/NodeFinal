const { Router } = require('express');
const routes = Router();
const productsRouter = require("./product")
const cartRouter = require("./cart")
const messageRouter = require("./message")
const userRouter = require("./user")
const loggerRouter = require("./logger")
routes.use("/api/products", productsRouter)
routes.use("/api/cart", cartRouter)
routes.use("/api/chat", messageRouter)
routes.use("/api/user", userRouter)
routes.use("/api/loggerTest", loggerRouter)
module.exports = routes