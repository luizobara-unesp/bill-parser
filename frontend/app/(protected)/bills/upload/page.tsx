import { PageGuard } from "@/components/page-guard";
import { UploadBillDialog } from "@/components/bills/upload-bill-dialog";

export default function UploadPage() {
  return (
    <PageGuard>
      <div className="w-full p-6 mx-auto flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-2xl uppercase">analisar contas</h3>
        </div>
        <UploadBillDialog/>
      </div>
    </PageGuard>
  );
}
