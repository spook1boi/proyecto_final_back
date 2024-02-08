import { Router } from "express";
import CartDTO from "../dao/DTOs/cart.dto.js";
import TicketDTO from "../dao/DTOs/ticket.dto.js";
import ticketRepository from "../repositories/Tickets.repository.js";
import cartRepository from "../repositories/Carts.repository.js";
import userRepository from "../repositories/User.repository.js";
import CartsDAO from "../dao/mongo/carts.mongo.js";
import logger from "../loggers.js";

const cartRouter = Router();

const initializeCartRouter = (logger) => {
    const cartsDAO = new CartsDAO();

    cartRouter.get("/", async (req, res) => {
        try {
            logger.info('Obtaining list of carts');
            let result = await cartsDAO.get();
            res.status(200).send({ status: "success", payload: result });
        } catch (error) {
            logger.error('Error obtaining list of carts:', error);
            res.status(500).send({ status: "error", message: "Internal Server Error" });
        }
    });

    cartRouter.post("/", async (req, res) => {
        try {
            let { products } = req.body;
            const userEmail = req.body.email;

            let cart = new CartDTO({ products });
            let result = await cartRepository.createCart(cart);
            
            if (result) {
                logger.info('Cart created successfully');
                res.status(200).send({ status: "success", payload: result });
            } else {
                logger.error("Error creating cart");
                res.status(500).send({ status: "error", message: "Internal Server Error" });
            }
        } catch (error) {
            logger.error("Internal Server Error:", error);
            res.status(500).send({ status: "error", message: "Internal Server Error" });
        }
    });

    cartRouter.post("/:cid/purchase", async (req, res) => {
        try {
            let id_cart = req.params.cid;
            const products = req.body.products;
            const userEmail = req.body.email;

            let cart = await cartRepository.validateCart(id_cart);

            if (!cart) {
                logger.error("Cart with the provided ID was not found");
                return res.status(404).json({ error: "Cart with the provided ID was not found" });
            }

            let hasSufficientStock = await cartRepository.validateStock({ products });

            if (hasSufficientStock) {
                let totalAmount = await cartRepository.getAmount({ products });
                const ticketFormat = new TicketDTO({ amount: totalAmount, purchaser: userEmail });
                const result = await ticketRepository.createTicket(ticketFormat);
                res.status(200).send({ status: "success", payload: result });
            } else {
                logger.error("Not enough stock to complete the purchase");
                res.status(400).send({ status: "error", message: "Not enough stock to complete the purchase" });
            }
        } catch (error) {
            logger.error("Error processing purchase:", error.message);
            return res.status(500).json({ error: "Internal Server Error while processing purchase" });
        }
    });

    return cartRouter;
};

export default initializeCartRouter;