const ProductDao = require('../daos/product.dao')
const productDao = new ProductDao()
class ProductRepository {
    async getProducts(filters) {
        return productDao.getProducts(filters);
    }
    async getById(id) {
        return productDao.getById(id);
    }
    async updateProduct(id, product) {
        return productDao.updateProduct(id, product);
    }
    async deleteById(id) {
        return productDao.deleteById(id);
    }
    async addProduct(product) {
        return productDao.addProduct(product);
    }
}

module.exports = ProductRepository;