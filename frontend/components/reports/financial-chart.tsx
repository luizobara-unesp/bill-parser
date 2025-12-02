"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { ConsumptionReport } from "@/types/report";

const chartConfig = {
  totalValue: {
    label: "Valor Pago (R$)",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function FinancialChart({ data }: { data: ConsumptionReport[] }) {
  const isEmpty = !data || !Array.isArray(data) || data.length === 0;

  if (isEmpty) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Utilização (12 Meses)</CardTitle>
          <CardDescription>
            Comparativo de Consumo (Barras) vs Demanda Medida (Linha)
          </CardDescription>
        </CardHeader>

        <CardContent className="flex h-[300px] items-center justify-center text-muted-foreground">
          Não há dados para serem visualizados.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custo Mensal (R$)</CardTitle>
        <CardDescription>Evolução do valor total das faturas</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `R$${val / 1000}k`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="totalValue"
              fill="var(--color-totalValue)"
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
