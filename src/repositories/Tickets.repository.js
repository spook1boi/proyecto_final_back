export default class TicketRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getTickets = async () => {
        try {
            let result = await this.dao.get();
            return result;
        } catch (error) {
            logger.error('Error in getTickets:', { error });
            throw error;
        }
    }

    createTicket = async (ticket) => {
        try {
            let result = await this.dao.create(ticket);
            return result;
        } catch (error) {
            logger.error('Error in createTicket:', { error });
            throw error;
        }
    }
}