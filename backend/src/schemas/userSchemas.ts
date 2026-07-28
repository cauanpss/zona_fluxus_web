import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(2),
    email: z.email({ message: "Digite um e-mail válido" }),
    password: z.string().min(6),
});

export const loginSchema = z.object({
    email: z.email({ message: "Digite um e-mail válido" }),
    password: z.string(),
});
