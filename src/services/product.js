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
    const validations = [
        { condition: product.title.length > 20, error: "El título puede tener máximo 20 caracteres" },
        { condition: product.description.length > 40, error: "La descripción puede tener máximo 40 caracteres" },
        { condition: product.category.length > 10, error: "La categoría puede tener un máximo de 10 caracteres" },
        { condition: product.code.length > 8, error: "El código puede tener máximo 8 caracteres" },
        { condition: product.price < 100, error: "El precio no puede ser menor a $100" },
        { condition: product.price > 100000, error: "El precio no puede ser mayor a $100.000" },
        { condition: product.stock <= 0, error: "El stock no puede ser igual o menor a 0" },
        { condition: product.stock > 10000, error: "El stock no puede ser mayor a 10.000" },
    ];

    validations.forEach(validation => {
        if (validation.condition) {
            throw new ValidationError(validation.error);  
        }
    });

    const addedProduct = await productRepository.addProduct(product);
    return addedProduct;
};

const validateProductFields = (product) => {
    const requiredFields = ['title', 'description', 'category', 'code', 'price', 'stock', 'thumbnail'];
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
