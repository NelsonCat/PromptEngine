/* Prompt Engine — data: preset Characters + scenario library + negative prompt bank */

const CHARACTERS = [
  {
    id: "aiko",
    name: "Aiko",
    gender: "female",
    avatarColor: "#e0795a",
    vibe: "warm, soft-glow, girl-next-door",
    dna: `A 25-year-old Japanese woman. Oval face with a softly rounded jawline. Monolid dark brown eyes with a gentle downward tilt, straight thin eyebrows. Small straight nose with a delicate rounded tip. Full lips in a soft beige-pink tone with a subtle cupid's bow. Fair skin tone with a soft matte finish and fine visible pores; a small mole just beneath the right eye. Straight jet-black hair in a blunt bob with soft bangs. Petite-slim build, 5'2".`
  },
  {
    id: "hana",
    name: "Hana",
    gender: "female",
    avatarColor: "#7a6bd0",
    vibe: "quiet-cool, minimalist, moody-light",
    dna: `A 28-year-old Japanese woman. Long oval face, softly defined jawline. Deep-set dark brown eyes with natural double eyelids, straight full eyebrows. Straight nose with a narrow bridge. Medium lips in a muted mauve-rose tone. Warm ivory skin tone with fine natural texture and visible pores; a faint scar near the outer edge of the left eyebrow. Long straight dark brown hair past the shoulders with a center part. Slim build, 5'5".`
  },
  {
    id: "haruto",
    name: "Haruto",
    gender: "male",
    avatarColor: "#2f6fa8",
    vibe: "rugged, easygoing, street-casual",
    dna: `A 30-year-old Japanese man. Square face with a defined jawline and light stubble. Monolid dark brown eyes, straight thick eyebrows. Straight nose with a medium bridge. Thin-medium lips, neutral composed expression. Fair-tan skin tone with visible pore texture and natural sun-worn skin; a small mole on the side of the neck. Short black hair in a textured crop, slightly longer on top. Lean-athletic build, 5'9".`
  },
  {
    id: "yuna",
    name: "Yuna",
    gender: "female",
    avatarColor: "#d99a2b",
    vibe: "glam, bright, K-beauty editorial",
    dna: `A 24-year-old Korean woman. Heart-shaped face, soft jawline, high cheekbones. Large round dark brown eyes with natural double eyelids, straight thin eyebrows. Small straight nose. Full lips in a soft coral-pink tone. Fair porcelain skin tone with a natural dewy finish and fine visible pores; a small cluster of light freckles across the nose. Long straight black hair with soft layers and side-swept bangs. Slim build, 5'4".`
  },
  {
    id: "jiwoo",
    name: "Ji-woo",
    gender: "female",
    avatarColor: "#3f9e7d",
    vibe: "bold, street, high-energy",
    dna: `A 27-year-old Korean woman. Oval face, angular jawline. Almond-shaped monolid eyes, thick straight eyebrows. Straight nose with a narrow bridge. Full lips in a deep rose tone with a sharply defined cupid's bow. Warm beige skin tone with a natural matte finish and visible pore texture; a small mole just above the lip. Short blunt-cut black bob. Athletic build, 5'6".`
  },
  {
    id: "minjun",
    name: "Min-jun",
    gender: "male",
    avatarColor: "#4a7a3f",
    vibe: "clean, corporate-casual, approachable",
    dna: `A 26-year-old Korean man. Oval face, softly angular jawline. Monolid dark brown eyes, straight thick eyebrows. Straight nose. Medium lips with a relaxed natural smile. Fair skin tone with a smooth matte finish and visible pore texture; a faint scar through the outer edge of the right eyebrow. Short black hair, textured on top with faded sides. Slim-athletic build, 5'10".`
  },
  {
    id: "mei",
    name: "Mei",
    gender: "female",
    avatarColor: "#c74e6b",
    vibe: "elegant, editorial, soft-lit",
    dna: `A 29-year-old Chinese woman. Oval face with softly defined cheekbones. Almond-shaped dark brown eyes, straight medium eyebrows. Straight nose with a delicate bridge. Full lips in a soft berry-mauve tone. Warm ivory skin tone with a natural sheen and fine visible pores; a small beauty mark near the outer corner of the left eye. Long straight black hair reaching mid-back, center part. Slim build, 5'5".`
  },
  {
    id: "wei",
    name: "Wei",
    gender: "male",
    avatarColor: "#8a5a44",
    vibe: "quiet confidence, minimalist, moody",
    dna: `A 31-year-old Chinese man. Square-oval face with a strong jawline. Deep-set dark brown eyes, straight thick eyebrows. Straight nose with a wide bridge. Medium lips, calm composed expression. Tan-olive skin tone with visible pore texture and light natural stubble. Short black hair with a clean side part. Athletic build, 6'0".`
  }
];

const SCENARIOS = {
  locations: [
    "on a sun-warmed rooftop terrace overlooking a city skyline",
    "in a cozy sunlit kitchen, morning light through sheer curtains",
    "walking down a quiet cobblestone street in an old European town",
    "on a wide sandy beach at low tide, waves softly blurred behind",
    "in a minimalist white-walled bedroom, seated on the edge of the bed",
    "inside a plant-filled greenhouse, dappled light through the glass",
    "at an outdoor café table, string lights blurred in the background",
    "in front of a bathroom mirror, phone raised for a candid selfie",
    "on a hiking trail overlook at golden hour, mountains in the distance",
    "inside a cozy bookstore aisle, warm lamp light",
    "at a rooftop pool, leaning against the railing",
    "in a parked car at dusk, city lights soft-focused through the window",
    "at a farmers market stall, holding a small bouquet of flowers",
    "in an industrial loft apartment, large factory windows behind",
    "on a quiet train platform, soft overhead light",
    "in a home gym, mid-stretch after a workout",
    "at a night market, neon signs glowing softly out of focus",
    "on a balcony at sunset, city rooftops stretching behind"
  ],
  lighting: [
    "soft golden-hour sunlight raking across the face",
    "diffused overcast daylight, even and flattering",
    "warm tungsten lamp light with soft shadows",
    "bright midday sun with natural squint and hard-edged shadows",
    "cool blue hour twilight with a single warm light source",
    "window light falling from one side, natural falloff on the far cheek",
    "candlelight flicker mixed with dim ambient room light",
    "soft bounce flash, simulating an on-camera flash photo look",
    "hazy backlight creating a soft rim glow around the hair",
    "mixed neon and shadow, colored light spill on one side of the face"
  ],
  outfits: [
    "an oversized cream knit sweater and gold hoop earrings",
    "a relaxed white linen shirt, sleeves rolled up",
    "a fitted black ribbed tank top and denim jacket",
    "a flowy floral sundress",
    "matching grey athleisure set, hair pulled back",
    "a tailored beige trench coat over a simple tee",
    "a chunky cable-knit cardigan and jeans",
    "a silk slip dress in a muted earth tone",
    "a plain fitted t-shirt and worn-in denim jeans",
    "a cozy oversized hoodie, sleeves pushed up",
    "a linen button-down shirt, top buttons undone",
    "a structured blazer over a plain tee, smart-casual"
  ],
  poses: [
    "looking directly into the lens with a relaxed half-smile",
    "glancing off to the side, caught mid-laugh",
    "hand brushing hair back from the face, candid motion blur at the fingertips",
    "leaning casually against a wall, weight on one hip",
    "sitting cross-legged, chin resting lightly on one hand",
    "walking mid-stride, looking back over one shoulder",
    "holding a coffee cup with both hands, looking down slightly",
    "arms crossed loosely, calm neutral expression",
    "adjusting sunglasses with one hand, slight smile",
    "sitting on a ledge, legs dangling, looking toward the horizon",
    "captured mid-conversation, mouth slightly open, natural unposed moment",
    "stretching one arm overhead, caught mid-motion"
  ],
  expressions: [
    "a genuine, slightly asymmetric smile",
    "a calm, neutral expression with soft eyes",
    "a candid laugh with eyes crinkled",
    "a thoughtful, slightly downward gaze",
    "raised eyebrows in playful surprise",
    "a quiet, content half-smile",
    "an intense, direct gaze with relaxed brows",
    "a shy smile with eyes glancing away from the lens"
  ],
  cameras: [
    "shot on an iPhone 15 Pro rear camera, natural phone-photo look, slight lens distortion at the edges",
    "shot on a Sony A7IV with an 85mm f/1.4 lens, shallow depth of field, creamy background blur",
    "shot on a Fujifilm X100V, 35mm equivalent, slight film grain, punchy but natural color",
    "shot on a Canon 5D Mark IV with a 50mm f/1.8 lens, natural compression, soft bokeh",
    "shot on 35mm film (Portra 400), fine grain, warm natural color rendition",
    "shot handheld on a point-and-shoot digital camera, candid early-2000s photo-dump aesthetic",
    "shot on a DSLR with a 24-70mm f/2.8 lens at 50mm, balanced sharpness across the frame"
  ]
};

const REALISM_BOOSTERS = [
  "visible individual skin pores and fine skin texture",
  "natural subtle skin imperfections — light blemishes, uneven tone, no retouching",
  "subsurface scattering in the skin under direct light",
  "natural facial asymmetry preserved, not idealized",
  "realistic catchlights in the eyes matching the light source",
  "fine flyaway hairs and natural hair texture, not overly smooth",
  "true-to-life color grading, no oversaturation",
  "subtle natural film grain",
  "unretouched, candid, documentary-style realism",
  "soft natural shadow falloff consistent with the light source"
];

const NEGATIVE_PROMPT_BASE = [
  "plastic skin", "waxy skin", "doll-like skin", "airbrushed skin", "over-smoothed skin",
  "mannequin face", "uncanny valley", "unnaturally symmetrical face", "glassy eyes", "dead eyes",
  "vacant stare", "extra fingers", "fused fingers", "mutated hands", "malformed hands",
  "extra limbs", "missing limbs", "distorted anatomy", "warped face", "blurry face",
  "low detail skin", "CGI look", "3D render look", "video game character",
  "over-sharpened", "HDR halo", "oversaturated skin tones", "generic AI face",
  "stock photo look", "different face", "changed facial structure", "inconsistent identity",
  "watermark", "text", "logo", "jpeg artifacts", "low resolution", "extra teeth",
  "asymmetric pupils", "cross-eyed", "deformed ears", "plastic hair", "wig-like hair"
].join(", ");

const TOOL_FORMATS = {
  generic: { label: "Generic (any AI image tool)", suffix: () => "" },
  midjourney: {
    label: "Midjourney",
    suffix: (ar) => ` --ar ${ar} --style raw --v 6.1`
  },
  flux: {
    label: "Flux / SDXL",
    suffix: () => "\n\n(Suggested settings: steps 30-40, CFG 3.5-5, high-res fix / 2x upscale for skin detail)"
  }
};

const ASPECT_RATIOS = ["4:5", "3:4", "9:16", "1:1", "16:9"];

/* Only Midjourney's --ar flag is machine-read; every other tool only sees
   whatever's written in plain English, so the chosen aspect ratio has to be
   spelled out in the prompt body itself or it gets silently ignored. */
const ASPECT_ORIENTATION = {
  "4:5": "portrait, slightly taller than wide",
  "3:4": "portrait, slightly taller than wide",
  "9:16": "tall vertical portrait, phone-screen / Story shape",
  "1:1": "square",
  "16:9": "wide horizontal landscape"
};

/* Explicit pixel dimensions give text-only models something more concrete
   to latch onto than a bare ratio — helps on tools that otherwise default
   to their own square/landscape output regardless of what the text says. */
const ASPECT_DIMENSIONS = {
  "4:5": "1024x1280",
  "3:4": "1024x1365",
  "9:16": "1080x1920",
  "1:1": "1024x1024",
  "16:9": "1920x1080"
};

/* Some AI image tools do a dumb substring match for NSFW filtering and flag
   words like "nude" even when used as an innocuous makeup/color term (e.g.
   "nude lipstick"). Safe Mode swaps these for equivalent wording so the
   prompt still reads naturally but won't trip a naive keyword filter. */
const SAFE_WORD_REPLACEMENTS = [
  [/rose-nude/gi, "rosy-beige"],
  [/berry-nude/gi, "berry-mauve"],
  [/plum-nude/gi, "muted plum"],
  [/terracotta-nude/gi, "warm terracotta"],
  [/\bnude\b/gi, "beige-toned"]
];

function sanitizePrompt(text) {
  return SAFE_WORD_REPLACEMENTS.reduce((out, [pattern, replacement]) => out.replace(pattern, replacement), text);
}
