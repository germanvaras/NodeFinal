const ProductRepository = require('../db/repositories/product');
const { InvalidStockPriceError, ValidationError, NotFoundProductError } = require('../middlewares/errorHandler');
const productRepository = new ProductRepository()
const serviceGetProducts = async (filters) => {
    let getProducts = await productRepository.getProducts(filters)
    return getProducts;
}
const serviceGetProductById = async (id) => {
    let product = await productRepository.getById(id)
    if (product.error) {
        throw new NotFoundProductError(product.error);
    }
    return product;
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
    const requiredFields = ['title', 'description', 'category', 'code', 'price', 'stock','thumbnail' ];
    const fieldTranslations = {
        'title': 'título',
        'description': 'descripción',
        'category': 'categoría',
        'code': 'código',
        'price': 'precio',
        'stock': 'stock',
        'thumbnail': 'imagen',
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
