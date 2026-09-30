'use client';

import { useRouter } from 'next/navigation';
import { logout } from '@/actions/auth.actions';

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await logout();
        router.push('/admin');
        router.refresh();
      }}
      className="text-[10px] font-black text-gray-600 hover:text-white uppercase tracking-widest transition-colors px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10"
    >
      Salir
    </button>
  );
}
