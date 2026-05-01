import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { MobileNav } from "./mobile-nav";
import { Chatbot } from "@/components/chatbot";
import { UserProfile } from "@/types";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: UserProfile | null;
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const role = user?.role || "MAHASISWA";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Topbar user={user} />
      <Sidebar role={role} />
      
      <div className="p-4 sm:p-6 md:p-8 pt-20 md:pt-24 pb-20 md:pb-8 md:ml-64 transition-all duration-300 ease-in-out">
        <main className="mx-auto max-w-7xl animate-in fade-in zoom-in-95 duration-500">
          {children}
        </main>
      </div>

      <MobileNav role={role} />
      <Chatbot isAuthenticated userName={user?.name} />
    </div>
  );
}
