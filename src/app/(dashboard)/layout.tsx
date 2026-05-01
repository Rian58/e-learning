export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/actions/user-actions";
import { DashboardLayout } from "@/components/layout";
import { redirect } from "next/navigation";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Removed role-based redirects here so shared routes like /profile under (dashboard) remain accessible to all roles.
  // Individual pages (like /dashboard, /courses) will handle their own role checks.

  return <DashboardLayout user={user}>{children}</DashboardLayout>;
}
