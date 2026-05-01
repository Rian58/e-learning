import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";
import { logout } from "@/actions/auth-actions";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopbarProps {
  user: UserProfile | null;
}

export function Topbar({ user }: TopbarProps) {
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 justify-between md:justify-end">
        <div className="md:hidden flex items-center">
            <h2 className="text-xl font-bold tracking-tight text-primary">
              Stack<span className="text-foreground">Sinau</span>
            </h2>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden flex-col items-end sm:flex border-r pr-4 mr-2">
                <span className="text-sm font-bold leading-none">{user.name}</span>
                <span className="text-xs font-semibold text-primary mt-1">{user.role}</span>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger className="relative h-10 w-10 rounded-full neo-button p-0 overflow-hidden ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                    <Avatar className="h-full w-full">
                      <AvatarImage src={user.avatarUrl || ''} alt={user.name} />
                      <AvatarFallback className="font-bold bg-primary text-primary-foreground">{initials}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 neo-card" align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold leading-none">{user.name}</p>
                        <p className="text-xs font-medium leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <Link href="/profile" className="w-full">
                    <DropdownMenuItem className="cursor-pointer font-medium flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profil</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem className="cursor-pointer p-0 font-medium text-destructive focus:bg-destructive focus:text-destructive-foreground">
                    <form action={async () => { "use server"; await logout(); }} className="w-full">
                      <button className="flex w-full items-center px-2 py-1.5 focus:outline-none">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Keluar</span>
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/login">
                <Button variant="outline">Masuk</Button>
              </Link>
              <Link href="/register">
                <Button>Daftar</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
