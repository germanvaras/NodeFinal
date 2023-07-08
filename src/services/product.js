const ProductRepository = require('../db/repositories/product')
const productRepository = new ProductRepository()
const serviceGetProducts = async (filters) =>{
    let getProducts = await productRepository.getProducts(filters)
    return getProducts;
}
const serviceGetProductById = async (id) => {
    let getById = await productRepository.getById(id)
    return getById;
}
const serviceAddProduct = async (product) => {
    let addProduct = await productRepository.addProduct(product)
    return addProduct;
}
const serviceUpdateProduct = async (id, product) => {
    let serviceAddProduct = await productRepository.updateProduct(id, product)
    return serviceAddProduct;
}
const serviceDeleteById = async (id) => {
    let deleteById = await productRepository.deleteById(id)
    return deleteById;
}
module.exports = {serviceAddProduct, serviceGetProducts,serviceGetProductById, serviceUpdateProduct, serviceDeleteById}
