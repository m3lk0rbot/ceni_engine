
import React from 'react';
import { ProjectInfo, SavedScene } from '../types';

interface ProjectManifestModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectInfo | null;
  scenes: SavedScene[];
  onDeleteScene: (id: string) => void;
}

const ProjectManifestModal: React.FC<ProjectManifestModalProps> = ({ 
  isOpen, 
  onClose, 
  project, 
  scenes,
  onDeleteScene 
}) => {
  if (!isOpen || !project) return null;

  const handleExport = () => {
    const dataStr = JSON.stringify({ project, scenes }, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${project.name.replace(/\s+/g, '_')}_Manifest.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-cine-panel border border-cine-border shadow-2xl rounded-sm w-full max-w-2xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-[#333] bg-cine-header">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">{project.name}</h2>
            <div className="text-[10px] text-cine-text-dim">{scenes.length} Scenes captured • Created {project.createdDate}</div>
          </div>
          <button onClick={onClose} className="text-cine-text-dim hover:text-white p-2">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#111]">
          {scenes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-cine-text-dim text-xs">
              <p>No scenes saved yet.</p>
              <p>Generate options and click "Confirm & Save Scene" to build your manifest.</p>
            </div>
          ) : (
            scenes.map((scene) => (
              <div key={scene.id} className="bg-cine-panel border border-cine-border p-3 rounded-sm flex gap-4 group relative">
                
                {/* Scene Number */}
                <div className="w-8 h-8 flex items-center justify-center bg-[#333] text-cine-text font-mono text-xs font-bold rounded">
                  {scene.sceneNumber}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-semibold text-white truncate pr-2">Scene {scene.sceneNumber}</h3>
                    <span className="text-[10px] bg-cine-accent px-1.5 rounded text-white font-mono">Option {scene.selectedOptionId}</span>
                  </div>
                  <p className="text-xs text-cine-text-dim truncate mt-1">"{scene.scriptSnippet}..."</p>
                  
                  {/* Expanded Data Display */}
                  <div className="mt-2 text-[10px] text-cine-text border-l-2 border-cine-border pl-2 py-0.5 space-y-1">
                    <div>
                      <span className="text-white font-medium">{scene.interpretation.title}</span>
                      <span className="text-cine-text-dim"> — {scene.interpretation.core_intent}</span>
                    </div>
                    <div className="text-cine-text-dim italic text-[9px]">
                      Loc: {scene.sceneAnalysis.location} • {scene.sceneAnalysis.dominant_emotion}
                    </div>
                  </div>
                </div>

                {/* Thumbnail */}
                {scene.interpretation.storyboard && scene.interpretation.storyboard.length > 0 && (
                  <div className="w-24 shrink-0 aspect-video bg-black border border-[#333]">
                     <img src={scene.interpretation.storyboard[0]} alt="Thumb" className="w-full h-full object-cover opacity-80" />
                  </div>
                )}

                {/* Delete Button (Hover) */}
                <button 
                  onClick={() => onDeleteScene(scene.id)}
                  className="absolute -top-2 -right-2 bg-red-900/90 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 hover:scale-110"
                  title="Delete Scene"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-[#333] bg-cine-panel flex justify-end">
           <button 
             onClick={handleExport}
             disabled={scenes.length === 0}
             className={`px-4 py-2 bg-cine-accent text-white text-xs font-bold uppercase rounded-sm flex items-center gap-2 ${scenes.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-cine-accent-hover'}`}
           >
             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
             Export JSON Manifest
           </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectManifestModal;