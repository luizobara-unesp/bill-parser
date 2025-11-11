import os
import io
import json
import pdfplumber
from groq import Groq
from dotenv import load_dotenv
from app.schemas import AnaliseCompletaConta

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
    """Chama o LLM (Groq) para extrair dados de um texto."""
    
    def __init__(self):
        self.client = Groq(api_key=os.environ.get("GROQ_API_KEY"))
        if not self.client.api_key:
            raise EnvironmentError("GROQ_API_KEY não encontrada. Verifique seu arquivo .env.")
        
        # --- LINHA ALTERADA ---
        # Trocamos pelo modelo que você encontrou no playground do Groq
        self.model = "openai/gpt-oss-20b" 
        # --- FIM DA ALTERAÇÃO ---

    def _build_prompt(self, raw_text: str) -> str:
        """Cria o prompt de sistema detalhado."""
        
        schema_json = json.dumps(AnaliseCompletaConta.model_json_schema(), indent=2)

        return f"""
        Você é um assistente de IA especialista em extração de dados financeiros de faturas.
        Sua tarefa é analisar o TEXTO BRUTO de uma conta de energia e retornar um objeto JSON estruturado.

        REGRAS IMPORTANTES:
        1.  **JSON VÁLIDO:** Você DEVE retornar *apenas* um objeto JSON válido, sem nenhum texto antes ou depois (sem "json", sem "```").
        2.  **SCHEMA OBRIGATÓRIO:** O JSON DEVE seguir rigorosamente este JSON Schema:
            {schema_json}
        3.  **OMITIR DADOS PESSOAIS:** Por segurança, NÃO inclua nome do cliente, CPF, CNPJ ou endereço no JSON. Use o valor "DADOS_OCULTADOS" conforme o schema.
        4.  **DADOS FINANCEIROS:** Converta todos os valores monetários (ex: "185,85") para números (ex: 185.85) com ponto flutuante.
        5.  **ITENS FATURADOS:** Extraia todos os itens da tabela de discriminação.
        6.  **TRIBUTOS:** Extraia os tributos (ICMS, PIS, COFINS) da tabela.
        7.  **AVISOS:** Capture avisos importantes, como "CDE Escassez Hídrica".

        ---
        TEXTO BRUTO DA FATURA:
        ---
        {raw_text}
        ---
        FIM DO TEXTO BRUTO.
        ---

        Agora, retorne o objeto JSON com os dados extraídos.
        """

    def extract_data_from_text(self, text: str) -> dict:
        """Chama a API do Groq e retorna o JSON como um dicionário Python."""
        
        prompt = self._build_prompt(text)

        print("\n--- PROMPT ENVIADO PARA O GROQ ---")
        print(prompt)
        print("--------------------------------------\n")
        
        try:
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": prompt 
                    },
                    {
                        "role": "user",
                        "content": "Por favor, extraia os dados do texto fornecido e retorne APENAS o objeto JSON."
                    }
                ],
                temperature=0,
                max_tokens=8192, 
                top_p=1,
                stream=False,
                response_format={"type": "json_object"}
            )

            response_content = completion.choices[0].message.content
            json_data = json.loads(response_content)
            return json_data

        except Exception as e:
            print(f"Erro na chamada do Groq: {e}")
            raise ValueError(f"Erro ao comunicar com o LLM: {str(e)}")