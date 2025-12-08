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

export default function ConsumptionReportsPage() {
  const [data, setData] = useState<ConsumptionReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { activeWorkspace } = useWorkspace();

  const fetchReports = async () => {
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
  };

  useEffect(() => {
    if (!activeWorkspace) return;
    fetchReports();
  }, [activeWorkspace]);

  if (!activeWorkspace) {
    return (
      <PageGuard>
        <div className="w-full p-6 mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-3xl font-bold tracking-tight">
              Relatórios Gerencias
            </h3>
          </div>
        </div>
      </PageGuard>
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
