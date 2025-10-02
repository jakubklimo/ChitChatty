import http from "http";
import { app } from "./app";
import { config } from "./config";

export const server = () => {
    try {
        const httpServer = http.createServer(app);

        httpServer.listen(config.port, () => {
            console.log(`Server běží na http://localhost:${config.port}`);
        });

        return httpServer;
    } catch (error) {
        console.error("[server] ", error);
        process.exit(1);
    }
};