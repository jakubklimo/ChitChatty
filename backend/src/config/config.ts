import dotenv from "dotenv";

dotenv.config();

export const config = {
    port: process.env.PORT || 4000,
    nodeEnv: process.env.NODE_ENV || "development",
    isDev: process.env.NODE_ENV === "development",

    jwtSecret: process.env.JWT_SECRET || "sepersecretkey",
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "anothersecret",
    jwtExpires: process.env.JWT_EXPIRES_IN || "15m",
    jwtRefreshExpires: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    jwtAlgorithm: process.env.JWT_ALGORITHM || "HS256",

    bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 12,
};