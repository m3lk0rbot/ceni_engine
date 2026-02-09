
import React from 'react';
import { Interpretation, SavedScene, Recommendation } from '../types';
import OptionCard from './OptionCard';
import { Star } from 'lucide-react';

interface ConceptCanvasProps {
  interpretations: Interpretation[];
  activeId: "A" | "B" | "C" | null;
  onActivate: (id: "A" | "B" | "C") => void;
  onViewStoryboard: (id: "A" | "B" | "C") => void;
  onSaveScene: (id: "A" | "B" | "C") => void;
  isGenerating: boolean;
  hasResult: boolean;
  savedScenes: SavedScene[]; 
  script: string;
  recommendation?: Recommendation; // NEW: Group B
}

const ConceptCanvas: React.FC<ConceptCanvasProps> = ({ 
  interpretations, 
  activeId, 
  onActivate,
  onViewStoryboard,
  onSaveScene,
  isGenerating,
  hasResult,
  savedScenes,
  script,
  recommendation
}) => {
  
  const isInterpretationSaved = (interpId: "A" | "B" | "C") => {
     // Check if this exact combination exists in saved scenes
     if (savedScenes.length === 0) return false;
     // Simple check: does a saved scene exist with this option ID and a matching script snippet?
     const snippet = script.substring(0, 50).trim();
     return savedScenes.some(s => s.scriptSnippet.includes(snippet) && s.selectedOptionId === interpId);
  };

  const activeInterpretation = interpretations.find(i => i.id === activeId);

  return (
    <div className="flex flex-col h-full w-full bg-black relative">
      
      {/* TAB HEADER */}
      {hasResult && !isGenerating && (
        <div className="flex items-center px-4 pt-4 gap-2 bg-black shrink-0 border-b border-[#333]">
          {interpretations.map((item) => {
             const isRecommended = recommendation?.selected_option_id === item.id;
             return (
                 <button
                   key={item.id}
                   onClick={() => onActivate(item.id)}
                   className={`
                     px-6 py-2 text-xs font-bold uppercase tracking-wider rounded-t-sm border-t border-l border-r transition-all relative top-[1px] flex items-center gap-2
                     ${activeId === item.id 
                       ? 'bg-[#1f1f1f] text-white border-[#333] border-b-black pb-2' 
                       : 'bg-transparent text-cine-text-dim border-transparent hover:bg-[#111] hover:text-cine-text'}
                   `}
                 >
                   Option {item.id}
                   {isRecommended && <Star className="w-3 h-3 text-purple-500 fill-purple-500" />}
                 </button>
             );
          })}
          <div className="flex-1 border-b border-[#333]"></div>
        </div>
      )}

      {/* CANVAS CONTENT area */}
      <main className="flex-1 bg-black p-[20px] overflow-y-auto relative w-full h-full scrollbar-thin">
        
        {!hasResult && !isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-cine-text-dim opacity-40 px-4 text-center">
             <svg className="w-12 h-12 sm:w-16 sm:h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
             </svg>
             <p className="text-sm font-medium">Ready to Analyze</p>
             <p className="text-xs mt-1">Start a Project, then enter a scene.</p>
          </div>
        )}

        {isGenerating && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 backdrop-blur-sm">
             <div className="w-8 h-8 border-2 border-cine-accent border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="text-cine-accent font-medium text-xs tracking-wider animate-pulse">GENERATING...</p>
          </div>
        )}

        {/* Render Only Active Card */}
        <div className="max-w-4xl mx-auto w-full pb-20 mt-2">
          {activeInterpretation ? (
             <OptionCard 
               key={activeInterpretation.id} 
               data={activeInterpretation} 
               isActive={true} // Always "active" visually since it's the only one shown
               onActivate={() => {}} // No-op since tabs handle this
               onViewStoryboard={() => onViewStoryboard(activeInterpretation.id)}
               onSaveScene={() => onSaveScene(activeInterpretation.id)}
               isSaved={isInterpretationSaved(activeInterpretation.id)}
               isRecommended={recommendation?.selected_option_id === activeInterpretation.id}
               recommendationReason={recommendation?.rationale}
             />
          ) : (
            hasResult && <div className="text-cine-text-dim text-center mt-10">Select an Option from the tabs above.</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ConceptCanvas;