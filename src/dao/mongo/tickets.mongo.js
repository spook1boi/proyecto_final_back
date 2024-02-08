import ticketsModel from './models/tickets.model.js';
import logger from '../../loggers.js';

export default class Tickets {
    constructor() {}

    async get() {
        try {
            const tickets = await ticketsModel.find();
            return tickets;
        } catch (error) {
            logger.error("Error al obtener los tickets:", error);
            return "Error interno";
        }
    }

    async getTicketById(ticketId) {
        try {
            const ticket = await ticketsModel.findById(ticketId).lean();
            return ticket;
        } catch (error) {
            logger.error("Error al obtener el ticket por ID:", error);
            return "Error interno";
        }
    }

    async addTicket(ticket) {
        try {
            const result = await ticketsModel.create(ticket);
            return result;
        } catch (error) {
            logger.error("Error en la creación del ticket:", error);
            return "Error interno";
        }
    }
}