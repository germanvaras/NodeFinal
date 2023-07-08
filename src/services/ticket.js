const TicketRepository = require('../db/repositories/ticket')
const ticketRepository = new TicketRepository()
const serviceCreateTicket = async (ticket) =>{
    return await ticketRepository.createTicket(ticket)
}
module.exports =  {serviceCreateTicket}
