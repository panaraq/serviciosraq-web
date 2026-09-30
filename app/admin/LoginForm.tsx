'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login } from '@/actions/auth.actions';

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await login(new FormData(e.currentTarget));
      if (result.success) {
        router.push('/admin/editor');
        router.refresh();
        return;
      }
      setError(result.error || 'No se pudo entrar.');
    } catch {
      setError('No se pudo validar la clave: error del servidor.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-4">
          <img src="/logo.png" alt="RAQ Servicios" className="h-16 w-auto mx-auto object-contain drop-shadow-[0_0_12px_rgba(249,115,22,0.5)]" />
          <h1 className="font-display text-4xl font-black tracking-tighter text-white">Editor de la web</h1>
          <p className="text-gray-500 font-medium">Ingresa la clave de acceso para editar la página de RAQ Servicios.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#111] border border-white/5 p-10 rounded-[2.5rem] shadow-2xl space-y-6">
          <div className="space-y-2">
            <label htmlFor="password" className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Clave de acceso</label>
            <input
              id="password"
              name="password"
              type="password"
              autoFocus
              required
              className="w-full bg-black border-2 border-white/10 rounded-2xl px-6 py-4 outline-none text-white focus:border-orange-500 transition-all font-mono text-xl text-center tracking-widest"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold p-4 rounded-xl text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-2xl shadow-xl shadow-orange-600/20 active:scale-95 transition-all text-lg tracking-tighter disabled:opacity-50"
          >
            {loading ? 'Validando...' : 'Entrar al editor'}
          </button>
        </form>

        <div className="flex items-center justify-center gap-6 text-[10px] font-black uppercase tracking-[0.3em]">
          <Link href="/" className="text-gray-600 hover:text-white transition-colors">← Volver a la web</Link>
          <a href="https://raqtools.com" className="text-gray-600 hover:text-orange-500 transition-colors">Ir a RAQtools →</a>
        </div>
      </div>
    </div>
  );
}
