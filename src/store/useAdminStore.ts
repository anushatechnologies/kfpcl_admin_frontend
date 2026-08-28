import { create } from 'zustand';
import {
  SellerApplication,
  ProductApprovalItem,
  SupportTicket,
  SupportWorkflowStage,
  SupportMessageType,
  DisputeItem,
  DisputeStatus,
  DisputeEvidence,
  InventoryItem,
  ReviewItem,
  BrandItem,
  AdminNotification,
  AdminRoleUser,
} from '../constants/mockData';
import { useProductStore } from './useProductStore';

export type AdminTopSection =
  | 'DASHBOARD'
  | 'USER_MGMT'
  | 'SELLER_MGMT'
  | 'BUYER_MGMT'
  | 'CATALOG_MGMT'
  | 'ORDER_MGMT'
  | 'RFQ_MGMT'
  | 'INVENTORY'
  | 'PAYMENTS'
  | 'REVIEWS'
  | 'SUPPORT'
  | 'NOTIFICATIONS'
  | 'ANALYTICS'
  | 'SETTINGS';

export type AdminSubSection =
  // User Management
  | 'USERS_BUYERS'
  | 'USERS_SELLERS'
  | 'USERS_ROLES'
  // Seller Management
  | 'SELLERS_LIST'
  | 'SELLERS_APPLICATIONS'
  | 'SELLERS_STORES'
  // Buyer Management
  | 'BUYERS_LIST'
  | 'BUYERS_DETAILS'
  | 'BUYERS_ACTIVITY'
  // Catalog Management
  | 'CATALOG_CATEGORIES'
  | 'CATALOG_SUBCATEGORIES'
  | 'CATALOG_ADD_PRODUCT'
  | 'CATALOG_PRODUCTS'
  | 'CATALOG_APPROVAL'
  | 'CATALOG_BRANDS'
  // Order Management
  | 'ORDERS_ALL'
  | 'ORDERS_PENDING'
  | 'ORDERS_PROCESSING'
  | 'ORDERS_SHIPPED'
  | 'ORDERS_DELIVERED'
  | 'ORDERS_CANCELLED'
  | 'ORDERS_DISPUTES'
  // RFQ Management
  | 'RFQS_ALL'
  | 'RFQS_REQUESTS'
  | 'RFQS_RESPONSES'
  | 'RFQS_STATUS'
  // Default / Root
  | 'ROOT';

export interface AdminAuthUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Catalog Manager' | 'Order & Escrow Lead' | 'Finance Admin' | 'Support Lead';
  department: string;
  avatar: string;
}

export interface PlatformCategory {
  id: string;
  name: string;
  image?: string;
  description?: string;
  displayOrder?: number;
  discount?: number;
  isActive?: boolean;
  icon: string;
  count: string;
  commissionRate?: number;
  subcategories?: string[];
  subcategoryImages?: Record<string, string>;
  subcategoryDetails?: Record<string, { description?: string; displayOrder?: number; discount?: number; isActive?: boolean }>;
}

interface AdminState {
  // Auth state
  isAdminAuthenticated: boolean;
  adminUser: AdminAuthUser | null;
  updateAdminUser: (changes: Partial<AdminAuthUser>) => void;
  login: (email: string, password?: string, customUser?: Partial<AdminAuthUser>) => boolean;
  signup: (userData: { name: string; email: string; role: AdminAuthUser['role']; department: string }) => boolean;
  logout: () => void;

  // Navigation
  activeSection: AdminTopSection;
  activeSubSection: AdminSubSection;
  setActiveSection: (section: AdminTopSection, subSection?: AdminSubSection) => void;
  setActiveSubSection: (subSection: AdminSubSection) => void;

  // Search & Global filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currency: 'INR' | 'USD';
  setCurrency: (c: 'INR' | 'USD') => void;
  formatCurrency: (amount: number) => string;

  // Dynamic Data & Collections
  categories: PlatformCategory[];
  setCategories: (categories: PlatformCategory[]) => void;
  addCategory: (cat: Omit<PlatformCategory, 'id'>) => void;
  updateCategory: (id: string, changes: Partial<Omit<PlatformCategory, 'id'>>) => void;
  deleteCategory: (id: string) => void;

  sellerApplications: SellerApplication[];
  supplierApprovalByUserId: Record<string, SellerApplication['status']>;
  submitSellerApplication: (application: Omit<SellerApplication, 'id' | 'status'>) => void;
  isSupplierApproved: (userId: string) => boolean;
  approveSellerApplication: (id: string, notes?: string) => void;
  rejectSellerApplication: (id: string, notes?: string) => void;

  productApprovals: ProductApprovalItem[];
  addProductApproval: (approval: ProductApprovalItem) => void;
  approveProduct: (id: string) => void;
  rejectProduct: (id: string) => void;

  supportTickets: SupportTicket[];
  disputes: DisputeItem[];
  resolveTicket: (id: string) => void;
  reopenTicket: (id: string) => void;
  updateTicketWorkflow: (id: string, stage: SupportWorkflowStage) => void;
  updateTicketPriority: (id: string, priority: SupportTicket['priority']) => void;
  updateTicketStatus: (id: string, status: SupportTicket['status']) => void;
  updateTicketAssignment: (id: string, assignedTo: string) => void;
  addTicketMessage: (id: string, type: SupportMessageType, message: string) => void;
  addTicketInternalNote: (id: string, note: string) => void;
  createDisputeFromTicket: (ticketId: string, input: { reason: string; category: string; disputedAmount: number; assignedTo: string }) => void;
  updateDisputeStatus: (id: string, status: DisputeStatus, actor?: string) => void;
  addDisputeEvidence: (id: string, evidence: Omit<DisputeEvidence, 'id' | 'uploadedAt'>) => void;
  requestDisputeInformation: (id: string, from: 'BUYER' | 'SELLER') => void;
  resolveDispute: (id: string, resolution: DisputeItem['resolution']) => void;
  closeDispute: (id: string) => void;

  inventory: InventoryItem[];
  addInventory: (item: Omit<InventoryItem, 'id' | 'status'>) => void;
  updateInventoryStock: (id: string, newStock: number) => void;
  updateInventoryDetails: (id: string, changes: Partial<Omit<InventoryItem, 'id'>>) => void;
  deleteInventory: (id: string) => void;

  reviews: ReviewItem[];
  updateReviewStatus: (id: string, status: ReviewItem['status']) => void;

  notificationsList: AdminNotification[];
  addNotification: (notification: Omit<AdminNotification, 'id' | 'sentAt'>) => void;

  adminRolesList: AdminRoleUser[];
  addAdminRoleUser: (user: Omit<AdminRoleUser, 'id' | 'lastLogin'>) => void;

  // Theme support
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Use a fresh API-backed namespace so legacy seeded browser data is never shown.
const CATEGORY_STORAGE_KEY = 'kfpl_api_categories';

const getInitialCategories = (): PlatformCategory[] => {
  return [];
};

const persistCategories = (categories: PlatformCategory[]) => {
  localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(categories));
};

const INITIAL_CATEGORIES: PlatformCategory[] = getInitialCategories();

// Initialize theme from localStorage
const getInitialTheme = (): 'light' | 'dark' => {
  const saved = localStorage.getItem('kfpl_theme');
  return saved === 'light' ? 'light' : 'dark';
};

export const useAdminStore = create<AdminState>((set, get) => ({
  theme: getInitialTheme(),
  toggleTheme: () => {
    const nextTheme = get().theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('kfpl_theme', nextTheme);
    set({ theme: nextTheme });
  },
  isAdminAuthenticated: false,
  adminUser: null,

  login: (email, _password, customUser) => {
    const user: AdminAuthUser = {
      id: `adm_${Date.now()}`,
      name: customUser?.name || 'Administrator',
      email: email,
      role: customUser?.role || 'Super Admin',
      department: customUser?.department || 'Executive Management',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
    set({ isAdminAuthenticated: true, adminUser: user });
    return true;
  },

  signup: (userData) => {
    const newUser: AdminAuthUser = {
      id: `adm_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    };
    set({ isAdminAuthenticated: true, adminUser: newUser });
    return true;
  },

  logout: () => {
    set({ isAdminAuthenticated: false, adminUser: null, activeSection: 'DASHBOARD', activeSubSection: 'ROOT' });
  },
  updateAdminUser: (changes) => set((state) => ({ adminUser: state.adminUser ? { ...state.adminUser, ...changes } : state.adminUser })),

  activeSection: 'DASHBOARD',
  activeSubSection: 'ROOT',

  setActiveSection: (section, subSection = 'ROOT') => {
    set({ activeSection: section, activeSubSection: subSection });
  },

  setActiveSubSection: (subSection) => {
    set({ activeSubSection: subSection });
  },

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  currency: 'INR',
  setCurrency: (c) => set({ currency: c }),

  formatCurrency: (amount: number) => {
    const { currency } = get();
    if (currency === 'INR') {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
    }
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
  },

  categories: INITIAL_CATEGORIES,
  setCategories: (categories) => set({ categories }),

  addCategory: (newCat) => {
    const cat: PlatformCategory = {
      ...newCat,
      id: `cat_${Date.now()}`,
      count: '0 Products',
    };
    set((state) => {
      const categories = [...state.categories, cat];
      persistCategories(categories);
      return { categories };
    });
  },
  updateCategory: (id, changes) => {
    set((state) => {
      const categories = state.categories.map((category) => category.id === id ? { ...category, ...changes } : category);
      persistCategories(categories);
      return { categories };
    });
  },

  deleteCategory: (id) => {
    set((state) => {
      const categories = state.categories.filter((c) => c.id !== id);
      persistCategories(categories);
      return { categories };
    });
  },

  sellerApplications: [],
  supplierApprovalByUserId: {},

  submitSellerApplication: (application) => {
    set((state) => ({
      sellerApplications: [...state.sellerApplications, { ...application, id: `app_${Date.now()}`, status: 'PENDING' }],
      supplierApprovalByUserId: application.applicantId ? { ...state.supplierApprovalByUserId, [application.applicantId]: 'PENDING' } : state.supplierApprovalByUserId,
    }));
  },

  isSupplierApproved: (userId) => get().supplierApprovalByUserId[userId] === 'APPROVED',

  approveSellerApplication: (id, notes) => {
    set((state) => {
      const target = state.sellerApplications.find((app) => app.id === id);
      return {
        sellerApplications: state.sellerApplications.map((app) => app.id === id ? { ...app, status: 'APPROVED' as const, reviewNotes: notes || 'Approved by Admin Team' } : app),
        supplierApprovalByUserId: target?.applicantId ? { ...state.supplierApprovalByUserId, [target.applicantId]: 'APPROVED' } : state.supplierApprovalByUserId,
      };
    });
  },

  rejectSellerApplication: (id, notes) => {
    set((state) => {
      const target = state.sellerApplications.find((app) => app.id === id);
      return {
        sellerApplications: state.sellerApplications.map((app) => app.id === id ? { ...app, status: 'REJECTED' as const, reviewNotes: notes || 'Rejected due to compliance issues' } : app),
        supplierApprovalByUserId: target?.applicantId ? { ...state.supplierApprovalByUserId, [target.applicantId]: 'REJECTED' } : state.supplierApprovalByUserId,
      };
    });
  },

  productApprovals: [],

  addProductApproval: (approval) => {
    set((state) => ({ productApprovals: [approval, ...state.productApprovals] }));
  },

  approveProduct: (id) => {
    useProductStore.getState().updateProductStatus(id, 'PUBLISHED');
    set((state) => ({
      productApprovals: state.productApprovals.map((p) => (p.id === id ? { ...p, status: 'APPROVED' as const } : p)),
    }));
  },

  rejectProduct: (id) => {
    useProductStore.getState().updateProductStatus(id, 'REJECTED');
    set((state) => ({
      productApprovals: state.productApprovals.map((p) => (p.id === id ? { ...p, status: 'REJECTED' as const } : p)),
    }));
  },

  supportTickets: [],
  disputes: [],

  resolveTicket: (id) => {
    set((state) => ({
      supportTickets: state.supportTickets.map((t) => (t.id === id ? { ...t, status: 'RESOLVED' as const, workflowStage: 'RESOLVED' as const, lastUpdate: 'Just now' } : t)),
    }));
  },

  reopenTicket: (id) => {
    set((state) => ({
      supportTickets: state.supportTickets.map((ticket) => ticket.id === id ? { ...ticket, status: 'OPEN' as const, workflowStage: 'TICKET_RAISED' as const, lastUpdate: 'Just now' } : ticket),
    }));
  },

  updateTicketWorkflow: (id, stage) => {
    set((state) => ({
      supportTickets: state.supportTickets.map((ticket) => ticket.id === id ? {
        ...ticket,
        workflowStage: stage,
        status: stage === 'CLOSED' ? 'CLOSED' as const : stage === 'RESOLVED' ? 'RESOLVED' as const : stage === 'TICKET_RAISED' ? 'OPEN' as const : stage === 'ESCALATED' ? 'ESCALATED' as const : 'IN_PROGRESS' as const,
        lastUpdate: 'Just now',
      } : ticket),
    }));
  },

  updateTicketPriority: (id, priority) => {
    set((state) => ({
      supportTickets: state.supportTickets.map((t) => (t.id === id ? { ...t, priority } : t)),
    }));
  },

  updateTicketStatus: (id, status) => {
    set((state) => ({
      supportTickets: state.supportTickets.map((ticket) => ticket.id === id ? {
        ...ticket,
        status,
        workflowStage: status === 'CLOSED' ? 'CLOSED' : status === 'RESOLVED' ? 'RESOLVED' : status === 'ESCALATED' ? 'ESCALATED' : ticket.workflowStage,
        lastUpdate: 'Just now',
      } : ticket),
    }));
  },

  updateTicketAssignment: (id, assignedTo) => {
    set((state) => ({
      supportTickets: state.supportTickets.map((ticket) => ticket.id === id ? { ...ticket, assignedTo, lastUpdate: 'Just now' } : ticket),
    }));
  },

  addTicketMessage: (id, type, message) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    set((state) => ({
      supportTickets: state.supportTickets.map((ticket) => {
        if (ticket.id !== id) return ticket;
        const created = { id: `msg_${Date.now()}`, sender: 'Administrator', role: 'ADMIN' as const, type, message, timestamp: now };
        const conversationMessage = { sender: 'Administrator', role: 'AGENT' as const, message, timestamp: now };
        return {
          ...ticket,
          messages: [...(ticket.messages || []), created],
          conversation: type === 'PUBLIC' ? [...(ticket.conversation || []), conversationMessage] : ticket.conversation,
          lastUpdate: 'Just now',
          status: type === 'PUBLIC' && ticket.status === 'OPEN' ? 'IN_PROGRESS' as const : ticket.status,
        };
      }),
    }));
  },

  addTicketInternalNote: (id, note) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    set((state) => ({
      supportTickets: state.supportTickets.map((ticket) => ticket.id === id ? {
        ...ticket,
        internalNotes: [...(ticket.internalNotes || []), { id: `note_${Date.now()}`, author: 'Administrator', note, timestamp: now }],
        lastUpdate: 'Just now',
      } : ticket),
    }));
  },

  createDisputeFromTicket: (ticketId, input) => {
    const ticket = get().supportTickets.find((item) => item.id === ticketId);
    if (!ticket || get().disputes.some((dispute) => dispute.ticketId === ticketId)) return;
    const now = new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    const disputeNumber = `DSP-${new Date().getFullYear()}-${String(get().disputes.length + 42).padStart(3, '0')}`;
    const dispute: DisputeItem = {
      id: `dsp_${Date.now()}`,
      disputeNumber,
      ticketId,
      orderNumber: ticket.orderNumber,
      buyer: ticket.userType === 'BUYER' ? ticket.raisedBy : 'Alex Vance (Buyer)',
      seller: ticket.userType === 'SELLER' ? ticket.raisedBy : 'SunGrid Systems Inc. (Seller)',
      reason: input.reason,
      category: input.category,
      disputedAmount: input.disputedAmount,
      priority: ticket.priority,
      status: 'OPEN',
      assignedTo: input.assignedTo,
      createdAt: now,
      lastUpdate: 'Just now',
      evidence: [],
      timeline: [{ id: `tl_${Date.now()}`, label: 'Dispute escalated', description: 'Support ticket was linked to a new dispute for admin investigation.', actor: 'Administrator', timestamp: now }],
    };
    set((state) => ({
      disputes: [dispute, ...state.disputes],
      supportTickets: state.supportTickets.map((item) => item.id === ticketId ? { ...item, disputeId: dispute.id, status: 'ESCALATED' as const, workflowStage: 'ESCALATED' as const, lastUpdate: 'Just now' } : item),
    }));
  },

  updateDisputeStatus: (id, status, actor = 'Administrator') => {
    const now = new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    set((state) => ({
      disputes: state.disputes.map((dispute) => dispute.id === id ? {
        ...dispute,
        status,
        lastUpdate: 'Just now',
        timeline: [...dispute.timeline, { id: `tl_${Date.now()}`, label: status.replace(/_/g, ' '), description: `Dispute status updated to ${status.replace(/_/g, ' ').toLowerCase()}.`, actor, timestamp: now }],
      } : dispute),
    }));
  },

  addDisputeEvidence: (id, evidence) => {
    set((state) => ({
      disputes: state.disputes.map((dispute) => dispute.id === id ? {
        ...dispute,
        evidence: [...dispute.evidence, { ...evidence, id: `ev_${Date.now()}`, uploadedAt: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) }],
        lastUpdate: 'Just now',
      } : dispute),
    }));
  },

  requestDisputeInformation: (id, from) => {
    const now = new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    set((state) => ({
      disputes: state.disputes.map((dispute) => dispute.id === id ? {
        ...dispute,
        requestedFrom: from,
        status: from === 'BUYER' ? 'WAITING_FOR_BUYER' as const : 'WAITING_FOR_SELLER' as const,
        lastUpdate: 'Just now',
        timeline: [...dispute.timeline, { id: `tl_${Date.now()}`, label: `Information requested from ${from.toLowerCase()}`, description: 'The case is waiting for additional evidence before admin review can continue.', actor: 'Administrator', timestamp: now }],
      } : dispute),
    }));
  },

  resolveDispute: (id, resolution) => {
    const now = new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    set((state) => ({
      disputes: state.disputes.map((dispute) => dispute.id === id ? {
        ...dispute,
        status: 'RESOLVED' as const,
        resolution,
        lastUpdate: 'Just now',
        timeline: [...dispute.timeline, { id: `tl_${Date.now()}`, label: 'Final resolution recorded', description: resolution?.note || 'Admin resolution recorded.', actor: 'Administrator', timestamp: now }],
      } : dispute),
      supportTickets: state.supportTickets.map((ticket) => {
        const dispute = state.disputes.find((item) => item.id === id);
        return dispute?.ticketId === ticket.id ? { ...ticket, status: 'RESOLVED' as const, workflowStage: 'RESOLUTION' as const, lastUpdate: 'Just now' } : ticket;
      }),
    }));
  },

  closeDispute: (id) => {
    const linkedTicketId = get().disputes.find((dispute) => dispute.id === id)?.ticketId;
    set((state) => ({
      disputes: state.disputes.map((dispute) => dispute.id === id ? { ...dispute, status: 'CLOSED' as const, lastUpdate: 'Just now' } : dispute),
      supportTickets: state.supportTickets.map((ticket) => ticket.id === linkedTicketId ? { ...ticket, status: 'CLOSED' as const, workflowStage: 'CLOSED' as const, lastUpdate: 'Just now' } : ticket),
    }));
  },

  inventory: [],

  addInventory: (item) => {
    const status = item.availableStock <= item.reorderLevel / 2 ? 'CRITICAL' : item.availableStock <= item.reorderLevel ? 'LOW_STOCK' : 'IN_STOCK';
    set((state) => ({ inventory: [{ ...item, id: `inv_${Date.now()}`, status }, ...state.inventory] }));
  },

  updateInventoryStock: (id, newStock) => {
    set((state) => ({
      inventory: state.inventory.map((inv) =>
        inv.id === id
          ? {
              ...inv,
              availableStock: newStock,
              status: newStock <= inv.reorderLevel / 2 ? 'CRITICAL' : newStock <= inv.reorderLevel ? 'LOW_STOCK' : 'IN_STOCK',
            }
          : inv
      ),
    }));
  },

  updateInventoryDetails: (id, changes) => {
    set((state) => ({
      inventory: state.inventory.map((inv) => inv.id === id ? {
        ...inv,
        ...changes,
        status: (changes.availableStock ?? inv.availableStock) <= inv.reorderLevel / 2 ? 'CRITICAL' : (changes.availableStock ?? inv.availableStock) <= inv.reorderLevel ? 'LOW_STOCK' : 'IN_STOCK',
      } : inv),
    }));
  },

  deleteInventory: (id) => set((state) => ({ inventory: state.inventory.filter((item) => item.id !== id) })),

  reviews: [],

  updateReviewStatus: (id, status) => {
    set((state) => ({
      reviews: state.reviews.map((r) => (r.id === id ? { ...r, status } : r)),
    }));
  },

  notificationsList: [],

  addNotification: (ntf) => {
    const created: AdminNotification = {
      ...ntf,
      id: `ntf_${Date.now()}`,
      sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    set((state) => ({ notificationsList: [created, ...state.notificationsList] }));
  },

  adminRolesList: [],

  addAdminRoleUser: (user) => {
    const created: AdminRoleUser = {
      ...user,
      id: `adm_${Date.now()}`,
      lastLogin: 'Never',
    };
    set((state) => ({ adminRolesList: [...state.adminRolesList, created] }));
  },
}));
