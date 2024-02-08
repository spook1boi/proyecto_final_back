import mongoose from "mongoose";

const usersCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  age: Number,
  password: String,
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Carts'
  },
  rol: {
    type: String,
    default: 'user'
  },
  documents: [
    {
      name: String,
      reference: String
    }
  ],
  last_connection: Date
});

const usersModel = mongoose.model(usersCollection, userSchema)

export default usersModel