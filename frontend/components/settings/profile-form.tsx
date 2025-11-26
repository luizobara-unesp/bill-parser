"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { toast } from "sonner";

import {
    getUserProfile,
    updateUserProfile,
    uploadUserAvatar,
} from "@/services/userService";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { UserProfile, UserUpdateRequest } from "@/types/user";
import { Loader2, User, Mail, Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, reset } = useForm<UserUpdateRequest>();

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getUserProfile();
        setUser(data);
        reset({ fullName: data.fullName, email: data.email });
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
      toast.error("Erro ao atualizar perfil.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB.");
      return;
    }

    try {
      setIsUploading(true);
      toast.info("Enviando foto...");
      const updatedUser = await uploadUserAvatar(file);
      setUser(updatedUser);
      toast.success("Foto atualizada!");
    } catch (error: any) {
      console.error(error);
      toast.error("Erro ao atualizar foto.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
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
            <div
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
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
                >
                  {isUploading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Pencil className="h-3.5 w-3.5 text-gray-600" />
                  )}
                </Button>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-lg">{user?.fullName}</h3>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Clique na foto para alterar.
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
                  disabled
                  className="pl-9"
                  {...register("email")}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
