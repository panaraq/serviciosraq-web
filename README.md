# serviciosraq-web

Web pública de **RAQ Servicios** (serviciosraq.com): la página de la empresa y su editor de
contenido. Hasta septiembre de 2026 vivía dentro de RAQtools; se separó para poder trabajar cada
proyecto por su lado.

## Qué hay

- `/` — la página pública. Todo su contenido (textos, servicios, publicaciones de Instagram,
  contacto, logo) sale de la tabla `landing_config` de Postgres.
- `/admin` — entrada al editor, con la clave de acceso (`ACCESS_KEY`).
- `/admin/editor` — el editor del contenido.
- `/api/upload-logo` — subida del logo (solo con sesión del editor).

## Variables de entorno

| Variable | Para qué |
|---|---|
| `DATABASE_URL` | Postgres donde está `landing_config` (Supabase, la misma base de RAQtools). En Cloudflare no se usa: la conexión llega por el enlace Hyperdrive de `wrangler.jsonc`. |
| `ACCESS_KEY` | Clave para entrar al editor. Es propia de esta web, distinta de la del Panel de RAQtools (desde 2026-11-16). |
| `AUTH_SECRET` | Firma la cookie de sesión del editor (mínimo 16 caracteres). También propio de esta web. |

## Comandos

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

## Despliegue

La web corre en Cloudflare Workers (OpenNext), en `www.serviciosraq.com`. Un push a `main` no
despliega nada: hay que compilar y subir a mano desde una copia del repo en WSL/Linux sin archivos
`.env*` (OpenNext los mete en el Worker):

```bash
npm run cf:deploy   # opennextjs-cloudflare build + deploy
```

Los secretos `ACCESS_KEY` y `AUTH_SECRET` se cargan con `npx wrangler secret put`. Sus valores están en
`despliegue.env` como `SERVICIOSRAQ_EDITOR_KEY` y `SERVICIOSRAQ_AUTH_SECRET`.
