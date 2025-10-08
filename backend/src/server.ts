import http from "http";
import app from "./app";
import { config } from "./config";
import { logger } from "./utils";
import { prisma } from "./prisma";

export const server = () => {
    try {
        const httpServer = http.createServer(app);

        httpServer.listen(config.port, () => {
            logger.info({ port: config.port, env: config.nodeEnv }, 'Server running')
        });

        const shutdown = async () => {
            logger.info("Shutting down server...");
            httpServer.close(async () => {
                await prisma.$disconnect();
                logger.info("Server closed");
                process.exit(0);
            });
        };

        process.on("SIGINT", shutdown);
        process.on("SIGTERM", shutdown);

        return httpServer;
    } catch (error) {
        console.error("[server] ", error);
        process.exit(1);
    }
};