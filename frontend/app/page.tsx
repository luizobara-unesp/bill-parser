"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (isAuthenticated) {
    return <div>Redirecionando para seu dashboard...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Bem-vindo ao Bill Parser</h1>
        <p className="mt-4 text-lg text-gray-700">
          Sua solução completa para gerenciamento de contas.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="/login"
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Entrar
          </a>
          <a
            href="/register"
            className="rounded-md bg-gray-200 px-4 py-2 font-medium text-gray-900 hover:bg-gray-300"
          >
            Registrar
          </a>
        </div>
      </div>
    </main>
  );
}