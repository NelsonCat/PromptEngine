/* Prompt Engine — app logic. All state lives in localStorage; nothing leaves the browser. */

const STORAGE_KEYS = {
  customCharacters: "pe.customCharacters",
  activeCharacterId: "pe.activeCharacterId",
  favorites: "pe.favorites",
  planner: "pe.planner",
  safeMode: "pe.safeMode"
};

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

let customCharacters = load(STORAGE_KEYS.customCharacters, []);
let activeCharacterId = load(STORAGE_KEYS.activeCharacterId, null);
let favorites = load(STORAGE_KEYS.favorites, []);
let planner = load(STORAGE_KEYS.planner, Array(30).fill(null));
let safeMode = load(STORAGE_KEYS.safeMode, true);

function allCharacters() {
  return [...CHARACTERS, ...customCharacters];
}
function getCharacter(id) {
  return allCharacters().find(c => c.id === id) || null;
}
function initials(name) {
  return name.trim().split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => t.classList.remove("show"), 1800);
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => showToast("Copied ✓")).catch(() => showToast("Copy failed — select manually"));
}

/* ---------- Navigation ---------- */

function switchView(view) {
  document.querySelectorAll(".view").forEach(v => v.style.display = "none");
  document.getElementById("view-" + view).style.display = "block";
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b.dataset.view === view));
  if (view === "genie") renderGenie();
  if (view === "favorites") renderFavorites();
  if (view === "planner") renderPlanner();
}

document.getElementById("mainTabs").addEventListener("click", e => {
  const btn = e.target.closest(".tab-btn");
  if (btn) switchView(btn.dataset.view);
});
document.addEventListener("click", e => {
  const btn = e.target.closest("[data-goto]");
  if (btn) switchView(btn.dataset.goto);
});

/* ---------- Header badge ---------- */

function updateActiveBadge() {
  const badge = document.getElementById("activeCharBadge");
  const c = getCharacter(activeCharacterId);
  if (!c) { badge.style.display = "none"; return; }
  badge.style.display = "flex";
  document.getElementById("activeCharSwatch").style.background = c.avatarColor;
  document.getElementById("activeCharName").textContent = c.name;
}

/* ---------- Characters view ---------- */

function renderCharacters() {
  const grid = document.getElementById("characterGrid");
  grid.innerHTML = "";
  allCharacters().forEach(c => {
    const card = document.createElement("div");
    card.className = "character-card" + (c.id === activeCharacterId ? " active" : "");
    const avatarStyle = c.photo ? `background-image:url(${c.photo})` : `background:${c.avatarColor}`;
    card.innerHTML = `
      ${c.id === activeCharacterId ? '<span class="active-pill">ACTIVE</span>' : ""}
      <div class="character-avatar" style="${avatarStyle}">${c.photo ? "" : initials(c.name)}</div>
      <h3>${c.name}</h3>
      <p class="vibe">${c.vibe}</p>
      ${c.origin === "custom" ? '<button class="del-btn" data-del="' + c.id + '">Delete</button>' : ""}
    `;
    card.addEventListener("click", (e) => {
      if (e.target.closest(".del-btn")) return;
      activeCharacterId = c.id;
      save(STORAGE_KEYS.activeCharacterId, activeCharacterId);
      renderCharacters();
      updateActiveBadge();
      showToast(`${c.name} locked in`);
    });
    grid.appendChild(card);
  });
  grid.querySelectorAll("[data-del]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.dataset.del;
      if (!confirm("Delete this character? Its saved favorites will remain but lose their character link.")) return;
      customCharacters = customCharacters.filter(c => c.id !== id);
      save(STORAGE_KEYS.customCharacters, customCharacters);
      if (activeCharacterId === id) {
        activeCharacterId = null;
        save(STORAGE_KEYS.activeCharacterId, null);
      }
      renderCharacters();
      updateActiveBadge();
    });
  });
}

document.getElementById("openBuilderBtn").addEventListener("click", () => {
  document.getElementById("builderModal").classList.add("open");
});
document.getElementById("closeBuilderBtn").addEventListener("click", () => {
  document.getElementById("builderModal").classList.remove("open");
});
document.getElementById("builderModal").addEventListener("click", (e) => {
  if (e.target.id === "builderModal") document.getElementById("builderModal").classList.remove("open");
});

let uploadedPhoto = null;
document.getElementById("photoInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const img = new Image();
  const reader = new FileReader();
  reader.onload = (ev) => {
    img.onload = () => {
      const maxW = 480;
      const scale = Math.min(1, maxW / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      uploadedPhoto = canvas.toDataURL("image/jpeg", 0.85);
      const preview = document.getElementById("photoPreview");
      preview.src = uploadedPhoto;
      preview.style.display = "block";
      document.getElementById("photoDropText").style.display = "none";
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

document.getElementById("builderForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("bName").value.trim();
  if (!name) return;
  const parts = [
    document.getElementById("bAge").value.trim(),
    document.getElementById("bFace").value.trim() ? "Face: " + document.getElementById("bFace").value.trim() + "." : "",
    document.getElementById("bEyes").value.trim() ? "Eyes/brows: " + document.getElementById("bEyes").value.trim() + "." : "",
    document.getElementById("bNoseLips").value.trim() ? "Nose/lips: " + document.getElementById("bNoseLips").value.trim() + "." : "",
    document.getElementById("bSkin").value.trim() ? "Skin: " + document.getElementById("bSkin").value.trim() + "." : "",
    document.getElementById("bHair").value.trim() ? "Hair: " + document.getElementById("bHair").value.trim() + "." : "",
    document.getElementById("bBody").value.trim() ? "Build: " + document.getElementById("bBody").value.trim() + "." : ""
  ].filter(Boolean).join(" ");
  const vibe = document.getElementById("bVibe").value.trim() || "custom character";

  const id = "custom-" + Date.now();
  const newChar = {
    id, name, gender: "unspecified", origin: "custom",
    avatarColor: ["#e0795a","#c74e6b","#7a6bd0","#3f9e7d","#d99a2b","#2f6fa8"][customCharacters.length % 6],
    vibe, dna: (name + (parts ? " — " + parts : "") ).trim(),
    photo: uploadedPhoto
  };
  customCharacters.push(newChar);
  save(STORAGE_KEYS.customCharacters, customCharacters);
  activeCharacterId = id;
  save(STORAGE_KEYS.activeCharacterId, id);

  e.target.reset();
  uploadedPhoto = null;
  document.getElementById("photoPreview").style.display = "none";
  document.getElementById("photoDropText").style.display = "block";
  document.getElementById("builderModal").classList.remove("open");
  renderCharacters();
  updateActiveBadge();
  showToast(`${name} created and locked in`);
});

/* ---------- Genie view ---------- */

function populateSelect(id, options) {
  const sel = document.getElementById(id);
  const first = sel.querySelector("option");
  sel.innerHTML = "";
  sel.appendChild(first);
  options.forEach(opt => {
    const o = document.createElement("option");
    o.value = opt; o.textContent = opt.length > 60 ? opt.slice(0, 57) + "…" : opt;
    sel.appendChild(o);
  });
}

function initGenieControls() {
  populateSelect("selLocation", SCENARIOS.locations);
  populateSelect("selLighting", SCENARIOS.lighting);
  populateSelect("selOutfit", SCENARIOS.outfits);
  populateSelect("selPose", SCENARIOS.poses);
  populateSelect("selExpression", SCENARIOS.expressions);
  populateSelect("selCamera", SCENARIOS.cameras);

  const toolSel = document.getElementById("selTool");
  toolSel.innerHTML = "";
  Object.entries(TOOL_FORMATS).forEach(([key, val]) => {
    const o = document.createElement("option");
    o.value = key; o.textContent = val.label;
    toolSel.appendChild(o);
  });

  const arSel = document.getElementById("selAspect");
  arSel.innerHTML = "";
  ASPECT_RATIOS.forEach(ar => {
    const o = document.createElement("option");
    o.value = ar; o.textContent = "Aspect " + ar;
    arSel.appendChild(o);
  });
  arSel.value = "4:5";
}

function pick(arr, forcedValue) {
  if (forcedValue) return forcedValue;
  return arr[Math.floor(Math.random() * arr.length)];
}

function renderGenie() {
  const c = getCharacter(activeCharacterId);
  document.getElementById("noCharacterNotice").style.display = c ? "none" : "block";
  document.getElementById("genieBody").style.display = c ? "block" : "none";
  if (!c) return;

  document.getElementById("dnaCard").innerHTML = `<span class="dna-title">🔒 Character DNA — Locked</span>${c.dna}`;
  document.getElementById("stackOutput").style.display = "none";
}

function buildStack(character, choices, toolKey, aspect) {
  const boosters = [];
  const shuffledBoosters = [...REALISM_BOOSTERS].sort(() => Math.random() - 0.5).slice(0, 4);
  boosters.push(...shuffledBoosters);

  const positive = [
    `Hyper-realistic professional photograph of the same person described below, ${choices.pose}, ${choices.expression}.`,
    ``,
    `[CHARACTER DNA — LOCKED, MUST MATCH EXACTLY EVERY TIME]`,
    character.dna,
    ``,
    `Scene: ${choices.location}, wearing ${choices.outfit}.`,
    `Lighting: ${choices.lighting}.`,
    `Camera: ${choices.camera}.`,
    ``,
    `Realism: ${boosters.join(", ")}.`
  ].join("\n");

  const toolSuffix = toolKey === "midjourney" ? TOOL_FORMATS.midjourney.suffix(aspect) : TOOL_FORMATS[toolKey].suffix();
  let finalPositive = positive + (toolSuffix || "");
  if (safeMode) finalPositive = sanitizePrompt(finalPositive);

  return { positive: finalPositive, negative: NEGATIVE_PROMPT_BASE };
}

let lastStack = null;

function generateStack(forceRandom) {
  const c = getCharacter(activeCharacterId);
  if (!c) return;

  const choices = {
    location: pick(SCENARIOS.locations, !forceRandom && document.getElementById("selLocation").value),
    lighting: pick(SCENARIOS.lighting, !forceRandom && document.getElementById("selLighting").value),
    outfit: pick(SCENARIOS.outfits, !forceRandom && document.getElementById("selOutfit").value),
    pose: pick(SCENARIOS.poses, !forceRandom && document.getElementById("selPose").value),
    expression: pick(SCENARIOS.expressions, !forceRandom && document.getElementById("selExpression").value),
    camera: pick(SCENARIOS.cameras, !forceRandom && document.getElementById("selCamera").value)
  };
  const toolKey = document.getElementById("selTool").value || "generic";
  const aspect = document.getElementById("selAspect").value || "4:5";

  const stack = buildStack(c, choices, toolKey, aspect);
  lastStack = { characterId: c.id, ...stack, createdAt: Date.now() };

  document.getElementById("posPrompt").value = stack.positive;
  document.getElementById("negPrompt").value = stack.negative;
  document.getElementById("stackOutput").style.display = "block";
}

document.getElementById("generateBtn").addEventListener("click", () => generateStack(false));
document.getElementById("surpriseBtn").addEventListener("click", () => {
  ["selLocation","selLighting","selOutfit","selPose","selExpression","selCamera"].forEach(id => document.getElementById(id).value = "");
  generateStack(true);
});

document.getElementById("copyAllBtn").addEventListener("click", () => {
  if (!lastStack) return;
  copyText(`POSITIVE PROMPT:\n${lastStack.positive}\n\nNEGATIVE PROMPT:\n${lastStack.negative}`);
});

document.querySelectorAll(".copy-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const el = document.getElementById(btn.dataset.copy);
    copyText(el.value);
  });
});

document.getElementById("saveFavBtn").addEventListener("click", () => {
  if (!lastStack) return;
  favorites.unshift({ id: "fav-" + Date.now(), ...lastStack });
  save(STORAGE_KEYS.favorites, favorites);
  showToast("Saved to Favorites ⭐");
});

/* ---------- Favorites view ---------- */

function renderFavorites() {
  const list = document.getElementById("favoritesList");
  const empty = document.getElementById("favEmpty");
  list.innerHTML = "";
  if (favorites.length === 0) { empty.style.display = "block"; return; }
  empty.style.display = "none";

  favorites.forEach(fav => {
    const c = getCharacter(fav.characterId);
    const card = document.createElement("div");
    card.className = "fav-card";
    card.innerHTML = `
      <div class="fav-card-head">
        <div class="fav-card-title">
          <span class="swatch" style="background:${c ? c.avatarColor : "#666"}"></span>
          ${c ? c.name : "Unknown character"}
        </div>
        <span style="color:var(--text-dim); font-size:12px;">${new Date(fav.createdAt).toLocaleDateString()}</span>
      </div>
      <div class="fav-card-preview">${fav.positive.replace(/\n/g, " ")}</div>
      <div class="fav-card-actions">
        <button data-act="copy">Copy Stack</button>
        <button data-act="planner">Add to Planner</button>
        <button data-act="remove" class="remove">Remove</button>
      </div>
    `;
    card.querySelector('[data-act="copy"]').addEventListener("click", () => {
      copyText(`POSITIVE PROMPT:\n${fav.positive}\n\nNEGATIVE PROMPT:\n${fav.negative}`);
    });
    card.querySelector('[data-act="remove"]').addEventListener("click", () => {
      favorites = favorites.filter(f => f.id !== fav.id);
      save(STORAGE_KEYS.favorites, favorites);
      renderFavorites();
    });
    card.querySelector('[data-act="planner"]').addEventListener("click", () => {
      const emptyIdx = planner.findIndex(d => !d);
      if (emptyIdx === -1) { showToast("Planner is full — clear a day first"); return; }
      planner[emptyIdx] = { favId: fav.id, characterId: fav.characterId, positive: fav.positive, negative: fav.negative };
      save(STORAGE_KEYS.planner, planner);
      showToast(`Added to Day ${emptyIdx + 1}`);
    });
    list.appendChild(card);
  });
}

/* ---------- Planner view ---------- */

function renderPlanner() {
  const grid = document.getElementById("plannerGrid");
  grid.innerHTML = "";
  planner.forEach((entry, i) => {
    const c = entry ? getCharacter(entry.characterId) : null;
    const day = document.createElement("div");
    day.className = "planner-day";
    day.innerHTML = `
      <div class="planner-day-head">
        <span class="planner-day-num">Day ${i + 1}</span>
        ${c ? `<span class="planner-day-char"><span class="swatch" style="background:${c.avatarColor}"></span>${c.name}</span>` : ""}
      </div>
      ${entry ? `<div class="planner-day-preview">${entry.positive.replace(/\n/g, " ")}</div>` : `<div class="planner-day-empty">Empty — fill or reroll</div>`}
      <div class="planner-day-actions">
        <button data-act="copy">Copy</button>
        <button data-act="reroll">Reroll</button>
        <button data-act="clear">Clear</button>
      </div>
    `;
    day.querySelector('[data-act="copy"]').addEventListener("click", () => {
      if (!entry) { showToast("Nothing to copy"); return; }
      copyText(`POSITIVE PROMPT:\n${entry.positive}\n\nNEGATIVE PROMPT:\n${entry.negative}`);
    });
    day.querySelector('[data-act="clear"]').addEventListener("click", () => {
      planner[i] = null;
      save(STORAGE_KEYS.planner, planner);
      renderPlanner();
    });
    day.querySelector('[data-act="reroll"]').addEventListener("click", () => {
      const charId = (entry && entry.characterId) || activeCharacterId;
      const c2 = getCharacter(charId);
      if (!c2) { showToast("Pick a character first"); return; }
      const choices = {
        location: pick(SCENARIOS.locations),
        lighting: pick(SCENARIOS.lighting),
        outfit: pick(SCENARIOS.outfits),
        pose: pick(SCENARIOS.poses),
        expression: pick(SCENARIOS.expressions),
        camera: pick(SCENARIOS.camera)
      };
      choices.camera = pick(SCENARIOS.cameras);
      const stack = buildStack(c2, choices, "generic", "4:5");
      planner[i] = { characterId: charId, positive: stack.positive, negative: stack.negative };
      save(STORAGE_KEYS.planner, planner);
      renderPlanner();
    });
    grid.appendChild(day);
  });
}

document.getElementById("fillPlannerBtn").addEventListener("click", () => {
  const c = getCharacter(activeCharacterId);
  if (!c && favorites.length === 0) { showToast("Pick a character or add favorites first"); return; }

  let favPool = favorites.filter(f => !activeCharacterId || f.characterId === activeCharacterId);
  let favIdx = 0;

  planner.forEach((entry, i) => {
    if (entry) return;
    if (favIdx < favPool.length) {
      const f = favPool[favIdx++];
      planner[i] = { favId: f.id, characterId: f.characterId, positive: f.positive, negative: f.negative };
    } else if (c) {
      const choices = {
        location: pick(SCENARIOS.locations),
        lighting: pick(SCENARIOS.lighting),
        outfit: pick(SCENARIOS.outfits),
        pose: pick(SCENARIOS.poses),
        expression: pick(SCENARIOS.expressions),
        camera: pick(SCENARIOS.cameras)
      };
      const stack = buildStack(c, choices, "generic", "4:5");
      planner[i] = { characterId: c.id, positive: stack.positive, negative: stack.negative };
    }
  });
  save(STORAGE_KEYS.planner, planner);
  renderPlanner();
  showToast("Planner filled ✓");
});

document.getElementById("clearPlannerBtn").addEventListener("click", () => {
  if (!confirm("Clear all 30 days?")) return;
  planner = Array(30).fill(null);
  save(STORAGE_KEYS.planner, planner);
  renderPlanner();
});

/* ---------- Safe Mode toggle ---------- */

function updateSafeModeUI() {
  document.getElementById("safeModeToggle").checked = safeMode;
  document.getElementById("safeModeTitle").textContent = safeMode ? 'Safe Mode — ON' : 'Standard Mode — natural language';
  document.getElementById("safeModeSub").textContent = safeMode
    ? 'Swaps ambiguous words (like "nude" used as a color term) so prompts don\'t get false-flagged by an image generator\'s NSFW filter.'
    : 'Uses natural photography/beauty wording as-is (e.g. "nude lipstick"). Some AI tools\' keyword filters may false-flag this — switch Safe Mode back on if you hit that.';
}

document.getElementById("safeModeToggle").addEventListener("change", (e) => {
  safeMode = e.target.checked;
  save(STORAGE_KEYS.safeMode, safeMode);
  updateSafeModeUI();
  if (document.getElementById("stackOutput").style.display !== "none") generateStack(false);
});

/* ---------- Init ---------- */

initGenieControls();
renderCharacters();
updateActiveBadge();
updateSafeModeUI();
switchView("characters");
