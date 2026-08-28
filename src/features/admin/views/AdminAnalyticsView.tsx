import React, { useState } from 'react';
import { useAdminStore } from '../../../store/useAdminStore';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  DollarSign,
  Package,
  Users,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Award,
  Download,
} from 'lucide-react';

export const AdminAnalyticsView: React.FC = () => {
  const { currency, formatCurrency, theme = 'dark' } = useAdminStore();
  const [timeRange, setTimeRange] = useState<'30D' | '90D' | '1Y'>('1Y');
  const dark = theme === 'dark';
  const ui = { text: dark ? '#F8FAFC' : '#0F172A', muted: dark ? '#94A3B8' : '#64748B', panel: dark ? 'rgba(15,23,42,.78)' : '#FFF', border: dark ? 'rgba(148,163,184,.16)' : '#E2E8F0' };

  const totalGMV = formatCurrency(0);
  const revenueData: Array<{ month: string; revenue: number }> = [];
  const categoryStats: Array<{ category: string; percentage: number }> = [];
  const maxMonthlyGMV = 1;

  const exportReport = () => {
    const csvContent = 'data:text/csv;charset=utf-8,Period,GMV,Growth,Orders\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kfpl_financial_analytics_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1480, margin: '0 auto' }}>
      <style>{`.analytics-card{transition:transform .18s ease,box-shadow .18s ease}.analytics-card:hover{transform:translateY(-3px);box-shadow:0 16px 35px rgba(2,6,23,.16)!important}`}</style>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: ui.text }}>Market Analytics & Intelligence Reports</h3>
          <p style={{ fontSize: 12, color: ui.muted, marginTop: 2 }}>
            Deep transaction analytics, trade corridor velocity, sector GMV breakdown, and repeat purchase ratios.
          </p>
        </div>

        <button
          onClick={exportReport}
          style={{
            background: dark ? 'rgba(30,41,59,.72)' : '#F8FAFC',
            border: `1px solid ${ui.border}`,
            borderRadius: 8,
            padding: '7px 14px',
            color: ui.text,
            fontSize: 12,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
          }}
        >
          <Download size={13} />
          <span>Export Full BI Report</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12 }}>
        {[
          { label: 'Total Annual GMV', val: totalGMV, change: 'No data available', color: '#10B981' },
          { label: 'RFQ Conversion Rate', val: '—', change: 'No data available', color: '#3B82F6' },
          { label: 'Escrow Settlement Avg', val: '—', change: 'No data available', color: '#F59E0B' },
          { label: 'Supplier Retention', val: '—', change: 'No data available', color: '#8B5CF6' },
        ].map((c, i) => (
          <div key={i} className="analytics-card" style={{ background: ui.panel, border: `1px solid ${ui.border}`, borderRadius: 14, padding: 16, boxShadow: '0 8px 24px rgba(2,6,23,.07)' }}>
            <div style={{ fontSize: 11, color: ui.muted }}>{c.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: ui.text, marginTop: 4 }}>{c.val}</div>
            <div style={{ fontSize: 10, color: c.color, fontWeight: 700, marginTop: 4 }}>{c.change} vs Last Year</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(300px, 1fr)', gap: 16 }}>
        <div className="analytics-card" style={{ background: ui.panel, border: `1px solid ${ui.border}`, borderRadius: 16, padding: 20, boxShadow: '0 8px 24px rgba(2,6,23,.07)' }}>
          <h4 style={{ fontSize: 15, fontWeight: 800, color: ui.text, marginBottom: 14 }}>GMV Trajectory (2026)</h4>
          <div style={{ display: 'flex', alignItems: 'stretch', justifyContent: 'space-between', gap: 10, height: 220, paddingTop: 10 }}>
            {revenueData.map((bar, i) => (
              <div key={i} style={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 7 }}>
                <span style={{ fontSize: 9, color: ui.muted, whiteSpace: 'nowrap' }}>{currency === 'INR' ? '₹' : '$'}{(bar.revenue / 1000).toFixed(0)}k</span>
                <div
                  title={`${bar.month}: ${currency === 'INR' ? '₹' : '$'}${bar.revenue.toLocaleString(currency === 'INR' ? 'en-IN' : 'en-US')}`}
                  style={{ width: 'min(30px, 68%)', height: `${Math.max(18, (bar.revenue / maxMonthlyGMV) * 155)}px`, minHeight: 18, background: 'linear-gradient(180deg, #60A5FA 0%, #2563EB 100%)', borderRadius: '6px 6px 2px 2px', boxShadow: '0 6px 14px rgba(37,99,235,.25)', transition: 'height .25s ease, transform .18s ease', cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
                />
                <span style={{ fontSize: 11, color: ui.muted, fontWeight: 700 }}>{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card" style={{ background: ui.panel, border: `1px solid ${ui.border}`, borderRadius: 16, padding: 20, boxShadow: '0 8px 24px rgba(2,6,23,.07)' }}>
          <h4 style={{ fontSize: 15, fontWeight: 800, color: ui.text, marginBottom: 14 }}>Industry Category Shares</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {categoryStats.map((cat, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                  <span style={{ color: ui.text }}>{cat.category}</span>
                  <strong style={{ color: '#10B981' }}>{cat.percentage}%</strong>
                </div>
                <div style={{ width: '100%', height: 5, background: 'rgba(31, 41, 55, 0.8)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${cat.percentage}%`, height: '100%', background: '#2563EB', borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
