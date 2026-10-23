import { redirect } from "next/navigation";
import { getCurrentUser, hasPermission } from "@/lib/auth";
import { getDashboardStats } from "@/lib/admin-data";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!hasPermission(user, "dashboard.view")) {
    redirect("/admin/akses-terbatas");
  }

  const stats = getDashboardStats();

  return (
    <AdminShell
      user={user}
      newMessages={hasPermission(user, "messages.view") ? stats.newMessages : 0}
    >
      {children}
    </AdminShell>
  );
}
