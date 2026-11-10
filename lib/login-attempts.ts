// Límite de intentos para la clave del editor (misma idea que RAQtools, PENDIENTES #34 de ese
// repo). Usa la tabla auth_attempts de la base compartida (la crea la migración 0035 de RAQtools).
// Cada intento se anota ANTES de comprobar la clave y después se cuenta: una ráfaga de peticiones
// en paralelo no pasa entera. Si la clave es correcta, se borran los intentos de esa IP.
// Sin 'use server': no es una acción pública.

import { sql } from 'drizzle-orm';
import { headers } from 'next/headers';
import { db } from '@/lib/db';

const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get('cf-connecting-ip') || h.get('x-forwarded-for')?.split(',')[0]?.trim() || 'sin-ip';
}

async function attemptKey(): Promise<string> {
  return `sraq-editor-ip:${await clientIp()}`;
}

/** Anota el intento y devuelve los minutos a esperar si se pasó el límite (o null). */
export async function beginLoginAttempt(): Promise<number | null> {
  const key = await attemptKey();
  await db.execute(sql`insert into auth_attempts (key) values (${key})`);
  const rows = (await db.execute(sql`
    select created_at from auth_attempts
    where key = ${key} and created_at > now() - make_interval(mins => ${WINDOW_MINUTES})
    order by created_at desc
  `)) as unknown as { created_at: Date | string }[];
  if (rows.length <= MAX_ATTEMPTS) return null;
  // Se libera cuando el intento que hace pasar el límite sale de la ventana.
  const oldest = new Date(rows[MAX_ATTEMPTS - 1].created_at).getTime();
  const waitMs = oldest + WINDOW_MINUTES * 60_000 - Date.now();
  return Math.min(WINDOW_MINUTES, Math.max(1, Math.ceil(waitMs / 60_000)));
}

/** Clave correcta: limpia los intentos de esta IP. */
export async function loginSucceeded(): Promise<void> {
  const key = await attemptKey();
  await db.execute(sql`delete from auth_attempts where key = ${key}`);
}
