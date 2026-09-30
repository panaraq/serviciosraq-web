'use server';

import { cookies } from 'next/headers';
import { EDITOR_COOKIE, SESSION_TTL_SECONDS, createSessionValue, passwordMatches } from '@/lib/session';

export async function login(formData: FormData): Promise<{ success?: true; error?: string }> {
  if (!process.env.ACCESS_KEY) {
    console.error('[login] ACCESS_KEY no está configurada: el acceso queda bloqueado.');
    return { error: 'El acceso no está configurado en el servidor. Contacta al administrador.' };
  }
  const password = String(formData.get('password') ?? '');
  if (!passwordMatches(password)) return { error: 'Clave incorrecta. Vuelve a intentarlo.' };

  let value: string;
  try {
    value = createSessionValue();
  } catch {
    console.error('[login] AUTH_SECRET no está configurada (mínimo 16 caracteres).');
    return { error: 'Falta configurar AUTH_SECRET en el servidor. Contacta al administrador.' };
  }

  const store = await cookies();
  store.set(EDITOR_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_TTL_SECONDS,
    path: '/',
  });
  return { success: true };
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.set(EDITOR_COOKIE, '', { httpOnly: true, maxAge: 0, path: '/' });
}
