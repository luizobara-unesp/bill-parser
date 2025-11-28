"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UploadCloud, FileBarChart, History, Settings } from "lucide-react";

export function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      title: "Novo Upload",
      description: "Envie uma fatura PDF para análise automática.",
      icon: UploadCloud,
      href: "/bills/upload",
      color: "text-blue-600",
      bg: "bg-blue-50 hover:bg-blue-100",
    },
    {
      title: "Relatórios",
      description: "Visualize gráficos de consumo e custos.",
      icon: FileBarChart,
      href: "/reports",
      color: "text-green-600",
      bg: "bg-green-50 hover:bg-green-100",
    },
    {
      title: "Histórico",
      description: "Consulte todas as contas já processadas.",
      icon: History,
      href: "/bills",
      color: "text-purple-600",
      bg: "bg-purple-50 hover:bg-purple-100",
    },
    {
      title: "Configurações",
      description: "Gerencie seus dados e preferências.",
      icon: Settings,
      href: "/settings",
      color: "text-gray-600",
      bg: "bg-gray-50 hover:bg-gray-100",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {actions.map((action, index) => (
        <Card
          key={index}
          className={`cursor-pointer transition-all hover:shadow-md border-none ${action.bg}`}
          onClick={() => router.push(action.href)}
        >
          <CardHeader className="pb-2">
            <action.icon className={`h-8 w-8 mb-2 ${action.color}`} />
            <CardTitle className="text-lg">{action.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-zinc-600">
              {action.description}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
