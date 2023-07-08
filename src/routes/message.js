const { Router } = require('express');
const messageRouter = Router();
const { addMessages, getAllMessages} =  require('../controllers/message')
const isLogged = require('../middlewares/isLogged')
const isUser = require('../middlewares/isUser')
messageRouter.get("/",isLogged, getAllMessages)
messageRouter.post("/",isLogged,isUser, addMessages)  
module.exports = messageRouter;