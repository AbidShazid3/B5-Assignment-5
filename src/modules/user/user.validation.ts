import z from "zod";
import { Role } from "./user.interface";

export const registerUserZodSchema = z.object({
    name: z
        .string({ error: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    phone: z
        .string({ error: "Phone number is required" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
        }),
    password: z
        .string({ error: "Password is required" })
        .min(5, "Password must be at least 5 digits")
        .max(20, "Password must be exactly 20 digits")
        .regex(/^(?=.*[A-Z])/, {
            message: "Password must contain at least 1 uppercase letter.",
        })
        .regex(/^(?=.*[!@#$%^&*])/, {
            message: "Password must contain at least 1 special character.",
        })
        .regex(/^(?=.*\d)/, {
            message: "Password must contain at least 1 number.",
        }),
    role: z
    .enum(Object.values(Role))
});