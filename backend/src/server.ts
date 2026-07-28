import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { prisma } from "./lib/prisma.js";
import { userRoutes } from "./routes/userRoutes.js";

const app = Fastify({ logger: true });

// Registrar plugins
await app.register(cors, { origin: "*" });
await app.register(jwt, {
    secret: process.env.JWT_SECRET || "supersecretkey",
});

// Registrar rotas
await app.register(userRoutes);

// Rota de saúde
app.get("/health", async () => {
    return { status: "ok", timestamp: new Date().toISOString() };
});

// Iniciar servidor
const start = async () => {
    try {
        await app.listen({ port: 3333, host: "0.0.0.0" });
        console.log("🚀 Server running on http://localhost:3333");
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
