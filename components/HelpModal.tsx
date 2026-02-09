
import React from 'react';
import { HelpCircle, BookOpen, Layers, Lock, Archive, Upload } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const features = [
    {
      icon: <Upload className="w-4 h-4 text-cine-accent" />,
      title: "1. Project Setup",
      text: "Start by creating a project. You can upload a .txt script file, use a Quick Start sample, or start blank. The Script Navigator allows you to jump between scenes."
    },
    {
      icon: <Layers className="w-4 h-4 text-cine-warning" />,
      title: "2. Dual-Lens Analysis",
      text: "The engine runs two models simultaneously. 'Creative Lens' (Gemini 3 Pro) creates directorial options. 'Production Lens' (Gemini 3 Flash) calculates budget risk."
    },
    {
      icon: <Lock className="w-4 h-4 text-white" />,
      title: "3. Style Lock & Continuity",
      text: "Enable 'Style Lock' in the toolbar to force visual consistency. The engine remembers the lighting and camera language of your first scene and applies it to future generations."
    },
    {
      icon: <Archive className="w-4 h-4 text-cine-text-dim" />,
      title: "4. Archiving & Manifests",
      text: "Save scenes to the Project Archive. You can export a full JSON manifest of your creative decisions from the File menu."
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="absolute inset-0"
        onClick={onClose}
      />
      
      <div className="relative bg-cine-panel border border-cine-border shadow-2xl rounded-sm w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center p-5 border-b border-[#333] bg-cine-header">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <HelpCircle className="w-4 h-4" /> System Manual
          </h2>
          <button onClick={onClose} className="text-cine-text-dim hover:text-white">
             ✕
          </button>
        </div>

        <div className="p-8 overflow-y-auto">
          <p className="text-sm text-cine-text mb-8 leading-relaxed border-l-2 border-cine-accent pl-4 italic">
             "CINE-ENGINE models the argument between a Director and a Line Producer, forcing you to find the balance between artistic intent and production reality."
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {features.map((f, i) => (
                <div key={i} className="bg-[#1a1a1a] p-4 rounded-sm border border-[#333] hover:border-[#555] transition-colors">
                   <div className="flex items-center gap-2 mb-2">
                      {f.icon}
                      <h3 className="text-xs font-bold text-white uppercase tracking-wide">{f.title}</h3>
                   </div>
                   <p className="text-xs text-cine-text-dim leading-relaxed">
                      {f.text}
                   </p>
                </div>
             ))}
          </div>

          <div className="mt-8 pt-6 border-t border-[#333]">
             <h4 className="text-[10px] font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                <BookOpen className="w-3 h-3"/> Quick Tips
             </h4>
             <ul className="list-disc list-inside text-xs text-cine-text-dim space-y-1">
                <li>Click <strong>"Visualize"</strong> on an option to generate storyboards.</li>
                <li>Use <strong>"Settings"</strong> to switch between Standard (Free) and Pro (Paid) API keys.</li>
                <li>The <strong>Risk Score</strong> updates in real-time based on your script content.</li>
             </ul>
          </div>
        </div>
        
        <div className="p-4 bg-[#111] border-t border-[#333] text-center">
            <button onClick={onClose} className="px-6 py-2 bg-[#333] hover:bg-cine-accent text-white text-xs font-bold uppercase rounded-sm transition-colors">
                Close Manual
            </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;