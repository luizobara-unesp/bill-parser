from pydantic import BaseModel, Field
from typing import Optional, List

# Sub-modelo para os itens da fatura (Consumo, Adicional, etc.)
class ItemFaturado(BaseModel):
    descricao: str = Field(description="Descrição completa do item (ex: Consumo Uso Sistema [KWh]-TUSD)")
    mes_referencia: Optional[str] = Field(None, description="Mês de referência do item (ex: SET/25)")
    quantidade: Optional[float] = Field(None, description="Quantidade faturada (ex: 194.000)")
    valor_total: float = Field(description="Valor total do item em R$ (ex: 86.11)")

# Sub-modelo para tributos
class Tributo(BaseModel):
    nome: str = Field(description="Nome do tributo (ex: ICMS, PIS, COFINS)")
    base_calculo: Optional[float] = Field(None, description="Base de cálculo em R$")
    aliquota: Optional[str] = Field(None, description="Alíquota (ex: 12.00 ou 0.93%)")
    valor: float = Field(description="Valor do tributo em R$")

# O modelo principal que o LLM deve preencher
class AnaliseCompletaConta(BaseModel):
    # Dados Principais
    valor_total_pagar: float = Field(description="O valor final e total que deve ser pago.")
    data_vencimento: str = Field(description="Data de vencimento da fatura (formato DD/MM/AAAA).")
    mes_referencia_geral: str = Field(description="O mês/ano principal da fatura (ex: SET/2025).")
    
    # Dados de Consumo
    consumo_total_kwh: Optional[int] = Field(description="O consumo total em kWh do mês (ex: 194).")
    dias_faturamento: Optional[int] = Field(description="Total de dias no período de faturamento (ex: 33).")
    
    # Dados Detalhados
    itens_faturados: List[ItemFaturado] = Field(description="Lista de todos os itens que compõem o valor total.")
    tributos_detalhados: List[Tributo] = Field(description="Lista de todos os tributos cobrados.")
    
    # Dados Adicionais
    avisos_importantes: List[str] = Field(description="Uma lista de avisos encontrados (ex: CDE Escassez Hídrica...)")
    bandeira_tarifaria: Optional[str] = Field(description="Bandeira tarifária aplicada (ex: Vermelha P2).")
    
    # Omitir PII (Informações Pessoais)
    dados_cliente: str = Field("DADOS_OCULTADOS", description="Não inclua nome, CPF ou endereço do cliente.")