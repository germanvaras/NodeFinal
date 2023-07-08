const ChatDAO = require('../daos/message.dao')
const chatDAO = new ChatDAO()
class MessageRespository {
    getAllMessages = async () => {
        let response = await chatDAO.getAllMessages();
        return response;
    };
    createMessage = async (message) => {
        let response = await chatDAO.createMessage(message);
        return response;
    };
}
module.exports = MessageRespository
