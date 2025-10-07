import http from "http";
import app from "./app";
import { config } from "./config";
import { logger } from "./utils";

export const server = () => {
    try {
        const httpServer = http.createServer(app);

        httpServer.listen(config.port, () => {
            logger.info({ port: config.port, env: config.nodeEnv }, 'Server running')
        });

        return httpServer;
    } catch (error) {
        console.error("[server] ", error);
        process.exit(1);
    }
};