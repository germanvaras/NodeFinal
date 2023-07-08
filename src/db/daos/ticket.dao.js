const Ticket = require("../model/ticket")
class TicketDao {
    async createTicket(ticket) {
        const newTicket = await Ticket.create(ticket);
        return newTicket;
    }
}
module.exports = TicketDao;