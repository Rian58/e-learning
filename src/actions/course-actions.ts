"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/actions/user-actions";
import { revalidatePath } from "next/cache";

export async function getCourseMaterial(courseId: string, materialId: string) {
  const user = await requireUser();

  // Verify enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId } }
  });

  if (!enrollment) return null;

  // Get material and also get course materials list for navigation
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      materials: { orderBy: { orderIndex: "asc" } },
      quizzes: true,
      assignments: true
    }
  });

  if (!course) return null;

  const currentMaterial = course.materials.find(m => m.id === materialId);
  if (!currentMaterial) return null;

  return { course, currentMaterial };
}

export async function getPublishedCourses(query?: string) {
  const user = await requireUser();

  const whereClause: any = { isPublished: true };
  if (query) {
    whereClause.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { creator: { name: { contains: query, mode: "insensitive" } } }
    ];
  }

  // Get all published courses with creator info and enrollment status
  const courses = await prisma.course.findMany({
    where: whereClause,
    include: {
      creator: {
        select: { name: true, avatarUrl: true },
      },
      enrollments: {
        where: { userId: user.id },
      },
      _count: {
        select: { materials: true, quizzes: true, assignments: true }
      }
    },
    orderBy: { createdAt: "desc" },
  });

  return courses;
}

export async function getEnrolledCourses() {
  const user = await requireUser();

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: user.id },
    include: {
      course: {
        include: {
          creator: { select: { name: true, avatarUrl: true } },
          _count: {
            select: { materials: true, quizzes: true, assignments: true }
          }
        }
      }
    },
    orderBy: { enrolledAt: "desc" }
  });

  return enrollments.map(e => e.course);
}

export async function getCourseDetails(courseId: string) {
  const user = await requireUser();

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      creator: { select: { name: true, avatarUrl: true } },
      materials: { orderBy: { orderIndex: "asc" } },
      quizzes: {
        include: {
          attempts: {
            where: { userId: user.id },
            orderBy: { completedAt: "desc" },
            take: 1,
            select: { score: true, completedAt: true }
          }
        }
      },
      assignments: {
        include: {
          submissions: {
            where: { userId: user.id },
            take: 1,
            select: { status: true, score: true, submittedAt: true }
          }
        }
      },
      enrollments: { where: { userId: user.id } }
    }
  });

  let completedMaterialIds: string[] = [];
  if (course) {
    const completions = await prisma.materialCompletion.findMany({
      where: {
        userId: user.id,
        materialId: { in: course.materials.map(m => m.id) },
      },
      select: { materialId: true },
    });
    completedMaterialIds = completions.map(c => c.materialId);
  }

  return course ? { ...course, completedMaterialIds } : null;
}

export async function enrollInCourse(enrollmentCode: string) {
  const user = await requireUser();

  if (!enrollmentCode || !enrollmentCode.trim()) {
    return { success: false, error: "Kode akses wajib diisi" };
  }

  // Find course by code
  const course = await prisma.course.findUnique({
    where: { enrollmentCode: enrollmentCode.trim() }
  });

  if (!course) {
    return { success: false, error: "Kode akses tidak valid atau mata kuliah tidak ditemukan" };
  }

  // Check if already enrolled
  const existing = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: course.id
      }
    }
  });

  if (existing) {
    return { success: false, error: "Anda sudah terdaftar di mata kuliah ini" };
  }

  await prisma.enrollment.create({
    data: {
      userId: user.id,
      courseId: course.id
    }
  });

  revalidatePath(`/courses/${course.id}`, "page");
  revalidatePath("/courses", "page");
  revalidatePath("/enroll", "page");

  return { success: true, courseId: course.id };
}

// ─── Quiz Actions ────────────────────────────────────────

export async function getQuizDetails(courseId: string, quizId: string) {
  const user = await requireUser();

  // Verify enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId } }
  });
  if (!enrollment) return null;

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: { orderBy: { orderIndex: "asc" } },
      course: { select: { id: true, title: true } },
      attempts: { where: { userId: user.id }, orderBy: { completedAt: "desc" }, take: 1, select: { score: true, completedAt: true, answers: true } }
    }
  });

  if (!quiz || quiz.course.id !== courseId) return null;

  return quiz;
}

export async function submitQuizAttempt(
  quizId: string,
  answers: Record<string, number> // questionId -> selectedIndex
) {
  const user = await requireUser();

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: true, course: true }
  });

  if (!quiz) return { success: false, error: "Kuis tidak ditemukan" };

  // Verify enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: quiz.courseId } }
  });
  if (!enrollment) return { success: false, error: "Anda belum terdaftar di mata kuliah ini" };

  const existingAttempt = await prisma.quizAttempt.findFirst({
    where: { userId: user.id, quizId: quiz.id },
  });
  if (existingAttempt) return { success: false, error: "Anda sudah mengerjakan kuis ini" };

  // Calculate score
  let correctCount = 0;
  let totalPoints = 0;
  for (const question of quiz.questions) {
    const selectedIndex = answers[question.id];
    if (selectedIndex === question.correctIndex) {
      correctCount++;
      totalPoints += question.points;
    }
  }

  const maxPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
  const scorePercentage = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0;

  // Save attempt
  const attempt = await prisma.quizAttempt.create({
    data: {
      userId: user.id,
      quizId: quiz.id,
      score: scorePercentage,
      answers: answers,
      startedAt: new Date(),
      completedAt: new Date()
    }
  });



  revalidatePath(`/courses/${quiz.courseId}`, "page");

  return {
    success: true,
    score: scorePercentage,
    correctCount,
    totalQuestions: quiz.questions.length,
    passed: scorePercentage >= quiz.passingScore
  };
}

// ─── Assignment Actions ──────────────────────────────────

export async function getAssignmentDetails(courseId: string, assignmentId: string) {
  const user = await requireUser();

  // Verify enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId } }
  });
  if (!enrollment) return null;

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: {
      course: { select: { id: true, title: true } },
      submissions: { where: { userId: user.id }, take: 1 }
    }
  });

  if (!assignment || assignment.course.id !== courseId) return null;

  return assignment;
}

export async function submitAssignment(assignmentId: string, content: string) {
  const user = await requireUser();

  const assignment = await prisma.assignment.findUnique({
    where: { id: assignmentId },
    include: { course: true }
  });

  if (!assignment) return { success: false, error: "Tugas tidak ditemukan" };

  // Verify enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: assignment.courseId } }
  });
  if (!enrollment) return { success: false, error: "Anda belum terdaftar di mata kuliah ini" };

  // Check if already submitted
  const existing = await prisma.assignmentSubmission.findUnique({
    where: { userId_assignmentId: { userId: user.id, assignmentId } }
  });
  if (existing) return { success: false, error: "Anda sudah mengumpulkan tugas ini" };

  // Create submission
  await prisma.assignmentSubmission.create({
    data: {
      userId: user.id,
      assignmentId,
      content,
      status: "SUBMITTED"
    }
  });



  revalidatePath(`/courses/${assignment.courseId}`, "page");

  return { success: true };
}

export async function markMaterialComplete(materialId: string) {
  const user = await requireUser();

  const material = await prisma.material.findUnique({
    where: { id: materialId },
    select: { courseId: true },
  });

  if (!material) return { success: false, error: "Materi tidak ditemukan" };

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId: user.id, courseId: material.courseId } },
  });
  if (!enrollment) return { success: false, error: "Anda belum terdaftar di mata kuliah ini" };

  const existing = await prisma.materialCompletion.findUnique({
    where: { userId_materialId: { userId: user.id, materialId } },
  });

  if (existing) return { success: true };

  await prisma.materialCompletion.create({
    data: { userId: user.id, materialId },
  });

  revalidatePath(`/courses/${material.courseId}`, "page");
  return { success: true };
}
