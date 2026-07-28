// src/controllers/userController.ts
import { Request, Response } from "express";
import { userService } from "../services/userService.js";
import { ZodError } from "zod"; // Importamos o erro do Zod

export const registerUser = async (req: Request, res: Response) => {
    try {
        const newUser = await userService.createUser(req.body);
        return res.status(201).json(newUser);
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                message: "Dados inválidos",
                errors: error.issues,
            });
        }

        console.error(error);
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
};
