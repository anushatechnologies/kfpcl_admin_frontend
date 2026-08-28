import { Product, RFQItem, Quotation, OrderItem, ChatConversation, ChatMessage } from '../types';

export const CATEGORIES = [
  { id: 'cat_1', name: 'Industrial Machinery', icon: 'Cpu', count: '14,200+ Products' },
  { id: 'cat_2', name: 'Electronics & Components', icon: 'Zap', count: '32,500+ Products' },
  { id: 'cat_3', name: 'Raw Materials & Metals', icon: 'Layers', count: '8,900+ Products' },
  { id: 'cat_4', name: 'Packaging & Supplies', icon: 'Box', count: '19,100+ Products' },
  { id: 'cat_5', name: 'Safety & PPE Apparel', icon: 'Shield', count: '6,400+ Products' },
  { id: 'cat_6', name: 'Chemicals & Resins', icon: 'FlaskConical', count: '5,300+ Products' },
  { id: 'cat_7', name: 'Solar & Renewable Tech', icon: 'Sun', count: '7,800+ Products' },
  { id: 'cat_8', name: 'Medical Equipment', icon: 'Activity', count: '4,100+ Products' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_001',
    title: 'Industrial Heavy-Duty CNC Milling Machine 5-Axis V2',
    category: 'Industrial Machinery',
    brand: 'ApexCorp Heavy',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
    ],
    description: 'High-precision 5-axis CNC Milling Machine designed for high-density automotive and aerospace component manufacturing. Includes automated coolant control and digital twin monitoring.',
    moq: 1,
    unit: 'Unit',
    tierPricing: [
      { minQty: 1, maxQty: 2, pricePerUnit: 24500 },
      { minQty: 3, maxQty: 5, pricePerUnit: 22800 },
      { minQty: 6, maxQty: null, pricePerUnit: 21000 },
    ],
    supplierId: 'sup_99',
    supplierName: 'PrecisionTech Dynamics',
    supplierLocation: 'San Jose, CA, USA',
    supplierRating: 4.9,
    isGstVerified: true,
    verifiedSupplier: true,
    specifications: {
      'Spindle Speed': '15,000 RPM',
      'Control Unit': 'Siemens SINUMERIK 840D',
      'Power Consumption': '35 kW',
      'Weight': '4,500 kg',
      'Warranty': '3 Years On-Site',
    },
    stock: 14,
    status: 'PUBLISHED',
    createdAt: '2026-07-15',
  },
  {
    id: 'prod_002',
    title: 'Commercial Grade Solar Inverter 50kW Three-Phase',
    category: 'Solar & Renewable Tech',
    brand: 'HelioPulse',
    images: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?w=800&auto=format&fit=crop&q=80',
    ],
    description: 'Grid-tied 50kW three-phase solar power inverter with integrated MPPT trackers, Wi-Fi telemetry, and anti-islanding protection.',
    moq: 5,
    unit: 'Pieces',
    tierPricing: [
      { minQty: 5, maxQty: 19, pricePerUnit: 1850 },
      { minQty: 20, maxQty: 49, pricePerUnit: 1680 },
      { minQty: 50, maxQty: null, pricePerUnit: 1490 },
    ],
    supplierId: 'sup_88',
    supplierName: 'SunGrid Systems Inc.',
    supplierLocation: 'Austin, TX, USA',
    supplierRating: 4.8,
    isGstVerified: true,
    verifiedSupplier: true,
    specifications: {
      'Max Efficiency': '98.8%',
      'Nominal Voltage': '400V / 480V',
      'Protection Rating': 'IP66 Waterproof',
      'Cooling': 'Smart Forced Air',
    },
    stock: 120,
    status: 'PUBLISHED',
    createdAt: '2026-07-20',
  },
  {
    id: 'prod_003',
    title: 'High-Conductivity Copper Cathode Plates Grade A',
    category: 'Raw Materials & Metals',
    brand: 'PureMet',
    images: [
      'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80',
    ],
    description: '99.99% pure LME registered electrolytic copper cathode sheets for transformer manufacturing and electrical cable production.',
    moq: 10,
    unit: 'Metric Tons',
    tierPricing: [
      { minQty: 10, maxQty: 29, pricePerUnit: 8900 },
      { minQty: 30, maxQty: 99, pricePerUnit: 8450 },
      { minQty: 100, maxQty: null, pricePerUnit: 7990 },
    ],
    supplierId: 'sup_77',
    supplierName: 'Global Metals & Smelting',
    supplierLocation: 'Houston, TX, USA',
    supplierRating: 4.7,
    isGstVerified: true,
    verifiedSupplier: true,
    specifications: {
      'Purity': '99.99% Cu',
      'Standard': 'ASTM B115',
      'Dimensions': '914mm x 914mm x 12mm',
      'Packaging': 'Steel Banded Skids',
    },
    stock: 450,
    status: 'PUBLISHED',
    createdAt: '2026-07-10',
  },
  {
    id: 'prod_004',
    title: 'Biodegradable Molded Fiber Packaging Containers',
    category: 'Packaging & Supplies',
    brand: 'EcoPack Pro',
    images: [
      'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&auto=format&fit=crop&q=80',
    ],
    description: 'Heavy-duty eco-friendly sugarcane bagasse molded pulp boxes designed for protective electronics shipping.',
    moq: 1000,
    unit: 'Units',
    tierPricing: [
      { minQty: 1000, maxQty: 4999, pricePerUnit: 0.45 },
      { minQty: 5000, maxQty: 19999, pricePerUnit: 0.35 },
      { minQty: 20000, maxQty: null, pricePerUnit: 0.24 },
    ],
    supplierId: 'usr_101',
    supplierName: 'Apex Industrial Solutions',
    supplierLocation: 'San Francisco, CA, USA',
    supplierRating: 4.9,
    isGstVerified: true,
    verifiedSupplier: true,
    specifications: {
      'Material': '100% Bagasse Pulp',
      'Drop Test Resistance': '1.8 Meters',
      'Compostable Cert': 'EN 13432 Compliant',
    },
    stock: 80000,
    status: 'PUBLISHED',
    createdAt: '2026-07-22',
  },
];

export const MOCK_RFQS: RFQItem[] = [
  {
    id: 'rfq_301',
    buyerId: 'usr_101',
    buyerName: 'Alex Vance',
    buyerCompany: 'Apex Industrial Solutions',
    buyerLocation: 'San Francisco, CA',
    productTitle: 'Custom Stainless Steel Flanges ANSI B16.5 150#',
    category: 'Industrial Machinery',
    quantity: 500,
    unit: 'Pieces',
    targetPrice: 38,
    expectedDeliveryDate: '2026-08-25',
    description: 'Seeking ASME/ANSI B16.5 Class 150 forged stainless steel 316L slip-on pipe flanges with mill test report (MTR 3.1 certificated).',
    status: 'QUOTED',
    createdAt: '2026-07-28',
    quotesCount: 3,
  },
  {
    id: 'rfq_302',
    buyerId: 'usr_101',
    buyerName: 'Alex Vance',
    buyerCompany: 'Apex Industrial Solutions',
    buyerLocation: 'San Francisco, CA',
    productTitle: 'Lithium Iron Phosphate (LiFePO4) Battery Cells 3.2V 280Ah',
    category: 'Solar & Renewable Tech',
    quantity: 120,
    unit: 'Units',
    targetPrice: 75,
    expectedDeliveryDate: '2026-09-01',
    description: 'Grade A EVE 280Ah LiFePO4 cells with QR code intact, busbars and insulation sheets included. Must support 6,000+ cycle life.',
    status: 'OPEN',
    createdAt: '2026-07-29',
    quotesCount: 1,
  },
  {
    id: 'rfq_303',
    buyerId: 'buyer_99',
    buyerName: 'Samantha Reed',
    buyerCompany: 'Vanguard Dynamics Corp',
    buyerLocation: 'Seattle, WA',
    productTitle: 'Industrial Packaging Strapping Rolls (PET Plastic 16mm)',
    category: 'Packaging & Supplies',
    quantity: 200,
    unit: 'Rolls',
    targetPrice: 42,
    expectedDeliveryDate: '2026-08-15',
    description: 'High tensile strength embossed green PET strapping rolls (16mm x 0.8mm x 1000m). Require sample prior to full shipment.',
    status: 'OPEN',
    createdAt: '2026-07-30',
    quotesCount: 0,
  },
];

export const MOCK_QUOTATIONS: Quotation[] = [
  {
    id: 'q_501',
    rfqId: 'rfq_301',
    supplierId: 'sup_99',
    supplierName: 'PrecisionTech Dynamics',
    supplierLogo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&auto=format&fit=crop&q=80',
    unitPrice: 35.5,
    totalPrice: 17750,
    moq: 500,
    estimatedDeliveryDays: 14,
    shippingCost: 450,
    gstPercent: 18,
    notes: 'Price includes EN 10204 3.1 mill certificate and heat batch testing. Express freight to SF included.',
    validUntil: '2026-08-15',
    status: 'PENDING',
    createdAt: '2026-07-29',
  },
  {
    id: 'q_502',
    rfqId: 'rfq_301',
    supplierId: 'sup_77',
    supplierName: 'Global Metals & Smelting',
    supplierLogo: 'https://images.unsplash.com/photo-1516876437184-593fda40c7ce?w=100&auto=format&fit=crop&q=80',
    unitPrice: 37.0,
    totalPrice: 18500,
    moq: 500,
    estimatedDeliveryDays: 10,
    shippingCost: 300,
    gstPercent: 18,
    notes: 'Stock readily available in Houston warehouse. Immediate dispatch upon PO confirmation.',
    validUntil: '2026-08-10',
    status: 'PENDING',
    createdAt: '2026-07-29',
  },
];

export const MOCK_ORDERS: OrderItem[] = [
  {
    id: 'ord_9001',
    orderNumber: 'B2B-2026-8891',
    buyerId: 'usr_101',
    buyerName: 'Alex Vance',
    supplierId: 'sup_88',
    supplierName: 'SunGrid Systems Inc.',
    productId: 'prod_002',
    productTitle: 'Commercial Grade Solar Inverter 50kW Three-Phase',
    productImage: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=400&auto=format&fit=crop&q=80',
    quantity: 10,
    unitPrice: 1680,
    totalAmount: 16800,
    status: 'SHIPPED',
    paymentStatus: 'ESCROW_HOLD',
    trackingNumber: 'TRK-FEDEX-9920192',
    orderDate: '2026-07-24',
    deliveryAddress: '450 Mission Street, Suite 1200, San Francisco, CA 94105',
  },
  {
    id: 'ord_9002',
    orderNumber: 'B2B-2026-7734',
    buyerId: 'usr_101',
    buyerName: 'Alex Vance',
    supplierId: 'sup_99',
    supplierName: 'PrecisionTech Dynamics',
    productId: 'prod_001',
    productTitle: 'Industrial Heavy-Duty CNC Milling Machine 5-Axis V2',
    productImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80',
    quantity: 1,
    unitPrice: 24500,
    totalAmount: 24500,
    status: 'DELIVERED',
    paymentStatus: 'PAID',
    trackingNumber: 'TRK-DHL-440182',
    orderDate: '2026-07-12',
    deliveryAddress: '450 Mission Street, Suite 1200, San Francisco, CA 94105',
  },
];

export const MOCK_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'conv_1',
    participantId: 'sup_99',
    participantName: 'PrecisionTech Dynamics',
    participantAvatar: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=120&auto=format&fit=crop&q=80',
    participantCompany: 'PrecisionTech Dynamics',
    participantRole: 'SUPPLIER',
    lastMessage: 'We have submitted Quotation #Q-501 for your stainless steel flanges RFQ.',
    lastMessageTime: '10:45 AM',
    unreadCount: 1,
  },
  {
    id: 'conv_2',
    participantId: 'sup_88',
    participantName: 'SunGrid Systems Inc.',
    participantAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    participantCompany: 'SunGrid Systems Inc.',
    participantRole: 'SUPPLIER',
    lastMessage: 'Tracking number TRK-FEDEX-9920192 has been generated for Order #B2B-2026-8891.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
  },
];

export const MOCK_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  conv_1: [
    {
      id: 'msg_1',
      conversationId: 'conv_1',
      senderId: 'usr_101',
      senderName: 'Alex Vance',
      senderRole: 'BUYER',
      text: 'Hello PrecisionTech team, can you confirm lead time for 500 units of stainless steel 316L flanges?',
      timestamp: '10:30 AM',
      type: 'TEXT',
    },
    {
      id: 'msg_2',
      conversationId: 'conv_1',
      senderId: 'sup_99',
      senderName: 'PrecisionTech Sales',
      senderRole: 'SUPPLIER',
      text: 'Hi Alex! Yes, we can fulfill 500 units within 14 business days from our California facility.',
      timestamp: '10:38 AM',
      type: 'TEXT',
    },
    {
      id: 'msg_3',
      conversationId: 'conv_1',
      senderId: 'sup_99',
      senderName: 'PrecisionTech Sales',
      senderRole: 'SUPPLIER',
      text: 'Here is our formal B2B quotation for your review:',
      timestamp: '10:45 AM',
      type: 'QUOTATION_CARD',
      quotationData: MOCK_QUOTATIONS[0],
    },
  ],
};

// ─── ADMIN PANEL MOCK DATA ─────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: 'BUYER' | 'SUPPLIER' | 'BUYER_SUPPLIER';
  kycStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  approvalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  gstVerified: boolean;
  totalOrders: number;
  totalRevenue: number;
  rating: number;
  joinDate: string;
  lastActive: string;
  isActive: boolean;
  avatar: string;
  location: string;
}

export const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: 'usr_101',
    name: 'Alex Vance',
    email: 'alex.vance@apexindustrial.com',
    phone: '+1 (555) 382-9900',
    company: 'Apex Industrial Solutions',
    role: 'BUYER_SUPPLIER',
    kycStatus: 'VERIFIED',
    gstVerified: true,
    totalOrders: 68,
    totalRevenue: 284000,
    rating: 4.9,
    joinDate: '2025-11-15',
    lastActive: '2026-08-22',
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    location: 'San Francisco, CA',
  },
  {
    id: 'sup_99',
    name: 'James Chen',
    email: 'j.chen@precisiontech.com',
    phone: '+1 (408) 555-1234',
    company: 'PrecisionTech Dynamics',
    role: 'SUPPLIER',
    kycStatus: 'VERIFIED',
    gstVerified: true,
    totalOrders: 142,
    totalRevenue: 1890000,
    rating: 4.9,
    joinDate: '2025-08-22',
    lastActive: '2026-08-22',
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    location: 'San Jose, CA',
  },
  {
    id: 'sup_88',
    name: 'Sarah Mitchell',
    email: 's.mitchell@sungrid.io',
    phone: '+1 (512) 555-5678',
    company: 'SunGrid Systems Inc.',
    role: 'SUPPLIER',
    kycStatus: 'VERIFIED',
    gstVerified: true,
    totalOrders: 89,
    totalRevenue: 956000,
    rating: 4.8,
    joinDate: '2025-09-10',
    lastActive: '2026-08-21',
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    location: 'Austin, TX',
  },
  {
    id: 'sup_77',
    name: 'Robert Zhang',
    email: 'r.zhang@globalmetals.com',
    phone: '+1 (713) 555-9012',
    company: 'Global Metals & Smelting',
    role: 'SUPPLIER',
    kycStatus: 'VERIFIED',
    gstVerified: true,
    totalOrders: 215,
    totalRevenue: 4200000,
    rating: 4.7,
    joinDate: '2025-06-18',
    lastActive: '2026-08-22',
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    location: 'Houston, TX',
  },
  {
    id: 'buyer_99',
    name: 'Samantha Reed',
    email: 's.reed@vanguarddynamics.com',
    phone: '+1 (206) 555-3456',
    company: 'Vanguard Dynamics Corp',
    role: 'BUYER',
    kycStatus: 'VERIFIED',
    gstVerified: true,
    totalOrders: 34,
    totalRevenue: 127000,
    rating: 4.6,
    joinDate: '2026-01-20',
    lastActive: '2026-08-20',
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    location: 'Seattle, WA',
  },
  {
    id: 'buyer_50',
    name: 'Marcus Williams',
    email: 'm.williams@deltamfg.com',
    phone: '+1 (312) 555-7890',
    company: 'Delta Manufacturing LLC',
    role: 'BUYER',
    kycStatus: 'PENDING',
    gstVerified: false,
    totalOrders: 12,
    totalRevenue: 45000,
    rating: 4.2,
    joinDate: '2026-04-05',
    lastActive: '2026-08-19',
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    location: 'Chicago, IL',
  },
  {
    id: 'sup_60',
    name: 'Priya Sharma',
    email: 'p.sharma@indoforge.in',
    phone: '+91 98765 43210',
    company: 'IndoForge Steel Works',
    role: 'SUPPLIER',
    kycStatus: 'PENDING',
    gstVerified: false,
    totalOrders: 0,
    totalRevenue: 0,
    rating: 0,
    joinDate: '2026-08-10',
    lastActive: '2026-08-18',
    isActive: true,
    avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    location: 'Mumbai, India',
  },
  {
    id: 'buyer_70',
    name: 'Thomas Park',
    email: 't.park@koreatechparts.kr',
    phone: '+82 10-1234-5678',
    company: 'Korea TechParts Co.',
    role: 'BUYER_SUPPLIER',
    kycStatus: 'REJECTED',
    gstVerified: false,
    totalOrders: 5,
    totalRevenue: 18500,
    rating: 3.8,
    joinDate: '2026-06-02',
    lastActive: '2026-08-15',
    isActive: false,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    location: 'Seoul, South Korea',
  },
];

export interface AdminActivity {
  id: string;
  type: 'ORDER' | 'RFQ' | 'USER' | 'PRODUCT' | 'QUOTATION';
  message: string;
  timestamp: string;
  actor: string;
}

export const MOCK_ADMIN_ACTIVITIES: AdminActivity[] = [
  { id: 'act_1', type: 'ORDER', message: 'Order #B2B-2026-8891 shipped via FedEx', timestamp: '2 min ago', actor: 'SunGrid Systems Inc.' },
  { id: 'act_2', type: 'RFQ', message: 'New RFQ posted for LiFePO4 Battery Cells', timestamp: '15 min ago', actor: 'Alex Vance' },
  { id: 'act_3', type: 'QUOTATION', message: 'Quotation #Q-501 submitted for SS Flanges', timestamp: '1 hr ago', actor: 'PrecisionTech Dynamics' },
  { id: 'act_4', type: 'USER', message: 'New supplier registration: IndoForge Steel Works', timestamp: '3 hrs ago', actor: 'Priya Sharma' },
  { id: 'act_5', type: 'PRODUCT', message: 'Product "Biodegradable Packaging" stock updated', timestamp: '5 hrs ago', actor: 'Apex Industrial Solutions' },
  { id: 'act_6', type: 'ORDER', message: 'Order #B2B-2026-7734 marked as delivered', timestamp: '8 hrs ago', actor: 'PrecisionTech Dynamics' },
  { id: 'act_7', type: 'USER', message: 'KYC verification rejected for Korea TechParts', timestamp: '12 hrs ago', actor: 'Admin System' },
  { id: 'act_8', type: 'RFQ', message: 'RFQ for PET Strapping Rolls received 0 quotes', timestamp: '1 day ago', actor: 'Samantha Reed' },
];

export const ADMIN_REVENUE_DATA = [
  { month: 'Jan', revenue: 124000, orders: 18 },
  { month: 'Feb', revenue: 156000, orders: 24 },
  { month: 'Mar', revenue: 189000, orders: 31 },
  { month: 'Apr', revenue: 210000, orders: 28 },
  { month: 'May', revenue: 245000, orders: 35 },
  { month: 'Jun', revenue: 278000, orders: 42 },
  { month: 'Jul', revenue: 312000, orders: 48 },
  { month: 'Aug', revenue: 198000, orders: 29 },
];

export const ADMIN_CATEGORY_STATS = [
  { category: 'Industrial Machinery', products: 14200, revenue: 890000, percentage: 32 },
  { category: 'Electronics & Components', products: 32500, revenue: 720000, percentage: 26 },
  { category: 'Raw Materials & Metals', products: 8900, revenue: 560000, percentage: 20 },
  { category: 'Solar & Renewable Tech', products: 7800, revenue: 340000, percentage: 12 },
  { category: 'Packaging & Supplies', products: 19100, revenue: 180000, percentage: 7 },
  { category: 'Others', products: 16200, revenue: 82000, percentage: 3 },
];

// ─── EXTENDED DATA STRUCTURES FOR 14 ADMIN MODULES ─────────────────────────────

export interface AdminRoleUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Catalog Manager' | 'Order & Escrow Lead' | 'Finance Admin' | 'Support Lead';
  department: string;
  status: 'ACTIVE' | 'INACTIVE';
  lastLogin: string;
  permissions: string[];
}

export const MOCK_ADMIN_ROLES: AdminRoleUser[] = [
  {
    id: 'adm_01',
    name: 'Rajesh Sharma',
    email: 'rajesh.admin@kfpl.in',
    role: 'Super Admin',
    department: 'Executive Management',
    status: 'ACTIVE',
    lastLogin: 'Today, 10:45 AM',
    permissions: ['ALL_PERMISSIONS', 'USER_MGMT', 'PAYMENTS', 'SETTINGS', 'CATALOG', 'ORDERS'],
  },
  {
    id: 'adm_02',
    name: 'Ananya Verma',
    email: 'ananya.catalog@kfpl.in',
    role: 'Catalog Manager',
    department: 'Catalog & Merchandising',
    status: 'ACTIVE',
    lastLogin: 'Today, 09:30 AM',
    permissions: ['CATALOG_READ', 'CATALOG_WRITE', 'PRODUCT_APPROVAL', 'CATEGORY_MGMT'],
  },
  {
    id: 'adm_03',
    name: 'Vikram Mehta',
    email: 'vikram.escrow@kfpl.in',
    role: 'Order & Escrow Lead',
    department: 'Fulfillment & Logistics',
    status: 'ACTIVE',
    lastLogin: 'Yesterday, 06:15 PM',
    permissions: ['ORDERS_READ', 'ORDERS_UPDATE', 'ESCROW_RELEASE', 'DISPUTES_RESOLVE'],
  },
  {
    id: 'adm_04',
    name: 'Sneha Patel',
    email: 'sneha.support@kfpl.in',
    role: 'Support Lead',
    department: 'Customer Success',
    status: 'ACTIVE',
    lastLogin: 'Today, 08:20 AM',
    permissions: ['SUPPORT_TICKETS', 'REVIEWS_MODERATE', 'NOTIFICATIONS_SEND'],
  },
];

export interface SellerApplication {
  id: string;
  applicantId?: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  gstNumber: string;
  category: string;
  yearsInBusiness: number;
  expectedAnnualTurnover: string;
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewNotes?: string;
  documents: { name: string; type: string; verified: boolean }[];
}

export const MOCK_SELLER_APPLICATIONS: SellerApplication[] = [
  {
    id: 'app_101',
    companyName: 'Bharat Forgings & Alloys Pvt Ltd',
    contactPerson: 'Harish Chandra',
    email: 'harish@bharatforgings.co.in',
    phone: '+91 98234 56789',
    gstNumber: '27AABCB1234F1Z1',
    category: 'Raw Materials & Metals',
    yearsInBusiness: 14,
    expectedAnnualTurnover: '₹15 Crore+',
    submittedAt: '2026-08-21',
    status: 'PENDING',
    documents: [
      { name: 'GST_Certificate.pdf', type: 'PDF', verified: true },
      { name: 'ISO_9001_Audit.pdf', type: 'PDF', verified: true },
      { name: 'Factory_License.jpg', type: 'IMAGE', verified: false },
    ],
  },
  {
    id: 'app_102',
    companyName: 'NovaGreen Solar Panels India',
    contactPerson: 'Divya Iyer',
    email: 'divya@novagreensolar.com',
    phone: '+91 94450 12345',
    gstNumber: '33AADCN9876E1Z5',
    category: 'Solar & Renewable Tech',
    yearsInBusiness: 6,
    expectedAnnualTurnover: '₹8 Crore',
    submittedAt: '2026-08-20',
    status: 'PENDING',
    documents: [
      { name: 'GSTIN_Registration.pdf', type: 'PDF', verified: true },
      { name: 'MNRE_Solar_Cert.pdf', type: 'PDF', verified: false },
    ],
  },
  {
    id: 'app_103',
    companyName: 'Zenith Pneumatics & Hydraulics',
    contactPerson: 'Karan Malhotra',
    email: 'karan@zenithpneumatics.com',
    phone: '+91 98110 54321',
    gstNumber: '07AAACZ4321K1Z9',
    category: 'Industrial Machinery',
    yearsInBusiness: 9,
    expectedAnnualTurnover: '₹5 Crore',
    submittedAt: '2026-08-19',
    status: 'APPROVED',
    reviewNotes: 'All GSTIN and Factory Audit documents verified by Finance Team.',
    documents: [
      { name: 'GST_Registration.pdf', type: 'PDF', verified: true },
      { name: 'Bank_Statement_6M.pdf', type: 'PDF', verified: true },
    ],
  },
];

export interface ProductApprovalItem {
  id: string;
  title: string;
  supplierName: string;
  category: string;
  brand: string;
  basePrice: number;
  moq: number;
  unit: string;
  submittedAt: string;
  image: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  complianceStatus: 'PASSED' | 'FLAGGED';
}

export const MOCK_PRODUCT_APPROVALS: ProductApprovalItem[] = [
  {
    id: 'p_app_01',
    title: 'High-Precision Automated CNC Lathe 3-Axis Pro',
    supplierName: 'PrecisionTech Dynamics',
    category: 'Industrial Machinery',
    brand: 'ApexCorp Heavy',
    basePrice: 185000,
    moq: 1,
    unit: 'Unit',
    submittedAt: '2026-08-22, 09:15 AM',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80',
    status: 'PENDING',
    complianceStatus: 'PASSED',
  },
  {
    id: 'p_app_02',
    title: 'Industrial Heavy Duty Safety Helmets with Face Visor (Batch of 500)',
    supplierName: 'Apex Industrial Solutions',
    category: 'Safety & PPE Apparel',
    brand: 'SafeGuard Pro',
    basePrice: 320,
    moq: 50,
    unit: 'Pieces',
    submittedAt: '2026-08-21, 04:30 PM',
    image: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=400&auto=format&fit=crop&q=80',
    status: 'PENDING',
    complianceStatus: 'PASSED',
  },
  {
    id: 'p_app_03',
    title: 'Lithium Battery Pack 48V 100Ah for Industrial Inverters',
    supplierName: 'SunGrid Systems Inc.',
    category: 'Solar & Renewable Tech',
    brand: 'HelioPulse',
    basePrice: 42000,
    moq: 5,
    unit: 'Units',
    submittedAt: '2026-08-20, 11:20 AM',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=400&auto=format&fit=crop&q=80',
    status: 'PENDING',
    complianceStatus: 'FLAGGED',
  },
];

export type SupportWorkflowStage = 'TICKET_RAISED' | 'SUPPORT_INVESTIGATION' | 'ESCALATED' | 'DISPUTE_INVESTIGATION' | 'RESOLUTION' | 'RESOLVED' | 'CLOSED';

export type SupportMessageType = 'PUBLIC' | 'INTERNAL' | 'SYSTEM';

export interface SupportMessage {
  id: string;
  sender: string;
  role: 'BUYER' | 'SELLER' | 'AGENT' | 'ADMIN';
  type: SupportMessageType;
  message: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  raisedBy: string;
  userType: 'BUYER' | 'SELLER';
  subject: string;
  category: 'ORDER_DISPUTE' | 'ESCROW_PAYMENT' | 'KYC_ISSUE' | 'PRODUCT_QUALITY' | 'TECHNICAL';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_CUSTOMER' | 'ESCALATED' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  lastUpdate: string;
  assignedTo: string;
  orderNumber?: string;
  resolutionSummary?: string;
  conversation?: { sender: string; role: 'BUYER' | 'SELLER' | 'AGENT'; message: string; timestamp: string }[];
  messages?: SupportMessage[];
  internalNotes?: { id: string; author: string; note: string; timestamp: string }[];
  disputeId?: string;
  severity?: 'NORMAL' | 'SERIOUS';
  workflowStage?: SupportWorkflowStage;
}

export const MOCK_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'tkt_01',
    ticketNumber: 'TKT-2026-901',
    raisedBy: 'Samantha Reed (Vanguard Dynamics)',
    userType: 'BUYER',
    subject: 'Delayed dispatch on Order #B2B-2026-8891 - Tracking not updated',
    category: 'ORDER_DISPUTE',
    priority: 'HIGH',
    status: 'OPEN',
    createdAt: 'Today, 08:30 AM',
    lastUpdate: '10 min ago',
    assignedTo: 'Vikram Mehta',
    orderNumber: 'B2B-2026-8891',
    resolutionSummary: 'Carrier escalation completed. FedEx tracking was refreshed and the shipment was confirmed in transit. The buyer accepted the updated delivery commitment.',
    conversation: [
      { sender: 'Samantha Reed', role: 'BUYER', message: 'The tracking page has not changed for two days. Please confirm whether the order has left the warehouse.', timestamp: '08:30 AM' },
      { sender: 'Vikram Mehta', role: 'AGENT', message: 'I have escalated this with the carrier and the supplier. I will share a confirmed scan update within the hour.', timestamp: '08:52 AM' },
      { sender: 'SunGrid Systems Inc.', role: 'SELLER', message: 'The shipment was handed to FedEx. The latest scan was delayed during the hub transfer.', timestamp: '09:18 AM' },
      { sender: 'Vikram Mehta', role: 'AGENT', message: 'Carrier scan is now visible and the shipment is in transit. Revised delivery is tomorrow. Closing this case with buyer confirmation.', timestamp: '10:05 AM' },
    ],
  },
  {
    id: 'tkt_02',
    ticketNumber: 'TKT-2026-882',
    raisedBy: 'Robert Zhang (Global Metals)',
    userType: 'SELLER',
    subject: 'Escrow payment payout release pending post-delivery',
    category: 'ESCROW_PAYMENT',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    createdAt: 'Yesterday, 02:40 PM',
    lastUpdate: '1 hr ago',
    assignedTo: 'Rajesh Sharma',
    orderNumber: 'B2B-2026-7734',
    disputeId: 'dsp_01',
    workflowStage: 'DISPUTE_INVESTIGATION',
    resolutionSummary: 'The escrow release was approved after delivery proof and the buyer confirmation were verified. Finance queued the payout for the next settlement cycle.',
    conversation: [
      { sender: 'Robert Zhang', role: 'SELLER', message: 'The order was delivered, but the escrow payout is still showing as held.', timestamp: '02:40 PM' },
      { sender: 'Rajesh Sharma', role: 'AGENT', message: 'Delivery proof and the buyer acceptance are under review. I have marked this for priority finance verification.', timestamp: '03:05 PM' },
      { sender: 'Alex Vance', role: 'BUYER', message: 'I confirm the CNC machine was received in good condition.', timestamp: '04:12 PM' },
      { sender: 'Rajesh Sharma', role: 'AGENT', message: 'Verification is complete. The payout has been approved and will be released in the next settlement cycle.', timestamp: '05:01 PM' },
    ],
  },
  {
    id: 'tkt_03',
    ticketNumber: 'TKT-2026-764',
    raisedBy: 'Marcus Williams (Delta Mfg)',
    userType: 'BUYER',
    subject: 'Request for custom tax invoice with reverse charge details',
    category: 'TECHNICAL',
    priority: 'LOW',
    status: 'RESOLVED',
    createdAt: '2026-08-19',
    lastUpdate: '2026-08-20',
    assignedTo: 'Sneha Patel',
    disputeId: 'dsp_02',
    resolutionSummary: 'The reverse-charge tax invoice was generated and sent to the buyer. The case was closed after invoice confirmation.',
    conversation: [
      { sender: 'Marcus Williams', role: 'BUYER', message: 'Please issue the tax invoice with the reverse-charge details for our accounts team.', timestamp: '2026-08-19 · 09:22 AM' },
      { sender: 'Sneha Patel', role: 'AGENT', message: 'The invoice template has been updated with the requested GST fields and is ready for review.', timestamp: '2026-08-19 · 02:10 PM' },
      { sender: 'Marcus Williams', role: 'BUYER', message: 'Received and confirmed. The invoice contains the required details.', timestamp: '2026-08-20 · 10:15 AM' },
    ],
  },
];

export type DisputeStatus = 'OPEN' | 'UNDER_REVIEW' | 'WAITING_FOR_BUYER' | 'WAITING_FOR_SELLER' | 'ESCALATED' | 'RESOLVED' | 'CLOSED';

export interface DisputeEvidence {
  id: string;
  fileName: string;
  fileType: string;
  uploadedBy: string;
  role: 'BUYER' | 'SELLER' | 'ADMIN';
  uploadedAt: string;
  description?: string;
}

export interface DisputeTimelineItem {
  id: string;
  label: string;
  description: string;
  actor: string;
  timestamp: string;
}

export type DisputeResolutionType = 'FULL_REFUND' | 'PARTIAL_REFUND' | 'REPLACEMENT' | 'RETURN_PRODUCT' | 'RELEASE_PAYMENT_TO_SELLER' | 'REJECT_DISPUTE' | 'CUSTOM_RESOLUTION';

export interface DisputeItem {
  id: string;
  disputeNumber: string;
  ticketId: string;
  orderNumber?: string;
  buyer: string;
  seller: string;
  reason: string;
  category: string;
  disputedAmount: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: DisputeStatus;
  assignedTo: string;
  createdAt: string;
  lastUpdate: string;
  requestedFrom?: 'BUYER' | 'SELLER';
  resolution?: { type: DisputeResolutionType; note: string; amount?: number; resolvedAt: string };
  evidence: DisputeEvidence[];
  timeline: DisputeTimelineItem[];
}

export const MOCK_DISPUTES: DisputeItem[] = [
  {
    id: 'dsp_01',
    disputeNumber: 'DSP-2026-041',
    ticketId: 'tkt_02',
    orderNumber: 'B2B-2026-7734',
    buyer: 'Alex Vance (Apex Industrial Solutions)',
    seller: 'Robert Zhang (Global Metals)',
    reason: 'Escrow payment payout release pending post-delivery',
    category: 'ESCROW PAYMENT',
    disputedAmount: 1958775,
    priority: 'HIGH',
    status: 'UNDER_REVIEW',
    assignedTo: 'Rajesh Sharma',
    createdAt: 'Yesterday, 03:05 PM',
    lastUpdate: '1 hr ago',
    requestedFrom: 'BUYER',
    evidence: [
      { id: 'ev_01', fileName: 'delivery-acceptance.pdf', fileType: 'PDF', uploadedBy: 'Alex Vance', role: 'BUYER', uploadedAt: 'Yesterday, 04:12 PM', description: 'Buyer delivery acceptance and receiving note.' },
      { id: 'ev_02', fileName: 'escrow-ledger-snapshot.png', fileType: 'IMAGE', uploadedBy: 'Rajesh Sharma', role: 'ADMIN', uploadedAt: 'Yesterday, 05:01 PM', description: 'Settlement ledger snapshot for review.' },
    ],
    timeline: [
      { id: 'tl_01', label: 'Dispute escalated', description: 'Ticket was routed to dispute investigation after the payment hold was not cleared.', actor: 'Rajesh Sharma', timestamp: 'Yesterday, 03:05 PM' },
      { id: 'tl_02', label: 'Buyer evidence received', description: 'Delivery confirmation was attached to the case.', actor: 'Alex Vance', timestamp: 'Yesterday, 04:12 PM' },
      { id: 'tl_03', label: 'Admin review started', description: 'Finance and support teams are validating the escrow release conditions.', actor: 'Rajesh Sharma', timestamp: 'Yesterday, 05:01 PM' },
    ],
  },
  {
    id: 'dsp_02',
    disputeNumber: 'DSP-2026-027',
    ticketId: 'tkt_03',
    orderNumber: 'B2B-2026-7550',
    buyer: 'Marcus Williams (Delta Mfg)',
    seller: 'Apex Industrial Solutions',
    reason: 'Tax invoice required with reverse-charge details',
    category: 'DOCUMENTATION',
    disputedAmount: 0,
    priority: 'LOW',
    status: 'RESOLVED',
    assignedTo: 'Sneha Patel',
    createdAt: '2026-08-19',
    lastUpdate: '2026-08-20',
    resolution: { type: 'CUSTOM_RESOLUTION', note: 'Reverse-charge invoice generated and shared with the buyer.', resolvedAt: '2026-08-20' },
    evidence: [],
    timeline: [
      { id: 'tl_04', label: 'Dispute opened', description: 'Buyer requested a corrected tax invoice.', actor: 'Marcus Williams', timestamp: '2026-08-19' },
      { id: 'tl_05', label: 'Resolved', description: 'Corrected invoice was confirmed by the buyer.', actor: 'Sneha Patel', timestamp: '2026-08-20' },
    ],
  },
];

export interface InventoryItem {
  id: string;
  productTitle: string;
  sku: string;
  category: string;
  supplierName: string;
  warehouseLocation: string;
  availableStock: number;
  reservedStock: number;
  reorderLevel: number;
  unit: string;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'CRITICAL';
}

export const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: 'inv_01',
    productTitle: 'Industrial Heavy-Duty CNC Milling Machine 5-Axis V2',
    sku: 'SKU-CNC-5AX-88',
    category: 'Industrial Machinery',
    supplierName: 'PrecisionTech Dynamics',
    warehouseLocation: 'Warehouse Hub - Mumbai (Bhiwandi)',
    availableStock: 14,
    reservedStock: 2,
    reorderLevel: 5,
    unit: 'Units',
    status: 'IN_STOCK',
  },
  {
    id: 'inv_02',
    productTitle: 'Commercial Grade Solar Inverter 50kW Three-Phase',
    sku: 'SKU-SLR-INV-50K',
    category: 'Solar & Renewable Tech',
    supplierName: 'SunGrid Systems Inc.',
    warehouseLocation: 'Warehouse Hub - Gujarat (Sanand)',
    availableStock: 120,
    reservedStock: 25,
    reorderLevel: 30,
    unit: 'Pieces',
    status: 'IN_STOCK',
  },
  {
    id: 'inv_03',
    productTitle: 'High-Conductivity Copper Cathode Plates Grade A',
    sku: 'SKU-MET-COP-01',
    category: 'Raw Materials & Metals',
    supplierName: 'Global Metals & Smelting',
    warehouseLocation: 'Port CFS - Chennai',
    availableStock: 8,
    reservedStock: 6,
    reorderLevel: 15,
    unit: 'Metric Tons',
    status: 'CRITICAL',
  },
  {
    id: 'inv_04',
    productTitle: 'Biodegradable Molded Fiber Packaging Containers',
    sku: 'SKU-PKG-BIO-100',
    category: 'Packaging & Supplies',
    supplierName: 'Apex Industrial Solutions',
    warehouseLocation: 'Warehouse Hub - Pune (Chakan)',
    availableStock: 80000,
    reservedStock: 15000,
    reorderLevel: 20000,
    unit: 'Units',
    status: 'IN_STOCK',
  },
];

export interface ReviewItem {
  id: string;
  authorName: string;
  authorCompany: string;
  targetType: 'PRODUCT' | 'SELLER';
  targetTitle: string;
  rating: number;
  comment: string;
  date: string;
  status: 'PUBLISHED' | 'FLAGGED' | 'HIDDEN';
  verifiedPurchase: boolean;
}

export const MOCK_REVIEWS: ReviewItem[] = [
  {
    id: 'rev_01',
    authorName: 'Alex Vance',
    authorCompany: 'Apex Industrial Solutions',
    targetType: 'PRODUCT',
    targetTitle: 'Commercial Grade Solar Inverter 50kW Three-Phase',
    rating: 5,
    comment: 'Exceptional build quality and thermal dissipation. Grid synchronization was seamless under heavy load testing.',
    date: '2026-08-15',
    status: 'PUBLISHED',
    verifiedPurchase: true,
  },
  {
    id: 'rev_02',
    authorName: 'Marcus Williams',
    authorCompany: 'Delta Manufacturing LLC',
    targetType: 'SELLER',
    targetTitle: 'PrecisionTech Dynamics',
    rating: 5,
    comment: 'Flawless precision milling tooling and provided 3.1 mill test certs within hours of PO generation.',
    date: '2026-08-10',
    status: 'PUBLISHED',
    verifiedPurchase: true,
  },
  {
    id: 'rev_03',
    authorName: 'Anonymous Buyer',
    authorCompany: 'Tech Corp',
    targetType: 'PRODUCT',
    targetTitle: 'Biodegradable Packaging Boxes',
    rating: 2,
    comment: 'Shipping packaging arrived crushed at the bottom corners. Need sturdier outer pallets.',
    date: '2026-08-08',
    status: 'FLAGGED',
    verifiedPurchase: true,
  },
];

export interface BrandItem {
  id: string;
  name: string;
  logo: string;
  category: string;
  originCountry: string;
  verifiedOfficial: boolean;
  totalListings: number;
}

export const MOCK_BRANDS: BrandItem[] = [
  { id: 'br_01', name: 'ApexCorp Heavy', logo: '⚙️', category: 'Industrial Machinery', originCountry: 'India / Germany', verifiedOfficial: true, totalListings: 420 },
  { id: 'br_02', name: 'HelioPulse Solar', logo: '☀️', category: 'Solar & Renewable Tech', originCountry: 'India', verifiedOfficial: true, totalListings: 185 },
  { id: 'br_03', name: 'PureMet Smelting', logo: '🛡️', category: 'Raw Materials & Metals', originCountry: 'India / USA', verifiedOfficial: true, totalListings: 94 },
  { id: 'br_04', name: 'EcoPack Pro', logo: '📦', category: 'Packaging & Supplies', originCountry: 'India', verifiedOfficial: true, totalListings: 610 },
  { id: 'br_05', name: 'Siemens Industrial', logo: '⚡', category: 'Electronics & Components', originCountry: 'Germany', verifiedOfficial: true, totalListings: 1250 },
];

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  targetAudience: 'ALL' | 'BUYERS' | 'SELLERS';
  sentAt: string;
  status: 'DISPATCHED' | 'SCHEDULED';
  channel: 'PUSH_AND_EMAIL' | 'IN_APP_ONLY';
}

export const MOCK_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'ntf_01',
    title: 'Platform Maintenance Notice: Sunday 02:00 AM - 04:00 AM IST',
    message: 'Scheduled database indexing and escrow ledger synchronization. Orders placed during this time will queue automatically.',
    targetAudience: 'ALL',
    sentAt: '2026-08-22, 08:00 AM',
    status: 'DISPATCHED',
    channel: 'PUSH_AND_EMAIL',
  },
  {
    id: 'ntf_02',
    title: 'Special Incentive: Zero Commission on First 5 RFQs Accepted This Week',
    message: 'Boost your factory direct sales volume! Zero commission fee for verified sellers on all quotation awards above ₹5,00,000.',
    targetAudience: 'SELLERS',
    sentAt: '2026-08-20, 10:00 AM',
    status: 'DISPATCHED',
    channel: 'PUSH_AND_EMAIL',
  },
];
