import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardDribbbleClient } from "@/components/dashboard/DashboardDribbbleClient";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/');
  }

  return (
    <div className="w-full h-full">
      <DashboardDribbbleClient />
    </div>
  );
}