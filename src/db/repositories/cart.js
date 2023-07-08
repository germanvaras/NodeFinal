
const CartDao = require('../daos/cart.dao')
const cartDao = new CartDao()
class CartRepository {
    getQuantityInCart = async (id) => {
        let carts = await cartDao.getQuantityInCart(id)
        return carts;
    }
    createCart = async () => {
        let addCart = await cartDao.createCart()
        return addCart;
    }
    getProductsInCart = async (id) => {
        let getProducts = await cartDao.getProductsInCart(id)
        return getProducts;
    }
    deleteProductsInCart = async (id) => {
        let deleteProduct = await cartDao.deleteProductsInCart(id)
        return deleteProduct;
    }
    addProductInCart = async (cid, pid) => {
        let addCartProduct = await cartDao.addProductInCart(cid, pid)
        return addCartProduct
    }
    deleteProductInCart = async (cid, pid) => {
        let deleteCartProduct = await cartDao.deleteProductInCart(cid, pid)
        return deleteCartProduct
    }
    updateQuantityProduct = async (cid, pid, quantity ) => {
        const result = await cartDao.updateQuantityProduct(cid, pid, quantity);
        return result;
    };
}
module.exports = CartRepository
