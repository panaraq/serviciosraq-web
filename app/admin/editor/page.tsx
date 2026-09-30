import { redirect } from 'next/navigation';
import { hasEditorSession } from '@/lib/session';
import LandingEditor from './LandingEditor';

export const dynamic = 'force-dynamic';

export default async function EditorPage() {
  if (!(await hasEditorSession())) redirect('/admin');
  return <LandingEditor />;
}
