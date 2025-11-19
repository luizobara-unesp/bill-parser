"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { AnaliseCompletaConta } from '@/types/bill';

interface BillReviewContextType {
  reviewData: AnaliseCompletaConta | null;
  setReviewData: (data: AnaliseCompletaConta) => void;
}

const BillReviewContext = createContext<BillReviewContextType | undefined>(undefined);

export function BillReviewProvider({ children }: { children: ReactNode }) {
  const [reviewData, setReviewData] = useState<AnaliseCompletaConta | null>(null);

  return (
    <BillReviewContext.Provider value={{ reviewData, setReviewData }}>
      {children}
    </BillReviewContext.Provider>
  );
}

export function useBillReview() {
  const context = useContext(BillReviewContext);
  if (!context) throw new Error("useBillReview deve ser usado dentro de BillReviewProvider");
  return context;
}