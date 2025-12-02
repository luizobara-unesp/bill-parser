"use client";

import { ConsumptionChart } from "@/components/reports/consumption-chart";
import { FinancialChart } from "@/components/reports/financial-chart";
import { getConsumptionReport } from "@/services/reportService";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Loader2, CalendarRange } from "lucide-react";
import { PageGuard } from "@/components/page-guard";
import { ConsumptionReport } from "@/types/report";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ReportsPage() {
  const [data, setData] = useState<ConsumptionReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { activeWorkspace } = useWorkspace();

  useEffect(() => {
    async function loadData() {
      try {
        if (!activeWorkspace) return;

        const workspaceId = activeWorkspace.id;
        
        const reportData = await getConsumptionReport(workspaceId);
        setData(reportData);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar relatórios.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <PageGuard>
      <div className="p-6 w-full space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Relatórios Gerenciais
            </h2>
            <p className="text-muted-foreground">
              Análise detalhada de consumo e custos da sua operação.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white p-2 rounded-md border shadow-sm">
            <CalendarRange className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Últimos 12 meses</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ConsumptionChart data={data} />
          
          <FinancialChart data={data} />
        </div>
      </div>
    </PageGuard>
  );
}
