const { Router } = require('express');
const cartRouter = Router();
const isLogged = require('../middlewares/isLogged')
const isUserOrPremium = require('../middlewares/isUserOrPremium')
const {
    getQuantityInCart,
    createCart,
    getProductsInCart,
    deleteProductsInCart,
    addProductInCart,
    deleteProductInCart,
    updateQuantityProduct
} = require('../controllers/cart')
const {
    purchaseProducts
} = require('../controllers/ticket')
cartRouter.get('/quantity/:cid', isLogged, getQuantityInCart)
cartRouter.post('/', isLogged, createCart)
cartRouter.get('/:cid', isLogged, getProductsInCart)
cartRouter.delete('/:cid', isLogged, isUserOrPremium, deleteProductsInCart)
cartRouter.post('/:cid/product/:pid', isLogged, isUserOrPremium, addProductInCart)
cartRouter.delete('/:cid/product/:pid', isLogged, isUserOrPremium, deleteProductInCart)
cartRouter.put("/:cid/product/:pid", isLogged, isUserOrPremium, updateQuantityProduct);
cartRouter.get('/:cid/purchase', isLogged, isUserOrPremium, purchaseProducts)

module.exports = cartRouter