"use client";

import { Trash2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AnaliseCompletaConta } from "@/types/bill";
import { Control, useFieldArray, UseFormRegister } from "react-hook-form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface BilledItemsFormProps {
  control: Control<AnaliseCompletaConta>;
  register: UseFormRegister<AnaliseCompletaConta>;
}

export function BilledItemsForm({ control, register }: BilledItemsFormProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "itens_faturados",
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Detalhamento da Fatura</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              descricao: "Novo Item",
              mes_referencia: "",
              quantidade: 0,
              valor_total: 0,
            })
          }
        >
          <Plus className="w-4 h-4 mr-2" /> Adicionar Item
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Descrição</TableHead>
              <TableHead>Ref.</TableHead>
              <TableHead>Qtd.</TableHead>
              <TableHead>Valor (R$)</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell>
                  <Input
                    {...register(`itens_faturados.${index}.descricao`)}
                    placeholder="Descrição do item"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    {...register(`itens_faturados.${index}.mes_referencia`)}
                    placeholder="MM/AA"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    {...register(`itens_faturados.${index}.quantidade`)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.01"
                    {...register(`itens_faturados.${index}.valor_total`)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {fields.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-4">
          Nenhum item faturado encontrado.
        </p>
      )}
    </div>
  );
}