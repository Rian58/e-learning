"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "./user-actions";
import { ActivityType } from "@prisma/client";

export async function logActivity(type: ActivityType, metadata?: any, duration?: number) {
  try {
    const user = await requireUser();

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        type,
        metadata: metadata || null,
        duration: duration || null,
      },
    });

    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function getActivityStats(userId: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const loginCount = await prisma.activityLog.count({
    where: { userId, type: "LOGIN", createdAt: { gte: thirtyDaysAgo } },
  });

  const studyLogs = await prisma.activityLog.findMany({
    where: { userId, type: "MATERIAL_READ", createdAt: { gte: thirtyDaysAgo } },
    select: { duration: true },
  });

  const totalStudyMinutes = studyLogs.reduce((sum, log) => sum + (log.duration || 0), 0);

  const totalAssignments = await prisma.assignment.count({
    where: { course: { enrollments: { some: { userId } } } },
  });

  const completedAssignments = await prisma.assignmentSubmission.count({
    where: { userId },
  });

  const totalQuizzes = await prisma.quiz.count({
    where: { course: { enrollments: { some: { userId } } } },
  });

  const completedQuizzes = await prisma.quizAttempt.count({
    where: { userId },
  });

  const totalTasks = totalAssignments + totalQuizzes;
  const completedTasks = completedAssignments + completedQuizzes;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return {
    loginFrequency: loginCount,
    studyTime: totalStudyMinutes,
    completionRate: Math.round(completionRate * 100) / 100,
  };
}
