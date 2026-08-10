import express from "express";
import test from "./src/route/test.js";

const app = express();

app.use(express.json());

const PORT = 5001;

app.use("/test", test);

app.listen(PORT, () => {
  console.log(`sever running on ${PORT}`);
});
