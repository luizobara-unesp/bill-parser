"use client";

import { ArrowLeft, Save, CheckCircle2, Loader2 } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { BilledItemsForm } from "@/components/bills/billed-items-form";
import { TechnicalForm } from "@/components/bills/technical-form";
import { HistoryForm } from "@/components/bills/history-form";
import { TaxesForm } from "@/components/bills/taxes-form";

import { useWorkspace } from "@/context/WorkspaceContext";
import { AnaliseCompletaConta } from "@/types/bill";
import { saveBill } from "@/services/billService";

const gerarUltimos12Meses = (mesReferenciaStr: string) => {
  try {
    const meses = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
    const [mesInput, anoInput] = mesReferenciaStr.split("/");

    let mesIndex = -1;
    if (isNaN(Number(mesInput))) {
      mesIndex = meses.indexOf(mesInput.toUpperCase());
    } else {
      mesIndex = Number(mesInput) - 1;
    }

    const ano = Number(anoInput);

    if (mesIndex === -1 || !ano) return [];

    const historico = [];
    for (let i = 1; i <= 12; i++) {
      let m = mesIndex - i;
      let a = ano;

      while (m < 0) {
        m += 12;
        a -= 1;
      }

      historico.push(`${meses[m]}/${a}`);
    }
    return historico;
  } catch (e) {
    return [];
  }
};

const getDiasDoMes = (mesReferenciaStr: string) => {
  try {
    const meses = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
    const [mesInput, anoInput] = mesReferenciaStr.split("/");
    let mesIndex = -1;

    if (isNaN(Number(mesInput))) {
      mesIndex = meses.indexOf(mesInput.toUpperCase());
    } else {
      mesIndex = Number(mesInput) - 1;
    }
    
    const ano = Number(anoInput);

    if (mesIndex === -1 || !ano) return 30;

    return new Date(ano, mesIndex + 1, 0).getDate();
  } catch (e) {
    return 30;
  }
};

export default function CreateBillPage() {
  const router = useRouter();
  const { activeWorkspace } = useWorkspace();
  const [isSaving, setIsSaving] = useState(false);

  const data = new Date();
  const mesAtual = data
    .toLocaleString("pt-BR", { month: "short" })
    .replace(".", "")
    .toUpperCase();

  const anoAtual = data.getFullYear();

  const form = useForm<AnaliseCompletaConta>({
    defaultValues: {
      mes_referencia_geral: `${mesAtual}/${anoAtual}`,
      dias_faturamento: 30,
      itens_faturados: [],
      tributos_detalhados: [],
      demonstrativo_utilizacao: {
        consumo_ponta: [],
        consumo_fora_ponta: [],
        demanda: [],
      },
    },
  });

  const mesReferenciaValue = useWatch({
    control: form.control,
    name: "mes_referencia_geral",
  });

  useEffect(() => {
    if (mesReferenciaValue && mesReferenciaValue.includes("/")) {
      const mesesHistorico = gerarUltimos12Meses(mesReferenciaValue);

      if (mesesHistorico.length === 12) {
        const historicoPonta = mesesHistorico.map((m) => ({
          mes_referencia: m,
          dias: getDiasDoMes(m),
          consumo_kwh: 0,
        }));
        const historicoForaPonta = mesesHistorico.map((m) => ({
          mes_referencia: m,
          dias: getDiasDoMes(m),
          consumo_kwh: 0,
        }));
        const historicoDemanda = mesesHistorico.map((m) => ({
          mes_referencia: m,
          dias: getDiasDoMes(m),
          demanda_kw: 0,
        }));

        form.setValue("demonstrativo_utilizacao.consumo_ponta", historicoPonta);
        form.setValue(
          "demonstrativo_utilizacao.consumo_fora_ponta",
          historicoForaPonta
        );
        form.setValue("demonstrativo_utilizacao.demanda", historicoDemanda);
      }
    }
  }, [mesReferenciaValue, form.setValue]);

  const onSubmit = async (data: AnaliseCompletaConta) => {
    if (!activeWorkspace) {
      toast.error("Selecione um workspace primeiro!");
      return;
    }

    try {
      setIsSaving(true);

      const payload = { ...data };
      payload.valor_total_pagar = Number(payload.valor_total_pagar);
      payload.consumo_ponta_kwh = Number(payload.consumo_ponta_kwh);
      payload.consumo_fora_ponta_kwh = Number(payload.consumo_fora_ponta_kwh);
      payload.dias_faturamento = Number(payload.dias_faturamento);

      if (payload.demonstrativo_utilizacao) {
        payload.demonstrativo_utilizacao.consumo_ponta =
          payload.demonstrativo_utilizacao.consumo_ponta.filter(
            (i) => i.mes_referencia
          );
        payload.demonstrativo_utilizacao.consumo_fora_ponta =
          payload.demonstrativo_utilizacao.consumo_fora_ponta.filter(
            (i) => i.mes_referencia
          );
        payload.demonstrativo_utilizacao.demanda =
          payload.demonstrativo_utilizacao.demanda.filter((i) => i.mes_referencia);
      }

      await saveBill(payload, activeWorkspace.id);

      toast.success("Conta criada manualmente com sucesso!");
      router.push("/bills");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar conta.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 w-full mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10 py-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Nova Conta Manual</h1>
            <p className="text-sm text-muted-foreground">
              Preencha os dados da fatura manualmente.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="mr-2 h-4 w-4" />
            )}
            Salvar Conta
          </Button>
        </div>
      </div>

      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Dados Principais</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label>Mês de Referência</Label>
              <Input
                {...form.register("mes_referencia_geral")}
                placeholder="JUN/2025"
              />
            </div>
            <div className="space-y-2">
              <Label>Vencimento</Label>
              <Input
                {...form.register("data_vencimento")}
                placeholder="DD/MM/AAAA"
              />
            </div>
            <div className="space-y-2">
              <Label>Valor Total (R$)</Label>
              <Input
                type="number"
                step="0.01"
                {...form.register("valor_total_pagar", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label>Bandeira</Label>
              <Input {...form.register("bandeira_tarifaria")} />
            </div>

            <div className="space-y-2">
              <Label>Consumo Ponta (kWh)</Label>
              <Input type="number" {...form.register("consumo_ponta_kwh", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label>Consumo Fora Ponta (kWh)</Label>
              <Input
                type="number"
                {...form.register("consumo_fora_ponta_kwh", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label>Dias Faturamento</Label>
              <Input type="number" {...form.register("dias_faturamento", { valueAsNumber: true })} />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="items">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="items">Itens</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="taxes">Impostos</TabsTrigger>
            <TabsTrigger value="tech">Técnicos</TabsTrigger>
          </TabsList>

          <TabsContent value="items" className="mt-6">
            <BilledItemsForm control={form.control} register={form.register} />
          </TabsContent>
          <TabsContent value="history" className="mt-6">
            <HistoryForm control={form.control} register={form.register} />
          </TabsContent>
          <TabsContent value="taxes" className="mt-6">
            <TaxesForm control={form.control} register={form.register} />
          </TabsContent>
          <TabsContent value="tech" className="mt-6">
            <TechnicalForm control={form.control} register={form.register} />
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}