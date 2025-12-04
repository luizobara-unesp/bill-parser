import { PageGuard } from "@/components/page-guard";
import ConsumptionReportsPage from "../reports/consumption/page";
import HistoryReportPage from "../reports/history/page";

export default function DashboardPage() {
  return (
    <PageGuard>
      <div className="w-full p-6 mx-auto">
        <ConsumptionReportsPage/>
        
        <HistoryReportPage/>
      </div>
    </PageGuard>
  );
}
