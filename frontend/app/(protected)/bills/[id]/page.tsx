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
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BilledItemsForm } from "@/components/bills/billed-items-form";
// import { HistoryForm } from "../../review/_components/history-form"; 

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
      await updateBill(billId, data); 
      toast.success("Conta atualizada com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar conta.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-96"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10 py-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/bills")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Detalhes da Conta #{billId}</h1>
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isSaving}>
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Save className="w-4 h-4 mr-2" />}
          Salvar Alterações
        </Button>
      </div>

      <form className="space-y-8">
        <Card>
          <CardHeader><CardTitle>Dados Gerais</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="space-y-2">
                <Label>Mês Ref</Label>
                <Input {...form.register("mes_referencia_geral")} />
             </div>
             <div className="space-y-2">
                <Label>Valor (R$)</Label>
                <Input {...form.register("valor_total_pagar")} />
             </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="items">
            <TabsList>
                <TabsTrigger value="items">Itens</TabsTrigger>
            </TabsList>
            <TabsContent value="items">
                <BilledItemsForm control={form.control} register={form.register} />
            </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}