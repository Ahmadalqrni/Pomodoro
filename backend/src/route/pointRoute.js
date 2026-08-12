import express from "express";
import { addpoint } from "../controller/pointController.js";

const routes = express.Router();

routes.post("/pointcontroller", addpoint);

export default routes;
