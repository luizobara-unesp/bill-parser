import data from "@/components/dashboard/data.json";
import { PageGuard } from "@/components/page-guard";
import { DataTable } from "@/components/dashboard/data-table";
import { SectionCards } from "@/components/dashboard/section-cards";
import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive";

export default function DashboardPage() {
  return (
    <PageGuard>
      <div className="w-full p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
           <h3 className="font-bold text-2xl uppercase">Histórico de Contas</h3>
        </div>
        <>
          <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
        </>
      </div>
    </PageGuard>
  );
}
