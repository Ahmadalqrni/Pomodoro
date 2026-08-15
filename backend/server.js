import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

//import routes
import authRoute from "./src/route/authRoute.js";
import pointRoute from "./src/route/pointRoute.js";

const app = express();
const PORT = 5001;

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

//routes
app.use("/auth", authRoute);
app.use("/point", pointRoute);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("CLIENT_URL:", process.env.CLIENT_URL);
app.listen(PORT, () => {
  console.log(`sever running on ${PORT}`);
});
