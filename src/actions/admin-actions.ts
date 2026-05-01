"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "./user-actions";
import { revalidatePath } from "next/cache";
import { createClient, createAdminClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "SUPER_ADMIN") throw new Error("Unauthorized");
  return user;
}

export async function createUser(
  name: string,
  email: string,
  password: string,
  role: "MAHASISWA" | "DOSEN" | "SUPER_ADMIN"
) {
  const admin = await requireAdmin();

  const supabase = await createAdminClient();

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, role },
  });

  if (authError) {
    return { success: false, error: authError.message };
  }

  if (!authData.user) {
    return { success: false, error: "Gagal membuat akun autentikasi" };
  }

  await prisma.user.create({
    data: {
      id: authData.user.id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
    },
  });

  revalidatePath("/admin");
  return { success: true };
}

export async function updateUser(
  userId: string,
  name: string,
  email: string,
  role: "MAHASISWA" | "DOSEN" | "SUPER_ADMIN"
) {
  const admin = await requireAdmin();

  if (admin.id === userId && role !== "SUPER_ADMIN") {
    return { success: false, error: "Tidak dapat mengubah role akun sendiri" };
  }

  const supabase = await createAdminClient();

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
    },
  });

  await supabase.auth.admin.updateUserById(userId, {
    email: email.trim().toLowerCase(),
    user_metadata: { name: name.trim(), role },
  });

  revalidatePath("/admin");
  return { success: true };
}

export async function deleteUser(userId: string) {
  const admin = await requireAdmin();

  if (admin.id === userId) {
    return { success: false, error: "Tidak dapat menghapus akun sendiri" };
  }

  const supabase = await createAdminClient();

  await prisma.user.delete({
    where: { id: userId },
  });

  await supabase.auth.admin.deleteUser(userId);

  revalidatePath("/admin");
  return { success: true };
}

export async function deleteGlobalCourse(courseId: string): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin();

  await prisma.course.delete({
    where: { id: courseId },
  });

  revalidatePath("/admin/courses");
  return { success: true };
}

export async function toggleGlobalCoursePublish(courseId: string): Promise<{ success: boolean; error?: string }> {
  const admin = await requireAdmin();

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return { success: false, error: "Mata kuliah tidak ditemukan" };

  await prisma.course.update({
    where: { id: courseId },
    data: { isPublished: !course.isPublished },
  });

  revalidatePath("/admin/courses");
  return { success: true };
}
