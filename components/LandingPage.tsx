
import React, { useState } from 'react';
import { ModelTier } from '../types';
import { ChevronRight, PlayCircle, Terminal, Cpu, Clapperboard, ShieldAlert, Settings, Brain, Image as ImageIcon, Zap, Info } from 'lucide-react';
import ConfigModal from './ConfigModal';

interface LandingPageProps {
  onConnect: (apiKey: string, tier: ModelTier) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onConnect }) => {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [showBrief, setShowBrief] = useState(false);

  const handleConfigConfirm = (key: string, tier: ModelTier) => {
    onConnect(key, tier);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#121212] text-cine-text p-6 font-sans relative overflow-hidden">
      
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none"></div>

      <div className="w-full max-w-7xl h-[85vh] bg-cine-panel border border-cine-border shadow-2xl rounded-sm flex flex-col overflow-hidden animate-fadeIn z-10">
        
        {/* HEADER */}
        <div className="h-20 shrink-0 bg-[#1a1a1a] border-b border-[#333] flex items-center justify-between px-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tighter flex items-center gap-3">
              <span className="w-3 h-3 bg-cine-accent rounded-full shadow-[0_0_10px_#007acc]"></span>
              CINE-ENGINE
            </h1>
            <p className="text-[11px] text-cine-text-dim mt-1 tracking-wide uppercase">
              Dual-Lens Cinematic Reasoning • <span className="text-cine-accent">Gemini 3 Pro Thinking</span>
            </p>
          </div>
          <div className="text-right flex items-center gap-4">
            <button 
              onClick={() => setShowBrief(true)}
              className="flex items-center gap-2 text-[10px] font-bold text-purple-400 bg-purple-900/20 hover:bg-purple-900/40 px-3 py-1.5 rounded border border-purple-500/30 transition-all uppercase tracking-wider"
            >
              <Info className="w-3 h-3" />
              Judges' Brief
            </button>
            <button 
              onClick={() => setIsConfigOpen(true)}
              className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-white bg-[#333] hover:bg-cine-accent px-3 py-1.5 rounded border border-[#444] transition-colors uppercase tracking-wider"
            >
              <Settings className="w-3 h-3" />
              Configure
            </button>
          </div>
        </div>

        {/* MAIN BODY */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 bg-[#151515] overflow-y-auto relative">
             <div className="p-8 md:p-12 max-w-4xl mx-auto pb-20">
               
               <section className="mb-12">
                   <h3 className="text-sm font-bold text-cine-accent uppercase tracking-widest mb-4 flex items-center gap-2">
                     <Cpu className="w-4 h-4" /> System Philosophy
                   </h3>
                   <p className="text-2xl md:text-3xl text-white font-medium leading-relaxed tracking-tight mb-4">
                     "CINE-ENGINE models the argument between a <span className="text-cine-accent">Director</span> and a <span className="text-cine-warning">Line Producer</span>."
                   </p>
                   <p className="text-sm text-cine-text-dim max-w-2xl leading-relaxed">
                     Most AI tools just generate content. This engine forces filmmakers to confront the cost of their creativity before shooting a single frame.
                   </p>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                      <div className="bg-[#1f1f1f] border-l-2 border-cine-accent p-5 rounded-r-sm">
                         <strong className="text-white block mb-2 flex items-center gap-2 text-sm"><Clapperboard className="w-4 h-4 text-cine-accent"/> The Creative Lens</strong>
                         <p className="text-xs text-cine-text-dim leading-relaxed">
                           Powered by <b>Gemini 3 Pro</b>. Reasons through emotional subtext to output technical camera moves.
                         </p>
                      </div>
                      <div className="bg-[#1f1f1f] border-l-2 border-cine-warning p-5 rounded-r-sm">
                         <strong className="text-white block mb-2 flex items-center gap-2 text-sm"><ShieldAlert className="w-4 h-4 text-cine-warning"/> The Production Lens</strong>
                         <p className="text-xs text-cine-text-dim leading-relaxed">
                           Powered by <b>Gemini 3 Flash</b>. Audits for Safety, Legal, and Logistics risks in parallel.
                         </p>
                      </div>
                   </div>
               </section>

               <div className="flex justify-center pb-8 mt-4">
                  <button
                    onClick={() => setIsConfigOpen(true)}
                    className="px-12 py-5 bg-cine-accent hover:bg-cine-accent-hover text-white font-bold uppercase tracking-widest text-sm rounded-sm transition-all shadow-[0_0_30px_rgba(0,122,204,0.3)] hover:shadow-[0_0_40px_rgba(0,122,204,0.5)] flex items-center gap-3 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <PlayCircle className="w-6 h-6" />
                    Launch System
                  </button>
               </div>
               
               <div className="mt-8 pt-6 border-t border-[#222] text-center">
                  <p className="text-[10px] text-cine-text-dim/50 uppercase tracking-wider font-mono">
                    Submitted for the Gemini Global Hackathon • Feb 9, 2026
                  </p>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Judges' Brief Modal */}
      {showBrief && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#1a1a1a] border border-purple-500/30 max-w-2xl w-full p-8 rounded-sm shadow-2xl relative">
            <button onClick={() => setShowBrief(false)} className="absolute top-4 right-4 text-cine-text-dim hover:text-white">✕</button>
            <h2 className="text-purple-400 font-bold uppercase tracking-widest text-sm mb-6 flex items-center gap-2">
              <Brain className="w-5 h-5" /> Gemini Integration Details
            </h2>
            <div className="space-y-4 text-cine-text text-sm leading-relaxed">
              <p>
                <strong>CINE-ENGINE</strong> is a dual-lens workstation that leverages the unique reasoning and multimodal capabilities of the <strong>Gemini 3 series</strong> to bridge the gap between creative vision and production reality.
              </p>
              <p>
                At its core, the application utilizes <strong>Gemini 3 Pro’s Thinking Mode</strong> to simulate a Director’s cognitive process. By allocating a dedicated <code>thinkingBudget</code>, the model doesn't just generate "cool shots"; it reasons through the emotional subtext of a script to ensure that every camera move and lighting choice is narratively motivated.
              </p>
              <p>
                In parallel, <strong>Gemini 3 Flash</strong> acts as a pragmatic "Line Producer." It performs high-speed risk audits—scanning for safety, legal, and logistical hazards—to calculate a "Feasibility Score." This creates a "Marathon Agent" effect where the model uses its long-context memory to detect <strong>Continuity Drift</strong>, warning the user if their current scene’s ambition outpaces the project’s established production scale.
              </p>
              <p>
                Finally, <strong>Gemini 3 Pro Image</strong> synthesizes high-fidelity 16:9 conceptual storyboards. We implement a <strong>"Style Lock"</strong> mechanism that programmatically injects visual parameters from previous scenes into new image prompts, ensuring a consistent cinematic look across the entire film.
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-purple-500/20 text-center">
               <button 
                 onClick={() => setShowBrief(false)}
                 className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase rounded-sm"
               >
                 Acknowledge & Continue
               </button>
            </div>
          </div>
        </div>
      )}

      <ConfigModal 
        isOpen={isConfigOpen} 
        onClose={() => setIsConfigOpen(false)} 
        onConfirm={handleConfigConfirm}
        currentKey="" 
      />
    </div>
  );
};

export default LandingPage;
