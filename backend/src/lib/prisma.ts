import { PrismaClient } from "../../../prisma/generated/client.js";
const prisma = new PrismaClient();
const users = await prisma.user.findMany();