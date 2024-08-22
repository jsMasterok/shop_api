import express from "express";
import mongoose from "mongoose";
import { registerValidation } from "./Validations/Auth.js";
import CheckAuth from "./utils/CheckAuth.js";
import { getMe, register, login } from "./Controllers/UserController.js";
import {
  create,
  deleteWish,
  getAll,
  getOne,
  updateWish,
} from "./Controllers/WishController.js";
import { wishCreateValidation } from "./Validations/wish.js";
import jwt from "jsonwebtoken";
import Cart from "./Models/Cart.js";
import multer from "multer";
import cors from "cors";

const secretKey = "BW228";

// Default Settings
const app = express().use(express.json()).use(cors());
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "Uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// IMG get
app.use("/uploads", express.static("Uploads"));
//

mongoose
  .connect("mongodb+srv://Admin:5m32yyoo@bestwishes.kcodd.mongodb.net")
  .then(() => {
    console.log("DB OK!");
  })
  .catch((e) => console.warn(e));
//
app.get("/", (req, res) => {
  res.send("BestWishesAPI :)");
});
// START
// AUTH
app.post("/register", registerValidation, register);
app.post("/login", login);
//
// User CheckToken
app.get("/dashboard/me", CheckAuth, getMe);
//
// Wishes CRUD
app.post("/wishes", wishCreateValidation, create);
app.get("/wishes", getAll);
app.get("/wishes/:id", getOne);
app.delete("/wishes/:id", deleteWish);
app.patch("/wishes/:id", updateWish);
//
// Cart
// Маршрут для добавления товаров в корзину
app.post("/cart", async (req, res) => {
  let token = (req.headers["authorization"] || "").replace(/^Bearer\s+/i, "");
  let cart;

  if (!token) {
    // Генерируем новый токен
    token = jwt.sign({}, secretKey, { expiresIn: "1h" });

    // Создаем новую запись корзины в базе данных
    cart = new Cart({ token, items: [] });
  } else {
    // Проверяем и декодируем токен
    try {
      jwt.verify(token, secretKey);
      cart = await Cart.findOne({ token });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
    } catch (err) {
      return res.status(400).json({ message: "Invalid token" });
    }
  }

  cart.items.push({ ...req.body });

  // Сохраняем корзину в базе данных
  await cart.save();

  res.json({ success: true, cart: cart.items, token });
});

// Маршрут для получения товаров из корзины
app.get("/cart", async (req, res) => {
  const token = (req.headers["authorization"] || "").replace(/^Bearer\s+/i, "");

  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }

  try {
    jwt.verify(token, secretKey);
    const cart = await Cart.findOne({ token });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.json(cart.items);
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
});
// Delete cart with token
app.delete("/cart", async (req, res) => {
  const token = (req.headers["authorization"] || "").replace(/^Bearer\s+/i, "");
  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }
  await Cart.findOneAndDelete({ token });
  res.json({
    message: "Delete success",
  });
});
//
// Delete cart item
app.delete("/cart/:id", async (req, res) => {
  const token = (req.headers["authorization"] || "").replace(/^Bearer\s+/i, "");
  if (!token) {
    return res.status(400).json({ message: "No token provided" });
  }
  try {
    const cartID = req.params.id;
    const cart = await Cart.findOne({ token });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const itemIndex = cart.items.findIndex((item) => item._id.equals(cartID));

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Удалите элемент
    cart.items.splice(itemIndex, 1);

    // Сохраните изменения
    await cart.save();

    return res.json({ message: "Item deleted successfully", cart });
  } catch (error) {
    console.log(error);
    res.json({ message: "Failed" });
  }
});
//
// IMG upload
app.post("/upload", upload.single("img"), async (req, res) => {
  res.json({
    url: `/Uploads/${req.file.originalname}`,
  });
});
//

//END
app.listen("4444", (err) => {
  if (err) return console.error(err);
  console.log("Server OK!");
});
