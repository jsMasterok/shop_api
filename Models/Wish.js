import mongoose from "mongoose";

const WishSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      required: true,
      default: [],
    },
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    total_count: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      required: true,
    },
    compound: {
      type: String,
      required: true,
    },
    result: {
      type: String,
      required: true,
    },
    views_count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    _id: true,
  }
);

export default mongoose.model("Wish", WishSchema);
