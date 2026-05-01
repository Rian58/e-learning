export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/actions/user-actions";
import { DashboardLayout } from "@/components/layout";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  return <DashboardLayout user={user}>{children}</DashboardLayout>;
}
