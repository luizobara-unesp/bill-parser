"use client";

import { QuickActions } from "./quick-actions";

export function AuthenticatedHome() {
  return (
    <div className="space-y-8 p-6 md:p-8 pt-6 mx-auto">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">O que você quer fazer?</h3>
        <QuickActions />
      </div>

      <div className="mt-8 p-6 border rounded-xl bg-slate-50 flex flex-col items-center justify-center text-center h-64 text-muted-foreground">
        <span className="mb-2 font-medium">
          Tendência de Consumo (Últimos 6 meses)
        </span>
        <p className="text-sm">Gráfico interativo será carregado aqui.</p>
      </div>
    </div>
  );
}
