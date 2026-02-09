
export interface ProductionConstraint {
  status: "APPROVED" | "RISKY" | "REJECTED";
  flag: string; // Short headline, e.g. "Budget Overrun"
  reason: string; // 1 sentence explanation
}

export interface Interpretation {
  id: "A" | "B" | "C";
  title: string;
  core_intent: string;
  camera_language: {
    framing: string;
    movement: string;
    lens_tendency: string;
  };
  lighting_philosophy: {
    quality: string;
    motivation: string;
    color_temperature_direction: "Warm" | "Cool" | "Neutral" | "Mixed";
  };
  audience_effect: string;
  rationale: string;
  production_constraint: ProductionConstraint; // The "Creative Rejection"
  storyboard?: string[]; 
}

export interface SceneAnalysis {
  location: string;
  time_of_day: "DAY" | "NIGHT" | "DAWN" | "DUSK" | "UNKNOWN";
  character_count: number;
  dominant_emotion: string;
  narrative_function: string;
}

export interface Recommendation {
  selected_option_id: "A" | "B" | "C";
  rationale: string;
}

export interface CinematicResponse {
  meta: {
    model: string;
    version: string;
    generated_at: string;
  };
  scene_analysis: SceneAnalysis;
  interpretations: Interpretation[];
  recommendation?: Recommendation; // NEW: Group B
}

export interface RiskCategory {
  name: string;
  score: number; // 1-10
  reasoning: string;
}

export interface ProductionLogistics {
  crew_size: "Skeleton (5-10)" | "Indie (15-30)" | "Standard (40-80)" | "Blockbuster (100+)";
  est_shoot_days: string; // e.g. "0.5 Days" or "2 Days"
  indie_friendly: boolean;
  insurance_requirement: "Standard" | "High Risk" | "Specialized";
}

export interface ContinuityWarning {
    type: "CREW" | "TONE" | "BUDGET" | "OTHER";
    message: string;
    severity: "LOW" | "HIGH";
}

export interface RiskAnalysisResult {
  feasibilityScore: number; 
  riskLevel: 'Low' | 'Medium' | 'High' | 'Extreme';
  budgetEstimate: string;
  summary: string;
  
  // Granular Breakdown
  breakdown: {
    safety_score: number; // 0-100 (100 is safe)
    legal_score: number;
    logistics_score: number;
    vfx_score: number;
  };

  logistics: ProductionLogistics; 

  categories: RiskCategory[];
  redFlags: string[];
  mitigations: string[];
  safetyProtocols: string[];
  vfxBreakdown: string[];
  
  continuity?: ContinuityWarning[]; // NEW: Group A
}

export interface SavedScene {
  id: string;
  timestamp: string;
  scriptSnippet: string;
  sceneNumber: number;
  selectedOptionId: "A" | "B" | "C";
  sceneAnalysis: SceneAnalysis;
  interpretation: Interpretation;
  riskAnalysis?: RiskAnalysisResult; 
}

// Script Structure for Navigation
export interface ScriptScene {
  id: string;
  scene_number: number;
  location: string; // e.g., "INT. DINER"
  content: string; // The full text of the scene
}

export interface ScriptManifest {
  source: "UPLOAD" | "SAMPLE" | "MANUAL";
  scenes: ScriptScene[];
}

export interface ProjectInfo {
  name: string;
  createdDate: string;
  scriptManifest?: ScriptManifest; // Added manifest to project info
}

export interface ArchivedProject {
  info: ProjectInfo;
  scenes: SavedScene[];
  lastModified: string;
}

export type Genre = "Drama" | "Thriller" | "Noir" | "Sci-Fi" | "Horror" | "Comedy" | "Action" | "Western";

export type ModelTier = 'PRO' | 'LITE';

export type LensMode = 'CREATIVE' | 'PRODUCTION';

export interface AppState {
  script: string;
  genre: Genre;
  references: string;
  isGenerating: boolean;
  result: CinematicResponse | null;
  riskResult: RiskAnalysisResult | null; 
  error: string | null;
  
  activeLens: LensMode; 
  
  activeInterpretationId: "A" | "B" | "C" | null;
  isGeneratingStoryboard: boolean;
  storyboardModalOpen: boolean;
  activeStoryboardId: "A" | "B" | "C" | null;
  modelTier: ModelTier;
  customApiKey: string | null;
  
  project: ProjectInfo | null;
  savedScenes: SavedScene[];
  createProjectModalOpen: boolean;
  projectManifestModalOpen: boolean;
  archiveModalOpen: boolean; 

  styleLock: boolean; // NEW: Group C
}