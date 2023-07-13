const { Router } = require('express');
const userRouter = Router();
const passport = require("passport");
const upload = require('../config/multer');
const {
    getAllUsers,
    loginUserForm,
    loginUser,
    formRegisterUser,
    createUser,
    logoutUser,
    formResetPassword,
    formForgotPassword,
    forgotPassword,
    resetPassword,
    updateRolUser,
    deleteUser,
    uploadDocuments,
    renderUploadForm
} = require("../controllers/user.js");
const isUserOrPremium = require('../middlewares/isUserOrPremium.js');
const IsAdmin = require('../middlewares/isAdmin');
const isLogged = require('../middlewares/isLogged');
userRouter.get("/getAll",IsAdmin, getAllUsers)
userRouter.get("/login", loginUserForm);
userRouter.post("/login", loginUser);
userRouter.get("/register", formRegisterUser);
userRouter.post("/register", createUser);
userRouter.get("/logout", isLogged, logoutUser);
userRouter.get("/forgotPassword", formForgotPassword)
userRouter.post("/forgotPassword", forgotPassword)
userRouter.get("/resetPassword", formResetPassword)
userRouter.post("/resetPassword", resetPassword)
userRouter.post("/:uid/documents", upload.array('document'), isUserOrPremium, uploadDocuments);
userRouter.get("/documents",isLogged, renderUploadForm);
userRouter.post("/premium/:uid", isLogged, updateRolUser)
userRouter.delete("/:uid", IsAdmin, deleteUser)
userRouter.get(
    "/auth/github",
    passport.authenticate("github", { scope: ["user:email"] })
);
userRouter.get(
    "/auth/github/callback",
    passport.authenticate("github", { failureRedirect: "api/login" }),
    async function (req, res) {
        req.session.user = req.user;
        res.redirect("/api/products");
    }
);
module.exports = userRouter;