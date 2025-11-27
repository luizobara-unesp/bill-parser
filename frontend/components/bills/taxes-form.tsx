"use client";

import { Control, useFieldArray, UseFormRegister } from "react-hook-form";
import { AnaliseCompletaConta } from "@/types/bill";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus } from "lucide-react";

interface TaxesFormProps {
  control: Control<AnaliseCompletaConta>;
  register: UseFormRegister<AnaliseCompletaConta>;
}

export function TaxesForm({ control, register }: TaxesFormProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "tributos_detalhados",
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Tributos e Encargos</h3>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => append({ nome: "", base_calculo: 0, aliquota: "", valor: 0 })}
        >
          <Plus className="w-4 h-4 mr-2" /> Adicionar
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tributo</TableHead>
              <TableHead>Base Calc.</TableHead>
              <TableHead>Alíquota</TableHead>
              <TableHead>Valor (R$)</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell>
                  <Input {...register(`tributos_detalhados.${index}.nome`)} placeholder="Ex: ICMS" />
                </TableCell>
                <TableCell>
                  <Input type="number" step="0.01" {...register(`tributos_detalhados.${index}.base_calculo`)} />
                </TableCell>
                <TableCell>
                  <Input {...register(`tributos_detalhados.${index}.aliquota`)} placeholder="%" />
                </TableCell>
                <TableCell>
                  <Input type="number" step="0.01" {...register(`tributos_detalhados.${index}.valor`)} />
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" type="button" onClick={() => remove(index)} className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}