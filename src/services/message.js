const MessageRepository = require('../db/repositories/message')
const messageRepository = new MessageRepository()
const getMessagesServices = async () => {
  let response = await messageRepository.getAllMessages();
  return response;
};

const addMessageServices = async (message) => {
    let response = await messageRepository.createMessage(message);
    return response;
};
module.exports = { getMessagesServices, addMessageServices }
