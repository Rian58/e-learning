"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { createUser, updateUser, deleteUser } from "@/actions/admin-actions";
import { UserPlus, Trash2, Loader2, Pencil, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { SearchInput } from "@/components/search-input";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

interface AdminUserTableProps {
  users: AdminUser[];
  currentUserId: string;
  currentPage: number;
  totalPages: number;
  totalUsers: number;
}

type UserRole = "MAHASISWA" | "DOSEN" | "SUPER_ADMIN";

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "MAHASISWA", label: "Mahasiswa" },
  { value: "DOSEN", label: "Dosen" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
];

const ROLE_BADGE_VARIANT: Record<string, "default" | "destructive" | "secondary"> = {
  SUPER_ADMIN: "default",
  DOSEN: "destructive",
  MAHASISWA: "secondary",
};

function getRoleLabel(role: string) {
  return ROLE_OPTIONS.find((r) => r.value === role)?.label || role;
}

export function AdminUserTable({ users, currentUserId, currentPage, totalPages, totalUsers }: AdminUserTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("MAHASISWA");
  const [isPending, setIsPending] = useState(false);

  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<UserRole>("MAHASISWA");
  const [isEditPending, setIsEditPending] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [isDeletePending, setIsDeletePending] = useState(false);

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  const resetCreateForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("MAHASISWA");
    setShowForm(false);
  };

  const handleCreate = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Semua field wajib diisi.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password minimal 6 karakter.");
      return;
    }

    setIsPending(true);
    try {
      const res = await createUser(name.trim(), email.trim(), password, role);
      if (res.success) {
        toast.success("Pengguna berhasil dibuat!");
        resetCreateForm();
        router.refresh();
      } else {
        toast.error(res.error || "Gagal membuat pengguna.");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsPending(false);
    }
  };

  const openEditDialog = (u: AdminUser) => {
    setEditUser(u);
    setEditName(u.name);
    setEditEmail(u.email);
    setEditRole(u.role as UserRole);
  };

  const handleUpdate = async () => {
    if (!editUser || !editName.trim() || !editEmail.trim()) {
      toast.error("Nama dan email wajib diisi.");
      return;
    }

    setIsEditPending(true);
    try {
      const res = await updateUser(editUser.id, editName.trim(), editEmail.trim(), editRole);
      if (res.success) {
        toast.success("Pengguna berhasil diperbarui!");
        setEditUser(null);
        router.refresh();
      } else {
        toast.error(res.error || "Gagal memperbarui pengguna.");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsEditPending(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeletePending(true);
    try {
      const res = await deleteUser(deleteTarget.id);
      if (res.success) {
        toast.success("Pengguna berhasil dihapus.");
        setDeleteTarget(null);
        router.refresh();
      } else {
        toast.error(res.error || "Gagal menghapus pengguna.");
      }
    } catch {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsDeletePending(false);
    }
  };

  return (
    <>
      <Card className="neo-card">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Direktori Pengguna</CardTitle>
            <CardDescription>{totalUsers} pengguna terdaftar</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <SearchInput placeholder="Cari nama atau email..." />
            <Button onClick={() => setShowForm(!showForm)} className="neo-button font-bold gap-1">
              <UserPlus className="h-4 w-4" />
              {showForm ? "Tutup" : "Tambah"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showForm && (
            <div className="border-2 border-primary rounded-xl p-4 space-y-4 bg-primary/5">
              <h4 className="font-bold text-sm text-primary">Buat Pengguna Baru</h4>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Nama Lengkap</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" className="neo-input text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Email</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@contoh.com" className="neo-input text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Password</Label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimal 6 karakter" className="neo-input text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Role</Label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full rounded-lg border-2 border-border bg-background p-2 text-sm font-medium"
                  >
                    {ROLE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" onClick={resetCreateForm} className="font-bold">Batal</Button>
                <Button onClick={handleCreate} disabled={isPending} className="neo-button font-bold gap-1">
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                  Buat Pengguna
                </Button>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-border/50 overflow-hidden overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="font-bold">Nama</TableHead>
                  <TableHead className="font-bold">Email</TableHead>
                  <TableHead className="font-bold">Role</TableHead>
                  <TableHead className="font-bold">Terdaftar</TableHead>
                  <TableHead className="font-bold text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground font-medium">
                      Tidak ada pengguna ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Badge variant={ROLE_BADGE_VARIANT[u.role] || "secondary"}>
                          {getRoleLabel(u.role)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(u.createdAt), "dd MMM yyyy", { locale: idLocale })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="outline" size="sm" onClick={() => openEditDialog(u)} className="font-bold gap-1">
                            <Pencil className="h-3 w-3" />
                            Edit
                          </Button>
                          {u.id !== currentUserId && (
                            <Button variant="destructive" size="sm" onClick={() => setDeleteTarget(u)} className="font-bold gap-1">
                              <Trash2 className="h-3 w-3" />
                              Hapus
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-muted-foreground font-medium">
                Halaman {currentPage} dari {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage <= 1}
                  onClick={() => navigateToPage(currentPage - 1)}
                  className="font-bold gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    if (totalPages <= 5) return true;
                    if (p === 1 || p === totalPages) return true;
                    return Math.abs(p - currentPage) <= 1;
                  })
                  .reduce<(number | "ellipsis")[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("ellipsis");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "ellipsis" ? (
                      <span key={`e-${i}`} className="px-2 text-muted-foreground">...</span>
                    ) : (
                      <Button
                        key={p}
                        variant={p === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => navigateToPage(p)}
                        className="font-bold min-w-[36px]"
                      >
                        {p}
                      </Button>
                    )
                  )}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages}
                  onClick={() => navigateToPage(currentPage + 1)}
                  className="font-bold gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editUser} onOpenChange={(open) => { if (!open) setEditUser(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-black">Edit Pengguna</DialogTitle>
            <DialogDescription>Perbarui informasi pengguna yang dipilih.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="space-y-1">
              <Label className="text-xs font-bold">Nama Lengkap</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="neo-input text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold">Email</Label>
              <Input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="neo-input text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold">Role</Label>
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value as UserRole)}
                className="w-full rounded-lg border-2 border-border bg-background p-2 text-sm font-medium"
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" className="font-bold" />}>Batal</DialogClose>
            <Button onClick={handleUpdate} disabled={isEditPending} className="neo-button font-bold gap-1">
              {isEditPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-black text-destructive">Hapus Pengguna</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus <strong>{deleteTarget?.name}</strong>?
              Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" className="font-bold" />}>Batal</DialogClose>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeletePending} className="font-bold gap-1">
              {isDeletePending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
