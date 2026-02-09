import { GoogleGenAI } from "@google/genai";
import { CinematicResponse, Interpretation, SceneAnalysis, ModelTier, RiskAnalysisResult, Recommendation } from "../types";
import { SYSTEM_PROMPT, CINEMATIC_SCHEMA, RISK_SYSTEM_PROMPT, RISK_SCHEMA, RECOMMENDATION_SYSTEM_PROMPT, RECOMMENDATION_SCHEMA } from "../constants";

// Helper: Exponential Backoff for 503 Errors
async function retryWithBackoff<T>(fn: () => Promise<T>, retries = 3, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (retries > 0 && (error?.status === 503 || error?.code === 503 || error?.message?.includes('overloaded'))) {
      console.warn(`Model overloaded. Retrying in ${delay}ms... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryWithBackoff(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const generateCinematicOptions = async (
  script: string,
  genre: string,
  references: string,
  modelTier: ModelTier,
  apiKey?: string | null
): Promise<CinematicResponse> => {
  const key = apiKey || process.env.API_KEY;
  if (!key) {
    throw new Error("API_KEY is missing. Please enter a valid key.");
  }

  const ai = new GoogleGenAI({ apiKey: key });

  const prompt = `
    Analyze the following scene script.
    Genre: ${genre}
    References: ${references || "None provided"}
    
    Script:
    ${script}
  `;

  // Select model based on Tier
  const modelName = modelTier === 'PRO' 
    ? "gemini-3-pro-preview" 
    : "gemini-3-flash-preview"; 

  const thinkingConfig = modelTier === 'PRO' 
    ? { thinkingBudget: 2048 } 
    : undefined;

  return retryWithBackoff(async () => {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          responseMimeType: "application/json",
          responseSchema: CINEMATIC_SCHEMA,
          temperature: 0.7,
          thinkingConfig: thinkingConfig
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("No response text received from Gemini.");
      }

      const data = JSON.parse(text) as CinematicResponse;
      
      // Inject model info if not present
      if (data.meta) {
          data.meta.model = modelName;
      }
      
      return data;
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  });
};

export const generateRecommendation = async (
  cinematic: CinematicResponse,
  risk: RiskAnalysisResult,
  apiKey?: string | null
): Promise<Recommendation> => {
    const key = apiKey || process.env.API_KEY;
    if (!key) throw new Error("API_KEY missing");

    const ai = new GoogleGenAI({ apiKey: key });
    
    const context = `
    CREATIVE OPTIONS:
    ${JSON.stringify(cinematic.interpretations.map(i => ({ id: i.id, title: i.title, constraint: i.production_constraint })))}
    
    RISK PROFILE:
    Feasibility: ${risk.feasibilityScore}/100
    Level: ${risk.riskLevel}
    Logistics: ${JSON.stringify(risk.logistics)}
    `;

    return retryWithBackoff(async () => {
      try {
          const response = await ai.models.generateContent({
              model: "gemini-3-flash-preview",
              contents: `Which option is best? \n${context}`,
              config: {
                  systemInstruction: RECOMMENDATION_SYSTEM_PROMPT,
                  responseMimeType: "application/json",
                  responseSchema: RECOMMENDATION_SCHEMA,
                  temperature: 0.2
              }
          });
          
          return JSON.parse(response.text || "{}");
      } catch (e) {
          console.error("Recommendation failed", e);
          return { selected_option_id: "B", rationale: "Default fallback due to analysis error." };
      }
    });
};

export const generateRiskAnalysis = async (
  script: string,
  modelTier: ModelTier,
  projectContext: string | null,
  apiKey?: string | null
): Promise<RiskAnalysisResult> => {
  const key = apiKey || process.env.API_KEY;
  if (!key) throw new Error("API_KEY is missing.");

  const ai = new GoogleGenAI({ apiKey: key });

  // Use gemini-3-flash-preview for risk analysis on both tiers for speed and reliability
  const modelName = "gemini-3-flash-preview";
  
  let prompt = `Analyze risk factors for this script:\n\n${script}`;
  if (projectContext) {
      prompt += `\n\nPROJECT CONTINUITY CONTEXT (Previous Scenes):\n${projectContext}\n\nWarning: Check if the current script drifts significantly from the established context (e.g. huge budget jump, tonal shift).`;
  }

  return retryWithBackoff(async () => {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          systemInstruction: RISK_SYSTEM_PROMPT,
          responseMimeType: "application/json",
          responseSchema: RISK_SCHEMA,
          temperature: 0.4, 
        },
      });

      const text = response.text;
      if (!text) throw new Error("No risk analysis text returned.");

      return JSON.parse(text) as RiskAnalysisResult;
    } catch (error) {
      console.error("Risk Analysis Error:", error);
      throw error;
    }
  });
};

const buildImagePrompt = (
  interp: Interpretation,
  scene: SceneAnalysis,
  shotType: string,
  styleContext?: string
): string => {
  const envDesc = scene.location; 

  let prompt = `
A conceptual visual reference depicting:

SCENE:
${scene.location}, ${envDesc}, ${scene.time_of_day}.

INTERPRETATION LENS:
${interp.core_intent}.
The visual language should express ${interp.rationale.substring(0, 150)}.

COMPOSITION:
${shotType}. ${interp.camera_language.framing}.
The characters should be positioned to reinforce ${interp.audience_effect}.
Avoid theatrical posing; the moment should feel observed, not staged.

LIGHTING & TEXTURE:
${interp.lighting_philosophy.quality} lighting with ${interp.lighting_philosophy.motivation}.
Surface textures and skin tones should reflect ${scene.dominant_emotion}.
Color tones should lean ${interp.lighting_philosophy.color_temperature_direction}.
`.trim();

  if (styleContext) {
      prompt += `\n\nVISUAL CONTINUITY LOCK (STRICT):
      The generated image MUST match the visual style of previous scenes:
      ${styleContext}
      Do not deviate from this established look.
      `;
  }

  prompt += `\n\nEMOTIONAL GUARDRAIL:
The storyboard may never be more emotionally expressive than the text interpretation.
If the text implies subtlety, the image must be subtle. 
If the text implies detachment, the image must be detached.
Do not exaggerate emotions beyond the provided rationale.

STYLE CONSTRAINTS:
Grounded realism, conceptual reference, no exaggerated stylization.
Visualise characters as generic archetypes avoiding specific likeness or celebrity resemblance.
Focus on composition and lighting over specific facial details.`;

  return prompt;
};

export const generateStoryboardImages = async (
  interpretation: Interpretation,
  scene: SceneAnalysis,
  modelTier: ModelTier,
  apiKey?: string | null,
  styleContext?: string
): Promise<string[]> => {
  const key = apiKey || process.env.API_KEY;
  if (!key) {
    throw new Error("API_KEY is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: key });

  const shots = [
    "Wide establishing shot",
    "Medium shot emphasizing character interaction",
    "Close-up detail or reaction shot"
  ];

  // Select Image Model
  // PRO: gemini-3-pro-image-preview
  const modelName = modelTier === 'PRO' 
    ? 'gemini-3-pro-image-preview' 
    : 'gemini-2.5-flash-image';

  // Config adjustments
  const imageConfig = modelTier === 'PRO'
    ? { aspectRatio: "16:9", imageSize: "1K" }
    : { aspectRatio: "16:9" }; 

  const generateSingleImage = async (shotType: string) => {
    const prompt = buildImagePrompt(interpretation, scene, shotType, styleContext);
    
    return retryWithBackoff(async () => {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: { parts: [{ text: prompt }] },
          config: {
            imageConfig: imageConfig as any
          }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          }
        }
        throw new Error("No image data returned from model.");
    });
  };

  try {
    const images = await Promise.all(shots.map(shot => generateSingleImage(shot)));
    return images;
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};