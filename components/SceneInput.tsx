
import React from 'react';
import { GENRES } from '../constants';
import { Genre, ScriptManifest, ScriptScene, SavedScene } from '../types';
import { CheckCircle, ChevronRight, FileText } from 'lucide-react';

interface SceneInputProps {
  script: string;
  genre: Genre;
  references: string;
  isGenerating: boolean;
  onScriptChange: (val: string) => void;
  onSelectScene: (content: string, sceneNumber: number) => void; // New Prop
  onGenreChange: (val: Genre) => void;
  onReferencesChange: (val: string) => void;
  onGenerate: () => void;
  disabled: boolean;
  scriptManifest?: ScriptManifest;
  savedScenes: SavedScene[];
}

const SceneInput: React.FC<SceneInputProps> = ({
  script,
  genre,
  references,
  isGenerating,
  onScriptChange,
  onSelectScene,
  onGenreChange,
  onReferencesChange,
  onGenerate,
  disabled,
  scriptManifest,
  savedScenes
}) => {
  
  // Find which scene is currently "active" in the text area by matching content prefix
  const activeSceneId = scriptManifest?.scenes.find(s => script.startsWith(s.content.substring(0, 20)))?.id;

  const isSceneSaved = (sceneContent: string) => {
    return savedScenes.some(s => s.scriptSnippet.includes(sceneContent.substring(0, 50).trim()));
  };

  return (
    <div className={`flex flex-col h-full w-full overflow-hidden ${disabled ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
      
      <div className="bg-cine-header px-[10px] py-[8px] text-[11px] font-semibold uppercase text-cine-text-header tracking-wider shrink-0 flex justify-between items-center border-b border-black">
        <span>Script Navigator</span>
        {scriptManifest && <span className="text-[9px] bg-[#222] px-2 py-0.5 rounded text-cine-text-dim border border-[#444]">{scriptManifest.scenes.length} Scenes</span>}
      </div>
      
      <div className="flex-1 overflow-hidden flex flex-col">
        
        {/* SCENE LIST (If Manifest Exists) */}
        {scriptManifest && (
          <div className="flex-shrink-0 max-h-[40%] min-h-[150px] overflow-y-auto border-b border-cine-border bg-[#181818]">
            <div className="p-2 space-y-1">
               {scriptManifest.scenes.map((scene) => {
                 const isActive = activeSceneId === scene.id;
                 const saved = isSceneSaved(scene.content);
                 
                 return (
                   <button
                     key={scene.id}
                     onClick={() => onSelectScene(scene.content, scene.scene_number)}
                     className={`w-full text-left p-2 rounded-sm text-xs flex items-start group transition-all ${isActive ? 'bg-cine-accent/10 border border-cine-accent/50' : 'bg-[#222] border border-transparent hover:border-[#444]'}`}
                   >
                      <div className={`mt-0.5 mr-2 font-mono font-bold ${isActive ? 'text-cine-accent' : 'text-cine-text-dim'}`}>
                        {scene.scene_number}.
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-bold truncate ${isActive ? 'text-white' : 'text-cine-text'}`}>
                           {scene.location}
                        </div>
                        <div className="text-[10px] text-cine-text-dim truncate opacity-60">
                           {scene.content.split('\n').find(l => !l.includes('INT.') && !l.includes('EXT.') && !l.includes('SCENE') && l.trim().length > 0)?.substring(0, 30)}...
                        </div>
                      </div>
                      {saved && <CheckCircle className="w-3 h-3 text-green-500 ml-2 shrink-0 mt-0.5" />}
                      {isActive && !saved && <ChevronRight className="w-3 h-3 text-cine-accent ml-2 shrink-0 mt-0.5" />}
                   </button>
                 );
               })}
            </div>
          </div>
        )}

        {/* EDITOR AREA */}
        <div className="flex-1 overflow-y-auto p-[10px] flex flex-col gap-[14px] bg-cine-panel">
          
          {/* Script Input */}
          <div className="flex flex-col flex-1 min-h-[120px]">
            <label className="text-cine-text font-medium text-xs mb-1 flex justify-between">
              <span>Selected Scene Text</span>
              {!scriptManifest && <span className="text-[10px] text-cine-text-dim italic">Manual Entry Mode</span>}
            </label>
            <textarea
              value={script}
              onChange={(e) => onScriptChange(e.target.value)}
              disabled={isGenerating || disabled}
              placeholder={disabled ? "Start a project to begin." : "Select a scene above or paste script here..."}
              className="w-full flex-1 bg-cine-input border border-transparent focus:border-cine-accent text-cine-text-header p-[8px] text-xs rounded-[2px] font-mono resize-none outline-none transition-colors placeholder:text-cine-text-dim/30 leading-relaxed"
            />
          </div>

          <div className="h-px bg-[#333] w-full shrink-0"></div>

          {/* Controls */}
          <div className="flex flex-col gap-3 shrink-0">
             
             {/* Genre */}
             <div className="flex flex-col">
              <label className="text-cine-text font-medium text-xs mb-1">Genre Lens</label>
              <div className="relative">
                <select
                  value={genre}
                  onChange={(e) => onGenreChange(e.target.value as Genre)}
                  disabled={isGenerating || disabled}
                  className="w-full bg-cine-input border border-transparent focus:border-cine-accent text-cine-text-header p-[6px] pr-8 text-xs rounded-[2px] outline-none appearance-none cursor-pointer transition-colors"
                >
                  {GENRES.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-cine-text-dim">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor"><path d="M0 0L5 6L10 0H0Z" /></svg>
                </div>
              </div>
            </div>

            {/* References */}
            <div className="flex flex-col">
              <label className="text-cine-text font-medium text-xs mb-1">Visual References</label>
              <input
                type="text"
                value={references}
                onChange={(e) => onReferencesChange(e.target.value)}
                disabled={isGenerating || disabled}
                placeholder="e.g. Fincher, Deakins, Noir"
                className="w-full bg-cine-input border border-transparent focus:border-cine-accent text-cine-text-header p-[6px] text-xs rounded-[2px] outline-none transition-colors placeholder:text-cine-text-dim/40"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={onGenerate}
              disabled={isGenerating || !script.trim() || disabled}
              className={`
                w-full p-[12px] mt-2 border-none text-white font-bold text-xs uppercase tracking-widest rounded-[2px] transition-all shrink-0 flex items-center justify-center gap-2
                ${isGenerating || !script.trim() || disabled ? 'bg-cine-border cursor-not-allowed text-cine-text-dim' : 'bg-cine-accent hover:bg-cine-accent-hover cursor-pointer shadow-lg hover:shadow-cine-accent/20'}
              `}
            >
              {isGenerating ? (
                <>
                   <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                   Running Dual-Lens Analysis...
                </>
              ) : 'Generate Breakdown'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SceneInput;