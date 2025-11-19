"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { uploadBill } from "@/services/billService";
import { useBillReview } from "@/context/BillReviewContext";
import { UploadCloud, Loader2, FileText, CheckCircle } from "lucide-react";

export function UploadBillDialog() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const router = useRouter();
  const { setReviewData } = useBillReview();

  const workspaceId = 1;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      const MAX_SIZE_MB = 1;
      const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

      if(selectedFile.size > MAX_SIZE_BYTES) {
        toast.error(`O arquivo excede o limite de ${MAX_SIZE_MB}MB.`);
        return;
      }

      if(selectedFile.type !== "application/pdf") {
        toast.error("Envie apenas arquivos em PDF.");
        return;
      }

      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setIsLoading(true);
      toast.info(
        "Iniciando análise inteligente... isso pode levar alguns segundos."
      );

      const data = await uploadBill(file, workspaceId);

      setResult(data);
      setReviewData(data);
      setIsOpen(false);
      router.push("/bills/review");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao processar a conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="border-2 border-dashed border-gray-300 rounded-lg w-full h-40 min-h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-primary transition-colors gap-2 text-gray-500 hover:text-primary">
          <UploadCloud className="w-10 h-10" />
          <span className="font-medium">Adicionar Nova Conta</span>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload de Conta de Energia</DialogTitle>
          <DialogDescription>
            Envie o PDF da conta. Nossa IA irá extrair os dados automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="bill-file">Arquivo PDF</Label>
            <Input
              id="bill-file"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={isLoading}
            />
          </div>

          {file && (
            <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 p-2 rounded">
              <FileText size={16} />
              <span className="truncate">{file.name}</span>
            </div>
          )}

          {result && (
            <div className="bg-green-50 p-3 rounded-md border border-green-200 text-sm text-green-800">
              <div className="flex items-center gap-2 font-bold mb-1">
                <CheckCircle size={16} /> Análise Concluída!
              </div>
              <p>Valor: R$ {result.valor_total_pagar}</p>
              <p>Vencimento: {result.data_vencimento}</p>
              <p className="text-xs text-gray-500 mt-2">
                Veja o console para o JSON completo.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button onClick={handleUpload} disabled={!file || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analisando (IA)...
              </>
            ) : (
              "Enviar e Analisar"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
