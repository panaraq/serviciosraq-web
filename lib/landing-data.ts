// Contenido de la página: lectura desde Postgres, con respaldo en data/landing.json y, si todo
// falla, los textos por defecto (lib/landing-defaults.ts). Sin "use server": no es una acción pública.

import { readFile } from 'fs/promises';
import { join } from 'path';
import { eq } from 'drizzle-orm';
import { db, landingConfig, LANDING_KEY } from '@/lib/db';
import { DEFAULT_DATA, mergeWithDefaults, type LandingData } from '@/lib/landing-defaults';

export { DEFAULT_DATA, mergeWithDefaults };
export type { LandingData, LandingService, InstagramPost } from '@/lib/landing-defaults';

export async function readSavedLanding(): Promise<Partial<LandingData> | null> {
  const [row] = await db.select().from(landingConfig).where(eq(landingConfig.key, LANDING_KEY)).limit(1);
  if (!row?.content) return null;
  const raw = row.content;
  return (typeof raw === 'string' ? JSON.parse(raw) : raw) as Partial<LandingData>;
}

export async function loadLandingData(): Promise<LandingData> {
  try {
    const saved = await readSavedLanding();
    if (saved) return mergeWithDefaults(saved);
  } catch (error) {
    console.warn('[landing] Base de datos no disponible, se usa data/landing.json:', error);
  }
  try {
    const file = await readFile(join(process.cwd(), 'data', 'landing.json'), 'utf-8');
    return mergeWithDefaults(JSON.parse(file));
  } catch (error) {
    console.warn('[landing] data/landing.json no disponible, se usan los textos por defecto:', error);
  }
  return DEFAULT_DATA;
}

export async function saveLanding(data: LandingData): Promise<void> {
  await db.insert(landingConfig)
    .values({ key: LANDING_KEY, content: data })
    .onConflictDoUpdate({ target: landingConfig.key, set: { content: data, updatedAt: new Date() } });
}
