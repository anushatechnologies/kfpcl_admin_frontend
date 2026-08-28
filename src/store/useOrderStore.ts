import { create } from 'zustand';
import { OrderItem } from '../types';

interface OrderState {
  orders: OrderItem[];
  selectedOrder: OrderItem | null;
  setSelectedOrder: (order: OrderItem | null) => void;
  updateOrderStatus: (orderId: string, status: OrderItem['status'], trackingNumber?: string) => void;
  createOrderFromQuotation: (quotationId: string, productData: any, deliveryAddress: string) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  selectedOrder: null,

  setSelectedOrder: (order) => set({ selectedOrder: order }),

  updateOrderStatus: (orderId, status, trackingNumber) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status,
              trackingNumber: trackingNumber || o.trackingNumber,
              paymentStatus: status === 'DELIVERED' ? 'PAID' : o.paymentStatus,
            }
          : o
      ),
    }));
  },

  createOrderFromQuotation: (quoteId, productData, deliveryAddress) => {
    const newOrder: OrderItem = {
      id: `ord_${Date.now()}`,
      orderNumber: `B2B-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      buyerId: 'usr_101',
      buyerName: 'Alex Vance',
      supplierId: productData.supplierId || 'sup_99',
      supplierName: productData.supplierName || 'PrecisionTech Dynamics',
      productId: productData.id || 'prod_001',
      productTitle: productData.title || 'B2B Wholesale Order',
      productImage: productData.images?.[0] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80',
      quantity: productData.moq || 100,
      unitPrice: productData.unitPrice || 35.5,
      totalAmount: productData.totalPrice || 3550,
      status: 'CONFIRMED',
      paymentStatus: 'ESCROW_HOLD',
      orderDate: new Date().toISOString().split('T')[0],
      deliveryAddress: deliveryAddress || '450 Mission Street, Suite 1200, San Francisco, CA 94105',
    };

    set((state) => ({ orders: [newOrder, ...state.orders] }));
  },
}));
