"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BillSavedResponse } from "@/types/bill";
import { Calendar, DollarSign, FileText } from "lucide-react";
import { format } from "date-fns";

interface BillCardProps {
  bill: BillSavedResponse;
}

export function BillCard({ bill }: BillCardProps) {
  const router = useRouter();
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch {
      return dateString;
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
            Mês Referencia: {formatDate(bill.mesReferenciaGeral)}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <span className="text-xs text-gray-400">ID: {bill.id}</span>
      </CardFooter>
    </Card>
  );
}
