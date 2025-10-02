import express, { Application } from "express";
import morgan from "morgan";
import compression from "compression";
import cors from "cors";

import helloRoutes from "./routes/hello.routes";

export const app: Application = express();

app.use(compression());
app.use(express.json());
app.use(morgan("dev"));

app.use(cors());

app.use("/api", helloRoutes);