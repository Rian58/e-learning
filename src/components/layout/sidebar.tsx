"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import { Leaf } from "lucide-react";
import { IconMap } from "@/components/icon-map";
import { UserRole } from "@prisma/client";

interface SidebarProps {
  role: UserRole;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  
  // Determine which nav items to show
  let items: readonly { href: string; label: string; icon: string }[] = NAV_ITEMS.mahasiswa;
  if (role === "DOSEN") items = NAV_ITEMS.dosen;
  if (role === "SUPER_ADMIN") items = NAV_ITEMS.admin;

  const activeItem = items.reduce((bestMatch, current) => {
    if (pathname === current.href || pathname.startsWith(current.href + "/")) {
      if (!bestMatch || current.href.length > bestMatch.href.length) {
        return current;
      }
    }
    return bestMatch;
  }, null as typeof items[number] | null);

  const isItemActive = (item: typeof items[number]) => {
    if (activeItem) return item.href === activeItem.href;
    return pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full border-r bg-sidebar pt-16 transition-transform md:translate-x-0 neo-border md:z-0 select-none">
      <div className="flex h-full flex-col overflow-y-auto px-3 py-4">
        <div className="mb-6 px-3">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-yellow-400" strokeWidth={3} />
            <h2 className="text-xl font-bold tracking-tight text-primary">
              Stack<span className="text-foreground">Sinau</span>
            </h2>
          </div>
          <p className="text-xs font-semibold text-muted-foreground mt-1">
            {role.charAt(0) + role.slice(1).toLowerCase()} Portal
          </p>
        </div>
        
        <ul className="space-y-2 font-medium">
          {items.map((item) => {
            const IconComponent = IconMap[item.icon];
            const isActive = isItemActive(item);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-lg p-3 mx-1 transition-all group neo-button hover:translate-x-1 hover:translate-y-1 hover:shadow-none hover:bg-primary/10",
                    isActive 
                      ? "bg-primary text-primary-foreground neo-shadow-sm shadow-none translate-x-[2px] translate-y-[2px]" 
                      : "text-foreground bg-background hover:border-primary"
                  )}
                >
                  <IconComponent className={cn("h-5 w-5", isActive ? "text-primary-foreground" : "text-primary transition duration-75 group-hover:text-primary")} />
                  <span className="ml-3 font-bold">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        
        <div className="mt-auto px-1 pt-6 pb-2">
            <div className="rounded-lg neo-card bg-accent p-4">
               <h3 className="font-bold text-sm">Butuh Bantuan?</h3>
               <p className="text-xs text-muted-foreground font-medium mt-1">Cek dokumentasi atau hubungi tim bantuan.</p>
            </div>
        </div>
      </div>
    </aside>
  );
}
