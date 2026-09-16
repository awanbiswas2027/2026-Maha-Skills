import React from 'react';
import { ChartCard, ChartCardProps } from './ChartCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ReferenceLine, LabelList } from 'recharts';
import { useChartTheme } from './chartTheme';
import { assignSeriesColors } from './logic/series';

export interface BarChartCardProps extends Omit<ChartCardProps, 'children'> {
  data: Record<string, unknown>[];
  series: { key: string; name: string; isBenchmark?: boolean }[];
  yAxisKey: string;
  focalKey?: string;
  targets?: { value: number; label: string }[];
}

export const BarChartCard: React.FC<BarChartCardProps> = ({ data, series, yAxisKey, focalKey, targets, ...props }) => {
  const theme = useChartTheme();
  
  const colors = assignSeriesColors(series.map(s => s.key), {
    focalKey,
    benchmarkKeys: series.filter(s => s.isBenchmark).map(s => s.key)
  });

  return (
    <ChartCard {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme.grid} />
          <XAxis type="number" tick={{ fill: theme.text, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis dataKey={yAxisKey} type="category" tick={{ fill: theme.text, fontSize: 12 }} axisLine={false} tickLine={false} width={100} />
          <RechartsTooltip contentStyle={{ backgroundColor: 'var(--background)', borderColor: theme.grid, color: 'var(--foreground)' }} />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          
          {targets && targets.map((t, i) => (
            <ReferenceLine key={i} x={t.value} stroke={theme.colors[5]} strokeDasharray="3 3">
              <span className="text-xs absolute top-0">{t.label}</span>
            </ReferenceLine>
          ))}

          {series.map(s => {
            const assignment = colors[s.key];
            const colorIndex = parseInt(assignment.token.replace('chart-', '')) - 1;
            const color = theme.colors[colorIndex] || theme.colors[0];
            return (
              <Bar key={s.key} dataKey={s.key} name={s.name} fill={color} isAnimationActive={false}>
                {series.length <= 3 && <LabelList dataKey={s.key} position="right" fill={theme.text} fontSize={12} />}
              </Bar>
            );
          })}
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};
