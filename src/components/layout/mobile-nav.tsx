"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import { IconMap } from "@/components/icon-map";
import { UserRole } from "@prisma/client";

interface MobileNavProps {
  role: UserRole;
}

export function MobileNav({ role }: MobileNavProps) {
  const pathname = usePathname();

  let items: readonly { href: string; label: string; icon: string }[] = NAV_ITEMS.mahasiswa;
  if (role === "DOSEN") items = NAV_ITEMS.dosen;
  if (role === "SUPER_ADMIN") items = NAV_ITEMS.admin;

  const displayItems = items.filter((item) => item.href !== "/profile");

  const activeItem = displayItems.reduce((bestMatch, current) => {
    if (pathname === current.href || pathname.startsWith(current.href + "/")) {
      if (!bestMatch || current.href.length > bestMatch.href.length) {
        return current;
      }
    }
    return bestMatch;
  }, null as typeof displayItems[number] | null);

  return (
    <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-14 bg-background/95 backdrop-blur border-t border-border/50 flex items-center justify-around px-4 pb-safe">
      {displayItems.map((item) => {
        const IconComponent = IconMap[item.icon];
        
        let isActive = false;
        if (activeItem) {
          isActive = item.href === activeItem.href;
        } else {
          isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-colors",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {IconComponent && <IconComponent className={cn("h-5 w-5", isActive && "fill-primary/20")} strokeWidth={isActive ? 2.5 : 2} />}
            {isActive && <span className="w-1 h-1 rounded-full bg-primary" />}
          </Link>
        );
      })}
    </div>
  );
}
