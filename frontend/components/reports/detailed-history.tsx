"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SpecificHistory } from "@/types/report";

const COLORS = {
  peak: "bg-red-500",
  offPeak: "bg-green-600",
  demand: "bg-blue-600",
};

export function BillDetailedHistory({ data }: { data: SpecificHistory[] }) {
  const maxPeak = Math.max(...data.map((d) => d.peakConsumption || 0), 1);
  const maxOffPeak = Math.max(...data.map((d) => d.offPeakConsumption || 0), 1);
  const maxDemand = Math.max(...data.map((d) => d.demand || 0), 1);

  const RenderRow = ({
    label,
    value,
    days,
    maxValue,
    colorClass,
  }: {
    label: string;
    value: number;
    days: number;
    maxValue: number;
    colorClass: string;
  }) => {
    const widthPercentage = Math.min(
      100,
      Math.max(0, (value / maxValue) * 100)
    );

    return (
      <div className="flex items-center gap-2 text-sm py-1 border-b border-border/50 last:border-0">
        <div className="w-20 font-medium text-xs text-muted-foreground shrink-0">
          {label}
        </div>

        <div className="flex-1 h-4 bg-secondary/50 rounded-sm overflow-hidden relative">
          <div
            className={`h-full rounded-sm ${colorClass}`}
            style={{ width: `${widthPercentage}%` }}
          />
        </div>

        <div className="w-20 text-right font-mono font-medium shrink-0">
          {value?.toLocaleString("pt-BR", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </div>

        <div className="w-10 text-right text-muted-foreground text-xs shrink-0">
          {days}
        </div>
      </div>
    );
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Detalhamento Mensal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase text-muted-foreground text-center">
              Consumo Ponta (kWh)
            </h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <p className="text-sm">Mês</p>
                <p className="text-sm">Dias</p>
              </div>
              {data.map((item, i) => (
                <RenderRow
                  key={i}
                  label={item.month}
                  value={item.peakConsumption}
                  days={item.days}
                  maxValue={maxPeak}
                  colorClass={COLORS.peak}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase text-muted-foreground text-center">
              Consumo F. Ponta (kWh)
            </h4>
            <div className="space-y-1">
              <div className="flex justify-between">
                <p className="text-sm">Mês</p>
                <p className="text-sm">Dias</p>
              </div>
              {data.map((item, i) => (
                <RenderRow
                  key={i}
                  label={item.month}
                  value={item.offPeakConsumption}
                  days={item.days}
                  maxValue={maxOffPeak}
                  colorClass={COLORS.offPeak}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4 col-span-2 flex w-full justify-center">
            <div className="max-w-1/2 w-full">
              <h4 className="font-semibold text-sm uppercase text-muted-foreground text-center">
                Demanda (kW)
              </h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <p className="text-sm">Mês</p>
                  <p className="text-sm">Dias</p>
                </div>
                {data.map((item, i) => (
                  <RenderRow
                    key={i}
                    label={item.month}
                    value={item.demand}
                    days={item.days}
                    maxValue={maxDemand}
                    colorClass={COLORS.demand}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
