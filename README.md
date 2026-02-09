
# CINE-ENGINE 🎬

**"CINE-ENGINE models the argument between a Director, a Line Producer, and an Executive Producer."**

---

## 🏆 Judges' Brief: Gemini 3 Implementation
**Date of Submission:** February 9, 2026  
**Event:** Gemini Global Hackathon 2026

CINE-ENGINE is a **Dual-Lens Cinematic Reasoning Engine** that forces filmmakers to confront the cost of their creativity before shooting a single frame. It addresses the siloed nature of filmmaking by splitting a single script input into opposing cognitive streams, maintaining **long-term continuity memory**, and offering **autonomous recommendations**.

**Core Gemini 3 Integration:**
1.  **Gemini 3 Pro (Thinking Mode):** Central to the **Creative Lens**. We utilize `thinkingBudget: 2048` to model a Director's **decision-making process**. The model reasons through emotional subtext and narrative intent *before* outputting technical camera moves.
2.  **Gemini 3 Flash (Production & Logic):** 
    *   **Risk Audit:** Audits scripts for granular risks (Safety, Legal, Logistics) in real-time.
    *   **Marathon Agent Memory:** Checks new scenes against the *entire project history* to detect **Continuity Drift** (e.g., a sudden budget jump from "Indie" to "Blockbuster").
    *   **Executive Decision Layer:** A final pass that autonomously reviews the creative options against the risk profile to **recommend** the best path forward.
3.  **Gemini 3 Pro Image:** Generates high-fidelity 16:9 conceptual frames.
    *   **Style Lock:** We programmatically inject visual parameters (lighting, lens choice) from the project's *anchor scene* into subsequent prompts to ensure visual consistency across the entire movie.

---

## 🏗️ System Philosophy: The Tri-Layer Architecture

Most AI tools just generate content. CINE-ENGINE generates **decisions**.

It operates on a **Split-Stream Reasoning Architecture**:
*   **Lens A (Creative):** "How do we make this feel emotional?" (Gemini 3 Pro)
*   **Lens B (Production):** "Can we actually afford to shoot this?" (Gemini 3 Flash)
*   **Lens C (Executive):** "Which trade-off is worth it?" (Gemini 3 Flash Recommendation Engine)

---

## 🚀 Getting Started

1.  **Clone & Install**
    ```bash
    npm install
    ```

2.  **API Configuration**
    *   Launch the app (`npm run dev`).
    *   The **Landing Page Modal** will appear.
    *   Enter your **Google Cloud API Key**.
        *   *Note:* A Paid Key is required for **Gemini 3 Pro** features.

*Submitted for the Gemini 3 Global Hackathon, Feb 9, 2026.*
