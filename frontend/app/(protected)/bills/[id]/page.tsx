"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { AnaliseCompletaConta } from "@/types/bill";
import { getBillById, updateBill } from "@/services/billService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { BilledItemsForm } from "@/components/bills/billed-items-form";
import { HistoryForm } from "@/components/bills/history-form";
import { TaxesForm } from "@/components/bills/taxes-form";
import { TechnicalForm } from "@/components/bills/technical-form";

export default function BillDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const billId = Number(params.id);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<AnaliseCompletaConta>();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getBillById(billId);
        form.reset(data);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar detalhes da conta.");
        router.push("/bills");
      } finally {
        setIsLoading(false);
      }
    };

    if (billId) loadData();
  }, [billId, router, form]);

  const onSubmit = async (data: AnaliseCompletaConta) => {
    try {
      setIsSaving(true);
      
      if (data.demonstrativo_utilizacao) {
        data.demonstrativo_utilizacao.consumo_ponta = data.demonstrativo_utilizacao.consumo_ponta.filter(
          (item) => item.mes_referencia && item.mes_referencia.trim() !== ""
        );

        data.demonstrativo_utilizacao.consumo_fora_ponta = data.demonstrativo_utilizacao.consumo_fora_ponta.filter(
          (item) => item.mes_referencia && item.mes_referencia.trim() !== ""
        );

        data.demonstrativo_utilizacao.demanda = data.demonstrativo_utilizacao.demanda.filter(
          (item) => item.mes_referencia && item.mes_referencia.trim() !== ""
        );
      }
      
      if (data.itens_faturados) {
        data.itens_faturados = data.itens_faturados.filter(i => i.descricao && i.descricao.trim() !== "");
      }
      await updateBill(billId, data); 
      
      toast.success("Conta atualizada com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar conta.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 w-full mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10 py-4 border-b">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/bills")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Detalhes da Conta #{billId}</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Salvar Alterações
          </Button>
        </div>
      </div>

      <form className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Dados Gerais</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label>Mês de Referência</Label>
              <Input {...form.register("mes_referencia_geral")} />
            </div>
            <div className="space-y-2">
              <Label>Vencimento</Label>
              <Input {...form.register("data_vencimento")} />
            </div>
            <div className="space-y-2">
              <Label>Valor Total (R$)</Label>
              <Input
                type="number"
                step="0.01"
                className="font-bold text-lg"
                {...form.register("valor_total_pagar")}
              />
            </div>
            <div className="space-y-2">
              <Label>Bandeira Tarifária</Label>
              <Input {...form.register("bandeira_tarifaria")} />
            </div>

            <div className="space-y-2">
              <Label>Consumo Ponta (kWh)</Label>
              <Input type="number" {...form.register("consumo_ponta_kwh")} />
            </div>
            <div className="space-y-2">
              <Label>Consumo Fora Ponta (kWh)</Label>
              <Input
                type="number"
                {...form.register("consumo_fora_ponta_kwh")}
              />
            </div>
            <div className="space-y-2">
              <Label>Dias Faturamento</Label>
              <Input type="number" {...form.register("dias_faturamento")} />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="items" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="items">Itens Faturados</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="taxes">Impostos</TabsTrigger>
            <TabsTrigger value="tech">Dados Técnicos</TabsTrigger>
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
