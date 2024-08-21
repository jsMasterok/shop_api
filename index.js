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

// Default Settings
const app = express().use(express.json());
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
//END
app.listen("4444", (err) => {
  if (err) return console.error(err);
  console.log("Server OK!");
});
