import { prisma } from "@/lib/prisma";
import { requireUser } from "@/actions/user-actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { AdminCourseTable } from "./admin-course-table";
import { SearchInput } from "@/components/search-input";

export default async function AdminCoursesPage({ searchParams }: { searchParams: Promise<{ query?: string }> }) {
  const params = await searchParams;
  const query = params?.query || "";
  
  const user = await requireUser();

  if (user.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const whereCourseClause: any = {};
  if (query) {
    whereCourseClause.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { creator: { name: { contains: query, mode: "insensitive" } } }
    ];
  }

  const allCourses = await prisma.course.findMany({
    where: whereCourseClause,
    orderBy: { createdAt: "desc" },
    include: {
      creator: { select: { name: true, email: true } },
      _count: { select: { enrollments: true, materials: true, quizzes: true, assignments: true } }
    }
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Manajemen Mata Kuliah</h1>
          <p className="text-muted-foreground font-medium mt-1">
            Pantau, edit status, atau hapus mata kuliah secara global.
          </p>
        </div>
        <SearchInput placeholder="Cari judul mata kuliah atau dosen..." />
      </div>

      <AdminCourseTable courses={allCourses} />
    </div>
  );
}
