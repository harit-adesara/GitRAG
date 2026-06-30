import express from "express";
import cookieParser from "cookie-parser";
import { router } from "./routes/routes.js";
import cors from "cors";
const app = express();

app.use(
  cors({
    origin: "https://git-rag-omega.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUt", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(cookieParser());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use("/gitrag", router);

export { app };
