import bcrypt from "bcrypt";
import { config } from "../config";

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, config.bcryptRounds);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
}

export const isPasswordStrong = (password: string): boolean => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
}