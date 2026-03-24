"use client";

import { motion } from "framer-motion";

type Ring = {
  label: string;
  percent: number;
  color: string;
  radius: number;
};

const buildRing = (size: number, ring: Ring, strokeWidth: number) => {
  const circumference = 2 * Math.PI * ring.radius;
  const offset = circumference - (ring.percent / 100) * circumference;
  return (
    <g key={ring.label}>
      <circle
        stroke="rgba(255,255,255,0.08)"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={ring.radius}
        cx={size / 2}
        cy={size / 2}
      />
      <motion.circle
        stroke={ring.color}
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        r={ring.radius}
        cx={size / 2}
        cy={size / 2}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />
    </g>
  );
};

type RadialPerformanceChartProps = {
  title: string;
  subtitle: string;
  centerValue: string;
  centerLabel: string;
  rings: Ring[];
};

export function RadialPerformanceChart({
  title,
  subtitle,
  centerValue,
  centerLabel,
  rings
}: RadialPerformanceChartProps) {
  const size = 260;
  const strokeWidth = 14;

  return (
    <div className="chart-card">
      <div className="chart-title">
        <h3>{title}</h3>
        <p className="muted">{subtitle}</p>
      </div>
      <svg width={size} height={size} className="radial-chart">
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {rings.map((ring) => buildRing(size, ring, strokeWidth))}
        </g>
        <circle
          cx={size / 2}
          cy={size / 2}
          r="46"
          fill="rgba(10,6,16,0.9)"
          stroke="rgba(255,255,255,0.08)"
        />
        <text
          x="50%"
          y="49%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="radial-center"
        >
          {centerValue}
        </text>
        <text
          x="50%"
          y="58%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="radial-sub"
        >
          {centerLabel}
        </text>
      </svg>
      <div className="chart-legend">
        {rings.map((ring) => (
          <div key={ring.label} className="legend-item">
            <span className="legend-dot" style={{ background: ring.color }} />
            <span>{ring.label}</span>
            <strong>{ring.percent}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TrendLineChart({
  title,
  subtitle,
  points,
  xLabels,
  yLabels,
  footerLeft,
  footerRight,
  headlineValue,
  headlineLabel
}: {
  title: string;
  subtitle: string;
  points: number[];
  xLabels?: string[];
  yLabels?: string[];
  footerLeft?: string;
  footerRight?: string;
  headlineValue?: string;
  headlineLabel?: string;
}) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const chartWidth = 520;
  const chartHeight = 220;
  const chartPadding = 56;
  const axisLeft = chartPadding;
  const axisBottom = chartHeight - chartPadding;
  const axisRight = chartWidth - 48;
  const axisTop = 28;

  const path = points
    .map((point, index) => {
      const x =
        axisLeft + (index / (points.length - 1)) * (axisRight - axisLeft);
      const y =
        axisBottom - ((point - min) / range) * (axisBottom - axisTop);
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");

  const areaPath = `${path} L ${axisRight} ${axisBottom} L ${axisLeft} ${axisBottom} Z`;
  const dotPoints = points.map((point, index) => {
    const x =
      axisLeft + (index / (points.length - 1)) * (axisRight - axisLeft);
    const y =
      axisBottom - ((point - min) / range) * (axisBottom - axisTop);
    return { x, y };
  });

  const safeXLabels =
    xLabels ??
    ["Jan", "Mar", "May", "Jul", "Sep", "Nov", ""].slice(0, points.length);
  const safeYLabels =
    yLabels ?? [
      `${Math.round(min).toLocaleString()}`,
      `${Math.round(min + range * 0.25).toLocaleString()}`,
      `${Math.round(min + range * 0.5).toLocaleString()}`,
      `${Math.round(min + range * 0.75).toLocaleString()}`,
      `${Math.round(max).toLocaleString()}`
    ];

  return (
    <div className="chart-card chart-card-linef">
      <div className="chart-title line-title">
        <div>
          <h3>{title}</h3>
        </div>
        <span className="line-logo">Jikoni Buddy</span>
      </div>
      <div className="line-subtitle">{subtitle}</div>
      <svg
        width="100%"
        height="260"
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="line-chart"
      >
        <defs>
          <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(59,200,214,0.35)" />
            <stop offset="100%" stopColor="rgba(10,40,46,0)" />
          </linearGradient>
          <linearGradient id="mountainFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(3, 33, 36, 0.8)" />
            <stop offset="100%" stopColor="rgba(2, 24, 26, 0)" />
          </linearGradient>
        </defs>
        <path
          d={`M ${axisLeft} ${axisBottom} Q ${
            (axisLeft + axisRight) / 2
          } ${axisTop - 60} ${axisRight} ${axisBottom} L ${axisRight} ${
            axisBottom + 40
          } L ${axisLeft - 40} ${axisBottom + 40} Z`}
          fill="url(#mountainFill)"
        />
        <motion.path
          d={areaPath}
          fill="url(#lineFill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <line
          x1={axisLeft}
          y1={axisBottom}
          x2={axisRight}
          y2={axisBottom}
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1"
        />
        <line
          x1={axisLeft}
          y1={axisTop}
          x2={axisLeft}
          y2={axisBottom}
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="1"
        />
        <motion.path
          d={path}
          fill="none"
          stroke="#3BC8D6"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        />
        {dotPoints.map((dot, index) => (
          <motion.circle
            key={`dot-${index}`}
            cx={dot.x}
            cy={dot.y}
            r="4.2"
            fill="#3BC8D6"
            stroke="#0b3b40"
            strokeWidth="2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 + index * 0.08, duration: 0.3 }}
          />
        ))}
        {safeYLabels.map((label, index) => {
          const y =
            axisBottom -
            (index / (safeYLabels.length - 1)) * (axisBottom - axisTop);
          return (
            <text
              key={`y-${label}-${index}`}
              x={axisLeft - 10}
              y={y + 4}
              textAnchor="end"
              className="axis-label"
            >
              {label}
            </text>
          );
        })}
        {safeXLabels.map((label, index) => {
          const x =
            axisLeft + (index / (safeXLabels.length - 1)) * (axisRight - axisLeft);
          return (
            <text
              key={`x-${label}-${index}`}
              x={x}
              y={axisBottom + 22}
              textAnchor="middle"
              className="axis-label"
            >
              {label}
            </text>
          );
        })}
        <text
          x={axisLeft - 42}
          y={(axisTop + axisBottom) / 2}
          transform={`rotate(-90 ${axisLeft - 42} ${(axisTop + axisBottom) / 2})`}
          textAnchor="middle"
          className="axis-title"
        >
          Revenue lost (line)
        </text>
        <text
          x={(axisLeft + axisRight) / 2}
          y={axisBottom + 46}
          textAnchor="middle"
          className="axis-title"
        >
          Date (x) 2026
        </text>
      </svg>
      <div className="line-badge">
        <div className="badge-ring" />
        <div>
          <span className="badge-value">{headlineValue ?? "43,000"}</span>
          <span className="badge-label">{headlineLabel ?? "Revenue lost"}</span>
        </div>
      </div>
      <div className="chart-footer">
        <span className="muted">
          {footerLeft ?? `Latest: ${points[points.length - 1]}`}
        </span>
        <span className="trend-tag">{footerRight ?? "+8.4% this week"}</span>
      </div>
    </div>
  );
}

export function SimpleBarChart({
  title, subtitle, data, footerLeft, footerRight
}: {
  title: string; subtitle: string;
  data: { label: string; value: number; color?: string }[];
  footerLeft?: string; footerRight?: string;
}) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="chart-card">
      <div className="chart-title">
        <h3>{title}</h3>
        <p className="muted">{subtitle}</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '160px', marginTop: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
        {data.map(bar => (
          <div key={bar.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', flex: 1 }}>
             <div style={{ fontSize: '0.8rem', fontWeight: 600, color: bar.color || '#fff' }}>{bar.value}</div>
             <motion.div 
               style={{ width: '28px', background: bar.color || '#3BC8D6', borderRadius: '4px 4px 0 0' }}
               initial={{ height: 0 }}
               animate={{ height: `${(bar.value / maxValue) * 120}px` }}
               transition={{ duration: 1, ease: 'easeOut' }}
             />
             <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{bar.label}</div>
          </div>
        ))}
      </div>
      { (footerLeft || footerRight) && (
        <div className="chart-footer" style={{ marginTop: '1rem' }}>
          <span className="muted">{footerLeft}</span>
          <span className="trend-tag">{footerRight}</span>
        </div>
      )}
    </div>
  );
}
