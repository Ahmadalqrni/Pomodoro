import express from "express";
import validate from "../middleware/validate.js";
import {
  signupValidation,
  loginValidation,
} from "../Validation/authValidation.js";
import { signup, login, logout } from "../controller/authController.js";
import rateLimit from "express-rate-limit";
import { refreshToken } from "../utils/genratetoken.js";

const routes = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per IP per window
  message: { message: "Too many attempts, try again later" },
});

routes.post("/signup", authLimiter, validate(signupValidation), signup);
routes.post("/login", authLimiter, validate(loginValidation), login);
routes.post("/logout", logout);
routes.post("/refresh-token", refreshToken);

export default routes;
