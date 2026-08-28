import React, { useState } from 'react';
import {
  ADMIN_REVENUE_DATA,
  ADMIN_CATEGORY_STATS,
  MOCK_PRODUCTS,
} from '../../constants/mockData';
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
  Layers,
  Globe,
  Award,
} from 'lucide-react';

export const AdminAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'30D' | '90D' | '1Y'>('1Y');

  const totalMarketRevenue = ADMIN_REVENUE_DATA.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalMarketOrders = ADMIN_REVENUE_DATA.reduce((acc, curr) => acc + curr.orders, 0);
  const maxRevenue = Math.max(...ADMIN_REVENUE_DATA.map((d) => d.revenue));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#F9FAFB' }}>Marketplace Analytics & BI</h1>
          <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>
            Deep transaction analytics, trade flow patterns, sector distribution, and GMV growth
          </p>
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {(['30D', '90D', '1Y'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              style={{
                background: timeRange === r ? '#2563EB' : 'rgba(31, 41, 55, 0.8)',
                border: timeRange === r ? '1px solid #3B82F6' : '1px solid rgba(255, 255, 255, 0.1)',
                color: timeRange === r ? '#FFF' : '#9CA3AF',
                borderRadius: 8,
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 Performance Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          {
            title: 'Annual Gross GMV',
            value: `$${(totalMarketRevenue / 1000).toFixed(0)}K`,
            change: '+24.5%',
            positive: true,
            icon: DollarSign,
            color: '#10B981',
          },
          {
            title: 'RFQ Conversion Rate',
            value: '68.4%',
            change: '+5.1%',
            positive: true,
            icon: Target,
            color: '#3B82F6',
          },
          {
            title: 'Avg. Escrow Fulfillment',
            value: '8.2 Days',
            change: '-1.4 Days',
            positive: true,
            icon: Sparkles,
            color: '#F59E0B',
          },
          {
            title: 'Supplier Repeat Rate',
            value: '91.8%',
            change: '+3.2%',
            positive: true,
            icon: Award,
            color: '#8B5CF6',
          },
        ].map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              style={{
                background: 'rgba(17, 24, 39, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 14,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600 }}>{c.title}</span>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: `${c.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: c.color,
                  }}
                >
                  <Icon size={14} />
                </div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#FFF' }}>{c.value}</div>
              <div style={{ fontSize: 11, color: c.positive ? '#34D399' : '#F87171', display: 'flex', alignItems: 'center', gap: 3, fontWeight: 700 }}>
                {c.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                <span>{c.change} vs previous period</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16 }}>
        {/* GMV Volume Bar Graph */}
        <div
          style={{
            background: 'rgba(17, 24, 39, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 16,
            padding: 20,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#F9FAFB' }}>Monthly GMV & Order Volume</h3>
              <p style={{ fontSize: 12, color: '#9CA3AF' }}>Aggregated volume across verified suppliers</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: '#9CA3AF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 10, height: 10, background: '#2563EB', borderRadius: 2 }} />
                <span>GMV ($)</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 220, paddingTop: 20 }}>
            {ADMIN_REVENUE_DATA.map((bar, idx) => {
              const h = (bar.revenue / maxRevenue) * 100;
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    flex: 1,
                  }}
                >
                  <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>
                    ${(bar.revenue / 1000).toFixed(0)}k
                  </span>
                  <div
                    style={{
                      width: 28,
                      height: `${h}%`,
                      background: 'linear-gradient(180deg, #3B82F6 0%, #1D4ED8 100%)',
                      borderRadius: 6,
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                    }}
                  />
                  <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>{bar.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sector Distribution List */}
        <div
          style={{
            background: 'rgba(17, 24, 39, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 16,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#F9FAFB' }}>Industry Sector Share</h3>
            <p style={{ fontSize: 12, color: '#9CA3AF' }}>Gross volume by category vertical</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, justifyContent: 'center' }}>
            {ADMIN_CATEGORY_STATS.map((cat, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#F3F4F6', fontWeight: 600 }}>{cat.category}</span>
                  <strong style={{ color: '#10B981' }}>${(cat.revenue / 1000).toFixed(0)}K ({cat.percentage}%)</strong>
                </div>
                <div style={{ width: '100%', height: 6, background: 'rgba(31, 41, 55, 0.8)', borderRadius: 3, overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${cat.percentage}%`,
                      height: '100%',
                      background:
                        i === 0
                          ? '#2563EB'
                          : i === 1
                          ? '#10B981'
                          : i === 2
                          ? '#F59E0B'
                          : i === 3
                          ? '#8B5CF6'
                          : '#06B6D4',
                      borderRadius: 3,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Trading Products */}
      <div
        style={{
          background: 'rgba(17, 24, 39, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 16,
          padding: 20,
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 800, color: '#F9FAFB', marginBottom: 14 }}>
          Top Grossing Wholesale Items
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {MOCK_PRODUCTS.map((prod, i) => (
            <div
              key={prod.id}
              style={{
                background: 'rgba(31, 41, 55, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 12,
                padding: 14,
                display: 'flex',
                gap: 12,
                alignItems: 'center',
              }}
            >
              <img
                src={prod.images[0]}
                alt={prod.title}
                style={{ width: 50, height: 50, borderRadius: 10, objectFit: 'cover' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, color: '#60A5FA', fontWeight: 700 }}>#{i + 1} BESTSELLER</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#FFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {prod.title}
                </div>
                <div style={{ fontSize: 12, color: '#10B981', fontWeight: 800, marginTop: 2 }}>
                  Base: ${prod.tierPricing[0].pricePerUnit.toLocaleString()} / {prod.unit}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
