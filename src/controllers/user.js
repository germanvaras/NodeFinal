const {
    getAllUserService,
    createUserService,
    loginUserService,
    updatePasswordService,
    existUserService,
    updateRolService,
    getUserById,
    deleteUserService,
    updatedUserConectionService,
    updateDocumentsStatusService,
    generateDocumentURL,
    passwordValidator
} = require("../services/user");
const {
    findTokenByUserIdService,
    updateTokenService,
    deleteTokenByIdService,
    createTokenService,
} = require("../services/tokenReset")
const {
    isValidPassword,
    isValidToken,
    createHash
} = require("../utils/hashPassword");
const {
    generateNumericToken
} = require("../utils/generateToken");
const { sendEmailResetPassword } = require("../config/nodemailer");
const path = require('path');
const { NotFoundUserError, CredentialError } = require("../middlewares/errorHandler");

const loginUserForm = (req, res) => {
    res.render("login", { title: "Login", style: "index.css" });
};
const getAllUsers = async (req, res, next) => {
    try {
        const user = await getUserById(req.session?.user?._id);
        const users = await getAllUserService(req.session.user)
        res.render("adminControlUsers", { status: "success", users: users, style: "index.css", user: user })
    } catch (error) {
        next(error)
    }
}
const loginUser = async (req, res, next) => {
    try {
        const user = await existUserService(req.body)
        const validPassword = isValidPassword(user, req.body.password);
        if (validPassword) {
            req.session.user = user;
            res.send({ status: "success", payload: "Login success", cartId: user.cartId, data: user });
        } else {
            throw new CredentialError("Contraseña Incorrecta");
        }
    } catch (error) {
        next(error)
    }
};
const formForgotPassword = async (req, res) => {
    res.render("forgotPassword", { title: "Forgot Password", style: "index.css" })
}
const forgotPassword = async (req, res, next) => {
    try {
        const user = await existUserService(req.body)
        const token = generateNumericToken()
        const expirationDate = new Date(Date.now() + 60 * 60 * 1000);
        const resetUrl = `${req.protocol}://${req.get('host')}/api/user/resetPassword`
        const tokenReset = await findTokenByUserIdService(user._id);
        if (tokenReset.error) {
            createTokenService(token, user._id, expirationDate);
        } else {
            tokenReset.token = createHash(token);
            tokenReset.expirationDate = expirationDate;
            await updateTokenService(tokenReset);
        }
        sendEmailResetPassword(token, user, resetUrl)
        res.status(201).send({ status: "success", payload: `El token de recuperacion ha sido enviado al email: ${user.email}` })
    } catch (error) {
        next(error)
    }
}
const formResetPassword = async (req, res) => {
    res.render("resetPassword", { title: "Reset Password", style: "index.css" })
}
const resetPassword = async (req, res, next) => {
    try {
        const user = await existUserService(req.body);
        const password = req.body.password;
        const newPassword = req.body.repeatPassword;
        const tokenReset = await findTokenByUserIdService(user._id);
        const validToken = tokenReset.error ? null : isValidToken(tokenReset, req.body.token);
        if (!validToken) {
            return res.status(403).send({ status: "error", payload: "Token Invalido" });
        }
        if (!passwordValidator(newPassword)) {
            return res.status(400).send({
                status: "error",
                payload: "La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y tener al menos 8 caracteres."
            });
        }
        const validPassword = isValidPassword(user, password);
        if (validPassword) {
            return res.status(422).send({ status: "error", payload: "La contraseña no puede ser igual a la anterior" });
        }
        if (password !== newPassword) {
            return res.status(422).send({ status: "error", payload: "Las contraseñas no coinciden" });
        }
        await updatePasswordService(user._id, createHash(password));
        deleteTokenByIdService(tokenReset._id);
        res.status(200).send({ status: "success", payload: "Contraseña actualizada correctamente" });
    } catch (error) {
        next(error);
    }
};

const formRegisterUser = (req, res) => {
    res.render("register", { title: "Register", style: "index.css" });
};
const createUser = async (req, res) => {
    try {
        let existEmailOrUser = await loginUserService(req.body)
        if (existEmailOrUser && existEmailOrUser.username === req.body.username) {
            return res.status(403).send({ status: "error", payload: "Usuario Ocupado" });
        }
        if (existEmailOrUser) {
            return res.status(403).send({ status: "error", payload: "Email Ocupado" });
        }
        const { password } = req.body;
        if (!passwordValidator(password)) {
            return res.status(400).send({
                status: "error",
                payload: "La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y tener al menos 8 caracteres."
            });
        }
        const newUser = await createUserService(req.body);
        req.logger.info(newUser.username)
        return res.status(201).send({ status: "success", payload: "Usuario creado correctamente", data: newUser });
    } catch (error) {
        return res.status(500).send({ status: "error", payload: error.message });
    }
};
const uploadDocuments = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const user = await getUserById(uid);
        const files = req.files;
        if (files && files.length > 0) {
            const documentStatus = files.map(file => ({
                name: path.parse(file.originalname).name,
                reference: generateDocumentURL(file, user.username),
            }));
            const updatedUser = await updateDocumentsStatusService(uid, documentStatus);
            res.send({ status: "success", payload: `Documentos cargados correctamente`, data: updatedUser });
        } else {
            res.status(400).send({
                status: "error",
                payload: "No se proporcionaron archivos",
            });
        }
    } catch (error) {
        next(error);
    }
};
const renderUploadForm = async (req, res) => {
    const user = await getUserById(req.session?.user?._id);
    res.render('upload', { user, style: "index.css" });
};
const updateRolUser = async (req, res, next) => {
    try {
        const user = await updateRolService(req.params.uid);
        res.send({
            status: "success",
            payload: `${user.username} ha cambiado tu rol a ${user.rol}`,
            data: user.rol,
        });
    } catch (error) {
        next(error);
    }
};
const logoutUser = (req, res, next) => {
    try {
        let userId = req.session.user._id;
        req.session.destroy(async (err) => {
            if (!err) {
                await updatedUserConectionService(userId)
                res.redirect("/api/user/login");
            } else res.send({ status: "Logout Error", body: err });
        });
    }
    catch (error) {
        next(error)
    }
};
const deleteUser = async (req, res, next) => {
    try {
        const deleteResult = await deleteUserService(req.params.uid)
        if (deleteResult.status == "error") {
            throw new NotFoundUserError(deleteResult.payload)
        }
        res.send({ status: "success", payload: `${deleteResult.username} ha sido eliminado`, data: deleteResult })
    } catch (error) {
        next(error)
    }
}
module.exports = {
    loginUserForm,
    loginUser,
    formRegisterUser,
    createUser,
    logoutUser,
    formForgotPassword,
    formResetPassword,
    forgotPassword,
    resetPassword,
    updateRolUser,
    deleteUser,
    uploadDocuments,
    renderUploadForm,
    getAllUsers
};
