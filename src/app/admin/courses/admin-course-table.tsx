"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteGlobalCourse, toggleGlobalCoursePublish } from "@/actions/admin-actions";
import { Trash2, Loader2, BookOpen, AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export function AdminCourseTable({ courses }: { courses: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = (courseId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus mata kuliah ini secara GLOBAL? Semua data mahasiswa (nilai, progress) terkait mata kuliah ini akan hilang.")) return;
    
    setActiveCourseId(courseId);
    startTransition(async () => {
      try {
        const res = await deleteGlobalCourse(courseId);
        if (res.success) {
          toast.success("Mata Kuliah berhasil dihapus.");
          router.refresh();
        } else {
          toast.error(res.error || "Gagal menghapus.");
        }
      } catch {
        toast.error("Error.");
      } finally {
        setActiveCourseId(null);
      }
    });
  };

  const handleToggle = (courseId: string) => {
    setActiveCourseId(courseId);
    startTransition(async () => {
      try {
        const res = await toggleGlobalCoursePublish(courseId);
        if (res.success) toast.success("Status mata kuliah diubah.");
        else toast.error(res.error || "Gagal mengubah.");
      } catch {
        toast.error("Error.");
      } finally {
        setActiveCourseId(null);
      }
    });
  };

  return (
    <Card className="neo-card">
      <CardHeader>
        <CardTitle>Direktori Mata Kuliah</CardTitle>
        <CardDescription>Semua mata kuliah yang dibuat oleh dosen di platform</CardDescription>
      </CardHeader>
      <CardContent>
        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl bg-muted/50 neo-border">
            <BookOpen className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="text-lg font-bold">Belum ada mata kuliah.</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              Sistem akan menampilkan tabel mata kuliah ketika dosen sudah membuatnya.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border neo-border overflow-hidden overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="font-bold whitespace-nowrap">Mata Kuliah / Dosen</TableHead>
                  <TableHead className="font-bold text-center">Status</TableHead>
                  <TableHead className="font-bold text-center">Semester</TableHead>
                  <TableHead className="font-bold text-center">Mahasiswa</TableHead>
                  <TableHead className="font-bold text-center">Konten</TableHead>
                  <TableHead className="font-bold text-right">Dibuat Pada</TableHead>
                  <TableHead className="font-bold text-right">Aksi Global</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium whitespace-nowrap">
                      <p className="font-bold text-sm max-w-[200px] truncate" title={c.title}>{c.title}</p>
                      <p className="text-xs text-muted-foreground">{c.creator?.name}</p>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={c.isPublished ? "default" : "secondary"}>
                        {c.isPublished ? "Aktif" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-xs font-bold">
                      {c.semester || "-"}
                    </TableCell>
                    <TableCell className="text-center font-bold">
                      {c._count.enrollments}
                    </TableCell>
                    <TableCell className="text-center text-xs">
                      {c._count.materials} M • {c._count.quizzes} K • {c._count.assignments} T
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground text-xs whitespace-nowrap">
                      {format(new Date(c.createdAt), "dd MMM yy", { locale: id })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggle(c.id)}
                          disabled={isPending && activeCourseId === c.id}
                          className="font-bold gap-1 neo-button border-2 h-8"
                          title={c.isPublished ? "Sembunyikan Mata Kuliah" : "Publikasi Mata Kuliah"}
                        >
                          {c.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(c.id)}
                          disabled={isPending && activeCourseId === c.id}
                          className="font-bold gap-1 border-2 border-transparent h-8"
                          title="Hapus Paksa"
                        >
                          {isPending && activeCourseId === c.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
