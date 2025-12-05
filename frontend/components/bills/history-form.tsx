"use client";

import { Input } from "@/components/ui/input";
import { AnaliseCompletaConta } from "@/types/bill";
import { Control, useFieldArray, UseFormRegister } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
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
  name:
    | "demonstrativo_utilizacao.consumo_ponta"
    | "demonstrativo_utilizacao.consumo_fora_ponta"
    | "demonstrativo_utilizacao.demanda";
  control: Control<AnaliseCompletaConta>;
  register: UseFormRegister<AnaliseCompletaConta>;
}) {
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className="space-y-2 flex flex-col h-full">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
          {title}
        </h4>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() =>
            append({
              mes_referencia: "",
              dias: 0,
              [name.includes("demanda") ? "demanda_kw" : "consumo_kwh"]: 0,
            } as any)
          }
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 border-b pb-2 mb-2 h-8 items-center font-medium text-xs text-muted-foreground">
        <div>Mês Ref.</div>
        <div>{name.includes("demanda") ? "Demanda (kW)" : "Consumo (kWh)"}</div>
        <div>Dias</div>
      </div>

      <div className="space-y-2 flex-1">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="group relative grid grid-cols-3 gap-2 items-center"
          >
            <Input
              {...register(`${name}.${index}.mes_referencia`)}
              placeholder="MM/AAAA"
              className="h-8 text-sm"
            />
            <Input
              type="number"
              step="0.01"
              className="h-8 text-sm"
              {...register(
                name.includes("demanda")
                  ? (`${name}.${index}.demanda_kw` as any)
                  : (`${name}.${index}.consumo_kwh` as any)
              )}
            />
            <div className="relative">
              <Input
                type="number"
                className="h-8 text-sm"
                {...register(`${name}.${index}.dias`)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute -right-8 top-0 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                onClick={() => remove(index)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
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