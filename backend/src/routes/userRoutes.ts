import { FastifyInstance } from "fastify";
import { userController } from "../controllers/userController.js";
import { authenticate } from "../middlewares/auth.js";

export async function userRoutes(app: FastifyInstance) {
    app.post("/register", userController.register);
    app.post("/login", userController.login);
    app.get("/me", { preHandler: authenticate }, userController.getMe);
}
