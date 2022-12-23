import express from "express";
import cors from "cors";
import multer from "multer";
import mongoose from "mongoose";
import { registValidator } from "./validations/auth.js";
import checkAuth from "./itils/checkAuth.js";
import * as UserController from "./Controllers/UserController.js";
import * as EmailController from "./Controllers/EmailController.js";

mongoose
  .connect(
    "mongodb+srv://KLL00-1:Veritas1)@cluster0.4rv9v1z.mongodb.net/block?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("DB ok!");
  })
  .catch((err) => {
    console.log(err);
  });
mongoose.set("strictQuery", false);

// const PORT = 5000;

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use("/uploads", express.static("uploads"));

app.use(express.json());
app.use(cors());

app.post("/", (req, res) => {
  //   console.log(req.query);
  console.log(req.body);
  res.status(200).json("сервер работает!!!");
});

app.post("/upload", upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.post("/auth/login", UserController.loginMe);

app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/auth/register", registValidator, UserController.registerUser);

app.post("/email", EmailController.createEmail);

app.get("/email", EmailController.getEmails);

app.listen(process.env.PORT || 5000, () =>
  console.log("server start on PORT: " + PORT)
);
