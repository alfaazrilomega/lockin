import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardDribbbleClient } from "@/components/dashboard/DashboardDribbbleClient";
import { type User as AppUser } from "@/lib/types";
import { prisma } from '@/lib/prisma';
export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  const currentUser: AppUser = {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    avatarUrl: user.user_metadata?.avatar_url || null,
    createdAt: new Date(user.created_at),
    updatedAt: new Date(user.updated_at || user.created_at)
  }

  let salesContributors: any[] = [];
  let dbError = "";

  try {
    // Fetch real data from Prisma using $queryRaw to bypass cached Prisma Client missing property
    salesContributors = await prisma.$queryRaw`
      SELECT sc.*, json_build_object('name', u.name, 'id', u.id) as user
      FROM "sales_contributors" sc
      JOIN "users" u ON sc."user_id" = u.id
    `;

    // Ensure the user exists in the Prisma DB first
    await prisma.$executeRaw`
      INSERT INTO "users" ("id", "email", "name", "updated_at")
      VALUES (${user.id}, ${user.email || ''}, ${user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}, now())
      ON CONFLICT ("id") DO NOTHING
    `;

    if (!salesContributors || salesContributors.length === 0) {
      await prisma.$executeRaw`
        INSERT INTO "sales_contributors" ("id", "user_id", "revenue", "leadsBlack", "leadsGrey", "kpi", "winPct", "wlBlack", "wlGrey", "updated_at")
        VALUES (gen_random_uuid()::text, ${user.id}, 209633, 41, 118, 0.84, '31%', 12, 29, now())
      `;
      salesContributors = await prisma.$queryRaw`
        SELECT sc.*, json_build_object('name', u.name, 'id', u.id) as user
        FROM "sales_contributors" sc
        JOIN "users" u ON sc."user_id" = u.id
      `;
    }
  } catch (err: any) {
    dbError = err.message;
  }

  const plainContributors = JSON.parse(JSON.stringify(salesContributors));

  if (dbError) {
    return <div className="text-red-500 p-10 font-bold bg-white z-50">DB ERROR: {dbError}</div>;
  }


  return (
    <div className="w-full h-full">
      <DashboardDribbbleClient currentUser={currentUser} salesContributors={plainContributors} />
    </div>
  );
}