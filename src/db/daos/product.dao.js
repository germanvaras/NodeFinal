const Product = require('../model/product');
const ProductDTO = require('../DTOs/product')
const createProductDtoFromObject = (obj) => {
    const { _id, title, description, code, price, stock, category, thumbnail, owner } = obj;
    return new ProductDTO(_id, title, description, code, price, stock, category, thumbnail, owner);
}
require("dotenv").config;
class ProductDao {
    async getProducts({ query, limit, page, sort }) {
        const setLimit = limit ? limit : 10
        const setPage = page ? page : 1
        const setSort = sort ? { price: sort } : {}
        const setQuery = query ? { category: query } : {}
        const options = {
            limit: setLimit,
            page: setPage,
            sort: setSort,
            lean: true
        }
        try {
            const products = await Product.paginate(setQuery, options)
            return { ...products, query, sort };
        }
        catch (err) {
            return { error: err.message }
        }
    }
    async getById(id) {
        try {
            const product = await Product.findOne({ _id: id }).lean()
            if (!product) {
                return { error: `No existe un producto con el id: ${id}` }
            }
            return createProductDtoFromObject(product)
        }
        catch (err) {
            if (err.name === 'CastError') {
                return { error: `Id inválido: ${id}` }
            }
            return { error: err.message }
        }
    }
    async addProduct(product) {
        try {
            const newProduct = new Product(product)
            const validationError = newProduct.validateSync()
            if (validationError) {
                const errorMessages = []
                for (let errorField in validationError.errors) {
                    const errorMessage = validationError.errors[errorField].message
                    errorMessages.push(errorMessage)
                }
                return { error: errorMessages }
            }
            const createdProduct = await newProduct.save()
            return createProductDtoFromObject(createdProduct)

        } catch (err) {
            return { error: err.message }
        }
    }
    async updateProduct(id, product) {
        try {
            const updatedProduct = await Product.findOneAndUpdate(
                { _id: id },
                product,
                { new: true }
            )
            if (!updatedProduct) {
                return { error: `No existe producto con id: ${id}` }
            }
            return createProductDtoFromObject(updatedProduct)
        } catch (err) {
            if (err.name === 'CastError') {
                return { error: `Id inválido: ${id}` }
            }
            return { error: err.message }
        }
    }
    async deleteById(id) {
        try {
            const deleteProduct = await Product.deleteOne({ _id: id })
            if (deleteProduct.deletedCount === 0) {
                return { error: `No existe producto con id:${id}` }
            }
            return createProductDtoFromObject(deleteProduct)
        }
        catch (err) {
            if (err.name === 'CastError') {
                return { error: `Id inválido: ${id}` }
            }
            return { error: err.message }
        }
    }
}

module.exports = ProductDao;