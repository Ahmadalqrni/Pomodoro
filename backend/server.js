import express from "express";
import cookieParser from "cookie-parser";

//import routes
import authRoute from "./src/route/authRoute.js";
import pointRoute from "./src/route/pointRoute.js";

const app = express();
const PORT = 5001;

app.use(cookieParser());
app.use(express.json());
//routes
app.use("/auth", authRoute);
app.use("/point", pointRoute);

app.listen(PORT, () => {
  console.log(`sever running on ${PORT}`);
});
