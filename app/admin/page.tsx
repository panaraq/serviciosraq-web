import { redirect } from 'next/navigation';
import { hasEditorSession } from '@/lib/session';
import LoginForm from './LoginForm';

export const dynamic = 'force-dynamic';

// Entrada al editor de la web ("Acceso" / "Portal Admin" en la página pública).
export default async function AdminLoginPage() {
  if (await hasEditorSession()) redirect('/admin/editor');
  return <LoginForm />;
}
