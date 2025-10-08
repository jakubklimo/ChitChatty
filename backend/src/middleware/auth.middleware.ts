import { Request, Response, NextFunction } from "express"
import { AuthenticationError, logger, verifyToken } from "../utils";

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    try{
        const token = req.cookies?.accessToken;

        if (!token) {
            throw new AuthenticationError("No access token provided");
        }

        const decoded = verifyToken(token);

        (req as any).user = {
            id: decoded.sub,
            email: decoded.email,
            name: decoded.name,
            sessionId: decoded.sid,
        }

        logger.debug({ userId: decoded.sub }, "User authenticated");
        
        next();
    } catch (error) {
        logger.warn({ error }, "Invalid or expired access token");
        next(error);
    }
}