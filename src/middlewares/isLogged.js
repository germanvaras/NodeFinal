const { getUserByEmail} = require("../services/user");
const isLogged = async (req, res, next) => {
    const user = await getUserByEmail(req.session?.user?.email);
    if(user){
        next()
    }else{
        res.redirect('user/login')
    }
}

module.exports = isLogged