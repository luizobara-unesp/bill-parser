"use client";

import { saveBill } from "@/services/billService";
import { useState } from "react";

import { toast } from "sonner";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AnaliseCompletaConta } from "@/types/bill";
import { Separator } from "@/components/ui/separator";
import { useBillReview } from "@/context/BillReviewContext";
import { ArrowLeft, Save, CheckCircle2 } from "lucide-react";
import { HistoryForm } from "@/components/bills/history-form";
import { BilledItemsForm } from "@/components/bills/billed-items-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BillReviewPage() {
  const [isSaving, setIsSaving] = useState(false);
  const { reviewData } = useBillReview();
  const router = useRouter();

  useEffect(() => {
    if (!reviewData) {
      router.push("/bill");
    }
  }, [reviewData, router]);

  const form = useForm<AnaliseCompletaConta>({
    defaultValues: reviewData || {},
  });

  const onSubmit = async (data: AnaliseCompletaConta) => {
    try {
      setIsSaving(true);
      const workspaceId = 1; 

      console.log("Enviando para o backend...", data);
      
      await saveBill(data, workspaceId);

      toast.success("Conta salva com sucesso!");
      
      router.push("/bill"); 

    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar a conta. Verifique os dados.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!reviewData) return null;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10 py-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              Revisão da Conta{" "}
              <span className="text-muted-foreground text-lg font-normal">
                | {reviewData.mes_referencia_geral}
              </span>
            </h1>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            className="bg-green-600 hover:bg-green-700"
            disabled={isSaving}
          >
            {isSaving ? (
               <>Salvando...</> 
            ) : (
               <><CheckCircle2 className="w-4 h-4 mr-2" /> Aprovar e Salvar</>
            )}
          </Button>
        </div>
      </div>

      <form className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Informações Principais</CardTitle>
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
            <Card>
              <CardHeader>
                <CardTitle>Detalhamento de Impostos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Em breve: Edição de PIS/COFINS/ICMS.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tech" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Dados Técnicos e Medidores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Demanda Contratada (kW)</Label>
                    <Input {...form.register("demanda_contratada.valor_kw")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de Demanda</Label>
                    <Input {...form.register("demanda_contratada.tipo")} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
