"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/actions/user-actions";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

export function ProfileForm({ initialUser }: { initialUser: { name: string; email: string } }) {
  const [name, setName] = useState(initialUser.name);
  const [email, setEmail] = useState(initialUser.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleUpdate = () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Nama dan Email tidak boleh kosong.");
      return;
    }

    if (password && password !== confirmPassword) {
      toast.error("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    if (password && password.length < 6) {
      toast.error("Kata sandi minimal 6 karakter.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await updateProfile({
          name: name !== initialUser.name ? name : undefined,
          email: email !== initialUser.email ? email : undefined,
          password: password ? password : undefined,
        });

        if (res.success) {
          toast.success("Profil berhasil diperbarui!");
          setPassword("");
          setConfirmPassword("");
        } else {
          toast.error(res.error || "Gagal memperbarui profil.");
        }
      } catch (e) {
        toast.error("Terjadi kesalahan sistem.");
      }
    });
  };

  return (
    <Card className="neo-card">
      <CardHeader>
        <CardTitle>Data Pribadi</CardTitle>
        <CardDescription>Ubah detail informasi Anda di bawah ini</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-1">
            <Label className="font-bold text-sm">Nama Lengkap</Label>
            <Input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Masukkan nama lengkap" 
              className="neo-input" 
            />
          </div>
          <div className="space-y-1">
            <Label className="font-bold text-sm">Email</Label>
            <Input 
              type="email"
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="Email valid" 
              className="neo-input" 
            />
          </div>

          <div className="my-6 border-t font-medium text-xs font-bold text-muted-foreground pt-4">KEAMANAN (Opsional)</div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="font-bold text-sm">Kata Sandi Baru</Label>
              <Input 
                type="password"
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Biarkan kosong jika tidak diubah" 
                className="neo-input" 
              />
            </div>
            <div className="space-y-1">
              <Label className="font-bold text-sm">Konfirmasi Sandi Baru</Label>
              <Input 
                type="password"
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                placeholder="Ketik ulang sandi baru" 
                className="neo-input" 
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleUpdate} 
            disabled={isPending || (!password && name === initialUser.name && email === initialUser.email)}
            className="neo-button font-bold gap-2"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Simpan Perubahan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
