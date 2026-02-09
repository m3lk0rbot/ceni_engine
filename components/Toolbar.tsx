
import React from 'react';
import { ProjectInfo, LensMode } from '../types';
import { Lock, Unlock } from 'lucide-react';

interface ToolbarProps {
  activeId: "A" | "B" | "C" | null;
  onSelect: (id: "A" | "B" | "C") => void;
  disabled: boolean;
  project: ProjectInfo | null;
  onCreateProject: () => void;
  onViewProject: () => void;
  activeLens: LensMode;
  onToggleLens: (lens: LensMode) => void;
  
  styleLock: boolean;
  onToggleStyleLock: () => void;
  hasSavedScenes: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
  project,
  onCreateProject,
  onViewProject,
  activeLens,
  onToggleLens,
  styleLock,
  onToggleStyleLock,
  hasSavedScenes
}) => {
  const isCreative = activeLens === 'CREATIVE';

  return (
    <div className="h-[50px] bg-cine-panel flex items-center px-4 border-b border-cine-border select-none relative justify-between">
      
      {/* LEFT: Project Controls */}
      <div className="flex items-center z-10 gap-3">
        {project ? (
          <button 
            onClick={onViewProject}
            className="h-[32px] px-3 bg-[#333] border border-[#555] hover:border-cine-accent text-white flex items-center gap-2 rounded-[3px] text-xs font-bold transition-all max-w-[200px] shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="truncate">{project.name}</span>
          </button>
        ) : (
          <button 
            onClick={onCreateProject}
            className="h-[32px] px-3 bg-cine-accent hover:bg-cine-accent-hover text-white flex items-center gap-2 rounded-[3px] text-xs font-bold transition-all shadow-lg"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            CREATE PROJECT
          </button>
        )}
        
        {/* Group C: Style Lock Toggle */}
        {hasSavedScenes && (
             <button
                onClick={onToggleStyleLock}
                title={styleLock ? "Style Locked: Using previous scene as visual anchor" : "Style Unlocked: New scenes are visually independent"}
                className={`h-[32px] px-3 border flex items-center gap-2 rounded-[3px] text-[10px] font-bold uppercase transition-all ${styleLock ? 'bg-cine-accent/20 border-cine-accent text-cine-accent' : 'bg-[#222] border-[#333] text-cine-text-dim hover:text-white'}`}
             >
                {styleLock ? <Lock className="w-3 h-3"/> : <Unlock className="w-3 h-3"/>}
                <span className="hidden xl:inline">Style Lock</span>
             </button>
        )}
      </div>

      {/* CENTER: Lens Switcher (Absolute Centered) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
        <div className="flex bg-[#111] rounded-[4px] p-1 border border-[#333] shadow-inner">
          <button
            onClick={() => onToggleLens('CREATIVE')}
            className={`px-4 py-1.5 text-[11px] font-bold uppercase rounded-[3px] transition-all flex items-center gap-2 ${isCreative ? 'bg-[#333] text-white shadow-sm ring-1 ring-white/5' : 'text-cine-text-dim hover:text-white'}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            Creative
          </button>
          <button
            onClick={() => onToggleLens('PRODUCTION')}
            className={`px-4 py-1.5 text-[11px] font-bold uppercase rounded-[3px] transition-all flex items-center gap-2 ${!isCreative ? 'bg-[#333] text-white shadow-sm ring-1 ring-white/5' : 'text-cine-text-dim hover:text-white'}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Production
          </button>
        </div>
      </div>

      {/* RIGHT: Status / Hints */}
      <div className="text-cine-text-dim text-[10px] uppercase font-medium tracking-wider hidden sm:block z-10">
        {isCreative ? "Interpretation Lens" : "Risk & Logistics Lens"}
      </div>
    </div>
  );
};

export default Toolbar;