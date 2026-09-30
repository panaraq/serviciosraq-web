import React from 'react';
import Link from 'next/link';
import { 
  Laptop, 
  ShieldCheck, 
  Wifi, 
  Smartphone, 
  MapPin, 
  Camera,
  MessageCircle,
  Cpu,
  Zap,
  Lock,
  ArrowRight,
  ExternalLink,
  Monitor,
  Server,
  Database,
  Printer,
  HardDrive,
  Router,
  Wrench,
  Headphones,
  Cable,
  CircuitBoard,
  Plug,
  ScanLine,
  Cctv,
  type LucideIcon,
} from 'lucide-react';

import { loadLandingData } from '@/lib/landing-data';

// Always render fresh from DB — never cache the public landing page
export const dynamic = 'force-dynamic';

export default async function LandingPage() {
  const data = await loadLandingData();

  const iconMap: Record<string, LucideIcon> = {
    Laptop, ShieldCheck, Wifi, Smartphone,
    Camera, Cpu, Monitor, Server, Database,
    Printer, HardDrive, Router, Wrench, Headphones,
    Cable, CircuitBoard, Plug, ScanLine, Cctv,
  };

  // Color utility for service cards
  const colorStyles: Record<string, { border: string; bg: string; text: string; dot: string; shadow: string }> = {
    orange: { border: 'hover:border-orange-500/50 hover:bg-orange-500/5', bg: 'bg-orange-500/10', text: 'text-orange-500', dot: 'bg-orange-500', shadow: 'shadow-orange-500/5 hover:shadow-orange-500/20' },
    purple: { border: 'hover:border-purple-500/50 hover:bg-purple-500/5', bg: 'bg-purple-500/10', text: 'text-purple-500', dot: 'bg-purple-500', shadow: 'shadow-purple-500/5 hover:shadow-purple-500/20' },
    blue:   { border: 'hover:border-blue-500/50 hover:bg-blue-500/5',   bg: 'bg-blue-500/10',   text: 'text-blue-500',   dot: 'bg-blue-500',   shadow: 'shadow-blue-500/5 hover:shadow-blue-500/20' },
    green:  { border: 'hover:border-emerald-500/50 hover:bg-emerald-500/5', bg: 'bg-emerald-500/10', text: 'text-emerald-500', dot: 'bg-emerald-500', shadow: 'shadow-emerald-500/5 hover:shadow-emerald-500/20' },
    red:    { border: 'hover:border-red-500/50 hover:bg-red-500/5',    bg: 'bg-red-500/10',    text: 'text-red-500',    dot: 'bg-red-500',    shadow: 'shadow-red-500/5 hover:shadow-red-500/20' },
    gold:   { border: 'hover:border-amber-500/50 hover:bg-amber-500/5',  bg: 'bg-amber-500/10',  text: 'text-amber-500',  dot: 'bg-amber-500',  shadow: 'shadow-amber-500/5 hover:shadow-amber-500/20' },
  };

  // Only show active services on the public page
  const activeServices = data.services.filter((s) => s.active !== false);

  // Extract @username from instagram URL
  const igUrl = data.contact.instagram || 'https://www.instagram.com/raqservicios';
  const igUsername = igUrl.replace(/\/$/, '').split('/').pop() || 'raqservicios';

  // Use Base64 logo from DB (persists across Railway deploys), fallback to static /logo.png
  const logoSrc: string = data.logoBase64 || '/logo.png';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-orange-500/30">
      
      {/* GLOBAL CSS para la animacion del Hero */}
      <style>{`
        @keyframes neonPulse {
          0%, 100% { 
            box-shadow: 0 0 8px rgba(249,115,22,0.4), 0 0 20px rgba(249,115,22,0.2), inset 0 0 8px rgba(249,115,22,0.1);
            border-color: rgba(249,115,22,0.4);
          }
          50% { 
            box-shadow: 0 0 16px rgba(249,115,22,0.8), 0 0 40px rgba(249,115,22,0.4), 0 0 60px rgba(249,115,22,0.15), inset 0 0 16px rgba(249,115,22,0.2);
            border-color: rgba(249,115,22,0.9);
          }
        }
        @keyframes textNeonPulse {
          0%, 100% { text-shadow: 0 0 8px rgba(249,115,22,0.6), 0 0 20px rgba(249,115,22,0.3); }
          50% { text-shadow: 0 0 16px rgba(249,115,22,1), 0 0 40px rgba(249,115,22,0.6), 0 0 60px rgba(249,115,22,0.3); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .neon-badge {
          animation: neonPulse 2s ease-in-out infinite;
        }
        .neon-text {
          animation: textNeonPulse 2s ease-in-out infinite;
        }
        .gradient-text-animated {
          background-size: 300% auto;
          animation: gradientShift 4s linear infinite;
        }
      `}</style>

      {/* WHATSAPP FLOATING BUTTON */}
      <a 
        href={`https://wa.me/${data.contact.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-[100] bg-[#25d366] text-white p-4 rounded-full shadow-2xl shadow-[#25d366]/40 hover:scale-110 transition-all active:scale-95 group"
      >
        <MessageCircle size={32} />
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
          ¿En qué podemos ayudarte?
        </span>
      </a>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-white/5 bg-black/60">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-16 py-1">
              <img 
                src={logoSrc} 
                alt="RAQ Servicios" 
                className="h-full w-auto object-contain drop-shadow-[0_0_12px_rgba(249,115,22,0.5)]"
              />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-10 text-sm font-black uppercase tracking-[0.15em] text-white">
            <a href="#servicios" className="hover:text-orange-500 transition-colors">Servicios</a>
            <a href="#experiencia" className="hover:text-purple-500 transition-colors">Portafolio</a>
            <a href="#contacto" className="hover:text-orange-500 transition-colors">Ubicación</a>
            <Link 
              href="/admin" 
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-orange-600 hover:border-orange-500 text-white transition-all group text-sm"
            >
              <Lock size={14} className="group-hover:text-white" />
              <span>ACCESO</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative">
        {/* HERO SECTION */}
        <section className="relative pt-20 pb-20 px-6 overflow-hidden min-h-[75vh] flex items-center">
          <div className="absolute inset-0 z-0">
            <img 
              src="/hero-bg.png" 
              alt="RAQ Tech Background" 
              className="w-full h-full object-cover opacity-50 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]"></div>
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          <div className="max-w-7xl mx-auto text-center relative z-10">
            {/* NEON BADGE - with pulsing animation */}
            <div className="neon-badge inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500/10 border border-orange-500/40 text-orange-400 text-xs font-black tracking-widest uppercase mb-10">
              <Zap size={14} className="animate-pulse" />
              <span className="neon-text">+23 Años de Experiencia</span>
            </div>
            
            <h1 className="font-display text-6xl md:text-9xl font-black mb-8 tracking-tighter leading-[0.85] text-white">
              {data.hero.title} <br />
              <span className="bg-gradient-to-r from-orange-500 via-purple-500 to-orange-500 bg-clip-text text-transparent italic gradient-text-animated px-6 pb-2 box-decoration-clone">
                {data.hero.highlight}
              </span>
            </h1>
            
            <p className="max-w-3xl mx-auto text-lg md:text-2xl text-white mb-12 leading-relaxed font-medium">
              {data.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a 
                href={`https://wa.me/${data.contact.whatsapp}`} 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-widest text-sm shadow-2xl shadow-orange-600/30 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <MessageCircle size={20} />
                WhatsApp Directo
              </a>
              <a 
                href="#servicios"
                className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-3 group"
              >
                Nuestros Servicios
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </section>

        {/* SERVICES SECTION - Fully Dynamic */}
        <section id="servicios" className="py-32 px-6 bg-[#0a0a0a]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="font-display text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter italic">Integradores de Tecnología</h2>
              <div className="w-24 h-2 bg-gradient-to-r from-orange-500 to-purple-600 mx-auto rounded-full"></div>
              <p className="mt-8 text-white max-w-2xl mx-auto font-black italic text-xl">
                &ldquo;Lo que no sabemos lo aprendemos. Tu aliado estratégico en Margarita.&rdquo;
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {activeServices.map((service) => {
                const Icon = iconMap[service.icon] || Cpu;
                const cs = colorStyles[service.color] || colorStyles.orange;
                return (
                  <div key={service.id} className={`group p-10 rounded-[3rem] bg-[#111] border border-white/5 transition-all hover:-translate-y-3 ${cs.border} shadow-2xl ${cs.shadow}`}>
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform ${cs.bg} ${cs.text}`}>
                      <Icon size={32} />
                    </div>
                    <h3 className="font-display text-2xl font-black mb-6 text-white uppercase tracking-tight">{service.title}</h3>
                    <p className="text-white text-sm leading-relaxed mb-10 min-h-[80px]">
                      {service.description}
                    </p>
                    <ul className="space-y-4">
                      {service.items.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-4 text-xs font-bold text-white uppercase tracking-widest">
                          <div className={`w-1.5 h-1.5 rounded-full ${cs.dot}`}></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* INSTAGRAM SECTION */}
        <section id="experiencia" className="py-32 px-6 bg-black">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-10">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 text-orange-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4">
                  <Camera size={18} />
                  Sello de Calidad RAQ
                </div>
                <h2 className="font-display text-5xl md:text-7xl font-black tracking-tighter">
                  <span className="text-white">@</span>{igUsername}
                </h2>
              </div>
              <a 
                href={igUrl} 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-10 py-5 rounded-[2rem] bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-xl shadow-purple-600/30"
              >
                <Camera size={20} />
                Seguir en Instagram
              </a>
            </div>

            {/* 4 INSTAGRAM POST CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {data.instagramPosts.map((post, i) => {
                const postUrl = post.url || igUrl;
                const hasImage = post.imageUrl;
                return (
                  <a 
                    key={post.id || i} 
                    href={postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-square bg-[#0a0a0a] rounded-[2.5rem] border border-white/5 overflow-hidden relative group block hover:border-orange-500/30 transition-all hover:-translate-y-2"
                  >
                    {hasImage ? (
                      <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/10 group-hover:text-white/20 transition-colors">
                        <Camera size={60} strokeWidth={0.5} />
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-600/80 via-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className="absolute inset-x-0 bottom-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 flex flex-col items-center gap-1">
                      <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.2em] mb-1">
                        {post.caption || 'Ver Publicación'}
                      </span>
                      <span className="text-[8px] font-black text-white uppercase tracking-widest flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                        Instagram <ExternalLink size={10} />
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
            <p className="text-center text-white text-xs font-bold mt-8 uppercase tracking-widest">
              Visita nuestro Instagram para ver nuestros trabajos más recientes →
            </p>
          </div>
        </section>

        {/* MAP & LOCATION SECTION */}
        <section id="contacto" className="py-32 px-6 bg-gradient-to-b from-black to-[#0a0a0a]">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              <div className="flex flex-col justify-center">
                <h2 className="font-display text-5xl md:text-6xl font-black mb-10 tracking-tight leading-[1.1]">
                  Ubicados en el <br />
                  <span className="text-orange-500 uppercase italic underline decoration-purple-600/30 underline-offset-8">Corazón de Margarita</span>
                </h2>
                <div className="space-y-12">
                  <div className="flex gap-8">
                    <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 shrink-0 border border-orange-500/20">
                      <MapPin size={32} />
                    </div>
                    <div>
                      <h4 className="font-black text-2xl text-white uppercase tracking-tight mb-3">Nuestra Sede</h4>
                      <p className="text-white text-lg leading-relaxed mb-6">
                        {data.contact.address}
                      </p>
                      {data.contact.mapUrl && (
                        <a 
                          href={data.contact.mapUrl} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center gap-3 w-fit"
                        >
                          Abrir Google Maps <Zap size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* REAL GOOGLE MAP IFRAME */}
              <div className="h-[500px] lg:h-[650px] rounded-[4rem] bg-[#111] border border-white/5 overflow-hidden relative shadow-2xl group">
                {data.contact.mapUrl && data.contact.mapUrl.includes('google.com/maps') ? (
                  <iframe 
                    src={data.contact.mapUrl} 
                    className="w-full h-full grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center opacity-20">
                      <MapPin size={120} className="mx-auto mb-6 text-orange-500 animate-bounce" />
                      <span className="font-black text-4xl tracking-tighter uppercase text-white/20 block">Nueva Esparta</span>
                    </div>
                  </div>
                )}
                <div className="absolute inset-x-8 bottom-8 p-10 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl pointer-events-none group-hover:translate-y-full transition-transform duration-500">
                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] block mb-4">Sede Operativa</span>
                  <p className="text-white font-black text-3xl tracking-tighter italic">RAQ Servicios</p>
                  <p className="text-white font-bold mt-2 uppercase tracking-widest text-[10px]">Visítanos de Lunes a Viernes</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-16">
          <div className="flex flex-col items-center md:items-start gap-6">
            <div className="h-12">
              <img src={logoSrc} alt="Logo RAQ" className="h-full w-auto object-contain" style={{ filter: 'drop-shadow(0 0 8px rgba(249,115,22,0.3))' }} />
            </div>
            <div className="text-white text-[10px] font-black uppercase tracking-[0.3em] text-center md:text-left leading-loose">
              © {new Date().getFullYear()} RAQ Servicios. <br />
              Tecnología de Vanguardia • Margarita • Venezuela.
            </div>
          </div>
          
          <div className="flex items-center gap-10">
            <a href={igUrl} target="_blank" rel="noopener noreferrer" className="text-white hover:text-pink-500 transition-all hover:scale-125">
              <Camera size={28} />
            </a>
            <a href={`https://wa.me/${data.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-white hover:text-green-500 transition-all hover:scale-125">
              <MessageCircle size={28} />
            </a>
            <div className="h-12 w-[1px] bg-white/10 mx-2"></div>
            <Link href="/admin" className="text-[10px] font-black tracking-[0.3em] text-white hover:text-white uppercase transition-all border border-white/10 px-6 py-3 rounded-xl hover:bg-white/5 flex items-center gap-2">
              <Lock size={12} />
              Portal Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
