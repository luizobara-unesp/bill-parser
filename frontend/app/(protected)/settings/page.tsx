"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useEffect, useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PageGuard } from "@/components/page-guard";
import { Separator } from "@/components/ui/separator";
import { Loader2, User, Mail, Camera } from "lucide-react";
import { UserProfile, UserUpdateRequest } from "@/types/user";
import {
  getUserProfile,
  updateUserProfile,
  uploadUserAvatar,
} from "@/services/userService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset } = useForm<UserUpdateRequest>();

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getUserProfile();
        setUser(data);

        reset({
          fullName: data.fullName,
          email: data.email,
        });
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar perfil.");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [reset]);

  const onSubmit = async (data: UserUpdateRequest) => {
    try {
      setIsSaving(true);

      const updatedUser = await updateUserProfile(data);

      setUser(updatedUser);

      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar perfil. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const MAX_SIZE_MB = 5;

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`A imagem deve ter no máximo ${MAX_SIZE_MB}MB.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    try {
      setIsUploading(true);
      toast.info("Enviando foto...");

      const updatedUser = await uploadUserAvatar(file);

      setUser(updatedUser);

      toast.success("Foto de perfil atualizada!");
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 413) {
        toast.error("Imagem muito grande para o servidor.");
      } else {
        toast.error("Erro ao atualizar foto.");
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <PageGuard>
      <div className="w-full mx-auto p-6 space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
          <p className="text-muted-foreground">
            Gerencie as configurações da sua conta e preferências.
          </p>
        </div>

        <Separator />

        <div className="grid gap-8 md:grid-cols-[250px_1fr]">
          <nav className="flex flex-col space-y-1 text-sm text-muted-foreground">
            <button className="text-left font-semibold text-primary bg-secondary/50 px-3 py-2 rounded-md transition-colors">
              Geral
            </button>
            <button className="text-left px-3 py-2 hover:bg-secondary/20 rounded-md transition-colors cursor-not-allowed opacity-50">
              Segurança
            </button>
            <button className="text-left px-3 py-2 hover:bg-secondary/20 rounded-md transition-colors cursor-not-allowed opacity-50">
              Aparência
            </button>
          </nav>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Perfil do Usuário</CardTitle>
                <CardDescription>
                  Essas informações identificam você na plataforma.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="relative group cursor-pointer">
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <Avatar className="h-24 w-24 border-4 border-background shadow-sm group-hover:opacity-90 transition-opacity">
                        <AvatarImage
                          src={user?.avatarUrl || ""}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                          {user?.fullName?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md border border-gray-100">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 rounded-full"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAvatarClick();
                          }}
                        >
                          {isUploading ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Camera className="h-3.5 w-3.5 text-gray-600" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="">
                      <h3 className="font-medium text-lg ">{user?.fullName}</h3>
                      <p className="text-xs text-muted-foreground ">
                        {user?.email}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Clique na foto para alterar.
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {user?.avatarUrl}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nome Completo</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="fullName"
                          className="pl-9"
                          placeholder="Seu nome"
                          {...register("fullName")}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          className="pl-9"
                          placeholder="seu@email.com"
                          {...register("email")}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>Salvar Alterações</>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageGuard>
  );
}
