
import { ScriptManifest, ScriptScene } from "../types";

export const SAMPLE_SCRIPTS: Record<string, string> = {
  "Big Bang Theory (Sitcom)": `
SCENE 1
INT. A TAXI - NIGHT

BERNADETTE
Burbank Airport, please.

PENNY
Vegas, here we come.

BERNADETTE
No husbands, no boyfriends, no rules.

AMY
No rules? We’re not gonna get drunk and have a six-way with the Blue Man Group, are we?

PENNY
No.

AMY
So there are some rules.

BERNADETTE
Fine. No husbands, no boyfriends, some rules.

AMY
Thank you. Vegas!

SCENE 2
INT. THE APARTMENT - DAY

HOWARD
The ladies are away, the boys will play.

RAJ
Anything can happen.

LEONARD
It’s gonna get crazy.

SHELDON
Dungeons & Dragons.

SCENE 3
INT. THE TAXI - NIGHT

PENNY
I got a brand-new bikini, so drinks at the pool are on these.

BERNADETTE
I got a sexy new tube top that says come hither, and a can of pepper spray that says close enough, Jack.

AMY
I got some old underwear I’m gonna throw on stage at the Garth Brooks concert.

PENNY
I’m sorry, why old?

AMY
‘Cause last time I saw him, I threw new ones and it got me nothing.
`.trim(),

"The Godfather (Crime Drama)": `
SCENE 1
INT. DON CORLEONE'S OFFICE - DAY

The blinds are closed. The room is dark, amber, dusty.

BONASERA
I believe in America. America has made my fortune. And I raised my daughter in the American fashion. I gave her freedom, but I taught her never to dishonor her family.

DON CORLEONE sits behind his desk. A silhouette. He pets a cat.

BONASERA
She found a boyfriend... not an Italian. She went to the movies with him. He stayed out late. I didn't protest. Two months ago, he took her for a drive, with another boyfriend. They made her drink whiskey. And then they tried to take advantage of her.

Bonasera pauses. He is weeping.

BONASERA
I went to the police, like a good American. These two boys were brought to trial. The judge sentenced them to three years in prison... suspended sentence. They went free that very day!

SCENE 2
EXT. WEDDING RECEPTION - DAY

Music, dancing, laughter. A stark contrast to the dark office.
KAY ADAMS and MICHAEL CORLEONE sit at a table.

KAY
Who is that man, Michael? The scary one.

MICHAEL
That's Luca Brasi. He helps my father.

KAY
He looks like he wants to kill someone.

MICHAEL
(matter of fact)
He probably does.
`.trim()
};

export const parseScriptText = (text: string): ScriptManifest => {
  const lines = text.split('\n');
  const scenes: ScriptScene[] = [];
  
  let currentScene: ScriptScene | null = null;
  let sceneCount = 0;

  // Regex for scene headers: INT., EXT., SCENE, or numbered SCENE 1
  const headerRegex = /^(INT\.|EXT\.|SCENE\s+\d+|SCENE:)/i;

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    if (headerRegex.test(trimmed)) {
      // Start new scene
      if (currentScene) {
        scenes.push(currentScene);
      }
      sceneCount++;
      currentScene = {
        id: `scene-${Date.now()}-${sceneCount}`,
        scene_number: sceneCount,
        location: trimmed.replace(/^(SCENE\s+\d+[:\s-]*)/i, ''), // Clean up "SCENE 1" to get location if possible
        content: trimmed + '\n'
      };
    } else {
      if (currentScene) {
        currentScene.content += line + '\n';
      } else {
        // Content before first scene header, treat as Scene 1 if explicit header missing
        sceneCount++;
        currentScene = {
          id: `scene-${Date.now()}-${sceneCount}`,
          scene_number: sceneCount,
          location: "OPENING SCENE",
          content: trimmed + '\n'
        };
      }
    }
  });

  // Push last scene
  if (currentScene) {
    scenes.push(currentScene);
  }

  return {
    source: "UPLOAD",
    scenes
  };
};