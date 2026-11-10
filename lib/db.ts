// Conexión a Postgres. La web solo usa una tabla: landing_config, donde el editor guarda todo el
// contenido de la página (textos, servicios, publicaciones, logo). Es la misma tabla que usaba la
// web cuando vivía dentro de RAQtools, así que el contenido ya cargado se conserva.

import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import postgres from 'postgres';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export const landingConfig = pgTable('landing_config', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: text('key').unique().notNull(), // siempre 'main_landing'
  content: jsonb('content').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull().defaultNow(),
});

export const LANDING_KEY = 'main_landing';

// Dos entornos (mismo criterio que lib/db/index.ts de RAQtools):
// - Node (next dev): un cliente para todo el proceso con DATABASE_URL (pooler de Supabase, puerto
//   6543, por eso `prepare: false`).
// - Cloudflare Workers (OpenNext): un cliente por petición contra Hyperdrive, guardado por
//   ExecutionContext, porque un Worker no puede reutilizar sockets entre peticiones.
// `db` es un Proxy que elige el cliente al usarse; no conecta al cargar el módulo ni en `next build`.

type Db = PostgresJsDatabase & { $client: postgres.Sql };

const isCloudflareWorker = typeof navigator !== 'undefined' && navigator.userAgent === 'Cloudflare-Workers';

let nodeDb: Db | undefined;
const workerDbs = new WeakMap<object, Db>();

function getDb(): Db {
  if (!isCloudflareWorker) {
    nodeDb ??= drizzle(postgres(process.env.DATABASE_URL!, { prepare: false, connect_timeout: 10, max: 5 }));
    return nodeDb;
  }
  const { env, ctx } = getCloudflareContext();
  let db = workerDbs.get(ctx);
  if (!db) {
    db = drizzle(postgres(env.HYPERDRIVE.connectionString, { prepare: false, connect_timeout: 10, max: 3 }));
    workerDbs.set(ctx, db);
  }
  return db;
}

export const db: Db = new Proxy({} as Db, {
  get(_target, prop) {
    const real = getDb();
    const value = Reflect.get(real, prop, real);
    return typeof value === 'function' ? value.bind(real) : value;
  },
});
