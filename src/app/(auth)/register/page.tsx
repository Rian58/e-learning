"use client";

import { useActionState } from "react";
import { register, loginWithGoogle } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(register, null);

  return (
    <Card className="neo-card border-4">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-black tracking-tight">Buat Akun Baru</CardTitle>
        <CardDescription className="text-base font-medium">
          Masukkan data Anda untuk memulai
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
            {state?.error && (
                <div className="bg-destructive/15 text-destructive font-medium p-3 rounded-md text-sm border-2 border-destructive neo-shadow-sm">
                    {state.error}
                </div>
            )}
          <div className="space-y-2">
            <Label htmlFor="name" className="font-bold">Nama Lengkap</Label>
            <Input 
                id="name" 
                name="name" 
                placeholder="Budi Santoso" 
                required 
                className="neo-input font-medium" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="font-bold">Email</Label>
            <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="budi@mahasiswa.ac.id" 
                required 
                className="neo-input font-medium" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="font-bold">Password</Label>
            <PasswordInput 
                id="password" 
                name="password" 
                required 
                className="neo-input font-medium" 
                minLength={6}
            />
            <p className="text-xs text-muted-foreground">Minimal 6 karakter</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full neo-button text-base font-bold h-12" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Daftar
          </Button>
          <div className="text-center text-sm font-medium">
            Sudah punya akun?{" "}
            <Link href="/login" className="underline font-bold hover:text-primary transition-colors">
              Masuk
            </Link>
          </div>
        </CardFooter>
      </form>
      <div className="px-6 pb-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t-2 border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground font-bold">
              Atau daftar dengan
            </span>
          </div>
        </div>
        <form action={loginWithGoogle} className="mt-4">
          <Button variant="outline" type="submit" className="w-full neo-button bg-white text-black hover:bg-gray-100 flex items-center justify-center gap-2 font-bold h-12">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
            Google
          </Button>
        </form>
      </div>
    </Card>
  );
}
