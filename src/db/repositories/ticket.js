const TicketDao = require('../daos/ticket.dao')
const ticketDao = new TicketDao()
class TicketRepository {
    createTicket = (ticket) =>{
        return ticketDao.createTicket(ticket)
    } 
}
module.exports = TicketRepository