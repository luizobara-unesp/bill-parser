"use client"; 

import { PageGuard } from "@/components/page-guard";
import { UploadBillDialog } from "@/components/bills/upload-bill-dialog";

export default function BillPage() {
  return (
    <PageGuard>
      <div className="w-full p-6">
        <div className="flex justify-between items-center mb-6">
           <h3 className="font-bold text-2xl uppercase">Contas de Consumo</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          
          <UploadBillDialog />

           <div className="bg-gray-100 border rounded-lg w-full h-40 flex items-center justify-center text-gray-400">
             Espaço Vazio
          </div>

        </div>
      </div>
    </PageGuard>
  );
}