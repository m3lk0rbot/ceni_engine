
import React from 'react';
import { Interpretation } from '../types';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface StoryboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  interpretation: Interpretation | null;
  isLoading: boolean;
}

const StoryboardModal: React.FC<StoryboardModalProps> = ({ 
  isOpen, 
  onClose, 
  interpretation,
  isLoading 
}) => {
  if (!isOpen) return null;

  // Helper for status badge
  const getStatusBadge = (status: string) => {
      if (status === 'APPROVED') return <span className="flex items-center gap-1 text-green-500"><CheckCircle className="w-3 h-3"/> Approved</span>;
      if (status === 'RISKY') return <span className="flex items-center gap-1 text-amber-500"><AlertTriangle className="w-3 h-3"/> Risky</span>;
      return <span className="flex items-center gap-1 text-red-500"><XCircle className="w-3 h-3"/> Rejected</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-5xl bg-[#121212] border border-cine-border shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* 1. Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#333] bg-cine-header shrink-0">
          <div>
            <h2 className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-cine-accent rounded-full"></span>
              Visual Proof of Concept
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-cine-text-dim hover:text-white p-1 rounded hover:bg-[#444] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 2. Reasoning Context (High Prominence) */}
        {interpretation && (
            <div className="px-5 py-4 bg-[#1a1a1a] border-b border-[#333] shrink-0 overflow-y-auto max-h-[30vh]">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left: Intent */}
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold text-cine-text-dim uppercase tracking-wider">
                                Option {interpretation.id}: {interpretation.title}
                            </span>
                            <div className="text-[10px] font-bold uppercase tracking-wider border border-[#333] bg-[#111] px-2 py-0.5 rounded-sm">
                                {getStatusBadge(interpretation.production_constraint.status)}
                            </div>
                        </div>
                        <p className="text-sm font-medium text-white italic leading-relaxed mb-3">
                            "{interpretation.core_intent}"
                        </p>
                        <div className="bg-[#222] p-3 rounded-sm border-l-2 border-cine-accent">
                            <span className="text-[10px] font-bold text-cine-accent uppercase block mb-1">Directorial Reasoning</span>
                            <p className="text-xs text-cine-text leading-relaxed">
                                {interpretation.rationale}
                            </p>
                        </div>
                    </div>

                    {/* Right: Technical constraints */}
                    <div className="w-full md:w-1/3 text-xs space-y-3 pt-1 border-t md:border-t-0 md:border-l border-[#333] md:pl-4 mt-2 md:mt-0">
                        <div>
                            <span className="text-[10px] font-bold text-cine-text-dim uppercase block mb-1">Camera Language</span>
                            <span className="text-cine-text block">{interpretation.camera_language.framing}</span>
                            <span className="text-cine-text-dim block text-[10px]">{interpretation.camera_language.movement}</span>
                        </div>
                         <div>
                            <span className="text-[10px] font-bold text-cine-text-dim uppercase block mb-1">Lighting</span>
                            <span className="text-cine-text">{interpretation.lighting_philosophy.quality} ({interpretation.lighting_philosophy.color_temperature_direction})</span>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* 3. Downstream Artifacts (Images) */}
        <div className="flex-1 overflow-y-auto p-5 bg-black relative">
          <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
          
          <h3 className="text-[10px] font-bold text-cine-text-dim uppercase tracking-widest mb-4 text-center opacity-50">
            Generated Artifacts (Downstream Visualization)
          </h3>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-4">
              <div className="w-8 h-8 border-2 border-cine-accent border-t-transparent rounded-full animate-spin"></div>
              <div className="text-center">
                <p className="text-cine-text font-medium text-xs tracking-wide">Synthesizing Imagery...</p>
                <p className="text-cine-text-dim text-[10px] mt-1">Applying emotional guardrails to pixel generation</p>
              </div>
            </div>
          ) : interpretation?.storyboard ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {interpretation.storyboard.map((imgSrc, idx) => (
                <div key={idx} className="flex flex-col gap-2 group">
                  <div className="relative aspect-[16/9] bg-[#111] border border-[#333] group-hover:border-cine-text-dim transition-colors rounded-sm overflow-hidden">
                    <img 
                      src={imgSrc} 
                      alt={`Conceptual frame ${idx + 1}`} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                    />
                  </div>
                  <div className="flex justify-between items-center px-1">
                     <span className="text-[9px] font-mono text-cine-text-dim uppercase">
                        {idx === 0 ? "EST" : idx === 1 ? "ACT" : "DET"}
                     </span>
                     <div className="h-px bg-[#333] flex-1 mx-2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="flex items-center justify-center h-32 text-cine-text-dim text-xs italic">
               Visuals not generated.
             </div>
          )}
        </div>

        {/* 4. Footer (Subtle) */}
        <div className="p-2 bg-[#0a0a0a] border-t border-[#222] text-center">
           <p className="text-[9px] text-cine-text-dim/30 font-mono uppercase tracking-widest">
             AI Generated Artifact • Gemini 3 Pro Image • Not Final Footage
           </p>
        </div>
      </div>
    </div>
  );
};

export default StoryboardModal;