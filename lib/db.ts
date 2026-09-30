// Conexión a Postgres. La web solo usa una tabla: landing_config, donde el editor guarda todo el
// contenido de la página (textos, servicios, publicaciones, logo). Es la misma tabla que usaba la
// web cuando vivía dentro de RAQtools, así que el contenido ya cargado se conserva.

import { drizzle } from 'drizzle-orm/postgres-js';
import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import postgres from 'postgres';

export const landingConfig = pgTable('landing_config', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: text('key').unique().notNull(), // siempre 'main_landing'
  content: jsonb('content').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
});

export const LANDING_KEY = 'main_landing';

const client = postgres(process.env.DATABASE_URL!, {
  prepare: false,
  connect_timeout: 10,
  max: 5,
});

export const db = drizzle(client);
