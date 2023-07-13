const { getUserByEmail } = require("../services/user");
const isUserOrPremium = async (req, res, next) => {
    const user = await getUserByEmail(req.session?.user?.email);
    if (user?.rol === "user" || user?.rol === "premium") {
        next();
    } else {
        res.status(401).send({
            status: "error",
            payload: "No posee la autorización para realizar esta acción",
        });
    }
};
module.exports = isUserOrPremium;