"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { UserProfile } from "@/types";

export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) return null;

    const roleStr = authUser.user_metadata?.role || "MAHASISWA";
    let role: "MAHASISWA" | "DOSEN" | "SUPER_ADMIN" = "MAHASISWA";
    if (["MAHASISWA", "DOSEN", "SUPER_ADMIN"].includes(roleStr)) {
      role = roleStr as "MAHASISWA" | "DOSEN" | "SUPER_ADMIN";
    }

    let dbUser = await prisma.user.findUnique({
      where: { id: authUser.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      }
    });

    if (!dbUser) {
      try {
        dbUser = await prisma.user.create({
          data: {
            id: authUser.id,
            email: authUser.email || "",
            name: authUser.user_metadata?.name || authUser.user_metadata?.full_name || "User",
            role: role,
            avatarUrl: authUser.user_metadata?.avatar_url || null,
          },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatarUrl: true,
            createdAt: true,
          }
        });
      } catch (error: any) {
        if (error.code === 'P2002') {
          dbUser = await prisma.user.findUnique({
            where: { id: authUser.id },
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              avatarUrl: true,
              createdAt: true,
            }
          });

          if (!dbUser) {
            const existingByEmail = await prisma.user.findUnique({
              where: { email: authUser.email || "" },
            });

            if (existingByEmail) {
              dbUser = await prisma.user.update({
                where: { email: authUser.email || "" },
                data: { id: authUser.id },
                select: {
                  id: true,
                  name: true,
                  email: true,
                  role: true,
                  avatarUrl: true,
                  createdAt: true,
                },
              });
            }
          }
        } else {
          throw error;
        }
      }
    }

    return dbUser;
  } catch (error) {
    console.error("Gagal mengambil data pengguna:", error);
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function updateProfile(data: { name?: string; email?: string; password?: string }) {
  const user = await requireUser();
  const supabase = await createClient();

  const updateAuthData: any = {};
  if (data.email && data.email !== user.email) updateAuthData.email = data.email;
  // Supabase takes password updates if provider is email setup
  if (data.password) updateAuthData.password = data.password;
  
  if (data.name && data.name !== user.name) {
    updateAuthData.data = { name: data.name, full_name: data.name };
  }

  if (Object.keys(updateAuthData).length > 0) {
    const { error: authError } = await supabase.auth.updateUser(updateAuthData);
    if (authError) return { success: false, error: authError.message };
  }

  const updatePrismaData: any = {};
  if (data.name && data.name !== user.name) updatePrismaData.name = data.name;
  if (data.email && data.email !== user.email) updatePrismaData.email = data.email;

  if (Object.keys(updatePrismaData).length > 0) {
    await prisma.user.update({
      where: { id: user.id },
      data: updatePrismaData,
    });
  }

  return { success: true };
}
