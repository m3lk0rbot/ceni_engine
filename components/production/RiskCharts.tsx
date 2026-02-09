import React from 'react';
import { RiskCategory } from '../../types';

interface RiskChartsProps {
  categories: RiskCategory[];
}

export const RiskCharts: React.FC<RiskChartsProps> = ({ categories }) => {
  return (
    <div className="h-full w-full flex flex-col justify-center p-4">
      <h4 className="text-[10px] text-cine-text-dim mb-6 text-center uppercase tracking-widest font-bold">
        Risk Intensity Profile
      </h4>
      
      <div className="space-y-4 overflow-y-auto max-h-[250px] pr-2">
        {categories.map((cat, idx) => {
          const percentage = (cat.score / 10) * 100;
          let colorClass = 'bg-emerald-500';
          if (cat.score > 7) colorClass = 'bg-red-500';
          else if (cat.score > 4) colorClass = 'bg-amber-500';

          return (
            <div key={idx} className="w-full">
              <div className="flex justify-between items-end mb-1">
                <span className="text-xs text-cine-text font-medium">{cat.name}</span>
                <span className="text-[10px] font-mono text-cine-text-dim">{cat.score}/10</span>
              </div>
              <div className="w-full h-2 bg-[#111] rounded-full overflow-hidden border border-[#333]">
                <div 
                  className={`h-full ${colorClass} transition-all duration-500`} 
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-[9px] text-cine-text-dim mt-1 truncate opacity-60">
                {cat.reasoning}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};