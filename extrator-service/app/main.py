from fastapi import FastAPI, UploadFile, File, HTTPException
from app.schemas import AnaliseCompletaConta
from app.services import PDFService, LLMExtractorService
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError

app = FastAPI(
    title="Serviço de Extração de Contas com LLM",
    description="API que usa LLM (Groq) para extrair dados completos de faturas PDF.",
    version="3.0.0"
)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pdf_service = PDFService()
llm_service = LLMExtractorService()

@app.post("/extract/full-analysis", response_model=AnaliseCompletaConta)
async def extract_full_bill_analysis(file: UploadFile = File(...)):
    """
    Recebe um PDF, extrai o texto, envia para um LLM (Groq) para análise
    e retorna um JSON estruturado com a análise completa.
    """
    
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Formato de arquivo inválido. Envie um PDF.")

    file_content = await file.read()

    try:
        print("DEBUG: Extraindo texto do PDF...")
        raw_text = pdf_service.extract_text(file_content)
        
        print("DEBUG: Enviando texto para o LLM (Groq) em múltiplas chamadas...")
        
        extracted_json = llm_service.extract_data(raw_text)
        print("DEBUG: Validando JSON combinado final...")
        validated_data = AnaliseCompletaConta(**extracted_json)
        
        return validated_data
    except ValueError as e:
        print(f"ERRO DE VALOR: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    except ValidationError as e:
        print(f"ERRO DE VALIDAÇÃO FINAL: {str(e)}")
        raise HTTPException(status_code=500, detail=f"O LLM retornou dados combinados em formato inesperado. Erro: {e}")
    except Exception as e:
        print(f"ERRO INESPERADO: {str(e)}")
        raise HTTPException(status_code=500, detail="Um erro inesperado ocorreu.")

@app.get("/")
def health_check():
    return {"status": "Serviço de extração (v3) online"}