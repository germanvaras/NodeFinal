const User = require("../model/user")
const UserDTO = require("../DTOs/user");
const { NotFoundUserError } = require("../../middlewares/errorHandler");
const createUserDtoFromObject = (obj) => {
    if (!obj) {
        return null
    }
    else {
        const { _id, name, lastname, username, email, password, rol, cartId, documents, last_connection } = obj;
        let userDto = new UserDTO(_id, name, lastname, username, email, password, rol, cartId, documents, last_connection);
        return userDto
    }
}
class UserDAO {
    async getAllUsers() {
        const users = await User.find({
            email: { $ne: process.env.userTest},
            rol: { $ne: 'admin' }
        }).lean();
    
        return users.map(user => {
            const { _id, username, email, rol, last_connection } = user;
            return new UserDTO(_id, undefined, undefined, username, email, undefined, rol, undefined, undefined, last_connection);
        });
    }
    async getUserByEmail(email) {
        const user = await User
            .findOne({ email: email })
            .lean();
        return createUserDtoFromObject(user);
    }
    async getUserByUsername(username) {
        const user = await User
            .findOne({ username: username })
            .lean();
        return createUserDtoFromObject(user);
    }
    async getUserById(id) {
        const user = await User
            .findOne({ _id: id })
            .lean()
        return createUserDtoFromObject(user);
    }
    async findUser(user) {
        let existUser = await User.findOne({ $or: [{ username: user.username }, { email: user.email },] })
            .lean();
        return createUserDtoFromObject(existUser);
    }
    async updatePassword(userId, newPassword) {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { password: newPassword },
                { new: true }
            );
            if (!updatedUser) {
                throw new NotFoundUserError('Usuario Inexistente');
            }
            return updatedUser;
        } catch (error) {
            return { error: error.message };
        }
    }
    async updateRol(userId, newRol) {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { rol: newRol },
                { new: true }
            );
            return updatedUser;
        } catch (error) {
            return { error: error.message };
        }
    }
    async createUser(user, cid) {
        const newUser = await User.create({
            ...user,
            cartId: cid
        });
        return createUserDtoFromObject(newUser);
    }
    async deleteUser(uid) {
        const deleteUser = await User.deleteOne({ _id: uid })
        return createUserDtoFromObject(deleteUser)
    }
    async updateLastConnection(uid, date) {
        const user = await User.findByIdAndUpdate(
            uid,
            { last_connection: date },
            { new: true }
        );
        return createUserDtoFromObject(user);
    };
    async updateDocumentsStatus(uid, documentStatus) {
        try {
            const user = await User.findOne({ _id: uid });
            if (user) {
                const duplicateDocuments = [];
                const documentsToAdd = documentStatus.map((doc) => ({
                    name: doc.name,
                    reference: doc.reference,
                }));

                documentsToAdd.forEach(newDoc => {
                    const alreadyExists = user.documents.some(
                        existingDoc => existingDoc.name === newDoc.name
                    );

                    if (!alreadyExists) {
                        user.documents.push(newDoc);
                    }
                    else {
                        duplicateDocuments.push(newDoc.name);
                    }
                });
                await user.save();
                return { user: createUserDtoFromObject(user), duplicateDocuments };
            } else {
                throw new NotFoundUserError('Usuario Inexistente');
            }
        } catch (error) {
            return { error: error.message };
        }
    }
}

module.exports = UserDAO; 