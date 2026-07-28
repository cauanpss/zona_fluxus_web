import { FastifyRequest, FastifyReply } from "fastify";
import { userService } from "../services/userService.js";
import { registerSchema, loginSchema } from "../schemas/userSchemas.js";

export const userController = {
    async register(request: FastifyRequest, reply: FastifyReply) {
        try {
            const data = registerSchema.parse(request.body);
            const user = await userService.createUser(data);
            return reply.status(201).send({ user });
        } catch (error) {
            return reply
                .status(400)
                .send({ error: "Dados inválidos", details: error });
        }
    },

    async login(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { email, password } = loginSchema.parse(request.body);
            const user = await userService.getUserByEmail(email);
            if (!user) {
                return reply
                    .status(401)
                    .send({ error: "Credenciais inválidas" });
            }

            const isValid = await userService.validatePassword(
                password,
                user.password,
            );
            if (!isValid) {
                return reply
                    .status(401)
                    .send({ error: "Credenciais inválidas" });
            }

            // Gerar token JWT
            const token = reply.jwtSign(
                { userId: user.id, email: user.email },
                { expiresIn: "7d" },
            );

            return reply.send({
                token,
                user: { id: user.id, email: user.email, name: user.name },
            });
        } catch (error) {
            return reply
                .status(400)
                .send({ error: "Dados inválidos", details: error });
        }
    },

    async getMe(request: FastifyRequest, reply: FastifyReply) {
        // O usuário já está disponível via request.user (adicionado pelo middleware)
        const user = (request as any).user;
        return reply.send({ user });
    },
};
