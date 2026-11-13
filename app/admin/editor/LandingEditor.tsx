'use client';

// Editor del contenido de la web (traído desde RAQtools /superadmin/landing, sesión 2026-09-30).

import React, { useState, useEffect, useRef } from 'react';
import { getLandingData, updateLandingData } from '@/actions/landing.actions';
import {
  Save, Loader2, Globe, Camera, Zap, Laptop, ShieldCheck,
  Wifi, Upload, Monitor, Server, Database, Cpu, Smartphone,
  Eye, EyeOff, ChevronDown,
  Printer, HardDrive, Router, Wrench, Headphones,
  Cable, CircuitBoard, Plug, ScanLine, Cctv,
  type LucideIcon,
} from 'lucide-react';
import { DEFAULT_DATA, type LandingData, type LandingService } from '@/lib/landing-defaults';

// All available icons for service cards
const ICON_OPTIONS = [
  { value: 'Laptop',      label: 'Laptop',              Icon: Laptop },
  { value: 'Monitor',     label: 'PC / Escritorio',     Icon: Monitor },
  { value: 'Smartphone',  label: 'Smartphone / Móvil',  Icon: Smartphone },
  { value: 'ShieldCheck', label: 'Seguridad / Shield',   Icon: ShieldCheck },
  { value: 'Cctv',        label: 'CCTV / Vigilancia',    Icon: Cctv },
  { value: 'Wifi',        label: 'WiFi / Fibra',         Icon: Wifi },
  { value: 'Router',      label: 'Router / Internet',    Icon: Router },
  { value: 'Camera',      label: 'Cámara / Foto',        Icon: Camera },
  { value: 'Cpu',         label: 'CPU / Procesador',     Icon: Cpu },
  { value: 'CircuitBoard',label: 'Electrónica / Placa',  Icon: CircuitBoard },
  { value: 'Server',      label: 'Servidor / Rack',      Icon: Server },
  { value: 'Database',    label: 'Base de datos / TI',   Icon: Database },
  { value: 'Printer',     label: 'Impresora',            Icon: Printer },
  { value: 'HardDrive',   label: 'Disco / Almacenamiento', Icon: HardDrive },
  { value: 'Wrench',      label: 'Reparación / Taller',  Icon: Wrench },
  { value: 'Headphones',  label: 'Audio / Soporte',      Icon: Headphones },
  { value: 'Cable',       label: 'Cableado / Instalación', Icon: Cable },
  { value: 'Plug',        label: 'Energía / UPS',        Icon: Plug },
  { value: 'ScanLine',    label: 'Punto de Venta / POS', Icon: ScanLine },
];

const ICON_MAP: Record<string, LucideIcon> = {
  Laptop, ShieldCheck, Wifi, Camera, Cpu, Monitor, Smartphone, Server, Database,
  Printer, HardDrive, Router, Wrench, Headphones, Cable, CircuitBoard, Plug, ScanLine, Cctv,
};

// Toggle switch component
function Toggle({ active, onChange }: { active: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!active)}
      className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none ${
        active ? 'bg-orange-500 shadow-lg shadow-orange-500/30' : 'bg-white/10'
      }`}
    >
      <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${
        active ? 'left-8' : 'left-1'
      }`} />
    </button>
  );
}

export default function LandingEditor() {
  const [data, setData] = useState<LandingData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [logoPreview, setLogoPreview] = useState<string>('/servicios-raq.png');
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getLandingData().then((res) => {
      setData(res);
      if (res?.logoBase64) setLogoPreview(res.logoBase64);
      setLoading(false);
    });
  }, []);

  const handleLogoUpload = async (file: File) => {
    if (!file) return;
    setUploadingLogo(true);
    const reader = new FileReader();
    reader.onload = (e) => setLogoPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append('logo', file);
    try {
      const res = await fetch('/api/upload-logo', { method: 'POST', body: formData });
      const result = await res.json();
      if (result.success) {
        if (result.dataUrl) {
          setLogoPreview(result.dataUrl);
          // FIX: sync logoBase64 into data so "Guardar Cambios" preserves it
          setData((prev) => ({ ...prev, logoBase64: result.dataUrl }));
        }
        setMessage('✅ Logo guardado permanentemente en la base de datos.');
        setTimeout(() => setMessage(''), 5000);
      } else {
        setMessage(`❌ ${result.error}`);
      }
    } catch {
      setMessage('❌ Error de conexión al subir el logo.');
    }
    setUploadingLogo(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateLandingData(data);
    if (res.success) {
      setMessage('✅ ¡Configuración guardada con éxito!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(`❌ ${res.error || 'Error al guardar.'}`);
    }
    setSaving(false);
  };

  const updateService = <K extends keyof LandingService>(index: number, field: K, value: LandingService[K]) => {
    const newServices = [...data.services];
    newServices[index] = { ...newServices[index], [field]: value };
    setData({ ...data, services: newServices });
  };

  const updateServiceItem = (sIdx: number, iIdx: number, value: string) => {
    const newServices = [...data.services];
    const newItems = [...newServices[sIdx].items];
    newItems[iIdx] = value;
    newServices[sIdx] = { ...newServices[sIdx], items: newItems };
    setData({ ...data, services: newServices });
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="animate-spin text-orange-500" size={40} />
    </div>
  );

  const activeCount = data.services.filter((s) => s.active !== false).length;

  return (
    <div className="p-6 max-w-6xl mx-auto pb-40">

      {/* ── STICKY HEADER ── */}
      <div className="flex items-center justify-between mb-10 sticky top-14 bg-[#0a0a0a]/90 backdrop-blur-md py-4 z-40 border-b border-white/5">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Editor de Web Pública</h1>
          <p className="text-gray-500 text-xs mt-1">
            <span className="text-orange-500 font-black">{activeCount}</span> de {data.services?.length || 0} servicios activos en la web
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest transition-all disabled:opacity-50 shadow-xl shadow-orange-600/20 active:scale-95"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl mb-6 font-bold text-center text-sm ${
          message.includes('❌') ? 'bg-red-500/20 text-red-400 border border-red-500/30'
          : 'bg-green-500/20 text-green-400 border border-green-500/30'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-16">

        {/* ══════════════════════════════ LOGO ══════════════════════════════ */}
        <section className="space-y-4">
          <SectionTitle icon={<Upload size={16} />} color="orange" label="Logo de la Empresa" />
          <div className="p-8 rounded-[2rem] bg-[#111] border border-white/5 space-y-6">
            <div className="flex flex-col md:flex-row items-start gap-10">
              {/* Preview */}
              <div
                className="w-56 h-28 rounded-2xl bg-black border-2 border-dashed border-white/10 flex items-center justify-center relative overflow-hidden cursor-pointer group hover:border-orange-500/40 transition-all shrink-0"
                onClick={() => logoInputRef.current?.click()}
              >
                <img src={logoPreview} alt="Logo" className="h-full w-full object-contain p-2" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-xs font-black uppercase flex items-center gap-2"><Upload size={14} />Cambiar</span>
                </div>
                {uploadingLogo && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <Loader2 className="animate-spin text-orange-500" size={28} />
                  </div>
                )}
              </div>

              {/* Info + button */}
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="font-black text-white text-lg mb-1">Actualizar Logo</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Sube tu logo en formato <strong className="text-white">PNG con fondo transparente</strong>.
                    También se acepta JPG o WEBP.
                  </p>
                </div>

                {/* ⚠️ NOTA IMPORTANTE */}
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 text-sm">
                  <span className="text-orange-400 font-black uppercase tracking-widest text-[10px] block mb-1">⚠️ Nota importante</span>
                  <p className="text-orange-300/80 text-xs leading-relaxed">
                    El archivo <strong className="text-orange-300">no debe superar 2MB</strong> para que se guarde correctamente en la base de datos.
                    Tu logo actual pesa ~30KB, estás muy lejos del límite 👍
                  </p>
                </div>

                <div className="flex gap-4 items-center">
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="flex items-center gap-2 bg-white/5 hover:bg-orange-600 border border-white/10 hover:border-orange-500 text-white px-5 py-2.5 rounded-xl font-black uppercase tracking-widest text-sm transition-all disabled:opacity-50"
                  >
                    <Upload size={14} />
                    {uploadingLogo ? 'Subiendo...' : 'Seleccionar Archivo'}
                  </button>
                  <a href="/" target="_blank" className="text-gray-600 hover:text-white text-xs font-black uppercase tracking-widest transition-all">
                    Ver sitio →
                  </a>
                </div>
                <p className="text-[10px] text-gray-700 font-bold uppercase tracking-widest">
                  El logo se guarda en Postgres y persiste entre deployments de Railway
                </p>
              </div>
            </div>
            <input
              ref={logoInputRef} type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f); }}
            />
          </div>
        </section>

        {/* ══════════════════════════════ HERO ══════════════════════════════ */}
        <section className="space-y-4">
          <SectionTitle icon={<Globe size={16} />} color="orange" label="Sección Principal (Hero)" />
          <div className="p-8 rounded-[2rem] bg-[#111] border border-white/5 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Título Principal">
                <input
                  type="text" value={data.hero.title}
                  onChange={(e) => setData({ ...data, hero: { ...data.hero, title: e.target.value } })}
                  className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-orange-500 outline-none transition-all"
                />
              </Field>
              <Field label="Texto Resaltado (Itálico naranja→morado)">
                <input
                  type="text" value={data.hero.highlight}
                  onChange={(e) => setData({ ...data, hero: { ...data.hero, highlight: e.target.value } })}
                  className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-orange-500 outline-none transition-all"
                />
              </Field>
            </div>
            <Field label="Subtítulo de Bienvenida">
              <textarea
                rows={3} value={data.hero.subtitle}
                onChange={(e) => setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } })}
                className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-orange-500 outline-none transition-all resize-none"
              />
            </Field>
          </div>
        </section>

        {/* ══════════════════════════════ SERVICES ══════════════════════════════ */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <SectionTitle icon={<Zap size={16} />} color="purple" label="Nuestros Servicios (9 Tarjetas)" />
            <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
              {activeCount} activas · {(data.services?.length || 0) - activeCount} ocultas
            </span>
          </div>
          <p className="text-gray-600 text-xs">
            Activa o desactiva cada tarjeta individualmente. Solo las activas aparecen en la web pública (de 3 en 3).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {data.services.map((service, sIdx) => {
              const Icon = ICON_MAP[service.icon] || Laptop;
              const isActive = service.active !== false;
              return (
                <div
                  key={service.id}
                  className={`rounded-[2rem] border transition-all duration-300 overflow-hidden ${
                    isActive
                      ? 'bg-[#111] border-orange-500/20 shadow-lg shadow-orange-500/5'
                      : 'bg-[#0d0d0d] border-white/5 opacity-60'
                  }`}
                >
                  {/* Card header: toggle + number + icon */}
                  <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl transition-colors ${
                        isActive
                          ? service.color === 'purple' ? 'bg-purple-500/15 text-purple-400'
                            : service.color === 'blue' ? 'bg-blue-500/15 text-blue-400'
                            : service.color === 'green' ? 'bg-emerald-500/15 text-emerald-400'
                            : service.color === 'red' ? 'bg-red-500/15 text-red-400'
                            : service.color === 'gold' ? 'bg-amber-500/15 text-amber-400'
                            : 'bg-orange-500/15 text-orange-400'
                          : 'bg-white/5 text-gray-600'
                      }`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest block">Tarjeta #{sIdx + 1}</span>
                        <span className={`text-[10px] font-black uppercase tracking-wider ${isActive ? 'text-green-500' : 'text-gray-700'}`}>
                          {isActive ? '● Visible' : '○ Oculta'}
                        </span>
                      </div>
                    </div>
                    <Toggle active={isActive} onChange={(v) => updateService(sIdx, 'active', v)} />
                  </div>

                  {/* Card body */}
                  <div className="p-5 space-y-4">
                    {/* Icon + Color selectors */}
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Ícono">
                        <select
                          value={service.icon}
                          onChange={(e) => updateService(sIdx, 'icon', e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-orange-500 outline-none transition-all"
                        >
                          {ICON_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Color">
                        <select
                          value={service.color}
                          onChange={(e) => updateService(sIdx, 'color', e.target.value)}
                          className="w-full bg-black border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-orange-500 outline-none transition-all"
                        >
                          <option value="orange">🟠 Naranja</option>
                          <option value="purple">🟣 Morado</option>
                          <option value="blue">🔵 Azul</option>
                          <option value="green">🟢 Verde</option>
                          <option value="red">🔴 Rojo</option>
                          <option value="gold">🟡 Dorado</option>
                        </select>
                      </Field>
                    </div>

                    {/* Title */}
                    <Field label="Nombre del Servicio">
                      <input
                        type="text" value={service.title}
                        onChange={(e) => updateService(sIdx, 'title', e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm text-white focus:border-orange-500 outline-none transition-all"
                      />
                    </Field>

                    {/* Description */}
                    <Field label="Descripción">
                      <textarea
                        rows={3} value={service.description}
                        onChange={(e) => updateService(sIdx, 'description', e.target.value)}
                        className="w-full bg-black border border-white/10 rounded-lg p-3 text-xs text-gray-400 focus:border-orange-500 outline-none transition-all resize-none"
                      />
                    </Field>

                    {/* Items */}
                    <Field label="Bullet Points (3 items)">
                      <div className="space-y-2">
                        {(service.items || []).map((item: string, iIdx: number) => (
                          <input
                            key={iIdx} type="text" value={item}
                            onChange={(e) => updateServiceItem(sIdx, iIdx, e.target.value)}
                            placeholder={`Item ${iIdx + 1}`}
                            className="w-full bg-black border border-white/5 rounded-lg p-2 text-[11px] text-gray-300 focus:border-orange-500 outline-none transition-all"
                          />
                        ))}
                      </div>
                    </Field>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ══════════════════════════════ INSTAGRAM POSTS ══════════════════════════════ */}
        <section className="space-y-4">
          <SectionTitle icon={<Camera size={16} />} color="purple" label="Publicaciones de Instagram (Portafolio)" />
          <p className="text-gray-600 text-xs">
            Personaliza las 4 tarjetas que aparecen en la sección de Instagram. Puedes poner el link directo y subir una imagen de portada.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.instagramPosts.map((post, pIdx) => (
              <div key={post.id} className="p-6 rounded-[2rem] bg-[#111] border border-white/5 space-y-4 group hover:border-purple-500/30 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Publicación #{pIdx + 1}</span>
                </div>

                {/* Image Preview / Upload */}
                <div 
                  className="aspect-square rounded-2xl bg-black border border-white/10 flex items-center justify-center relative overflow-hidden cursor-pointer group/img hover:border-purple-500/50 transition-all"
                  onClick={() => {
                    const input = document.getElementById(`post-img-${pIdx}`) as HTMLInputElement;
                    input?.click();
                  }}
                >
                  {post.imageUrl ? (
                    <img src={post.imageUrl} alt={`Post ${pIdx + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4">
                      <Camera size={32} className="mx-auto mb-2 text-gray-700 group-hover/img:text-purple-500 transition-colors" />
                      <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Subir Portada</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-[10px] font-black uppercase flex items-center gap-2"><Upload size={14} />Cambiar</span>
                  </div>
                </div>

                <input 
                  id={`post-img-${pIdx}`}
                  type="file" 
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      const base64 = ev.target?.result as string;
                      const newPosts = [...data.instagramPosts];
                      newPosts[pIdx] = { ...newPosts[pIdx], imageUrl: base64 };
                      setData({ ...data, instagramPosts: newPosts });
                    };
                    reader.readAsDataURL(file);
                  }}
                />

                <Field label="Link de la Publicación">
                  <input
                    type="text" value={post.url}
                    placeholder="https://instagram.com/p/..."
                    onChange={(e) => {
                      const newPosts = [...data.instagramPosts];
                      newPosts[pIdx] = { ...newPosts[pIdx], url: e.target.value };
                      setData({ ...data, instagramPosts: newPosts });
                    }}
                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none transition-all"
                  />
                </Field>

                <Field label="Texto Descriptivo">
                  <input
                    type="text" value={post.caption}
                    placeholder="Ej: Instalación de Fibra"
                    onChange={(e) => {
                      const newPosts = [...data.instagramPosts];
                      newPosts[pIdx] = { ...newPosts[pIdx], caption: e.target.value };
                      setData({ ...data, instagramPosts: newPosts });
                    }}
                    className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs text-white focus:border-purple-500 outline-none transition-all"
                  />
                </Field>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════ CONTACT ══════════════════════════════ */}
        <section className="space-y-4">
          <SectionTitle icon={<Globe size={16} />} color="orange" label="Contacto, Redes y Ubicación" />
          <div className="p-8 rounded-[2.5rem] bg-[#111] border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Field label="WhatsApp (Ej: 584120000000)">
              <input
                type="text" value={data.contact.whatsapp}
                onChange={(e) => setData({ ...data, contact: { ...data.contact, whatsapp: e.target.value } })}
                className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-orange-500 outline-none transition-all"
              />
            </Field>
            <Field label="Link de Instagram Perfil">
              <input
                type="text" value={data.contact.instagram}
                onChange={(e) => setData({ ...data, contact: { ...data.contact, instagram: e.target.value } })}
                className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-orange-500 outline-none transition-all"
              />
            </Field>
            <Field label="Dirección Escrita">
              <input
                type="text" value={data.contact.address}
                onChange={(e) => setData({ ...data, contact: { ...data.contact, address: e.target.value } })}
                className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-orange-500 outline-none transition-all"
              />
            </Field>
            <Field label="URL Google Maps (Iframe Src)" hint="En Google Maps: Compartir → Insertar Mapa → copia el valor de 'src'">
              <input
                type="text" value={data.contact.mapUrl}
                placeholder="https://www.google.com/maps/embed?..."
                onChange={(e) => setData({ ...data, contact: { ...data.contact, mapUrl: e.target.value } })}
                className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:border-orange-500 outline-none transition-all"
              />
            </Field>
          </div>
        </section>

      </form>
    </div>
  );
}

/* ── Helpers ── */
function SectionTitle({ icon, color, label }: { icon: React.ReactNode; color: 'orange' | 'purple'; label: string }) {
  return (
    <div className={`flex items-center gap-2 font-black uppercase tracking-widest text-sm ${color === 'orange' ? 'text-orange-500' : 'text-purple-500'}`}>
      {icon}
      {label}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">{label}</label>
      {children}
      {hint && <p className="text-[9px] text-gray-700">{hint}</p>}
    </div>
  );
}
