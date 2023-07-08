const { expect, requester } = require('../config/testConfig');
const { logger } = require('../middlewares/logger');
const sessionTest = () => {
    it('Endpoint Post /api/user/register para crear un nuevo usuario', async () => {
        let mockUser = {
            name: "Usuario de prueba",
            lastname: "Apellido de prueba",
            username: "Test",
            email: "user@test.com",
            password: "test123"
        };
        const res = await requester
            .post('/api/user/register')
            .send(mockUser)
            .expect(201);

        expect(res.body.status).to.equal("success");
        expect(res.body.data.email).to.equal(mockUser.email);
        userId = res.body.data._id;
        logger.info(res.body.payload)
    });
    it('Endpoint Post /api/user/login para loguear al usuario', async () => {
        let loginUser = {
            email: "user@test.com",
            password: "test123"
        };
        const res = await requester
            .post('/api/user/login')
            .send(loginUser)
            .expect(200);

        expect(res.body.status).to.equal("success");
        expect(res.body.data.email).to.equal(loginUser.email);
        logger.info(res.body.payload)
    });
    it('Endpoint Post /api/user/premium/:uid para actualizar el rol del usuario', async () => {
        const res = await requester
            .post(`/api/user/premium/${userId}`)
            .expect(200);
        expect(res.body.status).to.equal("success");
        expect(res.body.data).to.equal("premium");
        logger.info(res.body.payload)
    });
    it('Endpoint Delete api/user/:uid para eliminar un usuario', async () => {
        const res = await requester
            .delete(`/api/user/${userId}`)
            .expect(200);
        expect(res.body.status).to.equal("success");
        expect(res.body.data).to.be.empty
        logger.info(res.body.payload)
    })
    
}
module.exports = sessionTest