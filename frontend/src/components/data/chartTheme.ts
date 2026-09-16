import { useEffect, useState } from 'react';

export interface ChartTheme {
  colors: string[];
  grid: string;
  text: string;
}

export function useChartTheme(): ChartTheme {
  const [theme, setTheme] = useState<ChartTheme>({
    colors: ['#000', '#000', '#000', '#000', '#000', '#000'],
    grid: '#e5e7eb',
    text: '#6b7280',
  });

  useEffect(() => {
    const updateTheme = () => {
      const style = getComputedStyle(document.documentElement);
      const getColor = (token: string) => `hsl(${style.getPropertyValue(token).trim()})`;
      
      setTheme({
        colors: [
          getColor('--chart-1'),
          getColor('--chart-2'),
          getColor('--chart-3'),
          getColor('--chart-4'),
          getColor('--chart-5'),
          getColor('--chart-6'),
        ],
        grid: getColor('--border'),
        text: getColor('--muted-foreground'),
      });
    };

    updateTheme();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          updateTheme();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  return theme;
}
