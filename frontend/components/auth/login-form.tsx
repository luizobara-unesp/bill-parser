"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/services/authService";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardTitle,
  CardHeader,
  CardFooter,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  password: z.string().min(1, { message: "A senha é obrigatória." }),
});

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setError(null);

    try {
      const { token, email } = await loginUser(values);
      login(token, email);
      router.push("/home");
    } catch (err) {
      setError("Falha no login. Verifique seu email e senha.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-xs md:max-w-md h-96 bg-white/90 border border-zinc-200/80 text-zinc-900 shadow-lg shadow-zinc-900/5 backdrop-blur-sm gap-0">
      <CardHeader className="text-center gap-1 pb-3">
        <CardTitle className="text-2xl font-semibold tracking-tight text-zinc-900">
          Entrar na sua conta
        </CardTitle>
        <CardDescription className="text-xs text-zinc-500">
          Acesse o Bill Parser com seu email e senha.
        </CardDescription>
      </CardHeader>

      <CardContent className="h-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col h-full space-y-4"
          >
            <div className="flex flex-col gap-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-zinc-700 uppercase tracking-wide">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        autoComplete="email"
                        placeholder="seu@email.com"
                        className="bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-1 focus-visible:ring-zinc-900 focus-visible:border-zinc-900/80 transition-colors"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-medium text-zinc-700 uppercase tracking-wide">
                      Senha
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        autoComplete="current-password"
                        placeholder="Sua senha"
                        className="bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-1 focus-visible:ring-zinc-900 focus-visible:border-zinc-900/80 transition-colors"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {error && (
              <Alert className="border-red-500/60 bg-red-50 text-red-600 text-xs">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="mt-auto mb-1">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-60 disabled:cursor-not-allowed font-medium text-sm rounded-md transition-colors"
              >
                {isLoading ? "Carregando..." : "Entrar"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="pt-0">
        <p className="w-full text-center text-xs text-zinc-500">
          Não tem uma conta?{" "}
          <Link
            href="/register"
            className="text-zinc-900 hover:text-zinc-700 font-medium underline-offset-4 hover:underline"
          >
            Registre-se
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
