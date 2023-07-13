const { Router } = require('express');
const productsRouter = Router();
const isAdminOrPremium = require('../middlewares/isAdminOrPremium')
const isLogged = require('../middlewares/isLogged')
const {
    addProduct,
    getProducts,
    getProductById,
    updateProductById,
    deleteById,
    formCreate
} = require('../controllers/product.js');
productsRouter.get('/', isLogged, getProducts)
productsRouter.get('/form', isAdminOrPremium, formCreate)
productsRouter.post('/form', isAdminOrPremium, addProduct)
productsRouter.delete('/form/:pid',isAdminOrPremium,deleteById)
productsRouter.put('/form/:pid',isAdminOrPremium, updateProductById)
productsRouter.get('/:pid',isLogged,getProductById)
module.exports = productsRouter