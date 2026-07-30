import { FastifyRequest, FastifyReply } from "fastify";
import { userService } from "../services/userService.js";
import { registerSchema, loginSchema } from "../schemas/userSchemas.js";
import { z } from "zod";

export const userController = {
    async register(request: FastifyRequest, reply: FastifyReply) {
        try {
            console.log("🔵 1 - Iniciando registro");

            const data = registerSchema.parse(request.body);            
            const user = await userService.createUser(data);

            // Gerar token JWT
            const token = await reply.jwtSign(
                { userId: user.id, email: user.email },
                { expiresIn: "7d" },
            );
            
            const response = {
                message: "Usuário criado com sucesso",
                user,
                token,
            };
            
            return reply.status(201).send(response);
        } catch (error) {

            if (error instanceof z.ZodError) {
                return reply.status(400).send({
                    error: "Dados inválidos",
                    details: error.issues.map((err) => ({
                        field: err.path.join("."),
                        message: err.message,
                    })),
                });
            }

            return reply.status(400).send({
                error:
                    error instanceof Error
                        ? error.message
                        : "Erro ao criar usuário",
            });
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

            const token = await reply.jwtSign(
                { userId: user.id, email: user.email },
                { expiresIn: "7d" },
            );

            return reply.send({
                message: "Login realizado com sucesso",
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                },
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({
                    error: "Dados inválidos",
                    details: error.issues.map((err) => ({
                        field: err.path.join("."),
                        message: err.message,
                    })),
                });
            }

            return reply.status(400).send({
                error:
                    error instanceof Error
                        ? error.message
                        : "Erro ao fazer login",
            });
        }
    },

    async getMe(request: FastifyRequest, reply: FastifyReply) {
        try {
            const user = (request as any).user;

            if (!user || !user.userId) {
                return reply.status(401).send({ error: "Não autorizado" });
            }

            const userData = await userService.getUserById(user.userId);

            if (!userData) {
                return reply
                    .status(404)
                    .send({ error: "Usuário não encontrado" });
            }

            return reply.send({
                user: {
                    id: userData.id,
                    email: userData.email,
                    name: userData.name,
                    createdAt: userData.createdAt,
                    updatedAt: userData.updatedAt,
                },
            });
        } catch (error) {
            console.error("Erro no getMe:", error);
            return reply.status(500).send({
                error: "Erro ao buscar perfil",
            });
        }
    },
};
