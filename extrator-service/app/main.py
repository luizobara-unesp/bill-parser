from fastapi import FastAPI, UploadFile, File, HTTPException
from app.schemas import AnaliseCompletaConta # Nosso "Contrato" de saída
from app.services import PDFService, LLMExtractorService
from pydantic import ValidationError

# 1. Inicializar a API e os Serviços (Injeção de Dependência simples)
app = FastAPI(
    title="Serviço de Extração de Contas com LLM",
    description="API que usa LLM (Groq) para extrair dados completos de faturas PDF.",
    version="2.0.0"
)

# Criamos "instâncias" dos nossos trabalhadores
pdf_service = PDFService()
llm_service = LLMExtractorService()

# 2. Definir o Endpoint
@app.post("/extract/full-analysis", response_model=AnaliseCompletaConta)
async def extract_full_bill_analysis(file: UploadFile = File(...)):
    """
    Recebe um PDF, extrai o texto, envia para um LLM (Groq) para análise 
    e retorna um JSON estruturado com a análise completa.
    """
    
    # Validação básica do arquivo
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Formato de arquivo inválido. Envie um PDF.")

    file_content = await file.read()

    try:
        # -----------------------------------------------------
        # O FLUXO DE ORQUESTRAÇÃO
        # -----------------------------------------------------
        
        # Passo 1: Chamar o serviço de PDF
        print("DEBUG: Extraindo texto do PDF...")
        raw_text = pdf_service.extract_text(file_content)
        
        # Passo 2: Chamar o serviço de LLM
        print("DEBUG: Enviando texto para o LLM (Groq)...")
        extracted_json = llm_service.extract_data_from_text(raw_text)
        
        # Passo 3: Validar a resposta do LLM com nosso Schema
        print("DEBUG: Validando resposta do LLM...")
        # Isso garante que o LLM não "esqueceu" um campo ou mandou
        # um tipo errado (ex: string em vez de número).
        validated_data = AnaliseCompletaConta(**extracted_json)
        
        # Passo 4: Retornar os dados validados
        return validated_data
    
    # -----------------------------------------------------
    # TRATAMENTO DE ERROS
    # -----------------------------------------------------
    except ValueError as e:
        # Erro de negócio (PDF ruim, erro no LLM)
        print(f"ERRO DE VALOR: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    except ValidationError as e:
        # Erro de validação (O LLM retornou um JSON no formato errado)
        print(f"ERRO DE VALIDAÇÃO: {str(e)}")
        raise HTTPException(status_code=500, detail=f"O LLM retornou dados em formato inesperado. Erro: {e}")
    except Exception as e:
        # Erro genérico
        print(f"ERRO INESPERADO: {str(e)}")
        raise HTTPException(status_code=500, detail="Um erro inesperado ocorreu.")


# Endpoint de "saúde" só para saber se a API está no ar
@app.get("/")
def health_check():
    return {"status": "Serviço de extração online"}