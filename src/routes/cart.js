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
    updateQuantityProduct,
} = require('../controllers/cart')
const {
    purchaseProducts,
    checkout,
    confirmPurchase
} = require('../controllers/ticket')
cartRouter.get('/quantity/:cid', isLogged, getQuantityInCart)
cartRouter.post('/', isLogged, createCart)
cartRouter.get('/:cid', isLogged, getProductsInCart)
cartRouter.delete('/:cid', isLogged, isUserOrPremium, deleteProductsInCart)
cartRouter.post('/:cid/product/:pid', isLogged, isUserOrPremium, addProductInCart)
cartRouter.delete('/:cid/product/:pid', isLogged, isUserOrPremium, deleteProductInCart)
cartRouter.put("/:cid/product/:pid", isLogged, isUserOrPremium, updateQuantityProduct);
cartRouter.get('/:cid/checkout',isUserOrPremium, checkout )
cartRouter.post('/:cid/purchase', isUserOrPremium, purchaseProducts)
cartRouter.post('/:cid/confirm-purchase', isUserOrPremium, confirmPurchase);

module.exports = cartRouter