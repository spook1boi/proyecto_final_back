import mongoose from "mongoose"

const ticketsCollection = "ticket";

const ticketSchema = new mongoose.Schema({
    code: String,
    purchase_datetime: Date,
    amount: Number,
    purchaser: String,
});

export const ticketsModel = mongoose.model(ticketsCollection, ticketSchema)