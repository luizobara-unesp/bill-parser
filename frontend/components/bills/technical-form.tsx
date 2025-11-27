"use client";

import { Control, useFieldArray, UseFormRegister } from "react-hook-form";
import { AnaliseCompletaConta } from "@/types/bill";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface TechnicalFormProps {
  control: Control<AnaliseCompletaConta>;
  register: UseFormRegister<AnaliseCompletaConta>;
}

export function TechnicalForm({ control, register }: TechnicalFormProps) {
  const { fields: indicadoresFields } = useFieldArray({
    control,
    name: "indicadores_continuidade",
  });

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Demanda e Contrato</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo Demanda</Label>
                <Input {...register("demanda_contratada.tipo")} />
              </div>
              <div className="space-y-2">
                <Label>Valor (kW)</Label>
                <Input type="number" {...register("demanda_contratada.valor_kw")} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Níveis de Tensão</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label className="text-xs">Contratada</Label>
                <Input {...register("niveis_tensao.contratado")} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Mínima</Label>
                <Input {...register("niveis_tensao.minimo")} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Máxima</Label>
                <Input {...register("niveis_tensao.maximo")} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Medição e Datas</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-4">
              <Label className="font-semibold">Equipamentos</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-xs">Medidor Ativo</Label>
                    <Input {...register("equipamentos_medicao.energia_ativa")} />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs">Perda (%)</Label>
                    <Input type="number" {...register("equipamentos_medicao.taxa_perda_percent")} />
                </div>
              </div>
           </div>

           <div className="space-y-4">
              <Label className="font-semibold">Datas de Leitura</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                    <Label className="text-xs">Anterior</Label>
                    <Input {...register("datas_leitura.leitura_anterior")} placeholder="DD/MM/AAAA" />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs">Atual</Label>
                    <Input {...register("datas_leitura.leitura_atual")} placeholder="DD/MM/AAAA"/>
                </div>
                <div className="space-y-2">
                    <Label className="text-xs">Próxima</Label>
                    <Input {...register("datas_leitura.proxima_leitura_prevista")} placeholder="DD/MM/AAAA"/>
                </div>
              </div>
           </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Indicadores de Continuidade (DIC/FIC)</CardTitle></CardHeader>
        <CardContent>
            <div className="space-y-4">
                {indicadoresFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-5 gap-4 items-end border-b pb-2 last:border-0">
                        <div className="col-span-1 space-y-1">
                            <Label className="text-xs text-muted-foreground">Descrição</Label>
                            <Input {...register(`indicadores_continuidade.${index}.descricao`)} />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">DIC</Label>
                            <Input type="number" step="0.01" {...register(`indicadores_continuidade.${index}.dic`)} />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">FIC</Label>
                            <Input type="number" step="0.01" {...register(`indicadores_continuidade.${index}.fic`)} />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">DMIC</Label>
                            <Input type="number" step="0.01" {...register(`indicadores_continuidade.${index}.dmic`)} />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">DICRI</Label>
                            <Input type="number" step="0.01" {...register(`indicadores_continuidade.${index}.dicri`)} />
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}