import pino from "pino";
import { config } from "../config";

const transport = config.isDev ? pino.transport({ target: "pino-pretty", options: { colorize: true }, }) : undefined;

export const logger = pino(
    {
        level: config.isDev ? "debug" : "info",
    },
    transport
);