import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import UserModal from "../models/User.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModal({
      fullName: req.body.fullName,
      email: req.body.email,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "hash",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    // передаем инфо о созданном пользователе без пароля ...userData

    res
      .status(200)
      .json({ message: "Новый пользователь создан!", ...userData, token });
  } catch (err) {
    res.status(500).json({
      message: "не удалось зарегистрироваться",
      err,
    });
  }
};

export const loginMe = async (req, res) => {
  try {
    const user = await UserModal.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "пользователь не найден" });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );
    if (!validPassword) {
      return res.status(400).json({ message: "Неверная почта или пароль" });
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "hash",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res
      .status(200)
      .json({ message: "Авторизация успешна!", ...userData, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Не удалось авторизоваться!" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModal.findById(req.userId);

    if (!user) {
      res.status(404).json({
        message: "пользователь не найден",
      });
    }
    const { passwordHash, ...userData } = user._doc;

    res.status(200).json({ ...userData });
  } catch (err) {}
};
