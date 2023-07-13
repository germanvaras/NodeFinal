const { ValidationError } = require("../middlewares/errorHandler");
const { getUserByEmail } = require("../services/user");

const getAllMessages = async (req, res) => {
    let user = await getUserByEmail(req.session.user?.email)
    res.render("chat", {
        title: "Chat",
        style: "index.css",
        user
    });
};
const addMessages = async (req, res, next) => {
    try {
        await require("../socket").addMessages(req.body);
        if (req.body.message === "") {
            throw new ValidationError("Ingrese un mensaje")
        }
        else {
            res.status(201).send({ status: "success", payload: "Message Added" });
        }
    } catch (error) {
        next(error)
    }
};
module.exports = {
    getAllMessages,
    addMessages,
};

