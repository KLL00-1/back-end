import { body } from "express-validator";

export const registValidator = [
  body("email").isEmail(),
  body("password", "пароль должен быть минимум 5 символов").isLength({
    min: 5,
  }),
  body("fullName").isLength({ min: 3 }),
  body("avatarUrl").optional().isURL(),
];
