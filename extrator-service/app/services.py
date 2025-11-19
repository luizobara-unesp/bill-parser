import os
import io
import json
import pdfplumber
from groq import Groq
from dotenv import load_dotenv
from pydantic import BaseModel, ValidationError
from typing import Type 

from app.schemas import (
    SchemaGeral, SchemaDiscriminacao, SchemaDemonstrativo, SchemaDadosLeitura
)

load_dotenv()

class PDFService:
    """Le o texto de um arquivo PDF."""
    
    def extract_text(self, file_content: bytes) -> str:
        """Extrai o texto bruto de um PDF em memória."""
        full_text = ""
        try:
            with io.BytesIO(file_content) as pdf_file:
                with pdfplumber.open(pdf_file) as pdf:
                    for page in pdf.pages:
                        page_text = page.extract_text()
                        if page_text:
                            full_text += page_text + "\n"
            
            if not full_text.strip():
                raise ValueError("Não foi possível extrair texto do PDF. Pode ser um PDF de imagem.")
            
            return full_text
        except Exception as e:
            raise ValueError(f"Erro ao processar PDF: {str(e)}")


class LLMExtractorService:
    """
    Chama o LLM (Groq) em uma estratégia de "Dividir e Conquistar Híbrida"
    (4 chamadas focadas) para balancear precisão e custo.
    """
    
    def __init__(self):
        self.client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
        if not self.client.api_key:
            raise EnvironmentError("GROQ_API_KEY não encontrada. Verifique seu arquivo .env.")
        
        self.model = "openai/gpt-oss-20b" 

    def _call_llm(self, full_text: str, target_schema: Type[BaseModel], task_prompt: str) -> dict:
        """
        Função helper genérica para chamar o LLM com um texto, um schema-alvo
        e um prompt de tarefa específico.
        """
        schema_json = json.dumps(target_schema.model_json_schema(), indent=2)
        
        system_prompt = f"""
        Você é um assistente de IA especialista em extração de dados.
        Sua tarefa é analisar o TEXTO BRUTO de uma fatura de energia e extrair *apenas* as informações solicitadas.

        TAREFA ATUAL: {task_prompt}

        REGRAS:
        1. Retorne *apenas* um objeto JSON válido.
        2. Siga rigorosamente este JSON Schema:
           {schema_json}
        3. Converta valores monetários (ex: "1.234,56") para números (ex: 1234.56).
        4. NÃO inclua dados pessoais (Nome, CNPJ, Endereço).
        
        ---
        TEXTO BRUTO DA FATURA:
        ---
        {full_text}
        ---
        FIM DO TEXTO BRUTO.
        ---

        Agora, retorne o objeto JSON com os dados extraídos para a tarefa solicitada.
        """

        try:
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Por favor, execute a tarefa: {task_prompt}"}
                ],
                temperature=0,
                max_tokens=8192, 
                top_p=1,
                stream=False,
                response_format={"type": "json_object"}
            )

            response_content = completion.choices[0].message.content
            json_data = json.loads(response_content)
            
            # Validar com o schema-alvo e criar o objeto
            # Isso força o Pydantic a aplicar quaisquer valores default (como o 'dados_cliente')
            validated_model = target_schema(**json_data) 
            
            print(f"DEBUG: Extração bem-sucedida para {target_schema.__name__}")
            
            # Retornar o DICIONÁRIO do *modelo validado*, que agora inclui os defaults
            return validated_model.model_dump()

        except ValidationError as e:
            print(f"ERRO DE VALIDAÇÃO (LLM) para {target_schema.__name__}: {e}")
            raise ValueError(f"O LLM retornou dados inválidos para {target_schema.__name__}. Erro: {e}")
        except Exception as e:
            print(f"Erro na chamada do Groq para {target_schema.__name__}: {e}")
            raise ValueError(f"Erro ao comunicar com o LLM: {str(e)}")

    def extract_data(self, text: str) -> dict:
        """
        Orquestrador principal (4 chamadas). Chama o LLM para cada "zona"
        e combina os resultados.
        """
        
        dados_gerais = self._call_llm(
            full_text=text,
            target_schema=SchemaGeral,
            task_prompt="""
            Extraia todos os dados gerais: valor_total_pagar, data_vencimento, mes_referencia_geral, dias_faturamento,
            avisos_importantes, bandeira_tarifaria, demanda_contratada (ex: Única 206kW), datas_leitura, 
            tarifas_aneel, equipamentos_medicao, niveis_tensao, e indicadores_continuidade.
            NÃO extraia as tabelas 'DISCRIMINAÇÃO', 'DEMONSTRATIVO' ou 'DADOS DE LEITURA' nesta etapa.
            """
        )

        discriminacao = self._call_llm(
            full_text=text,
            target_schema=SchemaDiscriminacao,
            task_prompt="""
            Extraia *apenas* a lista de 'itens_faturados' e 'tributos_detalhados' (PIS, COFINS linha a linha) 
            da tabela 'DISCRIMINAÇÃO DA OPERAÇÃO'.
            Para 'Adicional Band', a 'quantidade' deve ser null.
            """
        )
        
        demonstrativo = self._call_llm(
            full_text=text,
            target_schema=SchemaDemonstrativo,
            task_prompt="""
            Extraia o 'DEMONSTRATIVO DE UTILIZAÇÃO' (histórico) da página 3.
            1. Preencha 'consumo_ponta_kwh' e 'consumo_fora_ponta_kwh' com os valores do mês de referência (ex: 2568.96 e 23451.3 para JUN/2025).
            2. Preencha 'demonstrativo_utilizacao' com o histórico de 12 meses.
            3. CRÍTICO: Para 'demonstrativo_utilizacao.demanda', use *exclusivamente* a tabela 'Demanda - [kW]' 
               (ex: 88,00 para JUN/2025, 143,00 para MAI). NÃO USE os valores da 'Discriminação' (ex: 88.32 ou 117.68).
            """
        )

        dados_leitura = self._call_llm(
            full_text=text,
            target_schema=SchemaDadosLeitura,
            task_prompt="""
            Extraia *apenas* a tabela 'DADOS DE LEITURA' (com colunas 'Atual', 'Anter', 'Ft. Multip'). 
            Não confunda com o histórico 'Demonstrativo'.
            """
        )

        final_data = {
            **dados_gerais,
            **discriminacao,
            **demonstrativo,
            **dados_leitura
        }

        return final_data