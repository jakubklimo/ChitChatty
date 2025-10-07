import { prisma } from "../prisma";
import { hashPassword, ValidationError } from "../utils";
import { isPasswordStrong } from "../utils";

interface LoginResult {
    accessToken: string;
    refreshToken: string;
    user: {
        id: number;
        email: string;
        name: string;
    };
}

export class AuthService {
    async register(email: string, password: string, passwordConfirm: string, name: string) {
        if (password !== passwordConfirm) {
            throw new ValidationError("Password do not match");
        }
        if (!isPasswordStrong(password)) {
            throw new ValidationError("Password must be at least 8 characters, contain upper and lower case letters, a number and a special character");
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            throw new Error("User with this email already exists");
        }

        const passwordHash = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: passwordHash
            }
        });

        return {}
    }
}