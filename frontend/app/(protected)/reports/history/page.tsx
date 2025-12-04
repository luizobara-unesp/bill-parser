"use client";

import { useEffect, useState } from "react";
import { PageGuard } from "@/components/page-guard";
import { Loader2, FileText } from "lucide-react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getBills } from "@/services/billService";
import { getBillSpecificHistory } from "@/services/reportService";
import { BillSavedResponse } from "@/types/bill";
import { SpecificHistory } from "@/types/report";

import { BillHistoryChart } from "@/components/reports/history-chart";
import { BillDetailedHistory } from "@/components/reports/detailed-history";

import { useWorkspace } from "@/context/WorkspaceContext";

export default function HistoryReportPage() {
  const [bills, setBills] = useState<BillSavedResponse[]>([]);
  const [selectedBillId, setSelectedBillId] = useState<string>("");
  const [chartData, setChartData] = useState<SpecificHistory[]>([]);

  const [isLoadingBills, setIsLoadingBills] = useState(true);
  const [isLoadingChart, setIsLoadingChart] = useState(false);

  
  const { activeWorkspace } = useWorkspace();

  useEffect(() => {
    async function loadBills() {
      try {
        if (!activeWorkspace) return;
        const data = await getBills({ workspaceId: activeWorkspace.id, page: 0, size: 20 });
        setBills(data.content);

        if (data.content.length > 0) {
          setSelectedBillId(data.content[0].id.toString());
        }
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar lista de contas.");
      } finally {
        setIsLoadingBills(false);
      }
    }
    loadBills();
  }, []);

  useEffect(() => {
    if (!selectedBillId) return;

    async function loadHistory() {
      try {
        setIsLoadingChart(true);
        const id = parseInt(selectedBillId);

        const history = await getBillSpecificHistory(id);
        setChartData(history);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar histórico da conta.");
        setChartData([]);
      } finally {
        setIsLoadingChart(false);
      }
    }

    loadHistory();
  }, [selectedBillId]);

  return (
    <PageGuard>
      <div className="p-6 w-full space-y-8 pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Análise de Histórico
            </h2>
            <p className="text-muted-foreground">
              Visualize o comportamento de consumo retroativo de uma fatura
              específica.
            </p>
          </div>

          <div>
            {isLoadingBills ? (
              <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
            ) : (
              <Select value={selectedBillId} onValueChange={setSelectedBillId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma conta" />
                </SelectTrigger>
                <SelectContent>
                  {bills.map((bill) => (
                    <SelectItem key={bill.id} value={bill.id.toString()}>
                      {bill.mesReferenciaGeral} - R${" "}
                      {bill.valorTotalPagar.toLocaleString("pt-BR")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <div className="min-h-[400px]">
          {isLoadingChart ? (
            <div className="flex h-[400px] w-full items-center justify-center border rounded-xl bg-slate-50/50">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : chartData.length > 0 ? (
            <div className="space-y-6">
              <BillDetailedHistory data={chartData} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Conta Selecionada
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-2xl font-bold">
                      {
                        bills.find((b) => b.id.toString() === selectedBillId)
                          ?.mesReferenciaGeral
                      }
                    </span>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Média de Consumo (12 meses)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className="text-2xl font-bold">
                      {Math.round(
                        chartData.reduce(
                          (acc, curr) =>
                            acc +
                            (curr.peakConsumption || 0) +
                            (curr.offPeakConsumption || 0),
                          0
                        ) / chartData.length
                      ).toLocaleString("pt-BR")}{" "}
                      kWh
                    </span>
                  </CardContent>
                </Card>
              </div>

              <BillHistoryChart data={chartData} />
            </div>
          ) : (
            <div className="flex h-[400px] w-full flex-col items-center justify-center border rounded-xl bg-slate-50/50 text-muted-foreground">
              <FileText className="h-10 w-10 mb-2 opacity-20" />
              <p>Nenhuma conta selecionada ou histórico não encontrado.</p>
            </div>
          )}
        </div>
      </div>
    </PageGuard>
  );
}
