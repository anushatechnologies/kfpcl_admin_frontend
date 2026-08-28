export type UserRole = 'GUEST' | 'BUYER' | 'SUPPLIER' | 'BUYER_SUPPLIER';
export type ActiveRole = 'BUYER' | 'SUPPLIER';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  companyName: string;
  businessType: UserRole;
  activeRole: ActiveRole;
  gstNumber: string;
  verifiedGst: boolean;
  avatar: string;
  location: {
    city: string;
    state: string;
    country: string;
    address: string;
  };
  kycStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  walletBalance: number;
  rating: number;
  reviewCount: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface ProductTierPrice {
  minQty: number;
  maxQty: number | null;
  pricePerUnit: number;
}

export interface ProductVariant {
  id: string;
  name: string;
  options: string[];
}

export interface Product {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  brand: string;
  images: string[];
  description: string;
  moq: number;
  unit: string;
  tierPricing: ProductTierPrice[];
  supplierId: string;
  supplierName: string;
  supplierLocation: string;
  supplierRating: number;
  isGstVerified: boolean;
  verifiedSupplier: boolean;
  specifications: Record<string, string>;
  stock: number;
  inWishlist?: boolean;
  status: 'PUBLISHED' | 'DRAFT' | 'PENDING_APPROVAL' | 'REJECTED' | 'OUT_OF_STOCK';
  createdAt: string;
  /** Legacy catalog table aliases kept for admin compatibility. */
  image?: string;
  seller?: string;
  price?: number;
}

export interface RFQItem {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerCompany: string;
  buyerLocation: string;
  productTitle: string;
  category: string;
  quantity: number;
  unit: string;
  targetPrice: number;
  expectedDeliveryDate: string;
  description: string;
  attachments?: string[];
  status: 'OPEN' | 'QUOTED' | 'ACCEPTED' | 'EXPIRED' | 'REJECTED';
  createdAt: string;
  quotesCount: number;
}

export interface Quotation {
  id: string;
  rfqId: string;
  supplierId: string;
  supplierName: string;
  supplierLogo: string;
  unitPrice: number;
  totalPrice: number;
  moq: number;
  estimatedDeliveryDays: number;
  shippingCost: number;
  gstPercent: number;
  notes: string;
  validUntil: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  supplierId: string;
  supplierName: string;
  productId: string;
  productTitle: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PAID' | 'PENDING' | 'ESCROW_HOLD';
  trackingNumber?: string;
  orderDate: string;
  deliveryAddress: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: ActiveRole;
  text: string;
  timestamp: string;
  type: 'TEXT' | 'PRODUCT_CARD' | 'QUOTATION_CARD' | 'IMAGE' | 'DOCUMENT';
  productData?: Partial<Product>;
  quotationData?: Partial<Quotation>;
  isRead?: boolean;
}

export interface ChatConversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  participantCompany: string;
  participantRole: ActiveRole;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface SupplierAnalytics {
  todayLeads: number;
  todayRevenue: number;
  todayOrders: number;
  todayVisitors: number;
  performanceScore: number;
  salesHistory: { month: string; amount: number }[];
  topProducts: { title: string; views: number; sales: number }[];
}
