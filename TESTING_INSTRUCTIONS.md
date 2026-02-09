
# 🧪 CINE-ENGINE: Testing Protocol

This document outlines the manual testing procedures to validate the functionality, logic, and stability of the CINE-ENGINE application.

---

## 🔑 Prerequisites

1.  **Browser:** Chrome (Recommended), Edge, or Firefox.
2.  **API Key:** A valid Google Cloud API Key with access to the **Gemini API**.
    *   *Note:* To test **Gemini 3 Pro** features (Thinking Mode, High-Res Images), a paid tier key is recommended.
    *   *Free Tier:* Will fallback to standard models if Pro is unavailable, though some 503 errors may occur during high traffic.
3.  **Network:** Stable internet connection (required for real-time AI streaming).

---

## 🟢 Phase 1: Initialization & Connection

**Objective:** Ensure the app loads and authenticates with the Gemini API.

1.  **Load Application:**
    *   Open `http://localhost:5173/` (or the deployed URL).
    *   *Pass Criteria:* The "Landing Page" should appear with the "System Status: Ready" indicator. Background texture and UI should look polished.
2.  **API Configuration:**
    *   Click **"Launch System"** or the **Settings (Gear Icon)**.
    *   **Test A (Empty Key):** Click "Initialize Standard".
        *   *Result:* App should enter the workspace in "LITE" mode.
    *   **Test B (Valid Key):** Paste a valid API Key and click "Initialize Pro Engine".
        *   *Result:* App should enter the workspace. Status Bar (bottom) should read: "AI: Gemini 3 Pro + G3 Image".

---

## 🎬 Phase 2: Project Management

**Objective:** Validate script parsing and project state handling.

1.  **Create Project:**
    *   Click **"Create Project"** in the Toolbar.
    *   **Quick Start:** Select "Big Bang Theory" sample -> Click "Initialize".
        *   *Result:* Sidebar should populate with 3 scenes.
    *   **Blank Project:** Select "Blank" -> Enter Name "Test Movie" -> Initialize.
        *   *Result:* Sidebar is empty. Text area is editable.
2.  **Navigation:**
    *   Click Scene 1 in the sidebar.
    *   *Result:* The script text area should update immediately with Scene 1's content.
    *   Click Scene 2.
    *   *Result:* Script text updates.

---

## 🧠 Phase 3: The Dual-Lens Analysis (Core Workflow)

**Objective:** Test the parallel processing of Creative (Gemini 3 Pro) and Production (Gemini 3 Flash) agents.

1.  **Generate Analysis:**
    *   Select a scene (e.g., Scene 1).
    *   Set **Genre** to "Thriller" and **References** to "Fincher".
    *   Click **"GENERATE BREAKDOWN"**.
    *   *Visual Check:* Button should show a spinner. Overlay on the canvas should say "Running Dual-Lens Analysis...".
2.  **Verify Creative Lens (Lens A):**
    *   Wait for completion (approx 3-8 seconds).
    *   Check Tabs: **Option A**, **Option B**, **Option C**.
    *   *Result:* Each option should have:
        *   Unique Title.
        *   "Line Producer Flag" (Approved/Risky/Rejected).
        *   Rationale text.
    *   *Group B Test:* Look for the **"System Recommendation"** star badge on one of the options.
3.  **Verify Production Lens (Lens B):**
    *   Click the **"Production"** toggle in the Toolbar.
    *   *Result:* View should switch to the Risk Dashboard.
    *   *Check:* Feasibility Score (0-100), Risk Level (Low/High), and Granular Breakdown bars (Safety, Legal, etc.).
    *   *Check:* "Indie Friendly" boolean logic (Thumbs Up/Down).

---

## 🎨 Phase 4: Visualization & Style Lock

**Objective:** Test image generation and visual consistency.

1.  **Generate Storyboard:**
    *   Switch back to **"Creative"** lens.
    *   On Option A, click **"VISUALIZE"**.
    *   *Result:* A modal should open. Loading spinner appears ("Synthesizing Imagery").
    *   *Pass Criteria:* 3 distinct images (Wide, Medium, Close-up) appear after ~5-10 seconds.
2.  **Test Style Lock (Group C Feature):**
    *   Ensure the **"Style Lock"** padlock icon in the Toolbar is **LOCKED** (Closed).
    *   Save Scene 1 (Click "Confirm Choice").
    *   Navigate to Scene 2.
    *   Generate Analysis -> Click Visualize on an option.
    *   *Pass Criteria:* The generated images for Scene 2 should share the same lighting/color palette as Scene 1 (e.g., if Scene 1 was "Neon Noir", Scene 2 shouldn't be "Desaturated Sepia").

---

## 💾 Phase 5: Memory & Manifests

**Objective:** Ensure data persistence within the session.

1.  **Save Scene:**
    *   On a generated scene, click **"Confirm Choice"**.
    *   *Result:* A green checkmark appears on the card.
    *   In the Sidebar, a green checkmark appears next to the Scene ID.
2.  **Project Manifest:**
    *   Click the **Project Name** button in the Toolbar (or File > Project Archive).
    *   *Result:* A modal opens listing all saved scenes.
    *   *Action:* Click **"Export JSON Manifest"**.
    *   *Pass Criteria:* A `.json` file downloads containing the script, analysis, and base64 images.

---

## 📱 Phase 6: Responsive & Mobile Testing

**Objective:** Verify the UI adapts to smaller screens.

1.  **Resize Browser:** Shrink window to mobile width (< 768px).
2.  **Check Layout:**
    *   Toolbar should simplify.
    *   **Bottom Navigation Bar** should appear (Navigator | Canvas | Rationale).
3.  **Interaction:**
    *   Tap "Navigator" -> Select Scene.
    *   Tap "Canvas" -> View Cards.
    *   Tap "Rationale" -> View Text Analysis.

---

## ⚠️ Phase 7: Edge Case & Error Handling

1.  **Simulate 503 (Overload):**
    *   *Note:* This happens naturally with the Preview API.
    *   *Pass Criteria:* The app should show a Toast notification: "Server Busy... Retrying". It should attempt exponential backoff automatically.
2.  **Content Safety:**
    *   Input a script with explicit violence or banned topics.
    *   *Pass Criteria:* Gemini API may block the response. The app should display a graceful error message in the UI ("Content blocked by safety filters" or similar generic API error).
3.  **Empty Input:**
    *   Try clicking "Generate" with an empty script.
    *   *Pass Criteria:* Button should be disabled.

---

## 🏁 Final Sign-Off Checklist

- [ ] API Key configuration works.
- [ ] Creative Analysis generates 3 distinct options.
- [ ] Production Risk Score calculates reasonable values.
- [ ] Images generate successfully.
- [ ] "Style Lock" passes previous scene context.
- [ ] Project Manifest exports valid JSON.
- [ ] UI looks consistent in Dark Mode.
