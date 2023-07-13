const { Router } = require('express');
const messageRouter = Router();
const { addMessages, getAllMessages} =  require('../controllers/message')
const isLogged = require('../middlewares/isLogged')
const isUserOrPremium = require('../middlewares/isUserOrPremium')
messageRouter.get("/",isLogged, getAllMessages)
messageRouter.post("/",isLogged,isUserOrPremium, addMessages)  
module.exports = messageRouter;