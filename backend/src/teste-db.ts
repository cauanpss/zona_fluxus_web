// backend/src/teste-db.ts
import 'dotenv/config'; // 👈 PRIMEIRA LINHA
import { prisma } from './lib/prisma.js';

async function test() {
  try {
    console.log('📌 DATABASE_URL carregada:', process.env.DATABASE_URL?.replace(/:[^:]*@/, ':****@'));
    console.log('Testando conexão com o banco...');
    
    const user = await prisma.user.create({
      data: {
        email: 'teste@teste.com',
        password: '123456',
        name: 'Teste',
      },
    });
    
    console.log('✅ Usuário criado:', user);
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

test();