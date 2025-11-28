import Link from "next/link";

import { Zap, ShieldCheck, ArrowRight, LineChart } from "lucide-react";

export function LandingPageContent() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900 justify-center">
      <header className="relative overflow-hidden bg-zinc-950 py-24 sm:py-32 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="container relative mx-auto px-4 text-center max-w-7xl">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900/50 px-3 py-1 text-sm text-zinc-400">
              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
              Versão 1.0 com IA Integrada
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-6 bg-clip-text text-transparent bg-linear-to-r from-white to-zinc-500">
              Domine suas Contas de Energia com IA
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-400 mb-10">
              O <strong>Bill Parser</strong> transforma PDFs complexos de
              concessionárias em dados acionáveis. Extração automática, análise
              de demanda, histórico de consumo e alertas de anomalias em
              segundos.
            </p>
            <div className="flex items-center justify-center gap-x-6">
              <Link
                href="/register"
                className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all"
              >
                Começar Agora
              </Link>
              <Link
                href="/login"
                className="text-sm font-semibold leading-6 text-white flex items-center gap-1 hover:gap-2 transition-all"
              >
                Já tenho conta <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="py-24 bg-zinc-50 ">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Mais do que um leitor de PDF
            </h2>
            <p className="text-zinc-600">
              Nossa inteligência artificial não apenas lê, ela entende sua conta
              de energia para gerar insights de economia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Extração Automática</h3>
              <p className="text-zinc-600">
                Arraste e solte suas faturas. Nosso sistema identifica
                automaticamente kWh Ponta, Fora Ponta, Demanda Contratada e
                Impostos (ICMS/PIS/COFINS).
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-6">
                <LineChart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Histórico Inteligente</h3>
              <p className="text-zinc-600">
                Visualize a evolução do seu consumo nos últimos 12 meses.
                Identifique sazonalidades e preveja seus gastos futuros com base
                no histórico.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Auditoria de Tarifas</h3>
              <p className="text-zinc-600">
                O sistema cruza os dados faturados com as tarifas da ANEEL.
                Receba alertas se houver cobrança indevida ou ultrapassagem de
                demanda.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                Fluxo de trabalho simplificado
              </h2>
              <p className="text-zinc-600 mb-8 text-lg">
                Elimine planilhas manuais. Centralize a gestão de energia de
                todas as suas unidades em um só lugar.
              </p>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-none w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">Upload da Fatura</h4>
                    <p className="text-zinc-600">
                      Envie o PDF original da concessionária. Suportamos
                      múltiplas unidades.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-none w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">Processamento IA</h4>
                    <p className="text-zinc-600">
                      Nossa IA lê linha por linha, separando consumo, demanda e
                      encargos.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-none w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">Dashboard & Aprovação</h4>
                    <p className="text-zinc-600">
                      Revise os dados extraídos e visualize em dashboards
                      gerenciais.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative bg-zinc-100 rounded-xl p-6 border border-zinc-200 shadow-xl rotate-1 hover:rotate-0 transition-all duration-500">
              <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                Live Data
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <div className="h-4 bg-zinc-100 rounded w-1/3 mb-4"></div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="h-20 bg-blue-50 rounded border border-blue-100"></div>
                  <div className="h-20 bg-blue-50 rounded border border-blue-100"></div>
                  <div className="h-20 bg-blue-50 rounded border border-blue-100"></div>
                  <div className="h-20 bg-blue-50 rounded border border-blue-100"></div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4 h-64 flex items-end justify-between gap-2">
                {[40, 60, 45, 70, 50, 80, 65, 85, 90, 70, 60, 75].map(
                  (h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className="w-full bg-zinc-800 rounded-t-sm opacity-80"
                    ></div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-zinc-900 py-12 text-center text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">
            Pronto para otimizar seus custos?
          </h2>
          <p className="text-zinc-400 mb-8 max-w-2xl mx-auto">
            Junte-se a empresas que já automatizaram a gestão de utilidades com
            o Bill Parser.
          </p>
          <Link
            href="/register"
            className="inline-block rounded-md bg-blue-600 px-8 py-4 font-bold text-white hover:bg-blue-500 transition-colors"
          >
            Criar Conta Gratuita
          </Link>
          <div className="mt-12 text-sm text-zinc-500 border-t border-zinc-800 pt-8">
            © 2025 Bill Parser. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
