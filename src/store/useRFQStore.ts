import { create } from 'zustand';
import { RFQItem, Quotation } from '../types';

interface RFQState {
  rfqs: RFQItem[];
  quotations: Quotation[];
  selectedRFQ: RFQItem | null;
  createRFQModalOpen: boolean;
  createQuotationModalOpen: boolean;
  compareModalOpen: boolean;

  setCreateRFQModalOpen: (open: boolean) => void;
  setCreateQuotationModalOpen: (open: boolean) => void;
  setCompareModalOpen: (open: boolean) => void;
  setSelectedRFQ: (rfq: RFQItem | null) => void;
  
  createRFQ: (rfq: Omit<RFQItem, 'id' | 'createdAt' | 'quotesCount' | 'status'>) => void;
  createQuotation: (quote: Omit<Quotation, 'id' | 'createdAt' | 'status'>) => void;
  acceptQuotation: (quotationId: string) => void;
  approveQuotation: (quotationId: string) => void;
  rejectQuotation: (quotationId: string) => void;
  getQuotesForRFQ: (rfqId: string) => Quotation[];
}

export const useRFQStore = create<RFQState>((set, get) => ({
  rfqs: [],
  quotations: [],
  selectedRFQ: null,
  createRFQModalOpen: false,
  createQuotationModalOpen: false,
  compareModalOpen: false,

  setCreateRFQModalOpen: (open) => set({ createRFQModalOpen: open }),
  setCreateQuotationModalOpen: (open) => set({ createQuotationModalOpen: open }),
  setCompareModalOpen: (open) => set({ compareModalOpen: open }),
  setSelectedRFQ: (rfq) => set({ selectedRFQ: rfq }),

  createRFQ: (newRfq) => {
    const rfq: RFQItem = {
      ...newRfq,
      id: `rfq_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      quotesCount: 0,
      status: 'OPEN',
    };
    set((state) => ({ rfqs: [rfq, ...state.rfqs] }));
  },

  createQuotation: (newQuote) => {
    const quote: Quotation = {
      ...newQuote,
      id: `q_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'PENDING',
    };

    set((state) => {
      const updatedRfqs = state.rfqs.map((r) =>
        r.id === quote.rfqId ? { ...r, quotesCount: r.quotesCount + 1, status: 'QUOTED' as const } : r
      );
      return {
        quotations: [quote, ...state.quotations],
        rfqs: updatedRfqs,
      };
    });
  },

  acceptQuotation: (quoteId) => {
    set((state) => {
      const targetQuote = state.quotations.find((q) => q.id === quoteId);
      if (!targetQuote) return state;

      const updatedQuotes = state.quotations.map((q) =>
        q.id === quoteId
          ? { ...q, status: 'ACCEPTED' as const }
          : q.rfqId === targetQuote.rfqId
          ? { ...q, status: 'REJECTED' as const }
          : q
      );

      const updatedRfqs = state.rfqs.map((r) =>
        r.id === targetQuote.rfqId ? { ...r, status: 'ACCEPTED' as const } : r
      );

      return { quotations: updatedQuotes, rfqs: updatedRfqs };
    });
  },

  approveQuotation: (quoteId) => get().acceptQuotation(quoteId),

  rejectQuotation: (quoteId) => {
    set((state) => ({
      quotations: state.quotations.map((quote) => quote.id === quoteId ? { ...quote, status: 'REJECTED' as const } : quote),
    }));
  },

  getQuotesForRFQ: (rfqId) => {
    return get().quotations.filter((q) => q.rfqId === rfqId);
  },
}));
