"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/actions/user-actions";
import { revalidatePath } from "next/cache";

async function requireLecturer() {
  const user = await requireUser();
  if (user.role !== "DOSEN" && user.role !== "SUPER_ADMIN") {
    throw new Error("Akses ditolak: hanya dosen yang diperbolehkan.");
  }
  return user;
}

// ─── Lecturer Course Management ──────────────────────────

export async function getLecturerCourses(query?: string) {
  const user = await requireLecturer();

  const whereClause: any = { creatorId: user.id };
  if (query) {
    whereClause.title = { contains: query, mode: "insensitive" };
  }

  const courses = await prisma.course.findMany({
    where: whereClause,
    include: {
      _count: {
        select: { materials: true, quizzes: true, assignments: true, enrollments: true }
      }
    },
    orderBy: { updatedAt: "desc" }
  });

  return courses;
}

export async function createCourse(title: string, description: string, semester: string | null) {
  const user = await requireLecturer();

  if (!title.trim() || !description.trim()) {
    return { success: false, error: "Judul dan deskripsi wajib diisi." };
  }

  // Generate a 6-character random alphanumeric code
  const enrollmentCode = Math.random().toString(36).substring(2, 8).toUpperCase();

  const course = await prisma.course.create({
    data: {
      title: title.trim(),
      description: description.trim(),
      semester: semester?.trim() || null,
      enrollmentCode,
      creatorId: user.id,
      isPublished: false
    }
  });

  revalidatePath("/manage/courses");
  return { success: true, courseId: course.id };
}

export async function updateCourse(courseId: string, title: string, description: string, semester: string | null, enrollmentCode?: string) {
  const user = await requireLecturer();

  if (!title.trim() || !description.trim()) {
    return { success: false, error: "Judul dan deskripsi wajib diisi." };
  }

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || course.creatorId !== user.id) {
    return { success: false, error: "Mata kuliah tidak ditemukan." };
  }

  // If a new code is provided, verify it's unique
  if (enrollmentCode && enrollmentCode.trim() !== course.enrollmentCode) {
    const existingCode = await prisma.course.findUnique({
      where: { enrollmentCode: enrollmentCode.trim() }
    });
    if (existingCode) {
      return { success: false, error: "Kode akses sudah digunakan oleh mata kuliah lain." };
    }
  }

  await prisma.course.update({
    where: { id: courseId },
    data: {
      title: title.trim(),
      description: description.trim(),
      semester: semester?.trim() || null,
      enrollmentCode: enrollmentCode ? enrollmentCode.trim() : course.enrollmentCode,
    }
  });

  revalidatePath("/manage/courses");
  revalidatePath(`/manage/courses/${courseId}`);
  return { success: true };
}

export async function togglePublishCourse(courseId: string) {
  const user = await requireLecturer();

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || course.creatorId !== user.id) {
    return { success: false, error: "Mata kuliah tidak ditemukan." };
  }

  await prisma.course.update({
    where: { id: courseId },
    data: { isPublished: !course.isPublished }
  });

  revalidatePath("/manage/courses");
  return { success: true, isPublished: !course.isPublished };
}

export async function deleteCourse(courseId: string) {
  const user = await requireLecturer();

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || course.creatorId !== user.id) {
    return { success: false, error: "Mata kuliah tidak ditemukan." };
  }

  await prisma.course.delete({ where: { id: courseId } });

  revalidatePath("/manage/courses");
  return { success: true };
}

// ─── Material Management ─────────────────────────────────

export async function addMaterial(courseId: string, title: string, content: string, type: string) {
  const user = await requireLecturer();

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || course.creatorId !== user.id) {
    return { success: false, error: "Mata kuliah tidak ditemukan." };
  }

  const lastMaterial = await prisma.material.findFirst({
    where: { courseId },
    orderBy: { orderIndex: "desc" }
  });

  await prisma.material.create({
    data: {
      courseId,
      title: title.trim(),
      content: content.trim(),
      type: type as any,
      orderIndex: (lastMaterial?.orderIndex ?? -1) + 1
    }
  });

  revalidatePath(`/manage/courses/${courseId}`);
  return { success: true };
}

export async function deleteMaterial(materialId: string, courseId: string) {
  const user = await requireLecturer();

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || course.creatorId !== user.id) {
    return { success: false, error: "Mata kuliah tidak ditemukan." };
  }

  await prisma.material.delete({ where: { id: materialId } });

  revalidatePath(`/manage/courses/${courseId}`);
  return { success: true };
}

export async function updateMaterial(materialId: string, courseId: string, title: string, content: string, type: string) {
  const user = await requireLecturer();

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || course.creatorId !== user.id) {
    return { success: false, error: "Mata kuliah tidak ditemukan." };
  }

  await prisma.material.update({
    where: { id: materialId },
    data: {
      title: title.trim(),
      content: content.trim(),
      type: type as any,
    }
  });

  revalidatePath(`/manage/courses/${courseId}`);
  return { success: true };
}

// ─── Quiz Management ─────────────────────────────────────

export async function addQuiz(
  courseId: string,
  title: string,
  description: string,
  passingScore: number,
  timeLimitMinutes: number | null,
  questions: { question: string; options: string[]; correctIndex: number; points: number }[]
) {
  const user = await requireLecturer();

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || course.creatorId !== user.id) {
    return { success: false, error: "Mata kuliah tidak ditemukan." };
  }

  await prisma.quiz.create({
    data: {
      courseId,
      title: title.trim(),
      description: description.trim() || null,
      passingScore,
      timeLimitMinutes,
      questions: {
        create: questions.map((q, idx) => ({
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          points: q.points,
          orderIndex: idx
        }))
      }
    }
  });

  revalidatePath(`/manage/courses/${courseId}`);
  return { success: true };
}

export async function deleteQuiz(quizId: string, courseId: string) {
  const user = await requireLecturer();

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || course.creatorId !== user.id) {
    return { success: false, error: "Mata kuliah tidak ditemukan." };
  }

  await prisma.quiz.delete({ where: { id: quizId } });

  revalidatePath(`/manage/courses/${courseId}`);
  return { success: true };
}

export async function updateQuiz(
  quizId: string,
  courseId: string,
  title: string,
  description: string,
  passingScore: number,
  timeLimitMinutes: number | null,
  questions: { question: string; options: string[]; correctIndex: number; points: number }[]
) {
  const user = await requireLecturer();

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || course.creatorId !== user.id) {
    return { success: false, error: "Mata kuliah tidak ditemukan." };
  }

  await prisma.quiz.update({
    where: { id: quizId },
    data: {
      title: title.trim(),
      description: description.trim() || null,
      passingScore,
      timeLimitMinutes,
      questions: {
        deleteMany: {},
        create: questions.map((q, idx) => ({
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          points: q.points,
          orderIndex: idx
        }))
      }
    }
  });

  revalidatePath(`/manage/courses/${courseId}`);
  return { success: true };
}

// ─── Assignment Management ───────────────────────────────

export async function addAssignment(
  courseId: string,
  title: string,
  description: string,
  dueDate: string,
  maxScore: number
) {
  const user = await requireLecturer();

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || course.creatorId !== user.id) {
    return { success: false, error: "Mata kuliah tidak ditemukan." };
  }

  await prisma.assignment.create({
    data: {
      courseId,
      title: title.trim(),
      description: description.trim(),
      dueDate: new Date(dueDate),
      maxScore
    }
  });

  revalidatePath(`/manage/courses/${courseId}`);
  return { success: true };
}

export async function deleteAssignment(assignmentId: string, courseId: string) {
  const user = await requireLecturer();

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || course.creatorId !== user.id) {
    return { success: false, error: "Mata kuliah tidak ditemukan." };
  }

  await prisma.assignment.delete({ where: { id: assignmentId } });

  revalidatePath(`/manage/courses/${courseId}`);
  return { success: true };
}

export async function updateAssignment(
  assignmentId: string,
  courseId: string,
  title: string,
  description: string,
  dueDate: string,
  maxScore: number
) {
  const user = await requireLecturer();

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || course.creatorId !== user.id) {
    return { success: false, error: "Mata kuliah tidak ditemukan." };
  }

  await prisma.assignment.update({
    where: { id: assignmentId },
    data: {
      title: title.trim(),
      description: description.trim(),
      dueDate: new Date(dueDate),
      maxScore
    }
  });

  revalidatePath(`/manage/courses/${courseId}`);
  return { success: true };
}

// ─── Student Progress ────────────────────────────────────

export async function getLecturerStudents() {
  const user = await requireLecturer();

  // Get courses by this lecturer
  const courses = await prisma.course.findMany({
    where: { creatorId: user.id },
    select: { id: true }
  });

  const courseIds = courses.map(c => c.id);

  // Get enrolled students
  const enrollments = await prisma.enrollment.findMany({
    where: { courseId: { in: courseIds } },
    include: {
      user: {
        select: { id: true, name: true, email: true }
      },
      course: {
        select: { title: true }
      }
    },
    orderBy: { enrolledAt: "desc" }
  });

  return enrollments;
}

export async function gradeSubmission(submissionId: string, score: number) {
  const user = await requireLecturer();

  const submission = await prisma.assignmentSubmission.findUnique({
    where: { id: submissionId },
    include: { assignment: { include: { course: true } } }
  });

  if (!submission || submission.assignment.course.creatorId !== user.id) {
    return { success: false, error: "Pengumpulan tidak ditemukan." };
  }

  await prisma.assignmentSubmission.update({
    where: { id: submissionId },
    data: { score, status: "GRADED", gradedAt: new Date() }
  });

  revalidatePath("/manage/students");
  return { success: true };
}
