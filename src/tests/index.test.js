const testProducts = require('./products.test')
const cartTest = require('./carts.test');
const sessionTest = require('./sessions.test');
describe('Testing Tienda Sublime', () => {
    describe('Test de Productos', () => {
        testProducts();
    });
    describe('Test de Cart', () => {
        cartTest();
    });
    describe('Test de Session', () => {
        sessionTest();
    });  
})