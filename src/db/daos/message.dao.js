const Message = require('../model/message')
const MessageDTO = require('../DTOs/message')
const mapMessagesToDto = (messages) => {

  const chatDTO = messages.map(chat => {
    return new MessageDTO(chat._id, chat.user, chat.message);
  })
  return chatDTO
}
class MessageDao {
  async getAllMessages() {
    let messages = await Message.find().lean();
    return mapMessagesToDto(messages);
  }
  async createMessage(message) {
    try {
      const newProduct = new Message(message)
      const createdProduct = await newProduct.save()
      return createdProduct
    } catch (err) {
      return { error: err.message }
    }
  }
}
module.exports = MessageDao;