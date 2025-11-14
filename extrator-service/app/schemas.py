from pydantic import BaseModel, Field
from typing import Optional, List

class ItemFaturado(BaseModel):
    descricao: str = Field(description="Descrição completa do item (ex: Consumo Ponta [KWh -TUSD)")
    mes_referencia: Optional[str] = Field(None, description="Mês de referência do item (ex: JUN/25)")
    quantidade: Optional[float] = Field(None, description="Quantidade faturada (ex: 2.568,960). Use null se estiver em branco.")
    valor_total: float = Field(description="Valor total do item em R$ (ex: 2.655,90)")

class Tributo(BaseModel):
    nome: str = Field(description="Nome do tributo (ex: ICMS, PIS, COFINS)")
    base_calculo: Optional[float] = Field(None, description="Base de cálculo em R$")
    aliquota: Optional[str] = Field(None, description="Alíquota (ex: 12.00 ou 0.85%)")
    valor: float = Field(description="Valor do tributo em R$")

class DemandaContratada(BaseModel):
    tipo: str = Field(description="Tipo de demanda contratada (ex: Única)")
    valor_kw: float = Field(description="Valor da demanda contratada em kW (ex: 206)")

class DatasLeitura(BaseModel):
    leitura_anterior: str = Field(description="Data da leitura anterior (DD/MM/AAAA)")
    leitura_atual: str = Field(description="Data da leitura atual (DD/MM/AAAA)")
    qtd_dias: int = Field(description="Quantidade de dias no período")
    proxima_leitura_prevista: str = Field(description="Data da próxima leitura (DD/MM/AAAA)")

class Tarifa(BaseModel):
    descricao: str = Field(description="Descrição da tarifa ANEEL (ex: kWh Ponta TE)")
    valor: float = Field(description="Valor da tarifa em R$ (ex: 0,50197000)")

class EquipamentoMedicao(BaseModel):
    energia_ativa: str = Field(description="Número do medidor de energia ativa")
    energia_reativa: str = Field(description="Número do medidor de energia reativa")
    taxa_perda_percent: float = Field(description="Taxa de perda em %")

class ConsumoHistorico(BaseModel):
    mes_referencia: str = Field(description="Mês de referência (ex: 2025 JUN)")
    consumo_kwh: float = Field(description="Consumo em kWh no mês")
    dias: int = Field(description="Quantidade de dias no período")

class DemandaHistorico(BaseModel):
    mes_referencia: str = Field(description="Mês de referência (ex: 2025 JUN)")
    demanda_kw: float = Field(description="Demanda em kW no mês")
    dias: int = Field(description="Quantidade de dias no período")
        
class DemonstrativoUtilizacao(BaseModel):
    consumo_ponta: List[ConsumoHistorico] = Field(description="Histórico de consumo na Ponta")
    consumo_fora_ponta: List[ConsumoHistorico] = Field(description="Histórico de consumo Fora de Ponta")
    demanda: List[DemandaHistorico] = Field(description="Histórico de demanda")

class DadosLeituraMedidor(BaseModel):
    descricao: str = Field(description="Descrição do dado (ex: kWh Ponta, kW F.Ponta)")
    atual: Optional[str] = Field(None, description="Valor de leitura atual")
    anterior: Optional[str] = Field(None, description="Valor de leitura anterior")
    fator_multiplicacao: Optional[float] = Field(None, description="Fator de multiplicação (Ft. Multip)")

class NiveisTensao(BaseModel):
    contratado: str = Field(description="Nível de tensão contratado (ex: 23.100)")
    minimo: str = Field(description="Nível de tensão mínimo (ex: 21.483)")
    maximo: str = Field(description="Nível de tensão máximo (ex: 24.255)")

class IndicadoresContinuidade(BaseModel):
    descricao: str = Field(description="Tipo de padrão (ex: Padrão Mensal, Apurado Mensal)")
    dic: float = Field(description="Valor DIC (hora)")
    fic: float = Field(description="Valor FIC (nº de vezes)")
    dmic: float = Field(description="Valor DMIC (hora)")
    dicri: float = Field(description="Valor DICRI (hora)")

# === SCHEMAS-ALVO PARA EXTRAÇÃO (Reduzido para 4) ===

# 1. Todos os campos "gerais" e simples
class SchemaGeral(BaseModel):
    valor_total_pagar: float = Field(description="O valor final e total que deve ser pago (ex: 17.694,26).")
    data_vencimento: str = Field(description="Data de vencimento da fatura (formato DD/MM/AAAA).")
    mes_referencia_geral: str = Field(description="O mês/ano principal da fatura (ex: JUN/2025).")
    dias_faturamento: Optional[int] = Field(description="Total de dias no período de faturamento (ex: 30).")
    avisos_importantes: List[str] = Field(description="Uma lista de avisos encontrados (ex: 'ATRASO NO PAGAMENTO...').")
    bandeira_tarifaria: Optional[str] = Field(description="Bandeira tarifária aplicada (ex: Vermelha P1).")
    demanda_contratada: Optional[DemandaContratada] = Field(None, description="Detalhes da demanda contratada (Seção 'Demanda Contratada').")
    datas_leitura: Optional[DatasLeitura] = Field(None, description="Datas de leitura do período (Seção 'DATAS DE LEITURA').")
    tarifas_aneel: List[Tarifa] = Field(default_factory=list, description="Lista de tarifas ANEEL aplicadas (Seção 'TARIFA ANEEL').")
    equipamentos_medicao: Optional[EquipamentoMedicao] = Field(None, description="Detalhes dos equipamentos de medição (Seção 'EQUIPAMENTOS DE MEDIÇÃO').")
    niveis_tensao: Optional[NiveisTensao] = Field(None, description="Níveis de tensão contratados e medidos (Seção 'NÍVEIS DE TENSÃO').")
    indicadores_continuidade: List[IndicadoresContinuidade] = Field(default_factory=list, description="Indicadores de continuidade (DIC, FIC) mensais e apurados (Seção 'INDICADORES DE CONTINUIDADE').")
    dados_cliente: str = Field("DADOS_OCULTADOS", description="Não inclua nome, CNPJ ou endereço do cliente.")

# 2. Tabela de Discriminação
class SchemaDiscriminacao(BaseModel):
    itens_faturados: List[ItemFaturado] = Field(description="Lista de todos os itens da 'DISCRIMINAÇÃO DA OPERAÇÃO'.")
    tributos_detalhados: List[Tributo] = Field(description="Lista de todos os tributos (PIS, COFINS) da 'DISCRIMINAÇÃO DA OPERAÇÃO'.")

# 3. Tabela de Histórico (Demonstrativo)
class SchemaDemonstrativo(BaseModel):
    # Campos que vêm desta seção mas vão para o nível raiz do JSON
    consumo_ponta_kwh: Optional[float] = Field(description="Consumo total em kWh no horário de Ponta (ex: 2568.00). Extrair do 'DEMONSTRATIVO DE UTILIZAÇÃO'.")
    consumo_fora_ponta_kwh: Optional[float] = Field(description="Consumo total em kWh no horário Fora de Ponta (ex: 23451.00). Extrair do 'DEMONSTRATIVO DE UTILIZAÇÃO'.")
    # O objeto aninhado
    demonstrativo_utilizacao: Optional[DemonstrativoUtilizacao] = Field(None, description="Histórico de consumo e demanda dos últimos 12 meses (Seção 'DEMONSTRATIVO DE UTILIZAÇÃO').")

# 4. Tabela de Leitura do Medidor
class SchemaDadosLeitura(BaseModel):
    dados_leitura_medidor: List[DadosLeituraMedidor] = Field(default_factory=list, description="Tabela 'DADOS DE LEITURA' com leituras atual, anterior e fator.")


# === O MODELO FINAL COMBINADO ===
# (Este não muda, ele é o "contrato final")

class AnaliseCompletaConta(BaseModel):
    # Dados Principais
    valor_total_pagar: float
    data_vencimento: str
    mes_referencia_geral: str
    consumo_ponta_kwh: Optional[float]
    consumo_fora_ponta_kwh: Optional[float]
    dias_faturamento: Optional[int]
    avisos_importantes: List[str]
    bandeira_tarifaria: Optional[str]
    
    # Dados da Discriminação
    itens_faturados: List[ItemFaturado]
    tributos_detalhados: List[Tributo]
    
    # Dados Específicos
    demanda_contratada: Optional[DemandaContratada]
    datas_leitura: Optional[DatasLeitura]
    tarifas_aneel: List[Tarifa]
    equipamentos_medicao: Optional[EquipamentoMedicao]
    demonstrativo_utilizacao: Optional[DemonstrativoUtilizacao]
    dados_leitura_medidor: List[DadosLeituraMedidor]
    niveis_tensao: Optional[NiveisTensao]
    indicadores_continuidade: List[IndicadoresContinuidade]
    
    dados_cliente: str