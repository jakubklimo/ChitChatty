import { prisma } from "../prisma";
import { AuthenticationError, AuthorizationError, ConflictError, generateAccessToken, generateSecureToken, getRefreshTokenExpiry, hashPassword, hashToken, logger, verifyPassword } from "../utils";
import { RegisterInput, LoginInput } from "../schemas";

export interface Context {
    headers: Record<string, string | undefined>;
    ip?: string;
}

export interface AuthUser {
    id: number;
    email: string;
    name: string;
}

export interface AuthResult {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
}

export class AuthService {
    async register(input: RegisterInput, context: Context): Promise<AuthResult> {
        const { email, password, name } = input;

        try {
            const existing = await prisma.user.findUnique({ where: { email } });
            if (existing) {
                throw new ConflictError("User with this email already exists");
            }

            const passwordHash = await hashPassword(password);

            const user = await prisma.user.create({
                data: {
                    email,
                    name,
                    password: passwordHash
                }
            });

            logger.info("User registered succesfully");

            const { accessToken, refreshToken } = await this._createTokens(user, context);

            const sanitizeUser = this._sanitizeUser(user);

            return {
                user: sanitizeUser,
                accessToken,
                refreshToken
        };
        } catch (error: any) {
            logger.error({ error, email }, "Register failed");
            throw(error);
        }
    }

    async login(input: LoginInput, context: Context): Promise<AuthResult> {
        const { email, password } = input;

        try {
            const user = await prisma.user.findUnique({ where: { email } });
            if (!user || !user.password) {
                throw new AuthorizationError("Invalid email or password");
            }

            const isValid = await verifyPassword(password, user.password);
            if (!isValid) {
                throw new AuthorizationError("Invalid email or password");
            }

            const { accessToken, refreshToken } = await this._createTokens(user, context);

            const sanitizeUser = this._sanitizeUser(user);

            return {
                user: sanitizeUser,
                accessToken,
                refreshToken
            };
        } catch (error: any) {
            logger.error({ error, email }, "Login failed");
            throw(error);
        }
    }

    async refreshToken(refreshToken: string, ip?: string, userAgent?: string): Promise<AuthResult> {
        if(!refreshToken) {
            throw new AuthenticationError("No refresh token provided");
        }
        try {
            const refreshTokenHash = hashToken(refreshToken);

            const session = await prisma.session.findFirst({
                where: {
                    refreshTokenHash,
                    expiresAt: { gt: new Date() }
                },
                include: { user: true}
            });

            if (!session) {
                throw new AuthenticationError("Invalid or expired refresh token");
            }

            const newRefreshToken = generateSecureToken();
            const newRefreshTokenHash = hashToken(newRefreshToken);
            const newExpiresAt = getRefreshTokenExpiry();

            await prisma.session.update({
                where: { id: session.id },
                data: { refreshTokenHash: newRefreshTokenHash, expiresAt: newExpiresAt, ipAddress: ip, userAgent }
            });

            const accessToken = generateAccessToken(session.user, session.id);

            const sanitizeUser = this._sanitizeUser(session.user);

            return {
                user: sanitizeUser,
                accessToken,
                refreshToken
            };
        } catch (error) {
            logger.error({ error }, "Refresh token failed");
            throw(error);
        }
    }

    async logout(sessionId: string): Promise<void> {
        if (!sessionId) {
            throw new AuthenticationError("No session provided");
        }
        try {
            const session = await prisma.session.findFirst({
                where: { id: sessionId },
            });

            if (!session) {
                throw new AuthenticationError("Session not found or already logged out");
            }
            
            await prisma.session.delete({
                where: { id: session.id },
            });

            logger.info({ sessionId: session.id, userId: session.userId }, "User logged out successfully");
        } catch (error) {
            logger.error({ error, sessionId }, "Logout failed");
            throw(error);
        }
    }

    async logoutAll(userId: number): Promise<void> {
        if (!userId) {
            throw new AuthenticationError("User ID not provided");
        }
        try {
            await prisma.session.deleteMany({
                where: { userId },
            });

            logger.info({ userId }, "User logged out from all sessions");
        } catch (error) {
            logger.error({ error, userId }, "Logout-all failed");
            throw(error);
        }
    }

    private async _createTokens(user: any, context: Context) {
        const refreshToken = generateSecureToken();
        const refreshTokenHash = hashToken(refreshToken);
        const expiresAt = getRefreshTokenExpiry();

        const session = await prisma.session.create({
            data: {
                userId: user.id,
                refreshTokenHash,
                userAgent: context.headers["user-agent"] || "unknown",
                ipAddress: context.ip,
                expiresAt,
            },
        });

        const accessToken = generateAccessToken(user, session.id);

        return { accessToken, refreshToken };
    }

    private _sanitizeUser(user: any) {
        const { password, ...rest } = user;
        return rest;
    }
}