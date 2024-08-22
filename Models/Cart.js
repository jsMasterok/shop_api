import mongoose from "mongoose";
const cartItemSchema = new mongoose.Schema({
  id: String,
  name: String,
  type: String,
  count: Number,
  image: String,
  total_price: Number,
});

const cartSchema = new mongoose.Schema({
  token: String,
  items: [cartItemSchema],
});

export default mongoose.model("Cart", cartSchema);
