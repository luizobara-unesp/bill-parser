import api from "@/lib/api";
import { ConsumptionReport, SpecificHistory } from "@/types/report";

export const getConsumptionReport = async (
  workspaceId: number
): Promise<ConsumptionReport[]> => {
  const response = await api.get<ConsumptionReport[]>(
    `/v1/reports/consumption?workspaceId=${workspaceId}`
  );
  return response.data;
};

export const getBillSpecificHistory = async (
  billId: number
): Promise<SpecificHistory[]> => {
  const response = await api.get<SpecificHistory[]>(
    `/v1/reports/bill/${billId}/history`
  );
  return response.data;
};
