const UserDAO = require('../daos/user.dao')
const userDAO = new UserDAO()
class UserRepository {
    createUser = async (user, cartId) => {
        const newUser = await userDAO.createUser(user, cartId);
        return newUser;
    };
    getUserByEmail = async (email) => {
        const user = await userDAO.getUserByEmail(email);
        return user;
    }
    getUserByUsername = async (username) => {
        const user = await userDAO.getUserByUsername(username);
        return user;
    }
    getUserById = async(id) => {
        const user = await userDAO.getUserById(id);
        return user;
    }
    findUser = async (user) => {
        const userInDB = await userDAO.findUser(user);
        return userInDB;
    };
    async updatePassword(userId, newPassword) {
        try {
            const updatedUser = await userDAO.updatePassword(userId, newPassword);
            return updatedUser;
        } catch (error) {
            return { error: error.message };
        }
    }
    async updateRol(userId, newRol){
        try{
            const updatedUser = await userDAO.updateRol(userId, newRol);
            return updatedUser;
        }
        catch(error){
            return{error: error.message}
        }
    }
    async deleteUser(uid){
        try{
            const deleteUser = await userDAO.deleteUser(uid)
            return deleteUser
        }catch{
            return{error: error.message}
        }
    }
    async updateLastConnection (uid, date) {
        try{
            const updatedUserConection = await userDAO.updateLastConnection(uid, date)
            return updatedUserConection
        }catch(error){
            return{error: error.message}
        }   
    };
    async updateDocumentsStatus (uid, documentStatus) {
        try {
            const updatedUser = await userDAO.updateDocumentsStatus(uid, documentStatus);
            return updatedUser;
        } catch (error) {
            return { error: error.message };
        }
    };
}


module.exports = UserRepository