import { requireUser } from "@/actions/user-actions";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { EnrollForm } from "./enroll-form";
import { KeyRound } from "lucide-react";

export const metadata = {
  title: "Gabung Mata Kuliah - Stack Sinau",
};

export default async function EnrollPage() {
  const user = await requireUser();

  if (user.role === "SUPER_ADMIN") {
    redirect("/admin");
  }
  if (user.role === "DOSEN") {
    redirect("/manage");
  }

  // Get enrolled courses to show recently joined
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.id },
    include: { course: true },
    orderBy: { enrolledAt: "desc" },
    take: 3
  });

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="bg-primary/10 border-4 neo-border p-8 rounded-3xl relative overflow-hidden mb-8 neo-shadow">
        <div className="absolute -top-12 -right-12 text-primary opacity-20">
          <KeyRound className="w-64 h-64" />
        </div>
        <div className="relative z-10 max-w-[80%]">
          <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">Gabung Kelas Baru</h1>
          <p className="text-muted-foreground font-medium mb-6">
            Punya kode akses dari dosen? Masukkan kode tersebut di bawah ini untuk tergabung ke dalam mata kuliah dan mengakses semua materi pembelajarannya.
          </p>
        </div>
      </div>

      <div className="bg-background border-4 neo-border p-6 rounded-3xl neo-shadow-sm">
        <EnrollForm />
      </div>

      {enrollments.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-black mb-4">Baru saja bergabung:</h2>
          <div className="grid gap-3">
            {enrollments.map((e) => (
              <div key={e.id} className="bg-muted p-4 rounded-xl border-2 neo-border flex justify-between items-center">
                <span className="font-bold">{e.course.title}</span>
                <span className="text-xs font-medium bg-background px-2 py-1 rounded border neo-border">
                  {new Date(e.enrolledAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
