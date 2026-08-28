import React from 'react';
import { useAdminStore } from '../../../store/useAdminStore';
import { useRFQStore } from '../../../store/useRFQStore';
import { useOrderStore } from '../../../store/useOrderStore';
import { useProductStore } from '../../../store/useProductStore';
import { SalesOverviewChart } from '../dashboard/SalesOverviewChart';
import { OrderStatusBreakdown } from '../dashboard/OrderStatusBreakdown';
import { LatestSales } from '../dashboard/LatestSales';
import { TopRegionSales } from '../dashboard/TopRegionSales';
import { Users, Store, Package, ShoppingCart, AlertTriangle, FileText, TrendingUp, ArrowUpRight } from 'lucide-react';
import { ADMIN_LATEST_SALES, ADMIN_REGION_SALES, ADMIN_SALES_OVERVIEW } from '../../../services/adminDashboardApi';

export const AdminDashboardView: React.FC = () => {
  const { setActiveSection, currency, theme = 'dark', sellerApplications = [], productApprovals = [] } = useAdminStore();
  const { rfqs = [] } = useRFQStore(); const { orders = [] } = useOrderStore(); const { products = [] } = useProductStore();
  const dark = theme === 'dark'; const text = dark ? '#F8FAFC' : '#0F172A'; const muted = dark ? '#94A3B8' : '#64748B';
  const gmv = orders.reduce((sum, order) => sum + order.totalAmount, 0); const money = new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', { style: 'currency', currency: currency === 'INR' ? 'INR' : 'USD', maximumFractionDigits: 0 }).format(gmv);
  const pending = sellerApplications.filter((item) => item.status === 'PENDING').length + productApprovals.filter((item) => item.status === 'PENDING').length;
  const statusData = (['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const).map((status) => ({ status, count: orders.filter((order) => order.status === status).length }));
  const cards = [
    ['Total Buyers', 0, '#3B82F6', Users, () => setActiveSection('BUYER_MGMT', 'BUYERS_LIST')],
    ['Total Sellers', 0, '#10B981', Store, () => setActiveSection('SELLER_MGMT', 'SELLERS_LIST')],
    ['Total Products', products.length, '#A855F7', Package, () => setActiveSection('CATALOG_MGMT', 'CATALOG_PRODUCTS')],
    ['Total Orders', orders.length, '#F59E0B', ShoppingCart, () => setActiveSection('ORDER_MGMT', 'ORDERS_ALL')],
    ['Pending Approvals', pending, '#F59E0B', AlertTriangle, () => setActiveSection('SELLER_MGMT', 'SELLERS_APPLICATIONS')],
    ['Open RFQs', rfqs.length, '#EC4899', FileText, () => setActiveSection('RFQ_MGMT', 'RFQS_ALL')],
    ['Revenue / GMV', money, '#10B981', TrendingUp, () => setActiveSection('PAYMENTS', 'ROOT')],
  ] as const;
  const card = ([label, value, color, Icon, action]: typeof cards[number]) => <button key={label} onClick={action} className="dashboard-card" style={{ textAlign: 'left', background: dark ? 'rgba(15,23,42,.78)' : '#FFF', border: `1px solid ${color}40`, borderRadius: 16, padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', color: text, boxShadow: '0 8px 22px rgba(2,6,23,.07)' }}><div><div style={{ color: muted, fontSize: 11, fontWeight: 700 }}>{label}</div><strong style={{ display: 'block', color: text, fontSize: 24, marginTop: 7 }}>{typeof value === 'number' ? value.toLocaleString() : value}</strong><span style={{ display: 'flex', alignItems: 'center', gap: 3, color, fontSize: 10, fontWeight: 800, marginTop: 7 }}>{value !== 0 && value !== '$0' && value !== '₹0' ? <ArrowUpRight size={11} /> : null}{value === 0 || value === '$0' || value === '₹0' ? 'No data available' : 'Current period'}</span></div><span style={{ width: 44, height: 44, borderRadius: 12, display: 'grid', placeItems: 'center', color, background: `${color}1F` }}><Icon size={20} /></span></button>;
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}><style>{`.dashboard-card{transition:transform .18s ease,box-shadow .18s ease}.dashboard-card:hover{transform:translateY(-2px);box-shadow:0 12px 26px rgba(2,6,23,.16)!important}@media(max-width:1100px){.dashboard-grid{grid-template-columns:repeat(2,1fr)!important}}@media(max-width:640px){.dashboard-grid,.dashboard-charts{grid-template-columns:1fr!important}}`}</style><header><div style={{ color: '#60A5FA', fontSize: 11, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase' }}>Overview / dashboard</div><h1 style={{ color: text, fontSize: 'clamp(22px,2.4vw,30px)', margin: '8px 0 0' }}>Executive dashboard</h1><p style={{ color: muted, fontSize: 13, margin: '8px 0 0' }}>Monitor marketplace activity and operational performance.</p></header><div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>{cards.slice(0, 4).map(card)}</div><div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>{cards.slice(4).map(card)}</div><div className="dashboard-charts" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}><SalesOverviewChart data={ADMIN_SALES_OVERVIEW} /><OrderStatusBreakdown data={statusData} /></div><div className="dashboard-charts" style={{ display: 'grid', gridTemplateColumns: '55fr 45fr', gap: 16 }}><LatestSales data={ADMIN_LATEST_SALES} /><TopRegionSales data={ADMIN_REGION_SALES} /></div></div>;
};
