
import React from 'react';
import { Interpretation } from '../types';
import { AlertTriangle, CheckCircle, XCircle, Star } from 'lucide-react';

interface OptionCardProps {
  data: Interpretation;
  isActive: boolean;
  onActivate: () => void;
  onViewStoryboard: (e: React.MouseEvent) => void;
  onSaveScene: (e: React.MouseEvent) => void;
  isSaved?: boolean;
  isRecommended?: boolean; // NEW: Group B
  recommendationReason?: string;
}

const OptionCard: React.FC<OptionCardProps> = ({ 
  data, 
  isActive, 
  onActivate, 
  onViewStoryboard, 
  onSaveScene,
  isSaved = false,
  isRecommended = false,
  recommendationReason
}) => {
  const cardRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isActive && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isActive]);

  const hasStoryboard = data.storyboard && data.storyboard.length > 0;
  
  // Logic for visual style based on constraints
  const status = data.production_constraint?.status || "APPROVED";
  
  let borderColor = "border-[#333]";
  let activeRing = "ring-cine-accent/30";
  let statusIcon = <CheckCircle className="w-3 h-3 text-green-500" />;
  let statusText = "APPROVED";
  let statusColor = "text-green-500 bg-green-500/10 border-green-500/20";
  
  if (status === "RISKY") {
     borderColor = isActive ? "border-cine-warning" : "border-cine-warning/50";
     activeRing = "ring-cine-warning/30";
     statusIcon = <AlertTriangle className="w-3 h-3 text-cine-warning" />;
     statusText = "RISKY";
     statusColor = "text-cine-warning bg-orange-500/10 border-orange-500/20";
  } else if (status === "REJECTED") {
     borderColor = isActive ? "border-red-600" : "border-red-900";
     activeRing = "ring-red-600/30";
     statusIcon = <XCircle className="w-3 h-3 text-red-500" />;
     statusText = "REJECTED";
     statusColor = "text-red-500 bg-red-500/10 border-red-500/20";
  } else if (isActive) {
      borderColor = "border-cine-accent";
  }
  
  // Highlight recommendation border if active
  if (isRecommended && isActive && status !== 'REJECTED') {
      borderColor = "border-purple-500";
      activeRing = "ring-purple-500/30";
  }

  return (
    <div 
      ref={cardRef}
      onClick={onActivate}
      className={`
        relative bg-[#1f1f1f] border border-l-4 p-[16px] mb-[14px] cursor-pointer transition-all duration-200 group
        ${borderColor}
        ${isActive ? `ring-1 ${activeRing} shadow-lg shadow-black/40` : 'hover:border-l-cine-text-dim'}
        ${status === 'REJECTED' && isActive ? 'bg-red-950/10' : ''}
      `}
    >
      {/* Group B: Recommendation Banner */}
      {isRecommended && (
        <div className="absolute -top-3 left-4 bg-purple-600 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded shadow-lg flex items-center gap-1 z-10 border border-purple-400">
             <Star className="w-3 h-3 fill-current" /> System Recommendation
        </div>
      )}

      {/* Header with Title and Constraint Badge */}
      <div className="flex justify-between items-start mb-3 pt-2">
        <div>
           <div className="font-semibold text-white text-sm flex items-center gap-2">
             Option {data.id} — {data.title}
           </div>
        </div>
        
        <div className="flex items-center gap-2">
             {/* Constraint Badge */}
             <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-bold tracking-wider ${statusColor}`}>
               {statusIcon}
               {statusText}
             </div>
        </div>
      </div>
      
      {/* Group B: Recommendation Rationale */}
      {isRecommended && recommendationReason && (
          <div className="mb-4 bg-purple-900/20 border border-purple-500/30 rounded-sm p-3">
              <span className="text-[10px] text-purple-400 font-bold uppercase block mb-1">Why this is recommended:</span>
              <p className="text-xs text-purple-200 leading-tight">"{recommendationReason}"</p>
          </div>
      )}
      
      {/* Rejection/Risk Reason (If any) */}
      {status !== "APPROVED" && data.production_constraint && (
        <div className="mb-4 bg-[#111] border border-[#333] rounded-sm p-3 relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${status === 'REJECTED' ? 'bg-red-600' : 'bg-cine-warning'}`}></div>
            <div className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-2 ${status === 'REJECTED' ? 'text-red-400' : 'text-cine-warning'}`}>
               Line Producer Flag: <span className="text-white">{data.production_constraint.flag}</span>
            </div>
            <p className="text-xs text-cine-text leading-tight">
               "{data.production_constraint.reason}"
            </p>
        </div>
      )}

      {/* Core Intent */}
      <div className="text-[12px] text-white/90 mb-4 font-medium italic border-l-2 border-cine-text-dim/30 pl-3 py-0.5">
        "{data.core_intent}"
      </div>

      {/* Technical Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-xs">
        <div className="bg-[#252526] p-2 rounded-sm border border-[#333]">
           <span className="block text-[10px] text-cine-text-dim font-bold uppercase mb-1">Framing</span>
           <span className="text-cine-text">{data.camera_language.framing}</span>
        </div>
        <div className="bg-[#252526] p-2 rounded-sm border border-[#333]">
           <span className="block text-[10px] text-cine-text-dim font-bold uppercase mb-1">Movement</span>
           <span className="text-cine-text">{data.camera_language.movement}</span>
        </div>
        <div className="bg-[#252526] p-2 rounded-sm border border-[#333]">
           <span className="block text-[10px] text-cine-text-dim font-bold uppercase mb-1">Lighting</span>
           <span className="text-cine-text">{data.lighting_philosophy.quality}, {data.lighting_philosophy.motivation}</span>
        </div>
      </div>
      
      {/* Rationale Bullet Points (Implicit via formatting) */}
      <div className="mb-4">
        <span className="text-[10px] font-bold text-cine-text-dim uppercase tracking-wider mb-1 block">Why This Works</span>
        <p className="text-xs text-cine-text leading-relaxed opacity-80">
            {data.rationale}
        </p>
      </div>

      <div className="flex justify-between items-center pt-3 border-t border-[#333]">
        <div className="flex items-center gap-2">
            {isSaved && <span className="text-[10px] text-green-500 font-bold tracking-wider flex items-center gap-1"><CheckCircle className="w-3 h-3"/> SAVED TO ARCHIVE</span>}
        </div>

        <div className="flex items-center gap-2">
            <button
            onClick={(e) => {
                e.stopPropagation();
                onSaveScene(e);
            }}
            disabled={!hasStoryboard || isSaved}
            className={`
                text-[10px] font-bold uppercase tracking-wider py-1.5 px-3 rounded-sm border transition-colors flex items-center gap-2
                ${!hasStoryboard ? 'text-cine-text-dim border-transparent opacity-50 cursor-not-allowed' : 
                isSaved ? 'hidden' :
                'text-white border-cine-border bg-[#2a2a2c] hover:bg-cine-accent hover:border-cine-accent hover:text-white'}
            `}
            >
            {!hasStoryboard ? "Visualize First" : "Confirm Choice"}
            </button>

            <button
            onClick={(e) => {
                e.stopPropagation();
                onViewStoryboard(e);
            }}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-cine-text-dim hover:text-white transition-colors py-1.5 px-3 hover:bg-[#333] rounded-sm border border-transparent hover:border-[#444]"
            >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {data.storyboard ? "View Storyboard" : "Visualize"}
            </button>
        </div>
      </div>
    </div>
  );
};

export default OptionCard;