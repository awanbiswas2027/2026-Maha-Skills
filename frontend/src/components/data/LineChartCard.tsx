import React from 'react';
import { ChartCard, ChartCardProps } from './ChartCard';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { useChartTheme } from './chartTheme';
import { assignSeriesColors, forecastBands } from './logic/series';

export interface LineSeriesDef {
  key: string;
  name: string;
  isBenchmark?: boolean;
}

export interface LineChartCardProps extends Omit<ChartCardProps, 'children'> {
  data: Record<string, unknown>[];
  series: LineSeriesDef[];
  xAxisKey: string;
  focalKey?: string;
  showForecast?: boolean;
}

export const LineChartCard: React.FC<LineChartCardProps> = ({ data, series, xAxisKey, focalKey, showForecast, ...props }) => {
  const theme = useChartTheme();
    
  const colors = assignSeriesColors(series.map(s => s.key), {
    focalKey,
    benchmarkKeys: series.filter(s => s.isBenchmark).map(s => s.key)
  });

  const chartData = showForecast ? forecastBands(data) : data;

  return (
    <ChartCard {...props}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.grid} />
          <XAxis dataKey={xAxisKey} tick={{ fill: theme.text, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: theme.text, fontSize: 12 }} axisLine={false} tickLine={false} />
          <RechartsTooltip contentStyle={{ backgroundColor: 'var(--background)', borderColor: theme.grid, color: 'var(--foreground)' }} />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          
          {series.map(s => {
            const assignment = colors[s.key];
            const colorIndex = parseInt(assignment.token.replace('chart-', '')) - 1;
            const color = theme.colors[colorIndex] || theme.colors[0];
            return (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.name}
                stroke={color}
                strokeWidth={assignment.dashed ? 1.5 : 2}
                strokeDasharray={assignment.dashed ? '4 4' : undefined}
                dot={false}
                activeDot={{ r: 4 }}
                connectNulls={false}
                isAnimationActive={false}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};
