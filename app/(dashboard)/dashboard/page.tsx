import { redirect } from 'next/navigation';
import { getWorkspaceData } from '@/actions/workspace';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const workspace = await getWorkspaceData();
  redirect(`/${workspace.slug}/dashboard`);
}