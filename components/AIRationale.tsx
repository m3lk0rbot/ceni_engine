
import React from 'react';
import { Interpretation, SceneAnalysis } from '../types';

interface AIRationaleProps {
  activeInterpretation: Interpretation | null;
  sceneAnalysis: SceneAnalysis | null;
}

const AIRationale: React.FC<AIRationaleProps> = ({ activeInterpretation, sceneAnalysis }) => {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="bg-cine-header px-[10px] py-[6px] text-[11px] font-semibold uppercase text-cine-text-header tracking-wider shrink-0">
        AI Rationale
      </div>
      
      <div className="flex-1 overflow-y-auto p-[10px] text-xs">
        
        {/* Scene Analysis Section */}
        <div className="mb-[14px] border-b border-cine-header pb-[12px]">
          <div className="text-[10px] uppercase text-cine-text-dim mb-[8px] font-bold tracking-wider">
            Scene Analysis
          </div>
          {sceneAnalysis ? (
            <div className="space-y-2 text-cine-text">
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-cine-text-dim whitespace-nowrap">Location:</span>
                <span className="text-right text-cine-text-header">{sceneAnalysis.location}</span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-cine-text-dim whitespace-nowrap">Time:</span>
                <span className="text-right text-cine-text-header">{sceneAnalysis.time_of_day}</span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-cine-text-dim whitespace-nowrap">Emotion:</span>
                <span className="text-right text-cine-text-header">{sceneAnalysis.dominant_emotion}</span>
              </div>
              <div className="mt-2 bg-[#2a2a2c] p-2 rounded border border-cine-border text-xs leading-relaxed italic text-cine-text-dim">
                "{sceneAnalysis.narrative_function}"
              </div>
            </div>
          ) : (
            <div className="text-cine-text-dim italic">Awaiting generation...</div>
          )}
        </div>

        {/* Rationale Section */}
        <div className="mb-[14px] border-b border-cine-header pb-[12px]">
          <div className="text-[10px] uppercase text-cine-text-dim mb-[8px] font-bold tracking-wider">
            Active Interpretation Logic
          </div>
          
          {activeInterpretation ? (
             <div className="bg-[rgba(255,152,0,0.08)] border-l-2 border-cine-warning p-[8px] text-[11px] leading-relaxed text-cine-text">
               {activeInterpretation.rationale}
             </div>
          ) : (
            <div className="text-cine-text-dim italic">Select an option to view rationale.</div>
          )}
        </div>

        {/* Global Usage Note */}
        <div className="mb-[14px]">
          <div className="text-[10px] uppercase text-cine-text-dim mb-[8px] font-bold tracking-wider">
            Usage Note
          </div>
           <div className="bg-[#2a2a2c] p-[8px] text-[11px] leading-relaxed text-cine-text-dim border border-cine-border rounded-[2px]">
              These are conceptual recommendations intended for director–DP discussion, not literal measurements.
           </div>
        </div>
      </div>
    </div>
  );
};

export default AIRationale;