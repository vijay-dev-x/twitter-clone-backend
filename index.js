import express from "express";
import { config } from "dotenv";
import connectDB from "./config/connectDB.js";
import cookieParser from "cookie-parser";
import router from "./Routes/UserRoute.js";
import tweet from "./Routes/TweetRoute.js";
import cors from "cors";

const app = express();
config({
  path: ".env",
});
// middlewares---
app.use(
  cors({
    origin: "https://twitter-clone-backend-ycez.onrender.com",
  })
);
app.use("/api", router);
app.use("/api", tweet);

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.post("/test", (req, res) => {
  const data = req.body;
  res.send(data);
  console.log(data);
});
const PORT = process.env.PORT || 5000;
// console.log(PORT);
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
connectDB();
