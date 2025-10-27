// database-postgres.js
import { sql } from './server.js';
import { randomUUID } from 'node:crypto';

export class DatabasePostgres {
  async list(search) {
    if (search) return sql`SELECT * FROM videos WHERE title ILIKE ${'%' + search + '%'}`;
    return sql`SELECT * FROM videos`;
  }

  async create({ title, description, duration }) {
    const id = randomUUID();
    await sql`
      INSERT INTO videos (id, title, description, duration)
      VALUES (${id}, ${title}, ${description}, ${duration})
    `;
    return id;
  }

  async update(id, { title, description, duration }) {
    await sql`
      UPDATE videos SET title=${title}, description=${description}, duration=${duration}
      WHERE id=${id}
    `;
  }

  async delete(id) {
    await sql`DELETE FROM videos WHERE id=${id}`;
  }
}
