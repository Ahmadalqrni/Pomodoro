import express from "express";
import validate from "../middleware/validate.js";
import {
  signupValidation,
  loginValidation,
} from "../Validation/authValidation.js";
import { signup, login, logout } from "../controller/authController.js";

const routes = express.Router();

routes.post("/signup", validate(signupValidation), signup);
routes.post("/login", validate(loginValidation), login);
routes.post("/logout", logout);

export default routes;
