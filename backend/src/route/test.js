import express from "express";
import { test } from "../controller/testController";

console.log("we on router");

const routes = express.Router();

routes.post("/test", test);

export default routes;
