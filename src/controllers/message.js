const { getUserByEmail } = require("../services/user");

const getAllMessages = async (req, res) => {
    let user = await getUserByEmail(req.session.user?.email)
    res.render("chat", {
        title: "Chat",
        style: "index.css",
        user
    });
};
const addMessages = async (req, res) => {
    try{     
        await require("../socket").addMessages(req.body);
        if(req.body.message === ""){
            res.status(400).send({status:"error", payload:"Ingrese un mensaje"})
        }
        else{
            res.status(201).send({ status: "success", payload: "Message Added"});
        }
    }catch(error){
        res.status(500).send({ status: "error", payload: error.message });
    }
};
module.exports = {
    getAllMessages,
    addMessages,
};

