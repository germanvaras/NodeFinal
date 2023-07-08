const { getUserByEmail } = require("../services/user");
const isPremium = async (req, res, next) => {
    const user = await getUserByEmail(req.session?.user?.email);
    if (user?.rol === "premium") {
        next();
    } else {
        res.render("401", { style: "index.css", user});
    }
};
module.exports = isPremium;