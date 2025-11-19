"use client";

import { Input } from "@/components/ui/input";
import { AnaliseCompletaConta } from "@/types/bill";
import { Control, useFieldArray, UseFormRegister } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HistoryFormProps {
  control: Control<AnaliseCompletaConta>;
  register: UseFormRegister<AnaliseCompletaConta>;
}

function HistorySection({ 
  title, 
  name, 
  control, 
  register 
}: { 
  title: string; 
  name: "demonstrativo_utilizacao.consumo_ponta" | "demonstrativo_utilizacao.consumo_fora_ponta" | "demonstrativo_utilizacao.demanda"; 
  control: Control<AnaliseCompletaConta>; 
  register: UseFormRegister<AnaliseCompletaConta>; 
}) {
  const { fields } = useFieldArray({ control, name });

  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">{title}</h4>
      <div className="grid grid-cols-3 gap-4 border-b pb-2 mb-2 font-medium text-sm">
        <div>Mês Ref.</div>
        <div>{name.includes('demanda') ? 'Demanda (kW)' : 'Consumo (kWh)'}</div>
        <div>Dias</div>
      </div>
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-3 gap-4">
            <Input {...register(`${name}.${index}.mes_referencia`)} />
            <Input 
              type="number" 
              step="0.01" 
              {...register(
                name.includes('demanda') 
                  ? `${name}.${index}.demanda_kw` as any 
                  : `${name}.${index}.consumo_kwh` as any
              )} 
            />
            <Input type="number" {...register(`${name}.${index}.dias`)} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function HistoryForm({ control, register }: HistoryFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Utilização (Últimos 12 Meses)</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <HistorySection 
          title="Consumo Ponta" 
          name="demonstrativo_utilizacao.consumo_ponta" 
          control={control} 
          register={register} 
        />
        <HistorySection 
          title="Consumo Fora Ponta" 
          name="demonstrativo_utilizacao.consumo_fora_ponta" 
          control={control} 
          register={register} 
        />
        <HistorySection 
          title="Demanda Medida" 
          name="demonstrativo_utilizacao.demanda" 
          control={control} 
          register={register} 
        />
      </CardContent>
    </Card>
  );
}