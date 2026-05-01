import { requireUser } from "@/actions/user-actions";
import { ProfileForm } from "./profile-form";
import { Settings, UserCircle } from "lucide-react";

export const metadata = {
  title: "Profil Pengguna - Stack Sinau",
};

export default async function ProfilePage() {
  const user = await requireUser();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
          <Settings className="h-8 w-8 text-primary" />
          Pengaturan Profil
        </h1>
        <p className="text-muted-foreground font-medium mt-1">
          Kelola informasi pribadi dan keamanan akun Anda.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <div className="flex flex-col items-center p-6 bg-accent rounded-xl neo-border border-2 text-center text-accent-foreground">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full neo-border border-2 mb-4 bg-background" />
            ) : (
              <UserCircle className="w-24 h-24 text-muted-foreground/50 mb-4 bg-background rounded-full neo-border border-2" />
            )}
            <h3 className="font-bold text-lg">{user.name}</h3>
            <p className="text-sm font-medium opacity-80">{user.email}</p>
            <div className="mt-4 px-3 py-1 bg-background text-foreground text-xs font-bold rounded-full border-2 neo-border">
              Role: {user.role}
            </div>
          </div>
          
          <div className="p-4 bg-primary/10 rounded-xl neo-border border-2 border-primary/20 text-sm font-medium">
            <p className="text-primary font-bold mb-1">Informasi Akun</p>
            <p>Akun Anda secara otomatis terhubung dengan keamanan Supabase Authentication. Perubahan kata sandi akan menggantikan kata sandi Anda yang sebelumnya.</p>
          </div>
        </div>

        <div className="md:col-span-2">
          <ProfileForm initialUser={{ name: user.name, email: user.email }} />
        </div>
      </div>
    </div>
  );
}
