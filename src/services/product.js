const ProductRepository = require('../db/repositories/product');
const { InvalidStockPriceError, ValidationError } = require('../middlewares/errorHandler');
const productRepository = new ProductRepository()
const serviceGetProducts = async (filters) => {
    let getProducts = await productRepository.getProducts(filters)
    return getProducts;
}
const serviceGetProductById = async (id) => {
    let getById = await productRepository.getById(id)
    return getById;
}
const serviceAddProduct = async (product) => {
    validateProductFields(product);
    if (product.stock <= 0 || product.price <= 0) {
        throw new InvalidStockPriceError("Ni stock ni precio no pueden ser igual o menor a 0");
    }
    const addedProduct = await productRepository.addProduct(product);
    return addedProduct;
};

const validateProductFields = (product) => {
    const requiredFields = ['title', 'description', 'category', 'code', 'thumbnail', 'stock', 'price'];
    const fieldTranslations = {
        'title': 'título',
        'description': 'descripción',
        'category': 'categoría',
        'code': 'código',
        'thumbnail': 'url imagen',
        'stock': 'stock',
        'price': 'precio',
    };
    const missingFields = requiredFields.filter((field) => !product[field]);
    if (missingFields.length > 0) {
        const missingFieldsInSpanish = missingFields.map(field => fieldTranslations[field]);
        throw new ValidationError(`Los siguientes campos son requeridos: ${missingFieldsInSpanish.join(', ')}`);
    }
};
const serviceUpdateProduct = async (id, product) => {
    let serviceAddProduct = await productRepository.updateProduct(id, product)
    return serviceAddProduct;
}
const serviceDeleteById = async (id) => {
    let deleteById = await productRepository.deleteById(id)
    return deleteById;
}
module.exports = { serviceAddProduct, serviceGetProducts, serviceGetProductById, serviceUpdateProduct, serviceDeleteById }
