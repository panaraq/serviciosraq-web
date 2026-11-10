// Bindings del Worker de Cloudflare que usa el código (ver wrangler.jsonc).
declare global {
  interface CloudflareEnv {
    /** Hyperdrive apuntando a la base de Supabase de RAQtools (lib/db.ts). */
    HYPERDRIVE: { connectionString: string };
  }
}

export {};
