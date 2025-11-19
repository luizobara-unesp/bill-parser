export interface ItemFaturado {
  descricao: string;
  mes_referencia: string;
  quantidade: number | null;
  valor_total: number;
}

export interface Tributo {
  nome: string;
  base_calculo: number | null;
  aliquota: string | null;
  valor: number;
}

export interface DemandaContratada {
  tipo: string;
  valor_kw: number;
}

export interface DatasLeitura {
  leitura_anterior: string;
  leitura_atual: string;
  qtd_dias: number;
  proxima_leitura_prevista: string;
}

export interface Tarifa {
  descricao: string;
  valor: number;
}

export interface EquipamentoMedicao {
  energia_ativa: string;
  energia_reativa: string;
  taxa_perda_percent: number;
}

export interface HistoricoConsumo {
  mes_referencia: string;
  consumo_kwh: number;
  dias: number;
}

export interface HistoricoDemanda {
  mes_referencia: string;
  demanda_kw: number;
  dias: number;
}

export interface DemonstrativoUtilizacao {
  consumo_ponta: HistoricoConsumo[];
  consumo_fora_ponta: HistoricoConsumo[];
  demanda: HistoricoDemanda[];
}

export interface DadoLeituraMedidor {
  descricao: string;
  atual: string;
  anterior: string;
  fator_multiplicacao: number | null;
}

export interface NiveisTensao {
  contratado: string;
  minimo: string;
  maximo: string;
}

export interface IndicadorContinuidade {
  descricao: string;
  dic: number;
  fic: number;
  dmic: number;
  dicri: number;
}

export interface AnaliseCompletaConta {
  valor_total_pagar: number;
  data_vencimento: string;
  mes_referencia_geral: string;
  consumo_ponta_kwh: number;
  consumo_fora_ponta_kwh: number;
  dias_faturamento: number;
  avisos_importantes: string[];
  bandeira_tarifaria: string;
  
  itens_faturados: ItemFaturado[];
  tributos_detalhados: Tributo[];
  
  demanda_contratada: DemandaContratada;
  datas_leitura: DatasLeitura;
  tarifas_aneel: Tarifa[];
  equipamentos_medicao: EquipamentoMedicao;
  
  demonstrativo_utilizacao: DemonstrativoUtilizacao;
  dados_leitura_medidor: DadoLeituraMedidor[];
  niveis_tensao: NiveisTensao;
  indicadores_continuidade: IndicadorContinuidade[];
  
  dados_cliente: string;
}

export interface WorkspaceResponse {
    id: number;
    name: string;
}

export interface UserResponse {
    id: number;
    email: string;
    fullName: string;
}

export interface BillResponse {
    id: number;
    
    valor_total_pagar: number;
    data_vencimento: string;
    mes_referencia_geral: string;
    consumo_ponta_kwh: number;
    consumo_fora_ponta_kwh: number;
    dias_faturamento: number;
    bandeira_tarifaria: string;

    workspace: WorkspaceResponse; 
    
    itens: ItemFaturado[]; 
    tributos: Tributo[];
}

export interface BillSavedResponse {
    id: number;
    valorTotalPagar: number;
    mesReferenciaGeral: string;
    statusMessage: string;
    savedByUserId: number;
}