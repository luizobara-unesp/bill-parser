"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BillSavedResponse } from "@/types/bill";
import { deleteBill } from "@/services/billService";

import { formatMonthReference } from "@/utils/formatDate";

import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";

import { Calendar, DollarSign, FileText, Trash2 } from "lucide-react";

interface BillCardProps {
  bill: BillSavedResponse;
  onDeleted?: (id: number) => void;
}

export function BillCard({ bill, onDeleted }: BillCardProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch {
      return dateString;
    }
  };

  const handleConfirmDelete  = async (e: React.MouseEvent) => {
    e.stopPropagation();

    await deleteBill(bill.id);

    if (onDeleted) {
      onDeleted(bill.id);
    } else {
      router.refresh();
    }
  };

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => router.push(`/bills/${bill.id}`)}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-start">
          <span className="text-lg font-bold text-primary">
            {bill.mesReferenciaGeral}
          </span>
          <FileText className="h-5 w-5 text-muted-foreground" />
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center text-2xl font-bold text-green-600">
            <DollarSign className="h-5 w-5 mr-1" />
            {bill.valorTotalPagar.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            Mês Referencia: {formatMonthReference(bill.mesReferenciaGeral)}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0 justify-between flex">
        <span className="text-xs text-gray-400">ID: {bill.id}</span>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={(e) => e.stopPropagation()}
              aria-label="Excluir conta"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir conta?</AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação não pode ser desfeita. A conta será removida
                permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={handleConfirmDelete}
              >
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}