import express from "express";
import protect from "../middleware/protect.js";
//import controller
import { signup, login, logout } from "../controller/authController.js";

const routes = express.Router();

routes.post("/signup", signup);
routes.post("/login", login);
routes.post("/logout", logout);

export default routes;
