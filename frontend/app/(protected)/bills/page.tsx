"use client";

import Link from "next/link";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BillSavedResponse } from "@/types/bill";
import { getBills } from "@/services/billService";
import { PageGuard } from "@/components/page-guard";
import { BillCard } from "@/components/bills/bill-card";
import { useWorkspace } from "@/context/WorkspaceContext";
import { BillPagination } from "@/components/bills/bill-pagination";

export default function BillPage() {
  const [bills, setBills] = useState<BillSavedResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 9;

  const { activeWorkspace } = useWorkspace();

  const fetchBills = async (page: number) => {
    try {
      setIsLoading(true);
      if (!activeWorkspace) return;

      const data = await getBills({
        workspaceId: activeWorkspace.id,
        page: page,
        size: pageSize,
      });

      setBills(data.content);
      setTotalPages(data.totalPages);
      setCurrentPage(data.number);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar contas.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!activeWorkspace) return;
    fetchBills(0);
  }, [activeWorkspace]);

  useEffect(() => {
    if (!activeWorkspace) return;
    fetchBills(currentPage);
  }, [currentPage, activeWorkspace]);

  if (!activeWorkspace) {
    return (
      <PageGuard>
        <div className="w-full p-6 mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-2xl uppercase">Contas de Consumo</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 animate-pulse rounded-lg w-full h-50"
              />
            ))}
          </div>
        </div>
      </PageGuard>
    );
  }

  return (
    <PageGuard>
      <div className="w-full p-6 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-2xl uppercase">Contas de Consumo</h3>

          <Link href="/bills/create">
            <Button variant="outline" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Manual
            </Button>
          </Link>
        </div>

        <div className="flex flex-col">
          <div className="min-h-[400px]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-100 animate-pulse rounded-lg w-full h-50"
                  />
                ))
              ) : (
                <>
                  {bills.map((bill) => (
                    <BillCard key={bill.id} bill={bill} />
                  ))}
                </>
              )}

              {!isLoading && bills.length === 0 && (
                <div className="col-span-full flex justify-center items-center h-40 text-gray-400 bg-gray-50 border border-dashed rounded-lg">
                  Nenhuma conta encontrada. Adicione a primeira!
                </div>
              )}
            </div>
          </div>
          <div className="mt-auto">
            {!isLoading && bills.length > 0 && (
              <BillPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </PageGuard>
  );
}
