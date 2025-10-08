import jwt, { SignOptions, JwtPayload, Algorithm } from "jsonwebtoken";
import ms from "ms";
import { config } from "../config";

export interface AccessTokenPayload extends JwtPayload {
    sub: string;
    sid: string;
    email: string;
    name: string;
    iat: number;
}

export const generateAccessToken = (user: { id: number; email: string; name: string}, sessionId: string) => {
    const payload: AccessTokenPayload = {
        sub: user.id.toString(),
        sid: sessionId,
        email: user.email,
        name: user.name,
        iat: Math.floor(Date.now() / 1000)
    };

    const options: SignOptions = {
        expiresIn: config.jwtExpires as ms.StringValue,
        algorithm: config.jwtAlgorithm as Algorithm
    }

    return jwt.sign(payload, config.jwtSecret, options);
};

export const verifyToken = (token: string): AccessTokenPayload => {
    return jwt.verify(token, config.jwtSecret, {
        algorithms: [config.jwtAlgorithm as Algorithm]
    }) as AccessTokenPayload;
}

export const getRefreshTokenExpiry = (): Date => {
    const expiresIn = config.jwtRefreshExpires;
    const durationMs = ms(expiresIn as ms.StringValue);

    if (typeof durationMs !== "number") {
        throw new Error(`Invalid refresh token expiry format: ${expiresIn}`);
    }

    return new Date(Date.now() + durationMs);
}