import React from 'react';
import { Search, X, Package, ShoppingCart, FileText, Layers, Store, Users } from 'lucide-react';
import { useAdminStore } from '../../../store/useAdminStore';
import { useProductStore } from '../../../store/useProductStore';
import { useOrderStore } from '../../../store/useOrderStore';
import { useRFQStore } from '../../../store/useRFQStore';

interface Props { isOpen: boolean; onClose: () => void; }

export const AdminGlobalSearchModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { searchQuery, setSearchQuery, setActiveSection, categories = [], theme = 'dark' } = useAdminStore();
  const { products = [] } = useProductStore();
  const { orders = [] } = useOrderStore();
  const { rfqs = [] } = useRFQStore();
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const query = searchQuery.trim().toLowerCase();
  const results = [
    ...categories.filter((item) => `${item.name} ${item.description || ''}`.toLowerCase().includes(query)).map((item) => ({ type: 'Category', title: item.name, meta: item.description || 'Catalog category', icon: Layers })),
    ...products.filter((item) => `${item.title} ${item.brand} ${item.id} ${item.category} ${item.subcategory || ''}`.toLowerCase().includes(query)).map((item) => ({ type: 'Product', title: item.title, meta: `SKU: ${item.id.toUpperCase()} · ${item.category}`, icon: Package })),
    ...orders.filter((item) => `${item.orderNumber} ${item.productTitle} ${item.buyerName} ${item.supplierName}`.toLowerCase().includes(query)).map((item) => ({ type: 'Order', title: item.orderNumber, meta: `${item.productTitle} · ${item.status}`, icon: ShoppingCart })),
    ...rfqs.filter((item) => `${item.productTitle} ${item.buyerName} ${item.buyerCompany} ${item.category}`.toLowerCase().includes(query)).map((item) => ({ type: 'RFQ', title: item.productTitle, meta: `${item.buyerCompany} · ${item.status}`, icon: FileText })),
  ].slice(0, 30);

  const openResult = (type: string) => {
    const destinations: Record<string, { section: any; subSection?: any }> = {
      Buyer: { section: 'BUYER_MGMT', subSection: 'USERS_BUYERS' },
      Seller: { section: 'SELLER_MGMT', subSection: 'SELLERS_LIST' },
      Category: { section: 'CATALOG_MGMT', subSection: 'CATALOG_CATEGORIES' },
      Product: { section: 'CATALOG_MGMT', subSection: 'CATALOG_PRODUCTS' },
      Order: { section: 'ORDER_MGMT' },
      RFQ: { section: 'RFQ_MGMT' },
    };
    const destination = destinations[type];
    if (!destination) return;
    setActiveSection(destination.section, destination.subSection || 'ROOT');
    setSearchQuery('');
    onClose();
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(2,6,23,.7)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '12vh 20px 20px' }}>
      <div onClick={(event) => event.stopPropagation()} style={{ width: 'min(100%, 680px)', maxHeight: '70vh', overflow: 'hidden', background: isDark ? '#0F172A' : '#FFF', border: `1px solid ${isDark ? 'rgba(96,165,250,.28)' : '#DBEAFE'}`, borderRadius: 18, boxShadow: '0 28px 90px rgba(2,6,23,.45)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 16, borderBottom: `1px solid ${isDark ? 'rgba(148,163,184,.16)' : '#E2E8F0'}` }}>
          <Search size={18} color="#60A5FA" />
          <input autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search buyers, orders, RFQs, products, SKU..." style={{ flex: 1, border: 0, outline: 0, background: 'transparent', color: isDark ? '#FFF' : '#0F172A', fontSize: 14 }} />
          <button type="button" onClick={onClose} aria-label="Close search" style={{ border: 0, background: isDark ? 'rgba(255,255,255,.08)' : '#F1F5F9', color: '#94A3B8', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', display: 'grid', placeItems: 'center' }}><X size={16} /></button>
        </div>
        <div style={{ maxHeight: 'calc(70vh - 70px)', overflowY: 'auto', padding: 10 }}>
          {!query ? <div style={{ padding: 36, textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>Start typing to search across the admin workspace.</div> : results.length === 0 ? <div style={{ padding: 36, textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>No matching records found.</div> : results.map((result, index) => {
            const Icon = result.icon;
            return <button type="button" key={`${result.type}-${result.title}-${index}`} onClick={() => openResult(result.type)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 10px', borderRadius: 10, border: 0, background: 'transparent', color: isDark ? '#E2E8F0' : '#334155', textAlign: 'left', cursor: 'pointer' }} onMouseEnter={(event) => { event.currentTarget.style.background = isDark ? 'rgba(59,130,246,.14)' : '#EFF6FF'; }} onMouseLeave={(event) => { event.currentTarget.style.background = 'transparent'; }}>
              <div style={{ width: 34, height: 34, borderRadius: 9, background: isDark ? 'rgba(59,130,246,.16)' : '#EFF6FF', color: '#3B82F6', display: 'grid', placeItems: 'center' }}><Icon size={16} /></div>
              <div><div style={{ fontSize: 13, fontWeight: 800 }}>{result.title}</div><div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{result.type} · {result.meta}</div></div>
            </button>;
          })}
        </div>
      </div>
    </div>
  );
};
