const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  user: {
    type: String,
    required:  [true, "El campo user es requerido"],
  },
  message: {
    type: String,
    required:[true, "El campo message es requerido"],
  },
});

const Message = mongoose.model('messages', messageSchema);
module.exports =  Message;