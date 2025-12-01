"use client";

import { TrendingUp } from "lucide-react";
import { ConsumptionReport } from "@/types/report";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  totalConsumptionKwh: {
    label: "Total (kWh)",
    color: "hsl(var(--chart-1))",
  },
  offPeakConsumption: {
    label: "Fora Ponta",
    color: "hsl(var(--chart-2))",
  },
  peakConsumption: {
    label: "Ponta",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function ConsumptionChart({ data }: { data: ConsumptionReport[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Consumo (kWh)</CardTitle>
        <CardDescription>
          Acompanhamento mensal de energia ativa
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.split("/")[0]}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <Line
              dataKey="totalConsumptionKwh"
              type="monotone"
              stroke="var(--color-totalConsumptionKwh)"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              dataKey="offPeakConsumption"
              type="monotone"
              stroke="var(--color-offPeakConsumption)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
            <Line
              dataKey="peakConsumption"
              type="monotone"
              stroke="var(--color-peakConsumption)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Tendência de consumo <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Visualizando últimos {data.length} meses
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
