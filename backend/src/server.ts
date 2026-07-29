// backend/src/server.ts
import "dotenv/config";
import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import { userRoutes } from "./routes/userRoutes.js";

const app = fastify();

// Configurar JWT
app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || "my-secret-key",
});

// Rotas
app.register(userRoutes);

// Iniciar
const start = async () => {
    try {
        await app.listen({ port: 3333, host: "0.0.0.0" });
        console.log("Server running on http://localhost:3333");
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
