import api from "@/lib/api";
import { AnaliseCompletaConta, BillResponse } from "@/types/bill";

export const uploadBill = async (
  file: File,
  workspaceId: number
): Promise<AnaliseCompletaConta> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("workspaceId", String(workspaceId));

  const response = await api.post<AnaliseCompletaConta>(
    "/v1/bills/extract",
    formData,
    {
      headers: {
        "Content-Type": undefined,
      },
      timeout: 300000,
    }
  );

  return response.data;
};

export const saveBill = async (data: AnaliseCompletaConta, workspaceId: number): Promise<BillResponse> => {
  const response = await api.post<BillResponse>(`/v1/bills?workspaceId=${workspaceId}`, data);
  return response.data;
};