// server.js
import { fastify } from 'fastify';
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';
import { DatabasePostgres } from './database-postgres.js';

dotenv.config();

export const sql = neon(process.env.DATABASE_URL);
const server = fastify();
const db = new DatabasePostgres();

server.get('/', async () => {
  const result = await sql`SELECT version()`;
  return `Conectado ao Neon! Versão: ${result[0].version}`;
});

server.post('/videos', async (req, reply) => {
  const id = await db.create(req.body);
  return reply.status(201).send({ id });
});

server.get('/videos', async (req) => db.list(req.query.search));

server.put('/videos/:id', async (req, reply) => {
  await db.update(req.params.id, req.body);
  return reply.status(204).send();
});

server.delete('/videos/:id', async (req, reply) => {
  await db.delete(req.params.id);
  return reply.status(204).send();
});

server.listen({
  host: '0.0.0.0',
  port: process.env.PORT ?? 3333
}, () => console.log(`Servidor rodando em http://localhost:${process.env.PORT ?? 3333}`));
