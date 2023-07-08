const { faker } = require("@faker-js/faker");
const testProducts = [];
const generateMockProducts = () => {
    const mock = {
        _id: faker.datatype.uuid(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.random.alphaNumeric(6),
        category: faker.internet.password(),
        price: Number(faker.commerce.price(5000, 10000, 2)),
        stock: Math.round(Math.random() * 10),
        thumbnail: faker.image.abstract(400, 400, true),
    }
    return mock
}
const getMockProducts = () => {
    for(let i = 0; i < 100; i++){
        testProducts.push(generateMockProducts())
    }
    return testProducts
}
module.exports = {getMockProducts}