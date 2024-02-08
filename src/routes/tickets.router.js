import { Router } from "express";
import TicketDTO from "../dao/DTOs/ticket.dto.js";
import ticketRepository from "../repositories/Tickets.repository.js";
import TicketsDAO from "../dao/mongo/tickets.mongo.js";

const ticketRouter = Router();

const ticketsDAO = new TicketsDAO();

ticketRouter.get("/", async (req, res) => {
    try {
        req.logger.info('Loading tickets');
        let result = await ticketsDAO.get();
        res.status(200).send({ status: "success", payload: result });
    } catch (error) {
        req.logger.error('Error loading tickets');
        res.status(500).send({ status: "error", message: "Internal Server Error" });
    }
});

ticketRouter.post("/", async (req, res) => {
    try {
        let { amount, purchaser } = req.body;
        let ticket = new TicketDTO({ amount, purchaser });
        let result = await ticketRepository.createTicket(ticket);
        if (result) {
            req.logger.info('Ticket created successfully');
            res.status(200).send({ status: "success", payload: result });
        } else {
            req.logger.error("Error creating ticket");
            res.status(500).send({ status: "error", message: "Error creating ticket" });
        }
    } catch (error) {
        req.logger.error("Internal Server Error:", error);
        res.status(500).send({ status: "error", message: "Internal Server Error" });
    }
});

export default ticketRouter;