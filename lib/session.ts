// Sesión del editor de la web. La contraseña es ACCESS_KEY (la misma clave de acceso que ya
// usaba el "Portal Admin") y la cookie va firmada con AUTH_SECRET: una cookie que no emitió el
// servidor no sirve. Sin 'use server': no es una acción pública.

import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

export const EDITOR_COOKIE = 'sraq_editor';
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 1 semana

function getSecret(): string | null {
  const secret = process.env.AUTH_SECRET;
  return secret && secret.length >= 16 ? secret : null;
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function createSessionValue(): string {
  const secret = getSecret();
  if (!secret) throw new Error('Falta AUTH_SECRET (mínimo 16 caracteres).');
  const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  return `${expires}.${sign(`editor.${expires}`, secret)}`;
}

export function isValidSessionValue(value: string | undefined): boolean {
  const secret = getSecret();
  if (!secret || !value) return false;
  const [expires, signature] = value.split('.');
  if (!expires || !signature || Number(expires) * 1000 < Date.now()) return false;
  const expected = Buffer.from(sign(`editor.${expires}`, secret));
  const received = Buffer.from(signature);
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export async function hasEditorSession(): Promise<boolean> {
  const store = await cookies();
  return isValidSessionValue(store.get(EDITOR_COOKIE)?.value);
}

// Compara la contraseña sin filtrar su largo por el tiempo de respuesta.
export function passwordMatches(input: string): boolean {
  const key = process.env.ACCESS_KEY;
  if (!key) return false;
  const a = createHmac('sha256', 'cmp').update(input).digest();
  const b = createHmac('sha256', 'cmp').update(key).digest();
  return timingSafeEqual(a, b);
}
