const mongoose = require('mongoose');
const ticketSchema = mongoose.Schema({
    code:{type: String},
    purchase_dateTime:{type: Date},
    amount:{type: Number},
    purchaser:{type: String},
})
const Ticket = mongoose.model('ticket', ticketSchema);
module.exports = Ticket