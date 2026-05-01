import { prisma } from "@/lib/prisma";
import { requireUser } from "@/actions/user-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, GraduationCap } from "lucide-react";
import { redirect } from "next/navigation";
import { AdminUserTable } from "./admin-user-table";

const USERS_PER_PAGE = 10;

export default async function AdminDashboardPage({ searchParams }: { searchParams: Promise<{ query?: string; page?: string }> }) {
  const params = await searchParams;
  const query = params?.query || "";
  const currentPage = Math.max(1, parseInt(params?.page || "1", 10));

  const user = await requireUser();

  if (user.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const totalUsers = await prisma.user.count();
  const totalCourses = await prisma.course.count();
  const totalEnrollments = await prisma.enrollment.count();

  const whereClause: any = query
    ? {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      }
    : {};

  const filteredCount = await prisma.user.count({ where: whereClause });
  const totalPages = Math.max(1, Math.ceil(filteredCount / USERS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const allUsers = await prisma.user.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    skip: (safePage - 1) * USERS_PER_PAGE,
    take: USERS_PER_PAGE,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Panel Super Admin</h1>
        <p className="text-muted-foreground font-medium mt-1">
          Pantau dan kelola seluruh sistem e-learning.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="neo-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Total Pengguna</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{totalUsers}</div>
            <p className="text-xs text-muted-foreground font-medium mt-1">Mahasiswa & Dosen</p>
          </CardContent>
        </Card>

        <Card className="neo-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Total Mata Kuliah</CardTitle>
            <BookOpen className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{totalCourses}</div>
            <p className="text-xs text-muted-foreground font-medium mt-1">Materi pembelajaran</p>
          </CardContent>
        </Card>

        <Card className="neo-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Total Pendaftaran</CardTitle>
            <GraduationCap className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black">{totalEnrollments}</div>
            <p className="text-xs text-muted-foreground font-medium mt-1">Aktivitas belajar</p>
          </CardContent>
        </Card>
      </div>

      <AdminUserTable
        users={allUsers}
        currentUserId={user.id}
        currentPage={safePage}
        totalPages={totalPages}
        totalUsers={filteredCount}
      />
    </div>
  );
}
