import express from "express";
import { addpoint } from "../controller/pointController.js";
import protect from "../middleware/protect.js";

const routes = express.Router();

routes.post("/visit", protect, addpoint);

export default routes;
