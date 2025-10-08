import { z } from "zod";

export const RegisterSchema = z.object({
    email: z.email("Invalid email format")
        .min(1, "Email is required")
        .transform(email => email.trim().toLowerCase()),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/^(?=.*[A-Z])(?=.*\d).+$/, "Password must contain at least one uppercase letter and one number"),
    passwordConfirm: z.string(),
    name: z.string()
        .min(1, "Name is required")
        .max(255, "Name too long")
}).refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
    email: z.email("Invalid email format")
        .min(1, "Email required")
        .transform(email => email.trim().toLowerCase()),
    password: z.string()
        .min(1, "Password is required")
});

export type LoginInput = z.infer<typeof LoginSchema>