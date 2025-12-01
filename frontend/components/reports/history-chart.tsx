"use client"

import { TrendingUp } from "lucide-react";
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { SpecificHistory } from "@/types/report";

const chartConfig = {
  offPeakConsumption: {
    label: "Consumo Fora Ponta (kWh)",
    color: "#16a34a",
  },
  peakConsumption: {
    label: "Consumo Ponta (kWh)",
    color: "#ef4444",
  },
  demand: {
    label: "Demanda (kW)",
    color: "#2563eb",
  },
} satisfies ChartConfig

export function BillHistoryChart({ data }: { data: SpecificHistory[] }) {
  const chronologicalData = [...data].reverse();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Utilização (12 Meses)</CardTitle>
        <CardDescription>
          Comparativo de Consumo (Barras) vs Demanda Medida (Linha)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <ComposedChart accessibilityLayer data={chronologicalData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.split(" ")[1] || value}
            />

            <YAxis
              yAxisId="left"
              orientation="left"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value / 1000}k`}
              label={{ value: 'kWh', angle: -90, position: 'insideLeft' }}
            />

            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              label={{ value: 'kW', angle: 90, position: 'insideRight' }}
            />

            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />

            <Bar
              dataKey="offPeakConsumption"
              stackId="a"
              fill={chartConfig.offPeakConsumption.color}
              radius={[0, 0, 4, 4]}
              yAxisId="left"
            />
            <Bar
              dataKey="peakConsumption"
              stackId="a"
              fill={chartConfig.peakConsumption.color}
              radius={[4, 4, 0, 0]}
              yAxisId="left"
            />

            <Line
              dataKey="demand"
              type="monotone"
              stroke={chartConfig.demand.color}
              strokeWidth={3}
              dot={{ r: 4, fill: chartConfig.demand.color }}
              yAxisId="right"
            />

          </ComposedChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Análise de Potência vs Energia <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              A linha azul indica a demanda de potência medida no período.
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}