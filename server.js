import { fastify } from 'fastify';
import { DatabasePostgres } from './database-postgres.js';
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config();

export const sql = neon(process.env.DATABASE_URL);

const server = fastify();
const db = new DatabasePostgres();

server.post('/videos', async (request, reply) => {
  const { title, description, duration } = request.body;
  await db.create({ title, description, duration });
  return reply.status(201).send();
});

server.get('/videos', async (request, reply) => {
  const search = request.query.search;
  const videos = await db.list(search);
  return videos;
});

server.put('/videos/:id', async (request, reply) => {
  const videoID = request.params.id;
  const { title, description, duration } = request.body;
  await db.update(videoID, { title, description, duration });
  return reply.status(204).send();
});

server.delete('/videos/:id', async (request, reply) => {
  const videoID = request.params.id;
  await db.delete(videoID);
  return reply.status(204).send();
});

server.listen({
  host: '0.0.0.0',
  port: process.env.PORT ?? 3333
})