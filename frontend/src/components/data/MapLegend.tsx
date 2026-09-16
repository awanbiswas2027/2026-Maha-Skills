import React from 'react';

export interface MapLegendProps {
  title?: string;
  className?: string;
}

export const MapLegend: React.FC<MapLegendProps> = ({ title, className }) => {
  return (
    <div className={`p-4 border rounded-lg bg-card text-card-foreground text-sm ${className || ''}`}>
      {title && <h4 className="font-medium mb-3">{title}</h4>}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-destructive" />
          <span>High Gap (≥60)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-warning" />
          <span>Medium Gap (40–59)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-success" />
          <span>Low Gap (&lt;40)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-muted relative overflow-hidden">
             {/* Hatched pattern */}
             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 1px, transparent 4px)' }}></div>
          </div>
          <span className="text-muted-foreground">No data</span>
        </div>
      </div>
    </div>
  );
};
