
import React, { useState, useRef } from 'react';
import { SAMPLE_SCRIPTS, parseScriptText } from '../utils/scriptParser';
import { ScriptManifest, ArchivedProject } from '../types';
import { FileText, Upload, PlayCircle, FileUp } from 'lucide-react';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, manifest?: ScriptManifest) => void;
  onImport: (project: ArchivedProject) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onCreate, onImport }) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'upload' | 'import' | 'blank'>('quick');
  const [projectName, setProjectName] = useState('');
  const [selectedSample, setSelectedSample] = useState(Object.keys(SAMPLE_SCRIPTS)[0]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
      if (!projectName) {
        setProjectName(e.target.files[0].name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        try {
            const text = await e.target.files[0].text();
            const data = JSON.parse(text) as ArchivedProject;
            if (data.info && data.scenes) {
                onImport(data);
            } else {
                alert("Invalid project file format.");
            }
        } catch (err) {
            alert("Error reading project file.");
        }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim() && activeTab !== 'import') return;

    let manifest: ScriptManifest | undefined;

    if (activeTab === 'quick') {
      const text = SAMPLE_SCRIPTS[selectedSample];
      manifest = parseScriptText(text);
      manifest.source = "SAMPLE";
    } else if (activeTab === 'upload' && uploadedFile) {
      const text = await uploadedFile.text();
      manifest = parseScriptText(text);
      manifest.source = "UPLOAD";
    }

    onCreate(projectName.trim(), manifest);
    setProjectName('');
    setUploadedFile(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-cine-panel border border-cine-border shadow-2xl rounded-sm w-full max-w-xl flex flex-col animate-fadeIn">
        
        <div className="flex justify-between items-center border-b border-[#333] p-4 bg-cine-header">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Project Launch</h2>
          <button onClick={onClose} className="text-cine-text-dim hover:text-white">✕</button>
        </div>

        <div className="flex border-b border-[#333] overflow-x-auto">
           <button 
             onClick={() => setActiveTab('quick')}
             className={`flex-1 min-w-[100px] py-3 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'quick' ? 'bg-[#252526] text-cine-accent border-b-2 border-cine-accent' : 'text-cine-text-dim hover:bg-[#333]'}`}
           >
             <PlayCircle className="w-3 h-3" /> Samples
           </button>
           <button 
             onClick={() => setActiveTab('import')}
             className={`flex-1 min-w-[100px] py-3 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'import' ? 'bg-[#252526] text-cine-accent border-b-2 border-cine-accent' : 'text-cine-text-dim hover:bg-[#333]'}`}
           >
             <FileUp className="w-3 h-3" /> Import File
           </button>
           <button 
             onClick={() => setActiveTab('upload')}
             className={`flex-1 min-w-[100px] py-3 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'upload' ? 'bg-[#252526] text-cine-accent border-b-2 border-cine-accent' : 'text-cine-text-dim hover:bg-[#333]'}`}
           >
             <Upload className="w-3 h-3" /> New Script
           </button>
           <button 
             onClick={() => setActiveTab('blank')}
             className={`flex-1 min-w-[100px] py-3 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'blank' ? 'bg-[#252526] text-cine-accent border-b-2 border-cine-accent' : 'text-cine-text-dim hover:bg-[#333]'}`}
           >
             <FileText className="w-3 h-3" /> Blank
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          
          {activeTab !== 'import' && (
            <div>
              <label className="text-xs text-cine-text font-medium mb-1 block">Project Title</label>
              <input 
                type="text" 
                autoFocus
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name..."
                className="w-full bg-cine-input border border-cine-border focus:border-cine-accent p-2.5 text-sm text-white rounded-sm outline-none placeholder:text-cine-text-dim/40"
              />
            </div>
          )}

          {activeTab === 'quick' && (
             <div className="bg-[#1a1a1a] p-4 rounded-sm border border-[#333]">
                <label className="text-xs text-cine-text-dim font-bold mb-2 block uppercase">Select Scene Pack</label>
                <div className="space-y-2">
                   {Object.keys(SAMPLE_SCRIPTS).map(key => (
                     <div 
                       key={key}
                       onClick={() => setSelectedSample(key)}
                       className={`p-3 rounded-sm border cursor-pointer flex items-center justify-between transition-all ${selectedSample === key ? 'bg-cine-accent/10 border-cine-accent text-white' : 'bg-[#252526] border-[#333] text-cine-text hover:border-[#555]'}`}
                     >
                        <span className="text-xs font-medium">{key}</span>
                        {selectedSample === key && <div className="w-2 h-2 rounded-full bg-cine-accent"></div>}
                     </div>
                   ))}
                </div>
             </div>
          )}

          {activeTab === 'import' && (
             <div 
               className="bg-[#1a1a1a] border-2 border-dashed border-cine-accent/30 rounded-sm h-40 flex flex-col items-center justify-center cursor-pointer hover:border-cine-accent hover:bg-cine-accent/5 transition-colors"
               onClick={() => importInputRef.current?.click()}
             >
                <input 
                  type="file" 
                  ref={importInputRef} 
                  className="hidden" 
                  accept=".json"
                  onChange={handleImportFile}
                />
                <FileUp className="w-8 h-8 text-cine-accent mb-3" />
                <div className="text-center">
                  <span className="text-sm text-white font-bold block mb-1">Open .json Manifest</span>
                  <span className="text-[10px] text-cine-text-dim">Restore all scenes, images, and analysis</span>
                </div>
             </div>
          )}

          {activeTab === 'upload' && (
             <div 
               className="bg-[#1a1a1a] border-2 border-dashed border-[#333] rounded-sm h-32 flex flex-col items-center justify-center cursor-pointer hover:border-cine-text-dim hover:bg-[#202020] transition-colors"
               onClick={() => fileInputRef.current?.click()}
             >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".txt"
                  onChange={handleFileChange}
                />
                <Upload className="w-6 h-6 text-cine-text-dim mb-2" />
                {uploadedFile ? (
                   <span className="text-sm text-cine-accent font-bold">{uploadedFile.name}</span>
                ) : (
                   <span className="text-xs text-cine-text font-medium block">Upload Script (.txt)</span>
                )}
             </div>
          )}

          {activeTab !== 'import' && (
            <div className="flex justify-end gap-2 pt-2 border-t border-[#333]">
                <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-bold text-cine-text hover:text-white uppercase">Cancel</button>
                <button 
                type="submit"
                disabled={!projectName.trim() || (activeTab === 'upload' && !uploadedFile)}
                className={`px-6 py-2 bg-cine-accent text-white text-xs font-bold uppercase rounded-sm shadow-lg ${(!projectName.trim() || (activeTab === 'upload' && !uploadedFile)) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-cine-accent-hover'}`}
                >
                Initialize
                </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
