import mongoose from "mongoose"

const productsCollection = "products";

const productsSchema = new mongoose.Schema({
    title: { type: String, max: 100},
    image: { type: String, max: 100},
    price: { type: Number},
    stock: { type: Number},
    category: { type: String, max: 50 },
    owner: { type: String, max: 70}
})

const productsModel = mongoose.model(productsCollection, productsSchema)

export default productsModel;