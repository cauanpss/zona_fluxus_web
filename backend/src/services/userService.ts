import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
import { registerSchema, loginSchema } from "../schemas/userSchemas.js";
import { z } from "zod";

type RegisterInput = z.infer<typeof registerSchema>;
type LoginInput = z.infer<typeof loginSchema>;

export const userService = {
    async createUser(data: unknown) {
        const validation = registerSchema.safeParse(data);

        if (!validation.success) {
            throw validation.error;
        }

        const validatedData = validation.data;

        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        return prisma.user.create({
            data: {
                email: validatedData.email,
                name: validatedData.name,
                password: hashedPassword,
            },
            select: { id: true, email: true, name: true, createdAt: true },
        });
    },

    async getUserByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } });
    },

    async validatePassword(plain: string, hashed: string) {
        return bcrypt.compare(plain, hashed);
    },
};
