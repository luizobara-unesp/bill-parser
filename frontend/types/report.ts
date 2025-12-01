export interface ConsumptionReport {
  month: string;
  totalValue: number;
  totalConsumptionKwh: number;
  peakConsumption: number;
  offPeakConsumption: number;
}

export interface SpecificHistory {
  month: string;
  peakConsumption: number;
  offPeakConsumption: number;
  demand: number;
  days: number;
}
