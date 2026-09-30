'use server';

import { revalidatePath } from 'next/cache';
import { hasEditorSession } from '@/lib/session';
import { loadLandingData, saveLanding, type LandingData } from '@/lib/landing-data';

// Solo el editor la usa; el contenido es público de todos modos (es lo que muestra la web).
export async function getLandingData(): Promise<LandingData> {
  return loadLandingData();
}

// Antes, dentro de RAQtools, esta acción no pedía ninguna sesión: cualquiera podía reescribir la
// web. Ahora exige haber entrado al editor con la clave.
export async function updateLandingData(data: LandingData): Promise<{ success?: true; error?: string }> {
  if (!(await hasEditorSession())) {
    return { error: 'Tu sesión del editor expiró. Vuelve a entrar con la clave.' };
  }
  if (!data?.hero || !data?.contact || !Array.isArray(data.services)) {
    return { error: 'Contenido incompleto: no se guardó nada.' };
  }
  try {
    await saveLanding(data);
  } catch (error) {
    console.error('[landing] No se pudo guardar:', error);
    return { error: 'No se pudo guardar en la base de datos. Intenta de nuevo.' };
  }
  revalidatePath('/');
  return { success: true };
}
