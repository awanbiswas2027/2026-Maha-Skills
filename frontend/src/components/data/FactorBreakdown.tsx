import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Button } from '../ui/button';
import { ChevronDown } from 'lucide-react';
import { factorRows, FactorInput } from './logic/factors';

export interface FactorBreakdownProps {
  factors: FactorInput[];
  defaultOpen?: boolean;
}

export const FactorBreakdown: React.FC<FactorBreakdownProps> = ({ factors, defaultOpen }) => {
  const { rows, total } = factorRows(factors);
  
  return (
    <Collapsible defaultOpen={defaultOpen} className="border rounded-md w-full text-sm">
      <div className="flex items-center justify-between p-3">
        <div className="font-semibold">Factor Breakdown</div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <table className="w-full text-left border-t border-border">
          <caption className="sr-only">Factor contributions to gap score</caption>
          <thead className="bg-muted text-muted-foreground font-medium">
            <tr>
              <th className="py-2 px-3">Factor</th>
              <th className="py-2 px-3 text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.factor} className="border-b border-border last:border-0 hover:bg-muted/50">
                <td className="py-2 px-3">{row.label}</td>
                <td className="py-2 px-3 text-right tabular-nums">{row.contribution} / {row.weight}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-muted font-medium">
            <tr>
              <td className="py-2 px-3">{total.label}</td>
              <td className="py-2 px-3 text-right tabular-nums">{total.contribution} / {total.weight}</td>
            </tr>
          </tfoot>
        </table>
      </CollapsibleContent>
    </Collapsible>
  );
};
