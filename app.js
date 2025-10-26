import { fastify } from 'fastify';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

export const sql = neon(process.env.DATABASE_URL);

const server = fastify();

server.get('/', async (request, reply) => {
  const result = await sql`SELECT version()`;
  return `Conectado ao Neon! Versão: ${result[0].version}`;
});

server.listen({ port: process.env.PORT ?? 3000 }, () =>
  console.log('Servidor rodando em http://localhost:3000')
);
