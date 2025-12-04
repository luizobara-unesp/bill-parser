import api from "@/lib/api";
import { AnaliseCompletaConta, BillResponse, PageableResponse, BillSavedResponse } from "@/types/bill";

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

interface GetBillsParams {
  workspaceId: number;
  page?: number;
  size?: number;
}

export const getBills = async ({ workspaceId, page = 0, size = 10 }: GetBillsParams) => {
  const response = await api.get<PageableResponse<BillSavedResponse>>(
    `/v1/bills?workspaceId=${workspaceId}&page=${page}&size=${size}`
  );
  return response.data;
};

export const getBillById = async (id: number): Promise<AnaliseCompletaConta> => {
  const response = await api.get<AnaliseCompletaConta>(`/v1/bills/${id}`);
  return response.data;
};

export const updateBill = async (id: number, data: AnaliseCompletaConta): Promise<void> => {
  await api.put(`/v1/bills/${id}`, data); 
};

export const deleteBill = async (id: number): Promise<void> => {
  await api.delete(`/v1/bills/${id}`);
}