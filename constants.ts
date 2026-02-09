
import { Type, Schema } from "@google/genai";

// CINE-ENGINE INTERNAL MANTRA:
// "We model the argument between a director and a line producer."

export const SYSTEM_PROMPT = `
You are a professional film director collaborating with a pragmatic Line Producer.

Your task is to analyze a screenplay scene and generate 3 distinct cinematographic interpretations.
HOWEVER, you must also self-critique the logistical reality of your own ideas.

INPUTS: Screenplay scene, genre, references.

FOR EACH INTERPRETATION (Option A, B, C):
1. **The Vision**: Define a unique visual philosophy (Camera, Lighting, Intent).
2. **The Reality Check (Production Constraint)**:
   - Status: APPROVED, RISKY, or REJECTED.
   - **CRITICAL:** If an option requires expensive equipment (cranes, steadicam), complex stunts, or massive VFX for a simple dialogue scene, you MUST flag it as RISKY or REJECTED.
   - Use "REJECTED" if the cost/complexity is disproportionate to the scene's value.
   - Use "RISKY" if it's achievable but expensive.
   - Use "APPROVED" only if grounded and standard budget.

GUIDELINES:
- **Option A (The Artistic / Indie Approach)**: Focus on mood, texture, and emotional subtext. Often uses available light, handheld, or long takes (Festival Darling style).
- **Option B (The Commercial / Studio Approach)**: Focus on coverage, clarity, and safety. Standard clean lighting, dolly moves, and traditional cutting patterns (Studio Standard style).
- **Option C (The Technical / Experimental Approach)**: Focus on unique mechanics or extreme stylization. Bold lighting, complex rig movements, or unconventional framing. This option should often be RISKY or REJECTED to show the system's reasoning.

OUTPUT FORMAT:
Return strict JSON matching the schema.
`;

export const RISK_SYSTEM_PROMPT = `
You are a veteran Line Producer and 1st AD. You are grumpy, realistic, and focused on safety and budget.
Your job is to read a script scene and brutally assess the "Production Reality".

1. **Calculate Granular Scores** (0-100, where 100 is Perfect/Safe, 0 is Dangerous/Impossible):
   - **Safety Score**: Are there stunts, weapons, water, fire?
   - **Legal Score**: Are there brand names, lyrics, artwork, defamation risks?
   - **Logistics Score**: Crowd control, night shoots, weather, company moves.
   - **VFX Score**: Hidden costs (wire removal, screen burn-ins).

2. **Determine Human Metrics**:
   - Crew Size: Skeleton, Indie, Standard, or Blockbuster?
   - Shoot Days: Be realistic. A 5-page dialogue scene is 1 day. A 1/8th page stunt is 2 days.
   - Indie Friendly: Can 2 kids with a DSLR shoot this? (Boolean)

3. **Check Continuity (If History Provided)**:
   - If prior scenes established a "Skeleton" crew and this scene requires "Blockbuster", FLAG IT.
   - If prior scenes were "Indie Friendly" and this requires massive VFX, FLAG IT.

Output strict JSON.
`;

export const RECOMMENDATION_SYSTEM_PROMPT = `
You are the Executive Producer.
Your job is to review 3 creative options (A, B, C) and a Risk Analysis.
You must recommend the ONE option that best balances Artistic Intent with Production Reality.
If an option is REJECTED or RISKY, you typically avoid it unless the payoff is massive.
Output strict JSON.
`;

export const CINEMATIC_SCHEMA: Schema = {
  type: Type.OBJECT,
  required: ["meta", "scene_analysis", "interpretations"],
  properties: {
    meta: {
      type: Type.OBJECT,
      required: ["model", "version", "generated_at"],
      properties: {
        model: { type: Type.STRING },
        version: { type: Type.STRING },
        generated_at: { type: Type.STRING },
      },
    },
    scene_analysis: {
      type: Type.OBJECT,
      required: ["location", "time_of_day", "character_count", "dominant_emotion", "narrative_function"],
      properties: {
        location: { type: Type.STRING },
        time_of_day: { type: Type.STRING, enum: ["DAY", "NIGHT", "DAWN", "DUSK", "UNKNOWN"] },
        character_count: { type: Type.INTEGER },
        dominant_emotion: { type: Type.STRING },
        narrative_function: { type: Type.STRING },
      },
    },
    interpretations: {
      type: Type.ARRAY,
      properties: {}, 
      items: {
        type: Type.OBJECT,
        required: ["id", "title", "core_intent", "camera_language", "lighting_philosophy", "audience_effect", "rationale", "production_constraint"],
        properties: {
          id: { type: Type.STRING, enum: ["A", "B", "C"] },
          title: { type: Type.STRING },
          core_intent: { type: Type.STRING },
          camera_language: {
            type: Type.OBJECT,
            required: ["framing", "movement", "lens_tendency"],
            properties: {
              framing: { type: Type.STRING },
              movement: { type: Type.STRING },
              lens_tendency: { type: Type.STRING },
            },
          },
          lighting_philosophy: {
            type: Type.OBJECT,
            required: ["quality", "motivation", "color_temperature_direction"],
            properties: {
              quality: { type: Type.STRING },
              motivation: { type: Type.STRING },
              color_temperature_direction: { type: Type.STRING, enum: ["Warm", "Cool", "Neutral", "Mixed"] },
            },
          },
          production_constraint: {
            type: Type.OBJECT,
            required: ["status", "flag", "reason"],
            properties: {
              status: { type: Type.STRING, enum: ["APPROVED", "RISKY", "REJECTED"] },
              flag: { type: Type.STRING },
              reason: { type: Type.STRING },
            },
          },
          audience_effect: { type: Type.STRING },
          rationale: { type: Type.STRING },
        },
      },
    },
  },
};

export const RISK_SCHEMA: Schema = {
  type: Type.OBJECT,
  required: ["feasibilityScore", "riskLevel", "budgetEstimate", "summary", "breakdown", "logistics", "categories", "redFlags", "mitigations", "safetyProtocols", "vfxBreakdown"],
  properties: {
    feasibilityScore: { type: Type.INTEGER, description: "0 to 100, where 100 is easiest to shoot." },
    riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High", "Extreme"] },
    budgetEstimate: { type: Type.STRING, description: "e.g., '$$ - Moderate' or '$$$$ - Blockbuster'" },
    summary: { type: Type.STRING },
    
    breakdown: {
      type: Type.OBJECT,
      required: ["safety_score", "legal_score", "logistics_score", "vfx_score"],
      properties: {
        safety_score: { type: Type.INTEGER },
        legal_score: { type: Type.INTEGER },
        logistics_score: { type: Type.INTEGER },
        vfx_score: { type: Type.INTEGER },
      },
    },

    logistics: {
      type: Type.OBJECT,
      required: ["crew_size", "est_shoot_days", "indie_friendly", "insurance_requirement"],
      properties: {
         crew_size: { type: Type.STRING, enum: ["Skeleton (5-10)", "Indie (15-30)", "Standard (40-80)", "Blockbuster (100+)"] },
         est_shoot_days: { type: Type.STRING },
         indie_friendly: { type: Type.BOOLEAN },
         insurance_requirement: { type: Type.STRING, enum: ["Standard", "High Risk", "Specialized"] },
      },
    },

    categories: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        required: ["name", "score", "reasoning"],
        properties: {
          name: { type: Type.STRING },
          score: { type: Type.INTEGER, description: "1-10, where 10 is highest risk" },
          reasoning: { type: Type.STRING },
        },
      },
    },
    redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
    mitigations: { type: Type.ARRAY, items: { type: Type.STRING } },
    safetyProtocols: { type: Type.ARRAY, items: { type: Type.STRING } },
    vfxBreakdown: { type: Type.ARRAY, items: { type: Type.STRING } },
    continuity: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                type: { type: Type.STRING, enum: ["CREW", "TONE", "BUDGET", "OTHER"] },
                message: { type: Type.STRING },
                severity: { type: Type.STRING, enum: ["LOW", "HIGH"] }
            }
        }
    }
  },
};

export const RECOMMENDATION_SCHEMA: Schema = {
  type: Type.OBJECT,
  required: ["selected_option_id", "rationale"],
  properties: {
    selected_option_id: { type: Type.STRING, enum: ["A", "B", "C"] },
    rationale: { type: Type.STRING }
  }
};

export const GENRES = [
  "Drama",
  "Thriller",
  "Noir",
  "Sci-Fi",
  "Horror",
  "Comedy",
  "Action",
  "Western",
];

export const MOCK_INITIAL_SCRIPT = `INT. DINER – NIGHT
John sits alone in the booth. The neon sign outside flickers, casting a rhythmic red pulse across his untouched coffee.

He checks his watch. 11:42 PM.

SARAH enters. She’s soaking wet. She doesn’t look at him, just slides into the opposite seat.

JOHN
You're late.

SARAH
I'm not late. I'm hesitant.

John stares at her. The air between them tightens.`;