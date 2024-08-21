import { validationResult } from "express-validator";
import User from "../Models/User.js";
import Admin from "../Models/Admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array());
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(req.body.password, salt);

    const doc = new Admin({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      passwordHash,
    });

    const admin = await doc.save();

    const token = jwt.sign(
      {
        _id: admin._id,
      },
      "BW228",
      {
        expiresIn: "30d",
      }
    );

    res.json({
      ...admin,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

export const login = async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin)
      return res.status(404).json({
        message: "Пользователь не найден",
      });

    const isValidPass = await bcrypt.compare(
      req.body.password,
      admin._doc.passwordHash
    );

    if (!isValidPass)
      return res.status(404).json({
        message: "Неверное имя пользователя или пароль",
      });

    const token = jwt.sign(
      {
        _id: admin._id,
      },
      "BW228",
      {
        expiresIn: "30d",
      }
    );
    res.json({
      succes: true,
      isValidPass,
      token,
      ...admin._doc,
    });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
};

export const getMe = async (req, res) => {
  try {
    const { _doc: user } = await Admin.findById(req.userId);
    if (!user) return res.send(404).json({ message: "Not found" });
    res.json({ ...user });
  } catch (error) {
    console.log(error);
    res.send(500).json({ message: "Access denied" });
  }
};
