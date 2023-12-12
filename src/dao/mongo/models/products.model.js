import mongoose from "mongoose"

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
    title: { type: String, max: 100, required: true},
    description: { type: String, max: 100, required: true},
    category: { type: String, max: 100, required: true},
    thumbnails: { type: String, max: 100, required: true},
    price: { type: Number, required: true},
    stock: { type: Number, required: true}
});

export const productsModel = mongoose.model(productsCollection, productsSchema)