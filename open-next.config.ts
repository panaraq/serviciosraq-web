// Configuración del adaptador OpenNext para Cloudflare. Sin caché incremental: todas las páginas son
// dinámicas (force-dynamic) y leen el contenido de landing_config en cada visita.
import { defineCloudflareConfig } from '@opennextjs/cloudflare';

export default defineCloudflareConfig({});
