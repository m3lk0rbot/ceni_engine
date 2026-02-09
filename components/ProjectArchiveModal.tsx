
import React from 'react';
import { Film, FileUp } from 'lucide-react';

interface ProjectArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportProject: () => void;
}

const ProjectArchiveModal: React.FC<ProjectArchiveModalProps> = ({ 
  isOpen, 
  onClose,
  onImportProject
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-cine-bg w-full max-w-xl border border-cine-border shadow-2xl flex flex-col rounded-sm overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="h-14 bg-cine-header border-b border-black flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-cine-accent flex items-center justify-center rounded-sm">
                <Film className="w-5 h-5 text-white" />
             </div>
             <div>
               <h2 className="text-white font-bold uppercase tracking-wider text-sm">Project Archive</h2>
               <p className="text-[10px] text-cine-text-dim">Portable Persistence Engine</p>
             </div>
          </div>
          <button onClick={onClose} className="text-cine-text-dim hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-8 text-center">
            <div className="bg-[#1a1a1a] p-6 border border-[#333] rounded-sm mb-6">
                <h3 className="text-white font-bold text-sm mb-2 uppercase tracking-wide">File-Based Project System</h3>
                <p className="text-cine-text-dim text-xs leading-relaxed">
                    To ensure reliability and bypass browser limits, CINE-ENGINE uses <b>Project Manifests (.json)</b>. 
                    Your work is stored in-memory during the session, but must be exported to your device for long-term use.
                </p>
            </div>

            <div className="flex flex-col gap-3">
                <button 
                    onClick={() => {
                        onClose();
                        onImportProject();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-cine-accent hover:bg-cine-accent-hover text-white font-bold text-xs uppercase rounded-sm transition-all"
                >
                    <FileUp className="w-4 h-4" />
                    Open Project File
                </button>
                
                <button 
                    onClick={onClose}
                    className="w-full px-6 py-3 bg-[#333] hover:bg-[#444] text-cine-text-dim hover:text-white font-bold text-xs uppercase rounded-sm transition-colors"
                >
                    Return to Workspace
                </button>
            </div>
            
            <p className="mt-6 text-[10px] text-cine-text-dim/50 uppercase tracking-widest font-mono">
                Manifests include: Script, Logic, Rationale, and Storyboards.
            </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectArchiveModal;
