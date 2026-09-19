/* Prompt Engine — data: preset Characters + scenario library + negative prompt bank */

const CHARACTERS = [
  {
    id: "maya",
    name: "Maya",
    gender: "female",
    avatarColor: "#e0795a",
    vibe: "warm, approachable, editorial-casual",
    dna: `A 26-year-old Brazilian-Japanese woman. Oval face with a soft angular jawline and high cheekbones. Almond-shaped dark brown eyes with warm hazel flecks, natural slightly hooded eyelids, straight medium-thick eyebrows. Small straight nose with a slightly rounded tip. Full lips in a natural rose-nude tone with a subtle cupid's bow. Warm olive skin tone with fine visible pores and light natural freckles across the nose and cheeks; one small mole just above the left lip corner. Long glossy dark brown hair with soft face-framing layers, usually worn down or in a loose low bun. Athletic-slim build, 5'6".`
  },
  {
    id: "sofia",
    name: "Sofia",
    gender: "female",
    avatarColor: "#c74e6b",
    vibe: "glam, confident, golden-hour",
    dna: `A 29-year-old Spanish-Colombian woman. Heart-shaped face, defined cheekbones, softly pointed chin. Large round dark brown eyes with long natural lashes, thick arched eyebrows. Straight nose with a narrow bridge. Full, well-defined lips in a deep berry-nude tone, faint natural asymmetry in the smile. Warm caramel skin tone with a natural sheen and visible fine pores; a small beauty mark on the right cheekbone. Thick wavy chestnut-brown hair past the shoulders with subtle honey highlights. Curvy-athletic build, 5'5".`
  },
  {
    id: "elena",
    name: "Elena",
    gender: "female",
    avatarColor: "#7a6bd0",
    vibe: "soft, natural, girl-next-door",
    dna: `A 24-year-old Eastern European (Polish) woman. Round-oval face, soft jawline. Light blue-grey eyes, downturned almond shape, thin natural blonde eyebrows a shade darker than her hair. Small upturned nose with light freckling across the bridge. Medium lips in a soft pink tone, slight overbite giving a natural smile. Fair skin tone that flushes easily at the cheeks, visible fine skin texture and peach fuzz in natural light. Straight ash-blonde hair, shoulder length with a center part. Slim build, 5'4".`
  },
  {
    id: "zara",
    name: "Zara",
    gender: "female",
    avatarColor: "#3f9e7d",
    vibe: "bold, street, high-energy",
    dna: `A 25-year-old Ethiopian-American woman. Long oval face, strong defined cheekbones, angular jawline. Deep brown almond-shaped eyes with a slight upward tilt, high-arched full eyebrows. Straight narrow nose. Full lips with a defined cupid's bow in a deep plum-nude tone. Rich deep brown skin tone with a natural matte-satin finish and visible pore texture; a faint scar through the outer edge of the left eyebrow. Very short natural coily black hair, tapered sides. Tall athletic build, 5'9".`
  },
  {
    id: "priya",
    name: "Priya",
    gender: "female",
    avatarColor: "#d99a2b",
    vibe: "elegant, editorial, warm-toned",
    dna: `A 27-year-old Indian woman. Oval face, softly defined jaw. Large dark brown eyes with a deep-set almond shape and naturally thick long lashes, full straight eyebrows. Slightly aquiline nose. Full lips in a warm terracotta-nude tone. Warm wheatish-brown skin tone with a natural dewy finish and fine visible pores; a small nose stud (left nostril) and a faint birthmark on the right jawline. Long thick straight-to-wavy black hair usually worn in a low braid or loose over one shoulder. Slim-average build, 5'5".`
  },
  {
    id: "luca",
    name: "Luca",
    gender: "male",
    avatarColor: "#2f6fa8",
    vibe: "rugged, easygoing, outdoorsy",
    dna: `A 30-year-old Italian-Brazilian man. Square face with a strong defined jawline, slight cleft chin. Deep-set hazel-green eyes, straight thick eyebrows. Straight nose with a slightly wide bridge. Medium lips, neutral resting expression with a faint asymmetric smirk. Olive skin tone with visible pores and light natural sun texture; short stubble along the jaw, a small scar through the right eyebrow. Short dark brown wavy hair, textured on top, fading at the sides. Athletic build, 6'0".`
  },
  {
    id: "jordan",
    name: "Jordan",
    gender: "male",
    avatarColor: "#4a7a3f",
    vibe: "clean, corporate-casual, approachable",
    dna: `A 28-year-old Black American man. Oval face, softly rounded jawline. Warm dark brown eyes, medium almond shape, straight full eyebrows. Broad straight nose. Medium-full lips with a relaxed natural smile showing a slight gap in the front teeth. Deep brown skin tone with a natural matte finish and visible pore texture; low, neatly lined-up fade haircut, short black hair. Clean-shaven with sharp jaw definition. Lean-athletic build, 5'11".`
  },
  {
    id: "kenji",
    name: "Kenji",
    gender: "male",
    avatarColor: "#8a5a44",
    vibe: "quiet-cool, minimalist, moody-light",
    dna: `A 26-year-old Japanese man. Oval-narrow face, subtle angular jaw. Monolid dark brown eyes, straight thin-medium eyebrows. Straight narrow nose. Thin-medium lips, neutral composed expression. Fair-to-medium skin tone with a smooth natural texture and visible pores at close range; a small mole below the left eye. Straight black hair, slightly longer on top and swept to one side. Slim build, 5'8".`
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
