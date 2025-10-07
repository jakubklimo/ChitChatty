import express from "express";
import morgan from "morgan";
import compression from "compression";
import cors from "cors";
import { setupSwagger } from "./config";

import { routes } from "./routes";
import { errorHandler } from "./middleware";

const app = express();

app.use(compression());
app.use(express.json());
app.use(morgan("dev"));

app.use(cors());

routes.forEach(({ path, router }) => app.use(path, router));

setupSwagger(app);

app.use(errorHandler)

export default app;