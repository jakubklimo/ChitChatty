import bcrypt from "bcrypt";
import crypto from "crypto";
import { config } from "../config";
import { Response } from "express";

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, config.bcryptRounds);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
}

export const generateSecureToken = (bytes = 32): string => {
    return crypto.randomBytes(bytes).toString("hex");
}

export const hashToken = (token: string): string => {
    return crypto.createHash("sha256").update(token).digest("hex");
}

export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
    const isProd = !config.isDev;

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
        path: "/",
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
    });
}

export const clearAuthCookies = (res: Response) => {
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });
}