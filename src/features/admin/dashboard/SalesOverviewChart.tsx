import React, { useState } from 'react';
import { useAdminStore } from '../../../store/useAdminStore';
import { ChartSkeleton, ErrorState, EmptyState } from '../../../components/common/FeedbackStates';
import { formatCurrencyFromUSD } from '../../../utils/currency';

interface SalesPoint {
  label: string;
  revenue: number;
}

interface Props { data: SalesPoint[]; }
export const SalesOverviewChart: React.FC<Props> = ({ data }) => {
  const { theme = 'dark', currency } = useAdminStore();
  const isDark = theme === 'dark';
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; val: number; label: string } | null>(null);

  const salesData = data.length > 0 ? data : [{ label: 'Start', revenue: 0 }, { label: 'Now', revenue: 0 }];

  // Dimensions of SVG
  const width = 500;
  const height = 180;
  const padding = 35;

  const maxVal = Math.max(...salesData.map((d) => d.revenue)) * 1.15 || 1;
  const minVal = 0;

  // Compute points
  const points = salesData.map((d, index) => {
    const x = padding + (index * (width - padding * 2)) / Math.max(salesData.length - 1, 1);
    const y = height - padding - ((d.revenue - minVal) * (height - padding * 2)) / (maxVal - minVal);
    return { x, y, val: d.revenue, label: d.label };
  });

  const pathD = points.reduce((acc, p, i) => {
    return acc + `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y} `;
  }, '');

  // For Area under line
  const areaD = pathD + `L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div
      style={{
        background: isDark ? 'rgba(17, 24, 39, 0.75)' : '#FFFFFF',
        border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
        borderRadius: 16,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        transition: 'all 0.2s ease',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: isDark ? '#FFF' : '#111827' }}>Sales Overview Chart</h3>
          <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>Monthly Gross Merchandise Volume (GMV)</div>
        </div>
          <span style={{ fontSize: 11, color: salesData[0].revenue === 0 ? '#9CA3AF' : '#10B981', background: salesData[0].revenue === 0 ? 'rgba(148,163,184,.12)' : 'rgba(16, 185, 129, 0.15)', padding: '3px 8px', borderRadius: 6, fontWeight: 700 }}>
          {salesData[0].revenue === 0 ? 'Awaiting data' : 'Live data'}
        </span>
      </div>

      <div style={{ flex: 1, position: 'relative', minHeight: 180 }}>
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
          {/* Grids / Axes */}
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}
            strokeWidth={1}
          />
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height - padding}
            stroke={isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}
            strokeWidth={1}
          />

          {/* Grid lines */}
          <line
            x1={padding}
            y1={padding + (height - padding * 2) / 2}
            x2={width - padding}
            y2={padding + (height - padding * 2) / 2}
            stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}
            strokeDasharray="4 4"
          />

          {/* Area under curve */}
          <path
            d={areaD}
            fill={isDark ? 'url(#salesAreaGradDark)' : 'url(#salesAreaGradLight)'}
          />

          {/* Gradient definitions */}
          <defs>
            <linearGradient id="salesAreaGradDark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="salesAreaGradLight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Curve Line */}
          <path
            d={pathD}
            fill="none"
            stroke="#2563EB"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Value circles & interaction triggers */}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={4}
                fill="#2563EB"
                stroke="#FFFFFF"
                strokeWidth={1.5}
              />
              {/* Interaction transparent larger circle */}
              <circle
                cx={p.x}
                cy={p.y}
                r={16}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              {/* X Labels */}
              <text
                x={p.x}
                y={height - 12}
                textAnchor="middle"
                fontSize={10}
                fontWeight={700}
                fill={isDark ? '#9CA3AF' : '#4B5563'}
              >
                {p.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div
            style={{
              position: 'absolute',
              background: '#0F172A',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 6,
              padding: '6px 10px',
              fontSize: 11,
              fontWeight: 700,
              color: '#FFF',
              pointerEvents: 'none',
              transform: 'translate(-50%, -100%)',
              top: `${(hoveredPoint.y / height) * 100 - 8}%`,
              left: `${(hoveredPoint.x / width) * 100}%`,
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            }}
          >
            <div>{hoveredPoint.label}: {formatCurrencyFromUSD(hoveredPoint.val, currency)}</div>
          </div>
        )}
      </div>
    </div>
  );
};
