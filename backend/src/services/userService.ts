// services/userService.ts
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";

export const userService = {
    async createUser(data: { email: string; password: string; name: string }) {
        // Verificar se usuário já existe
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new Error("Email já cadastrado");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        return prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            },
        });
    },

    async getUserByEmail(email: string) {
        return prisma.user.findUnique({ where: { email } });
    },

    async getUserById(id: number) {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    },

    async validatePassword(plain: string, hashed: string) {
        return bcrypt.compare(plain, hashed);
    },
};
