import { ReactNode } from 'react';
import LogoutButton from './LogoutButton';

export default function EditorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans">
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/servicios-raq.png" alt="RAQ" className="h-7 w-auto object-contain" />
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Editor Web Pública</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              className="text-[10px] font-black text-gray-600 hover:text-orange-500 uppercase tracking-widest transition-colors"
            >
              Ver Sitio →
            </a>
            <a
              href="https://raqtools.com"
              className="text-[10px] font-black text-gray-600 hover:text-white uppercase tracking-widest transition-colors"
            >
              RAQtools
            </a>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
