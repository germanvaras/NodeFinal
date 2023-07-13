const { getUserByEmail } = require("../services/user");
const IsAdmin = async (req, res, next) => {
    const user = await getUserByEmail(req.session?.user?.email);
    if (user?.rol === "admin") {
        next();
    } else {
        res.render("401", { style: "index.css", user});
    }
};
module.exports = IsAdmin;