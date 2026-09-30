// Sube el logo de la web y lo guarda dentro del contenido (en base64), así sobrevive a cada
// despliegue de Railway sin necesitar almacenamiento de archivos. Solo con sesión del editor.

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { hasEditorSession } from '@/lib/session';
import { DEFAULT_DATA, mergeWithDefaults, readSavedLanding, saveLanding } from '@/lib/landing-data';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_BYTES = 2 * 1024 * 1024; // el base64 ocupa ~33% más en la base de datos

export async function POST(request: NextRequest) {
  if (!(await hasEditorSession())) {
    return NextResponse.json({ error: 'Tu sesión del editor expiró. Vuelve a entrar con la clave.' }, { status: 401 });
  }
  try {
    const formData = await request.formData();
    const file = formData.get('logo');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No se recibió ningún archivo.' }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Tipo de archivo no permitido. Usa PNG, JPG o WEBP.' }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'El archivo es muy grande. Máximo 2MB para el logo.' }, { status: 400 });
    }

    const dataUrl = `data:${file.type};base64,${Buffer.from(await file.arrayBuffer()).toString('base64')}`;
    const saved = await readSavedLanding();
    await saveLanding({ ...mergeWithDefaults(saved ?? DEFAULT_DATA), logoBase64: dataUrl });
    revalidatePath('/');

    return NextResponse.json({ success: true, dataUrl });
  } catch (error) {
    console.error('[upload-logo] Error:', error);
    return NextResponse.json({ error: 'Error interno al procesar el logo.' }, { status: 500 });
  }
}
