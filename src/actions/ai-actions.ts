"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "./user-actions";
import { getActivityStats } from "./activity-actions";
import { kMeansClustering } from "@/lib/ai/ai-clustering";
import { getGamificationStrategy } from "@/lib/ai/gamification-engine";
import { BehaviorCluster } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function runBehaviorClustering() {
  const user = await requireUser();
  if (user.role !== "SUPER_ADMIN" && user.role !== "DOSEN") {
    return { success: false, error: "Hanya Dosen atau Admin yang bisa menjalakan clustering." };
  }

  const whereClause: any = { role: "MAHASISWA" };
  
  if (user.role === "DOSEN") {
    whereClause.enrollments = {
      some: {
        course: {
          creatorId: user.id,
        },
      },
    };
  }

  const students = await prisma.user.findMany({
    where: whereClause,
    select: { id: true },
  });

  if (students.length < 3) {
    return { success: false, error: "Minimal 3 mahasiswa diperlukan untuk clustering." };
  }

  const userFeatures = await Promise.all(
    students.map(async (s) => {
      const features = await getActivityStats(s.id);
      return { userId: s.id, features };
    })
  );

  const clusterResults = kMeansClustering(userFeatures, 3);

  for (const cluster of clusterResults) {
    const clusterEnum = cluster.label as BehaviorCluster;
    const strategy = getGamificationStrategy(cluster.label);

    for (const member of cluster.members) {
      await prisma.behaviorProfile.upsert({
        where: { userId: member.userId },
        update: {
          cluster: clusterEnum,
          loginFrequency: member.features.loginFrequency,
          studyTime: member.features.studyTime,
          completionRate: member.features.completionRate,
          strategy: JSON.parse(JSON.stringify(strategy)),
          analyzedAt: new Date(),
        },
        create: {
          userId: member.userId,
          cluster: clusterEnum,
          loginFrequency: member.features.loginFrequency,
          studyTime: member.features.studyTime,
          completionRate: member.features.completionRate,
          strategy: JSON.parse(JSON.stringify(strategy)),
        },
      });

      const existingBadges = await prisma.badge.findMany({
        where: { userId: member.userId },
        select: { name: true },
      });

      const badgeNames = new Set(existingBadges.map(b => b.name));
      const newBadges = strategy.badges.filter(b => !badgeNames.has(b.name));

      if (newBadges.length > 0) {
        await prisma.badge.createMany({
          data: newBadges.map(b => ({
            userId: member.userId,
            name: b.name,
            description: b.description,
            icon: b.icon,
          })),
        });
      }
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/admin/behavior");

  return {
    success: true,
    clusters: clusterResults.map(c => ({
      label: c.label,
      memberCount: c.members.length,
      centroid: c.centroid,
    })),
  };
}

export async function getMyBehaviorProfile() {
  const user = await requireUser();

  const profile = await prisma.behaviorProfile.findUnique({
    where: { userId: user.id },
  });

  const badges = await prisma.badge.findMany({
    where: { userId: user.id },
    orderBy: { earnedAt: "desc" },
  });

  return { profile, badges };
}

export async function getAllBehaviorProfiles() {
  const user = await requireUser();
  if (user.role !== "SUPER_ADMIN" && user.role !== "DOSEN") {
    throw new Error("Unauthorized");
  }

  const whereClause: any = {};
  
  if (user.role === "DOSEN") {
    whereClause.user = {
      enrollments: {
        some: {
          course: {
            creatorId: user.id,
          },
        },
      },
    };
  }

  const profiles = await prisma.behaviorProfile.findMany({
    where: whereClause,
    include: { user: { select: { name: true, email: true } } },
    orderBy: { analyzedAt: "desc" },
  });

  const clusterCounts = {
    AKTIF: profiles.filter(p => p.cluster === "AKTIF").length,
    PASIF: profiles.filter(p => p.cluster === "PASIF").length,
    PROCRASTINATOR: profiles.filter(p => p.cluster === "PROCRASTINATOR").length,
  };

  return { profiles, clusterCounts, total: profiles.length };
}
