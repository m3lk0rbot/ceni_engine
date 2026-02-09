
import React, { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import MenuBar from './components/MenuBar';
import Toolbar from './components/Toolbar';
import SceneInput from './components/SceneInput';
import ConceptCanvas from './components/ConceptCanvas';
import AIRationale from './components/AIRationale';
import StatusBar from './components/StatusBar';
import StoryboardModal from './components/StoryboardModal';
import LandingPage from './components/LandingPage';
import CreateProjectModal from './components/CreateProjectModal';
import ProjectManifestModal from './components/ProjectManifestModal';
import ProjectArchiveModal from './components/ProjectArchiveModal';
import ConfigModal from './components/ConfigModal';
import HelpModal from './components/HelpModal';
import { ProductionDashboard } from './components/production/ProductionDashboard';
import { AppState, ModelTier, SavedScene, ArchivedProject, ScriptManifest } from './types';
import { generateCinematicOptions, generateStoryboardImages, generateRiskAnalysis, generateRecommendation } from './services/geminiService';

type MobileTab = 'input' | 'canvas' | 'rationale';

const App: React.FC = () => {
  const [hasEntered, setHasEntered] = useState<boolean>(false); 
  const [checkingKey, setCheckingKey] = useState<boolean>(true);
  const [toast, setToast] = useState<{message: string, visible: boolean}>({message: "", visible: false});

  const [state, setState] = useState<AppState>({
    script: "",
    genre: "Drama",
    references: "",
    isGenerating: false,
    result: null,
    riskResult: null,
    error: null,
    activeLens: 'CREATIVE',
    activeInterpretationId: null,
    isGeneratingStoryboard: false,
    storyboardModalOpen: false,
    activeStoryboardId: null,
    modelTier: 'LITE', 
    customApiKey: null,
    project: null,
    savedScenes: [],
    createProjectModalOpen: false,
    projectManifestModalOpen: false,
    archiveModalOpen: false,
    styleLock: true
  });

  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>('input');

  useEffect(() => {
    setCheckingKey(false);
  }, []);

  const showToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleCreateProject = async (name: string, manifest?: ScriptManifest) => {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const newProject = { name, createdDate: today, scriptManifest: manifest };
    
    setState(prev => ({
      ...prev,
      project: newProject,
      createProjectModalOpen: false,
      script: manifest && manifest.scenes.length > 0 ? manifest.scenes[0].content : "", 
      savedScenes: [], 
      result: null, 
      riskResult: null
    }));
    showToast(`Project Initialized: ${name}`);
  };

  const handleSaveProjectFile = () => {
    if (!state.project) return;
    const archive: ArchivedProject = {
        info: state.project,
        scenes: state.savedScenes,
        lastModified: new Date().toISOString()
    };
    const dataStr = JSON.stringify(archive, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${state.project.name.replace(/\s+/g, '_')}_CINE_PROJECT.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Project Saved to Local File");
  };

  const handleImportProject = (data: ArchivedProject) => {
    setState(prev => ({
        ...prev,
        project: data.info,
        savedScenes: data.scenes,
        script: data.info.scriptManifest?.scenes[0].content || "",
        result: null,
        riskResult: null,
        activeInterpretationId: null,
        createProjectModalOpen: false,
        archiveModalOpen: false
    }));
    showToast(`Loaded Project: ${data.info.name}`);
  };

  const handleConnect = async (inputKey: string, tier: ModelTier) => {
    setState(prev => ({ 
      ...prev, 
      modelTier: tier,
      customApiKey: inputKey.trim() !== '' ? inputKey.trim() : null 
    }));
    setHasEntered(true);
  };

  const handleUpdateConfig = (key: string, tier: ModelTier) => {
      setState(prev => ({
          ...prev,
          modelTier: tier,
          customApiKey: key.trim() !== '' ? key.trim() : null
      }));
      setIsConfigOpen(false);
      showToast(`Engine Updated: ${tier} Mode`);
  };

  const handleApiError = (err: any) => {
    const msg = err.message || "";
    if (msg.includes("503") || msg.includes("overloaded")) {
       return "Server Busy: The Gemini Preview models are currently overloaded. Please wait a moment and try again.";
    }
    if (msg.includes("permission denied") || msg.includes("403") || msg.includes("Requested entity was not found")) {
      if (state.modelTier === 'PRO') {
         return "Permission Denied. Your Pro Key may lack billing/permissions. Refresh to use Standard Mode.";
      }
      return "Permission Denied. Please check your network or API configuration.";
    }
    return msg || "An unexpected error occurred.";
  };

  const handleSelectScene = (sceneContent: string, sceneNumber: number) => {
    const updatedState = { ...state, script: sceneContent };
    const match = state.savedScenes.find(s => s.sceneNumber === sceneNumber);
    
    if (match) {
         const restoredResult = {
            meta: { model: "ARCHIVED", version: "1.0", generated_at: match.timestamp },
            scene_analysis: match.sceneAnalysis,
            interpretations: [match.interpretation],
            recommendation: undefined 
         };
         setState({
             ...updatedState,
             script: match.scriptSnippet,
             result: restoredResult as any, 
             riskResult: match.riskAnalysis || null,
             activeInterpretationId: match.selectedOptionId,
             error: null
         });
         showToast(`Restored saved analysis for Scene ${match.sceneNumber}`);
    } else {
        setState({
            ...updatedState,
            result: null,
            riskResult: null,
            activeInterpretationId: null
        });
    }
  };

  const handleSaveScene = (optionId: "A" | "B" | "C") => {
    if (!state.result || !state.project) return;
    const option = state.result.interpretations.find(i => i.id === optionId);
    if (!option) return;

    let sceneNum = state.savedScenes.length + 1;
    if (state.project.scriptManifest) {
        const matchedScene = state.project.scriptManifest.scenes.find(s => state.script.includes(s.content.substring(0, 20)));
        if (matchedScene) sceneNum = matchedScene.scene_number;
    }

    const newScene: SavedScene = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      scriptSnippet: state.script, 
      sceneNumber: sceneNum,
      selectedOptionId: optionId,
      sceneAnalysis: state.result.scene_analysis,
      interpretation: option,
      riskAnalysis: state.riskResult || undefined
    };

    const filteredScenes = state.savedScenes.filter(s => s.sceneNumber !== sceneNum);
    const updatedScenes = [...filteredScenes, newScene].sort((a,b) => a.sceneNumber - b.sceneNumber);

    setState(prev => ({
      ...prev,
      savedScenes: updatedScenes
    }));
    showToast(`Scene ${newScene.sceneNumber} Saved to Session Memory`);
  };

  const handleDeleteScene = async (projectName: string, sceneId: string) => {
    const updatedScenes = state.savedScenes.filter(s => s.id !== sceneId);
    setState(prev => ({
        ...prev,
        savedScenes: updatedScenes
    }));
  };

  const handleGenerate = async () => {
    setState(prev => ({ 
      ...prev, 
      isGenerating: true, 
      error: null, 
      result: null, 
      riskResult: null, 
      activeInterpretationId: null, 
      storyboardModalOpen: false 
    }));
    setActiveMobileTab('canvas');
    
    let projectContext: string | null = null;
    if (state.savedScenes.length > 0) {
        projectContext = state.savedScenes.slice(-3).map((s, idx) => `
          Scene ${s.sceneNumber}:
          - Selected Option: ${s.selectedOptionId}
          - Visual Tone: ${s.interpretation.lighting_philosophy.quality}
          - Crew Size: ${s.riskAnalysis?.logistics.crew_size || "Unknown"}
        `).join('\n');
    }
    
    try {
      const [cinematicData, riskData] = await Promise.all([
        generateCinematicOptions(state.script, state.genre, state.references, state.modelTier, state.customApiKey),
        generateRiskAnalysis(state.script, state.modelTier, projectContext, state.customApiKey)
      ]);
      const recommendation = await generateRecommendation(cinematicData, riskData, state.customApiKey);
      const finalCinematic = { ...cinematicData, recommendation };
      
      setState(prev => ({
        ...prev,
        isGenerating: false,
        result: finalCinematic,
        riskResult: riskData,
        activeInterpretationId: "A"
      }));
    } catch (err: any) {
      const errorMsg = handleApiError(err);
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: errorMsg
      }));
    }
  };

  const handleViewStoryboard = async (id: "A" | "B" | "C") => {
    setState(prev => ({ ...prev, storyboardModalOpen: true, activeStoryboardId: id }));
    const interpretation = state.result?.interpretations.find(i => i.id === id);
    if (interpretation?.storyboard) return; 

    if (state.result && interpretation) {
      setState(prev => ({ ...prev, isGeneratingStoryboard: true }));
      let styleContext: string | undefined = undefined;
      if (state.styleLock && state.savedScenes.length > 0) {
          const anchorScene = state.savedScenes[0];
          styleContext = `
            Lighting: ${anchorScene.interpretation.lighting_philosophy.quality} (${anchorScene.interpretation.lighting_philosophy.color_temperature_direction})
            Camera: ${anchorScene.interpretation.camera_language.framing}, ${anchorScene.interpretation.camera_language.lens_tendency}
          `;
      }

      try {
        const images = await generateStoryboardImages(interpretation, state.result.scene_analysis, state.modelTier, state.customApiKey, styleContext);
        setState(prev => {
           if (!prev.result) return prev;
           const newInterpretations = prev.result.interpretations.map(interp => 
             interp.id === id ? { ...interp, storyboard: images } : interp
           );
           return {
             ...prev,
             result: { ...prev.result, interpretations: newInterpretations },
             isGeneratingStoryboard: false
           };
        });
      } catch (err: any) {
        console.error("Storyboard generation failed", err);
        const errorMsg = handleApiError(err);
        setState(prev => ({ ...prev, isGeneratingStoryboard: false, error: errorMsg }));
      }
    }
  };

  const getStatusText = () => {
    if (state.isGenerating) return `Analyzing with ${state.modelTier === 'PRO' ? 'Gemini 3 Pro' : 'Gemini 3 Flash'}...`;
    if (state.isGeneratingStoryboard) return "Visualizing conceptual frames...";
    if (state.error) return `Error: ${state.error}`;
    if (state.result) return "Analysis complete. Reviewing options.";
    if (!state.project) return "Initialize or Open a project to begin.";
    return "Ready. Select a scene.";
  };

  if (checkingKey) {
    return <div className="h-screen w-full bg-cine-bg flex items-center justify-center text-cine-text-dim">Initializing...</div>;
  }

  if (!hasEntered) {
    return <LandingPage onConnect={handleConnect} />;
  }

  const activeInterpretation = state.result?.interpretations.find(i => i.id === state.activeInterpretationId) || null;
  const activeStoryboardInterp = state.result?.interpretations.find(i => i.id === state.activeStoryboardId) || null;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-cine-bg font-sans text-cine-text relative">
      <MenuBar 
        onOpenArchive={() => setState(prev => ({ ...prev, archiveModalOpen: true }))}
        onCreateProject={() => setState(prev => ({ ...prev, createProjectModalOpen: true }))}
        onOpenSettings={() => setIsConfigOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onSaveProject={handleSaveProjectFile}
        onImportProject={() => setState(prev => ({ ...prev, createProjectModalOpen: true }))}
      />
      
      <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] transition-all duration-300 ${toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="bg-cine-accent text-white px-6 py-3 rounded shadow-xl flex items-center gap-3 border border-white/10">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          <span className="text-sm font-bold tracking-wide uppercase">{toast.message}</span>
        </div>
      </div>
      
      <div className={`${activeMobileTab === 'canvas' ? 'block' : 'hidden'} lg:block`}>
        <Toolbar 
          activeId={state.activeInterpretationId}
          onSelect={(id) => setState(prev => ({ ...prev, activeInterpretationId: id }))}
          disabled={!state.result}
          project={state.project}
          onCreateProject={() => setState(prev => ({ ...prev, createProjectModalOpen: true }))}
          onViewProject={() => setState(prev => ({ ...prev, projectManifestModalOpen: true }))}
          activeLens={state.activeLens}
          onToggleLens={(lens) => setState(prev => ({ ...prev, activeLens: lens }))}
          styleLock={state.styleLock}
          onToggleStyleLock={() => setState(prev => ({ ...prev, styleLock: !prev.styleLock }))}
          hasSavedScenes={state.savedScenes.length > 0}
        />
      </div>
      
      <div className="flex-1 flex overflow-hidden relative">
        <div className={`
          ${activeMobileTab === 'input' ? 'flex w-full' : 'hidden'} 
          lg:flex lg:w-[280px] xl:w-[320px] 
          flex-shrink-0 border-r border-cine-border bg-cine-panel transition-all duration-300
        `}>
          <SceneInput 
            script={state.script}
            genre={state.genre}
            references={state.references}
            isGenerating={state.isGenerating}
            onScriptChange={(val) => setState(prev => ({ ...prev, script: val }))}
            onSelectScene={handleSelectScene}
            onGenreChange={(val) => setState(prev => ({ ...prev, genre: val }))}
            onReferencesChange={(val) => setState(prev => ({ ...prev, references: val }))}
            onGenerate={handleGenerate}
            disabled={!state.project}
            scriptManifest={state.project?.scriptManifest}
            savedScenes={state.savedScenes}
          />
        </div>

        <div className={`
          ${activeMobileTab === 'canvas' ? 'flex w-full' : 'hidden'} 
          lg:flex flex-1 min-w-0 bg-black flex-col
        `}>
           {state.activeLens === 'CREATIVE' ? (
             <ConceptCanvas 
               interpretations={state.result?.interpretations || []}
               activeId={state.activeInterpretationId}
               onActivate={(id) => setState(prev => ({ ...prev, activeInterpretationId: id }))}
               onViewStoryboard={handleViewStoryboard}
               onSaveScene={handleSaveScene}
               isGenerating={state.isGenerating}
               hasResult={!!state.result}
               savedScenes={state.savedScenes}
               script={state.script}
               recommendation={state.result?.recommendation}
             />
           ) : (
             state.riskResult ? (
                <ProductionDashboard result={state.riskResult} />
             ) : (
               <div className="flex-1 flex items-center justify-center text-cine-text-dim flex-col">
                  {state.isGenerating ? (
                     <div className="flex flex-col items-center">
                        <div className="w-8 h-8 border-2 border-cine-accent border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-xs">ANALYZING LOGISTICS...</p>
                     </div>
                  ) : (
                    <>
                      <ShieldAlert className="w-16 h-16 mb-4 opacity-20" />
                      <p className="text-sm">No Risk Analysis Available</p>
                      <p className="text-xs mt-1 opacity-60">Generate a scene to view production risks.</p>
                    </>
                  )}
               </div>
             )
           )}
        </div>

        <div className={`
          ${activeMobileTab === 'rationale' ? 'flex w-full' : 'hidden'} 
          lg:flex lg:w-[300px] xl:w-[340px] 
          flex-shrink-0 border-l border-cine-border bg-cine-panel transition-all duration-300
        `}>
          <AIRationale 
            activeInterpretation={activeInterpretation}
            sceneAnalysis={state.result?.scene_analysis || null}
          />
        </div>
      </div>

      <div className="lg:hidden h-[40px] bg-cine-header border-t border-black flex items-stretch">
        <button onClick={() => setActiveMobileTab('input')} className={`flex-1 text-[10px] uppercase font-bold tracking-wider flex items-center justify-center border-r border-black/20 ${activeMobileTab === 'input' ? 'bg-cine-accent text-white' : 'text-cine-text-dim hover:bg-white/5'}`}>Navigator</button>
        <button onClick={() => setActiveMobileTab('canvas')} className={`flex-1 text-[10px] uppercase font-bold tracking-wider flex items-center justify-center border-r border-black/20 ${activeMobileTab === 'canvas' ? 'bg-cine-accent text-white' : 'text-cine-text-dim hover:bg-white/5'}`}>Canvas</button>
        <button onClick={() => setActiveMobileTab('rationale')} className={`flex-1 text-[10px] uppercase font-bold tracking-wider flex items-center justify-center ${activeMobileTab === 'rationale' ? 'bg-cine-accent text-white' : 'text-cine-text-dim hover:bg-white/5'}`}>Rationale</button>
      </div>

      <StatusBar statusText={getStatusText()} modelTier={state.modelTier} />

      <StoryboardModal 
        isOpen={state.storyboardModalOpen}
        onClose={() => setState(prev => ({ ...prev, storyboardModalOpen: false }))}
        interpretation={activeStoryboardInterp}
        isLoading={state.isGeneratingStoryboard}
      />

      <CreateProjectModal 
        isOpen={state.createProjectModalOpen}
        onClose={() => setState(prev => ({ ...prev, createProjectModalOpen: false }))}
        onCreate={handleCreateProject}
        onImport={handleImportProject}
      />

      <ProjectManifestModal 
        isOpen={state.projectManifestModalOpen}
        onClose={() => setState(prev => ({ ...prev, projectManifestModalOpen: false }))}
        project={state.project}
        scenes={state.savedScenes}
        onDeleteScene={(id) => handleDeleteScene(state.project!.name, id)}
      />
      
      <ProjectArchiveModal
        isOpen={state.archiveModalOpen}
        onClose={() => setState(prev => ({ ...prev, archiveModalOpen: false }))}
        onImportProject={() => setState(prev => ({ ...prev, createProjectModalOpen: true }))}
      />

      <ConfigModal 
        isOpen={isConfigOpen} 
        onClose={() => setIsConfigOpen(false)} 
        onConfirm={handleUpdateConfig}
        currentKey={state.customApiKey}
      />

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};

export default App;
