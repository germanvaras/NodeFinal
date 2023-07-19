const CartRepository = require('../db/repositories/cart')
const cartRepository = new CartRepository()
const serviceQuantityInCart = async (id) => {
    let carts = await cartRepository.getQuantityInCart(id)
    return carts;
}
const serviceAddCart = async () => {
    let addCart = await cartRepository.createCart()
    return addCart;
}
const serviceGetProductsInCart = async (id) => {
    let getProducts = await cartRepository.getProductsInCart(id)
    return getProducts;
}
const serviceDeleteCartById = async (id) => {
    let deleteCart = await cartRepository.deleteCart(id)
    return deleteCart;
}
const serviceDeleteProductsInCart = async (id) => {
    let deleteProduct = await cartRepository.deleteProductsInCart(id)
    return deleteProduct;
}
const serviceAddCartProduct = async (cid, pid)=>{
    let addCartProduct = await cartRepository.addProductInCart( cid, pid )
    return addCartProduct
}
const serviceDeleteCartProduct = async (cid, pid )=>{
    let deleteCartProduct = await cartRepository.deleteProductInCart( cid, pid )
    return deleteCartProduct
}
const serviceUpdateQuantityProduct = async ( cid, pid, {quantity}) => {
    const result = await cartRepository.updateQuantityProduct(cid, pid, quantity);
    return result;
};
module.exports = {serviceQuantityInCart, serviceAddCart, serviceGetProductsInCart, 
    serviceDeleteProductsInCart, serviceAddCartProduct, 
    serviceDeleteCartProduct, serviceUpdateQuantityProduct, serviceDeleteCartById}