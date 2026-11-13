// Tipos y contenido por defecto de la página. Sin base de datos ni archivos: lo usan también el
// editor (navegador) y lib/landing-data.ts (servidor).

export interface LandingService {
  id: number;
  active?: boolean;
  title: string;
  description: string;
  items: string[];
  icon: string;
  color: string;
}

export interface InstagramPost {
  id: number;
  url: string;
  imageUrl: string;
  caption: string;
}

export interface LandingData {
  hero: { title: string; highlight: string; subtitle: string };
  contact: { whatsapp: string; instagram: string; address: string; mapUrl: string };
  services: LandingService[];
  instagramPosts: InstagramPost[];
  logoBase64?: string;
}

export const DEFAULT_DATA: LandingData = {
  hero: {
    title: "Integradores de Tecnología",
    highlight: "lo aprendemos.",
    subtitle: "Soporte técnico, seguridad electrónica y redes de fibra óptica en Margarita. Más de 23 años resolviendo retos tecnológicos con precisión y pasión."
  },
  contact: {
    whatsapp: "584248072167",
    instagram: "https://www.instagram.com/raqservicios",
    address: "Isla de Margarita, Estado Nueva Esparta, Venezuela.",
    mapUrl: ""
  },
  services: [
    {
      id: 1, active: true,
      title: "Soporte Técnico",
      description: "Diagnóstico y reparación experta de Laptops y PCs. Mantenimiento preventivo, cambio de componentes y optimización de software.",
      items: ["Limpieza Interna", "Instalación de SO", "Recuperación de Datos"],
      icon: "Laptop", color: "orange"
    },
    {
      id: 2, active: true,
      title: "Seguridad Hikvision",
      description: "Partner Oficial Certificado. Instalación de sistemas de CCTV, alarmas inteligentes y control de acceso con tecnología de vanguardia.",
      items: ["Cámaras IP 4K", "Alarmas Residenciales", "Cerco Eléctrico"],
      icon: "ShieldCheck", color: "purple"
    },
    {
      id: 3, active: true,
      title: "Fibra Óptica",
      description: "Contratistas certificados para instalación de última milla. Garantizamos la máxima velocidad y estabilidad en tu conexión.",
      items: ["Empalmes por Fusión", "Certificación de Puntos", "Redes GPON"],
      icon: "Wifi", color: "orange"
    },
    {
      id: 4, active: false,
      title: "Cámaras y CCTV",
      description: "Instalación y configuración de sistemas de videovigilancia profesional para hogares, empresas y condominios.",
      items: ["Cámaras Análogas", "DVR / NVR", "Monitoreo Remoto"],
      icon: "Camera", color: "purple"
    },
    {
      id: 5, active: false,
      title: "Redes Empresariales",
      description: "Diseño, instalación y configuración de redes LAN/WAN para empresas. Soluciones escalables y seguras.",
      items: ["Cableado Estructurado", "Switches Gestionables", "VPN Corporativa"],
      icon: "Cpu", color: "orange"
    },
    {
      id: 6, active: false,
      title: "Control de Acceso",
      description: "Sistemas inteligentes de control de acceso con biometría, tarjetas RFID y gestión centralizada.",
      items: ["Biometría Dactilar", "Tarjetas RFID", "Registro de Entradas"],
      icon: "Monitor", color: "purple"
    },
    {
      id: 7, active: false,
      title: "Mantenimiento Preventivo",
      description: "Planes de mantenimiento periódico para equipos tecnológicos. Evita fallas antes de que ocurran.",
      items: ["Revisión Mensual", "Limpieza de Equipos", "Actualización de Software"],
      icon: "Smartphone", color: "orange"
    },
    {
      id: 8, active: false,
      title: "Alarmas Inteligentes",
      description: "Instalación de sistemas de alarma con sensores de movimiento, apertura y notificación inmediata al celular.",
      items: ["Sensores de Movimiento", "Alertas en Tiempo Real", "Integración App Móvil"],
      icon: "Server", color: "purple"
    },
    {
      id: 9, active: false,
      title: "Consultoría Tecnológica",
      description: "Asesoramiento experto para optimizar tu infraestructura tecnológica. Soluciones a medida para tu negocio.",
      items: ["Auditoría de Sistemas", "Plan de Mejoras", "Soporte Continuado"],
      icon: "Database", color: "orange"
    }
  ],
  instagramPosts: [
    { id: 1, url: '', imageUrl: '', caption: 'Calidad RAQ' },
    { id: 2, url: '', imageUrl: '', caption: 'Soporte Técnico' },
    { id: 3, url: '', imageUrl: '', caption: 'Seguridad' },
    { id: 4, url: '', imageUrl: '', caption: 'Fibra Óptica' },
  ]
};

// Siempre 9 servicios y 4 publicaciones: completa lo que falte con los valores por defecto y
// respeta lo que ya se editó (por id).
export function mergeWithDefaults(saved: Partial<LandingData> | null | undefined): LandingData {
  const servicesById = new Map((saved?.services ?? []).map((s) => [s.id, s]));
  const postsById = new Map((saved?.instagramPosts ?? []).map((p) => [p.id, p]));
  return {
    ...DEFAULT_DATA,
    ...saved,
    hero: { ...DEFAULT_DATA.hero, ...saved?.hero },
    contact: { ...DEFAULT_DATA.contact, ...saved?.contact },
    services: DEFAULT_DATA.services.map((def) => ({ ...def, ...servicesById.get(def.id) })),
    instagramPosts: DEFAULT_DATA.instagramPosts.map((def) => ({ ...def, ...postsById.get(def.id) })),
  };
}
