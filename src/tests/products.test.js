const { expect, requester, assert } = require('../config/testConfig');
const { logger } = require('../middlewares/logger');
const testProducts = () =>   {
    before(async () => {
        const adminUser = {
            email: process.env.adminUser,
            password: process.env.adminPassword
        }
        const { _body } = await requester.post('/api/user/login').send(adminUser);
        expect(200)
        expect(_body.status).to.equal("success")
    });
    describe('Test de Productos', () => {
        let createdProductId
        it('Endpoint Post /api/products/form para crear un nuevo producto', async () => {
            let mockProduct = {
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
            const res = await requester
                .post('/api/products/form')
                .send(mockProduct)
                .expect(201);
            assert.isObject(res.body.data, 'data is not an object');
            expect(res.body.data).to.have.property('_id');
            expect(res.body.data.title).to.equal(mockProduct.title);  
            createdProductId = res.body.data._id;
            logger.info(res.body.payload)
        });
        it('Endpoint Put api/products/form/:pid para modificar un producto', async() => {
            let mockUpdateProduct = {
                title: "Producto de prueba modificado",
                description: "DescripciProducto modificado",
                code: "12345",
                price: 100,
                status: true,
                stock: 10,
                category: "Categoria de prueba",
                thumbnail: "thumbnail.jpg",
                owner: "test@test.com"
            };  
            const res = await requester
                .put(`/api/products/form/${createdProductId}`)
                .send(mockUpdateProduct)
                .expect(200);  
            assert.isObject(res.body.data, 'data is not an object');  
            expect(res.body.data.title).to.equal(mockUpdateProduct.title); 
            logger.info(res.body.payload) 
        })
        it('Endpoint Delete api/products/form/:pid para modificar un producto', async() => {
            const res = await requester
                .delete(`/api/products/form/${createdProductId}`)
                .expect(200);
            expect(res.body.payload).to.equal(`Producto: ${res.body.data.title} eliminado`);
            logger.info(res.body.payload);
        })
    })
}
module.exports = testProducts