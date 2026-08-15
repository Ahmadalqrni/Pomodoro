import express from "express";
import protect from "../middleware/protect.js";

import { addpoint, showpoint } from "../controller/pointController.js";

const routes = express.Router();

routes.post("/visit", protect, addpoint);
routes.get("/show", protect, showpoint);

export default routes;
