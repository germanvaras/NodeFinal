const { expect, requester, assert } = require('../config/testConfig');
const { logger } = require('../middlewares/logger');
let productId
let cartId
const testCart = () => {
    before(async () => {
        const adminUser = {
            email: process.env.adminUser,
            password: process.env.adminPassword
        }
        let res = await requester.post('/api/user/login').send(adminUser);
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal("success");
        const mockProduct = {
            title: "Producto de prueba",
            description: "Esta es la descripción del producto de prueba",
            code: "12345",
            price: 100,
            status: true,
            stock: 10,
            category: "Categoria de prueba",
            thumbnail: "thumbnail.jpg",
            owner: "test@test.com"
        };
        res = await requester.post('/api/products/form').send(mockProduct);
        expect(res.status).to.equal(201);
        expect(res.body.status).to.equal("success");
        productId = res.body.data._id;
        
        const userTest = {
            email: process.env.userTest,
            password: process.env.userTestPassword
        }
        res = await requester.post('/api/user/login').send(userTest);
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal("success");
        cartId = res.body.cartId

    });

    describe('Test de Cart', () => {
        it('Endpoint Post /api/cart/:cid/product/:pid para agregar un nuevo producto al carrito', async () => {
            let res = await requester.post(`/api/cart/${cartId}/product/${productId}`);
            expect(200)
            expect(res.body.status).to.equal("success");
            logger.info(res.body.payload)
        })
        it('Endpoint Put /api/cart/:cid/product/:pid para modificar la cantidad producto', async () => {
            let updateQuantityTest = {
                quantity: 3
            }
            let res = await requester.put(`/api/cart/${cartId}/product/${productId}`).send(updateQuantityTest);
            expect(200)
            expect(res.body.status).to.equal("success");
            assert.isArray(res.body.data, 'data is not an array');
            logger.info(res.body.payload)
        })
        it('Endpoint Delete /api/cart/:cid/product/:pid para eliminar un producto del carrito', async () => {
            let res = await requester.delete(`/api/cart/${cartId}/product/${productId}`);
            expect(200)
            expect(res.body.status).to.equal("success");
            assert.isArray(res.body.data, 'data is not an array');
            logger.info(res.body.payload)
        })
    })
    .afterAll(async () => {
        const adminUser = {
            email: process.env.adminUser,
            password: process.env.adminPassword
        }
        await requester.post('/api/user/login').send(adminUser);
        await requester
            .delete(`/api/products/form/${productId}`)
            .expect(200);
    })
}
module.exports = testCart