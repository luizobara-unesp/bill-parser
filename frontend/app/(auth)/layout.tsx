"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { LoginSkeleton } from "@/components/auth/skeleton-login";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <LoginSkeleton/>;
  }

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Loader2 className="h-10 w-10 animate-spin text-zinc-950" />
    </div>
  );
}