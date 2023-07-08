const UserRepository = require('../db/repositories/user')
const userRepository = new UserRepository()
const { serviceAddCart } = require("./cart")
const createUserService = async (user) => {
    const newCart = await serviceAddCart();
    const newUser = await userRepository.createUser(user, newCart._id
    );
    return newUser;
};
const getUserByEmail = async (email) => {
    const user = await userRepository.getUserByEmail(email);
    return user;
}
const getUserByUsername = async (username) => {
    const user = await userRepository.getUserByEmail(username);
    return user;
}
const getUserById = async (id) => {
    const user = await userRepository.getUserById(id);
    return user;
}
const loginUserService = async (user) => {
    const userInDB = await userRepository.findUser(user);
    return userInDB;
};
const existUserService = async (userBody) => {
    const user = await loginUserService(userBody);
    if (!user) {
        throw new Error("Usuario Inexistente");
    }
    else {
        return user
    }
}
const updatePasswordService = async (userId, newPassword) => {
    const updatedUser = await userRepository.updatePassword(userId, newPassword);
    return updatedUser
}
const updateRolService = async (uid) => {
    const user = await getUserById(uid);
    const userRol = user.rol;
    if (userRol === "premium") {
        const updatedUser = await userRepository.updateRol(user._id, "user");
        return updatedUser;
    } else if (userRol === "user") {
        const requiredDocuments = [
            { name: "Identificacion", field: "identification" },
            { name: "Domicilio", field: "addressProof" },
            { name: "Estado", field: "accountStatement" },
        ];
        const missingDocuments = requiredDocuments.filter((document) =>
            !user.documents.some((doc) => doc.name.toUpperCase() === document.name.toUpperCase())
        );
        if (missingDocuments.length === 0) {
            const updatedUser = await userRepository.updateRol(user._id, "premium");
            return updatedUser;
        } else {
            const missingDocumentNames = missingDocuments.map((doc) => doc.name);
            let missingDocumentsError;
            if (missingDocumentNames.length === 1) {
                missingDocumentsError = new Error(`Falta el siguiente documento: ${missingDocumentNames[0]}`);
            } else {
                missingDocumentsError = new Error(`Faltan los siguientes documentos: ${missingDocumentNames.join(', ')}`);
            }
            missingDocumentsError.documents = missingDocumentNames;
            throw missingDocumentsError;
        }
    }
}
const deleteUserService = async (uid) => {
    const deleteUser = await userRepository.deleteUser(uid)
    return deleteUser
}
const updatedUserConectionService = async (uid) => {
    const now = new Date()
    const updateConection = await userRepository.updateLastConnection(uid, now)
    return updateConection
}
const updateDocumentsStatusService = async (uid, documentStatus) => {
    const validDocumentNames = ["IDENTIFICACION", "DOMICILIO", "ESTADO"];
    const invalidDocuments = documentStatus.filter(doc => !validDocumentNames.includes(doc.name.toUpperCase()));
    if (invalidDocuments.length > 0) {
        const errorDocumentText = invalidDocuments.length > 1 ? "Nombres de documentos no válidos" : "Nombre de documento no válido";
        throw new Error(`${errorDocumentText}: ${invalidDocuments.map(doc => doc.name).join(', ')}`);
    }
    const result = await userRepository.updateDocumentsStatus(uid, documentStatus);
    if(result.duplicateDocuments.length > 0) {
        const errorDocumentText = result.duplicateDocuments.length > 1 ? "Documentos existentes" : "Documento existente";
        throw new Error(`${errorDocumentText}: ${result.duplicateDocuments.join(', ')}`);
    } 
    return result.user;
};


const generateDocumentURL = (file, userName) => {
    const baseUrl = `${userName}/`;
    const fileName = file.filename;
    const documentURL = baseUrl + fileName;
    return documentURL;
};
module.exports = {
    createUserService, loginUserService, getUserByEmail, getUserByUsername,
    updatePasswordService, existUserService, updateRolService, getUserById,
    deleteUserService, updatedUserConectionService, updateDocumentsStatusService,
    generateDocumentURL
}