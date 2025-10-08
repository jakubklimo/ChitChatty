import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services";
import { clearAuthCookies, setAuthCookies } from "../utils";

const authService = new AuthService();

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const context = {
        headers: req.headers as Record<string, string>,
        ip: req.ip || "unknown",
    };

    try {
        const result = await authService.register(req.body, context);

        setAuthCookies(res, result.accessToken, result.refreshToken);

        res.status(201).json({
            success: true,
            data: { user: result.user }
        });
    } catch (error) {
        next(error);
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const context = {
        headers: req.headers as Record<string, string>,
        ip: req.ip || "unknown",
    };

    try {
        const result = await authService.login(req.body, context);

        setAuthCookies(res, result.accessToken, result.refreshToken);

        res.status(201).json({
            success: true,
            data: { user: result.user }
        });
    } catch (error) {
        next(error);
    }
}

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const userAgent = req.headers["user-agent"];
        const ip = req.ip;

        const result = await authService.refreshToken(refreshToken, ip, userAgent);

        setAuthCookies(res, result.accessToken, result.refreshToken);

        res.status(200).json({
            success: true,
            data: { user: result.user }
        });
    } catch (error) {
        next(error);
    }
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;

        await authService.logout(user.sid);

        clearAuthCookies(res);

        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        next(error);
    }
}

export const logoutAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;

        await authService.logoutAll(user.sub);

        clearAuthCookies(res);

        res.status(200).json({
            success: true,
            message: "Logged out from all devices successfully",
        });
    } catch (error) {
        next(error);
    }
}