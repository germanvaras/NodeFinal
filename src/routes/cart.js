const { Router } = require('express');
const cartRouter = Router();
const isLogged = require('../middlewares/isLogged')
const isUser = require('../middlewares/isUser')
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
cartRouter.delete('/:cid', isLogged, isUser, deleteProductsInCart)
cartRouter.post('/:cid/product/:pid', isLogged, isUser, addProductInCart)
cartRouter.delete('/:cid/product/:pid', isLogged, isUser, deleteProductInCart)
cartRouter.put("/:cid/product/:pid", isLogged, isUser, updateQuantityProduct);
cartRouter.get('/:cid/purchase', isLogged, isUser, purchaseProducts)

module.exports = cartRouter