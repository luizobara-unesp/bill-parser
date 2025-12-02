import Link from "next/link";

import { Card, CardHeader, CardDescription } from "@/components/ui/card";

import { PageGuard } from "@/components/page-guard";

const data = {
  reports: [
    {
      title: "Consumo x Custo",
      url: "reports/consumption",
      description: "Análise detalhada de consumo e custos da sua operação",
    },
    {
      title: "Histórico Anual",
      url: "reports/history",
      description:
        "Visualize o comportamento de consumo retroativo de uma fatura específica.",
    },
  ],
};

export default function ReportsPage() {
  return (
    <PageGuard>
      <div className="p-6 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.reports.map((report) => (
          <Link key={report.url} href={report.url}>
            <Card
              className="
                p-5 h-44 flex flex-col border border-muted shadow-sm 
                hover:shadow-md transition-all rounded-xl
                cursor-pointer bg-card"
            >
              <CardHeader className="p-0 font-semibold text-lg tracking-wide">
                {report.title}
              </CardHeader>

              <CardDescription className="text-sm text-muted-foreground mt-3 leading-relaxed">
                {report.description}
              </CardDescription>
            </Card>
          </Link>
        ))}
      </div>
    </PageGuard>
  );
}
