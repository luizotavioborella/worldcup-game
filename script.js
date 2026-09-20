"use strict";

// Dimensões internas do campo usadas pela física e pelo desenho no canvas.
const FIELD_W = 960;
const FIELD_H = 560;
const GOAL_TOP = 214;
const GOAL_BOTTOM = 346;
const MATCH_SECONDS = 120;
const BALL_RADIUS = 7;
const PLAYER_RADIUS = 13;

// Regras de escalação: o usuário precisa completar todas as posições.
const POSITIONS = [
  { key: "GK", label: "Goleiro", plural: "Goleiros", required: 1 },
  { key: "FB", label: "Lateral", plural: "Laterais", required: 2 },
  { key: "CB", label: "Zagueiro", plural: "Zagueiros", required: 2 },
  { key: "MID", label: "Meio-campista", plural: "Meio-campistas", required: 2 },
  { key: "WING", label: "Ponta", plural: "Pontas", required: 2 },
  { key: "ST", label: "Centroavante", plural: "Centroavantes", required: 2 }
];

// Elenco disponível com ratings realistas e atributos usados no gameplay.
const PLAYERS = [
  player("alisson", "Alisson Becker", "Brasil", "GK", 91, { pace: 55, shoot: 18, pass: 75, defense: 52, physical: 82, keeper: 92 }, "Reflexo"),
  player("martinez", "Emiliano Martinez", "Argentina", "GK", 89, { pace: 52, shoot: 18, pass: 70, defense: 50, physical: 86, keeper: 90 }, "Reflexo"),
  player("ederson", "Ederson Moraes", "Brasil", "GK", 89, { pace: 60, shoot: 20, pass: 86, defense: 49, physical: 80, keeper: 88 }, "Passe"),
  player("courtois", "Thibaut Courtois", "Bélgica", "GK", 91, { pace: 49, shoot: 16, pass: 72, defense: 53, physical: 84, keeper: 93 }, "Reflexo"),
  player("maignan", "Mike Maignan", "França", "GK", 89, { pace: 58, shoot: 18, pass: 78, defense: 51, physical: 83, keeper: 90 }, "Reflexo"),
  player("donnarumma", "Gianluigi Donnarumma", "Itália", "GK", 88, { pace: 50, shoot: 17, pass: 68, defense: 54, physical: 86, keeper: 89 }, "Reflexo"),
  player("joan-garcia", "Joan Garcia", "Espanha", "GK", 84, { pace: 54, shoot: 15, pass: 70, defense: 47, physical: 79, keeper: 85 }, "Reflexo"),
  player("raya", "David Raya", "Espanha", "GK", 86, { pace: 55, shoot: 17, pass: 82, defense: 48, physical: 78, keeper: 86 }, "Passe"),

  player("hakimi", "Achraf Hakimi", "Marrocos", "FB", 88, { pace: 93, shoot: 76, pass: 82, defense: 81, physical: 80, keeper: 10 }, "Velocidade"),
  player("theo", "Theo Hernández", "França", "FB", 88, { pace: 94, shoot: 78, pass: 79, defense: 80, physical: 84, keeper: 10 }, "Velocidade"),
  player("carvajal", "Dani Carvajal", "Espanha", "FB", 86, { pace: 82, shoot: 70, pass: 81, defense: 84, physical: 79, keeper: 10 }, "Defesa"),
  player("kounde", "Jules Koundé", "França", "FB", 86, { pace: 84, shoot: 58, pass: 76, defense: 86, physical: 82, keeper: 10 }, "Defesa"),
  player("trent", "Trent Alexander-Arnold", "Inglaterra", "FB", 87, { pace: 78, shoot: 75, pass: 91, defense: 79, physical: 73, keeper: 10 }, "Passe"),
  player("timber", "Jurrien Timber", "Holanda", "FB", 85, { pace: 82, shoot: 61, pass: 78, defense: 85, physical: 80, keeper: 10 }, "Defesa"),
  player("davies", "Alphonso Davies", "Canadá", "FB", 86, { pace: 95, shoot: 72, pass: 78, defense: 77, physical: 78, keeper: 10 }, "Velocidade"),
  player("nuno", "Nuno Mendes", "Portugal", "FB", 86, { pace: 91, shoot: 68, pass: 80, defense: 82, physical: 78, keeper: 10 }, "Velocidade"),

  player("van-dijk", "Virgil van Dijk", "Holanda", "CB", 91, { pace: 78, shoot: 63, pass: 76, defense: 92, physical: 89, keeper: 10 }, "Defesa"),
  player("saliba", "William Saliba", "França", "CB", 89, { pace: 82, shoot: 55, pass: 75, defense: 90, physical: 86, keeper: 10 }, "Defesa"),
  player("dias", "Rúben Dias", "Portugal", "CB", 88, { pace: 72, shoot: 58, pass: 74, defense: 89, physical: 87, keeper: 10 }, "Defesa"),
  player("gabriel", "Gabriel Magalhães", "Brasil", "CB", 87, { pace: 74, shoot: 61, pass: 70, defense: 88, physical: 88, keeper: 10 }, "Físico"),
  player("marquinhos", "Marquinhos", "Brasil", "CB", 87, { pace: 76, shoot: 59, pass: 78, defense: 88, physical: 81, keeper: 10 }, "Defesa"),
  player("rudiger", "Antonio Rüdiger", "Alemanha", "CB", 88, { pace: 84, shoot: 62, pass: 71, defense: 88, physical: 89, keeper: 10 }, "Físico"),
  player("konate", "Konaté", "França", "CB", 86, { pace: 79, shoot: 54, pass: 69, defense: 87, physical: 88, keeper: 10 }, "Físico"),
  player("gvardiol", "Joško Gvardiol", "Croácia", "CB", 87, { pace: 82, shoot: 66, pass: 79, defense: 87, physical: 84, keeper: 10 }, "Defesa"),

  player("bellingham", "Jude Bellingham", "Inglaterra", "MID", 91, { pace: 82, shoot: 88, pass: 87, defense: 81, physical: 86, keeper: 10 }, "Passe"),
  player("de-bruyne", "Kevin De Bruyne", "Bélgica", "MID", 91, { pace: 74, shoot: 88, pass: 94, defense: 70, physical: 78, keeper: 10 }, "Passe"),
  player("rodri", "Rodri", "Espanha", "MID", 91, { pace: 66, shoot: 82, pass: 90, defense: 88, physical: 86, keeper: 10 }, "Passe"),
  player("valverde", "Federico Valverde", "Uruguai", "MID", 89, { pace: 88, shoot: 84, pass: 86, defense: 84, physical: 87, keeper: 10 }, "Físico"),
  player("bruno", "Bruno Fernandes", "Portugal", "MID", 88, { pace: 76, shoot: 86, pass: 90, defense: 73, physical: 76, keeper: 10 }, "Passe"),
  player("rice", "Declan Rice", "Inglaterra", "MID", 88, { pace: 78, shoot: 78, pass: 84, defense: 88, physical: 87, keeper: 10 }, "Defesa"),
  player("wirtz", "Florian Wirtz", "Alemanha", "MID", 89, { pace: 84, shoot: 84, pass: 90, defense: 66, physical: 72, keeper: 10 }, "Passe"),
  player("odegaard", "Martin Odegaard", "Noruega", "MID", 89, { pace: 78, shoot: 83, pass: 90, defense: 68, physical: 72, keeper: 10 }, "Passe"),

  player("mbappe", "Kylian Mbappé", "França", "WING", 92, { pace: 97, shoot: 91, pass: 84, defense: 48, physical: 82, keeper: 10 }, "Velocidade"),
  player("vini", "Vinícius Júnior", "Brasil", "WING", 91, { pace: 96, shoot: 88, pass: 83, defense: 42, physical: 76, keeper: 10 }, "Velocidade"),
  player("yamal", "Lamine Yamal", "Espanha", "WING", 88, { pace: 90, shoot: 83, pass: 86, defense: 45, physical: 64, keeper: 10 }, "Velocidade"),
  player("salah", "Mohamed Salah", "Egito", "WING", 90, { pace: 89, shoot: 91, pass: 84, defense: 48, physical: 76, keeper: 10 }, "Chute"),
  player("raphinha", "Raphinha", "Brasil", "WING", 88, { pace: 88, shoot: 86, pass: 85, defense: 55, physical: 74, keeper: 10 }, "Chute"),
  player("dembele", "Ousmane Dembélé", "França", "WING", 88, { pace: 93, shoot: 84, pass: 84, defense: 42, physical: 67, keeper: 10 }, "Velocidade"),
  player("saka", "Bukayo Saka", "Inglaterra", "WING", 89, { pace: 87, shoot: 86, pass: 86, defense: 63, physical: 76, keeper: 10 }, "Passe"),
  player("leao", "Rafael Leão", "Portugal", "WING", 87, { pace: 93, shoot: 84, pass: 80, defense: 39, physical: 78, keeper: 10 }, "Velocidade"),

  player("haaland", "Erling Haaland", "Noruega", "ST", 92, { pace: 89, shoot: 94, pass: 76, defense: 49, physical: 91, keeper: 10 }, "Chute"),
  player("kane", "Harry Kane", "Inglaterra", "ST", 91, { pace: 72, shoot: 93, pass: 87, defense: 52, physical: 84, keeper: 10 }, "Chute"),
  player("messi", "Lionel Messi", "Argentina", "ST", 91, { pace: 80, shoot: 92, pass: 91, defense: 38, physical: 66, keeper: 10 }, "Passe"),
  player("ronaldo", "Cristiano Ronaldo", "Portugal", "ST", 88, { pace: 79, shoot: 90, pass: 78, defense: 42, physical: 82, keeper: 10 }, "Chute"),
  player("lewandowski", "Robert Lewandowski", "Polônia", "ST", 89, { pace: 73, shoot: 91, pass: 79, defense: 47, physical: 82, keeper: 10 }, "Chute"),
  player("lautaro", "Lautaro Martínez", "Argentina", "ST", 89, { pace: 82, shoot: 89, pass: 78, defense: 58, physical: 84, keeper: 10 }, "Chute"),
  player("gyokeres", "Viktor Gyokeres", "Suécia", "ST", 88, { pace: 88, shoot: 88, pass: 76, defense: 50, physical: 89, keeper: 10 }, "Físico"),
  player("julian", "Julián Álvarez", "Argentina", "ST", 87, { pace: 85, shoot: 87, pass: 82, defense: 58, physical: 77, keeper: 10 }, "Chute")
];

// Formação base do usuário. O time do computador usa a mesma formação espelhada.
const FORMATION = {
  GK: [{ x: 74, y: 280 }],
  FB: [{ x: 210, y: 132 }, { x: 210, y: 428 }],
  CB: [{ x: 172, y: 226 }, { x: 172, y: 334 }],
  MID: [{ x: 386, y: 205 }, { x: 386, y: 355 }],
  WING: [{ x: 598, y: 132 }, { x: 598, y: 428 }],
  ST: [{ x: 742, y: 235 }, { x: 742, y: 325 }]
};

// Estado central do jogo: seleção, placar, entidades em campo, bola e controles.
const state = {
  selectedIds: new Set(),
  secondSelectedIds: new Set(),
  activeSelectionTeam: "user",
  userLineup: [],
  cpuLineup: [],
  entities: [],
  userPlayers: [],
  cpuPlayers: [],
  selectedIndex: 0,
  cpuSelectedIndex: 0,
  keys: new Set(),
  ball: createBall(),
  score: { user: 0, cpu: 0 },
  matchMode: "full",
  playerMode: "single",
  running: false,
  lastTime: 0,
  matchLeft: MATCH_SECONDS,
  shotPressed: false,
  cpuShotPressed: false,
  tackleBoostUntil: 0,
  cpuTackleBoostUntil: 0,
  pausedAfterGoalUntil: 0,
  halftimeShown: false,
  inInterval: false,
  substitutionChoices: {},
  penalties: null,
  aiDecisionAt: 0,
  aiCooldown: 0,
  lastTouchTeam: null,
  animationId: null
};

const screens = {
  start: document.getElementById("start-screen"),
  selection: document.getElementById("selection-screen"),
  setup: document.getElementById("setup-screen"),
  lineup: document.getElementById("lineup-screen"),
  match: document.getElementById("match-screen"),
  result: document.getElementById("result-screen")
};

const elements = {
  startButton: document.getElementById("start-button"),
  clearTeamButton: document.getElementById("clear-team-button"),
  playButton: document.getElementById("play-button"),
  setupBackButton: document.getElementById("setup-back-button"),
  setupStartButton: document.getElementById("setup-start-button"),
  selectionSetupButton: document.getElementById("selection-setup-button"),
  selectP1Button: document.getElementById("select-p1-button"),
  selectP2Button: document.getElementById("select-p2-button"),
  teamSwitcher: document.getElementById("team-switcher"),
  selectionTitle: document.getElementById("selection-title"),
  lineupBackButton: document.getElementById("lineup-back-button"),
  lineupStartButton: document.getElementById("lineup-start-button"),
  lineupUser: document.getElementById("lineup-user"),
  lineupCpu: document.getElementById("lineup-cpu"),
  groups: document.getElementById("player-groups"),
  squadSummary: document.getElementById("squad-summary"),
  squadTeamLabel: document.getElementById("squad-team-label"),
  selectedCount: document.getElementById("selected-count"),
  userScore: document.getElementById("user-score"),
  cpuScore: document.getElementById("cpu-score"),
  matchTitle: document.getElementById("match-title"),
  clock: document.getElementById("match-clock"),
  selectedPlayerLabel: document.getElementById("selected-player-label"),
  backSelectionButton: document.getElementById("back-selection-button"),
  rematchButton: document.getElementById("rematch-button"),
  returnSelectionButton: document.getElementById("return-selection-button"),
  finalScore: document.getElementById("final-score"),
  resultMessage: document.getElementById("result-message"),
  intervalOverlay: document.getElementById("interval-overlay"),
  intervalScore: document.getElementById("interval-score"),
  substitutionList: document.getElementById("substitution-list"),
  continueHalfButton: document.getElementById("continue-half-button"),
  modeRadios: document.querySelectorAll('input[name="game-mode"]'),
  playerModeRadios: document.querySelectorAll('input[name="player-mode"]'),
  canvas: document.getElementById("game-canvas")
};

const ctx = elements.canvas.getContext("2d");

init();

function init() {
  renderSelection();
  renderSquadSummary();
  bindEvents();
  resizeCanvas();
}

function player(id, name, country, position, overall, attributes, dominant) {
  return {
    id,
    name,
    country,
    position,
    overall,
    attributes,
    dominant,
    image: `assets/players/${id}.png`
  };
}

function bindEvents() {
  elements.startButton.addEventListener("click", () => showScreen("setup"));
  elements.clearTeamButton.addEventListener("click", clearTeam);
  elements.selectionSetupButton.addEventListener("click", () => showScreen("setup"));
  elements.playButton.addEventListener("click", startMatch);
  elements.setupBackButton.addEventListener("click", () => showScreen("start"));
  elements.setupStartButton.addEventListener("click", prepareSelectionFromSetup);
  elements.selectP1Button.addEventListener("click", () => setActiveSelectionTeam("user"));
  elements.selectP2Button.addEventListener("click", () => setActiveSelectionTeam("cpu"));
  elements.lineupBackButton.addEventListener("click", () => showScreen("selection"));
  elements.lineupStartButton.addEventListener("click", beginPreparedMatch);
  elements.backSelectionButton.addEventListener("click", () => {
    stopMatch();
    showScreen("selection");
  });
  elements.rematchButton.addEventListener("click", startMatch);
  elements.returnSelectionButton.addEventListener("click", () => {
    stopMatch();
    showScreen("selection");
  });
  elements.continueHalfButton.addEventListener("click", continueSecondHalf);
  elements.substitutionList.addEventListener("change", handleSubstitutionChange);

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", (event) => state.keys.delete(normalizeKey(event)));
  window.addEventListener("resize", resizeCanvas);
  elements.canvas.addEventListener("click", handleCanvasClick);
}

// Monta todos os cards por posição e atualiza bloqueios quando uma posição lota.
function renderSelection() {
  elements.groups.innerHTML = "";
  const activeLabel = state.activeSelectionTeam === "user" ? "Player 1" : "Player 2";
  elements.selectionTitle.textContent = state.playerMode === "multi"
    ? `Monte o time do ${activeLabel}`
    : "Monte seu XI perfeito";
  elements.teamSwitcher.classList.toggle("hidden", state.playerMode !== "multi");
  elements.selectP1Button.classList.toggle("active", state.activeSelectionTeam === "user");
  elements.selectP2Button.classList.toggle("active", state.activeSelectionTeam === "cpu");

  POSITIONS.forEach((position) => {
    const section = document.createElement("section");
    section.className = "position-section";
    section.dataset.position = position.key;

    const selected = getSelectedByPosition(position.key).length;
    section.innerHTML = `
      <div class="position-header">
        <div>
          <p class="eyebrow">${position.label}</p>
          <h3>${position.plural}</h3>
        </div>
        <span>${selected}/${position.required} escolhidos</span>
      </div>
      <div class="cards-grid"></div>
    `;

    const grid = section.querySelector(".cards-grid");
    PLAYERS.filter((item) => item.position === position.key)
      .sort((a, b) => b.overall - a.overall)
      .forEach((item) => grid.appendChild(createPlayerCard(item, position.required)));

    elements.groups.appendChild(section);
  });
}

function createPlayerCard(item, required) {
  const activeSet = selectedSetForTeam();
  const otherSet = selectedSetForTeam(state.activeSelectionTeam === "user" ? "cpu" : "user");
  const selected = activeSet.has(item.id);
  const takenByOtherTeam = state.playerMode === "multi" && otherSet.has(item.id);
  const locked = !selected && (takenByOtherTeam || getSelectedByPosition(item.position).length >= required);
  const card = document.createElement("article");
  card.className = `player-card${selected ? " selected" : ""}${locked ? " locked" : ""}`;
  card.dataset.id = item.id;

  const dominantValue = item.attributes[dominantKey(item)];
  card.innerHTML = `
    <div class="photo-frame">
      <img src="${item.image}" alt="Foto de ${item.name}">
      <div class="overall-badge">${item.overall}</div>
    </div>
    <div class="player-info">
      <h4>${item.name}</h4>
      <div class="meta-row">
        <span class="country-pill">${item.country}</span>
        <span class="position-pill">${positionLabel(item.position)}</span>
      </div>
      <div class="attribute-row">
        <span>${item.dominant}</span>
        <strong>${dominantValue}</strong>
      </div>
      <button class="select-action">${selected ? "Selecionado" : takenByOtherTeam ? "No outro time" : locked ? "Limite atingido" : "Selecionar"}</button>
    </div>
  `;

  const photo = card.querySelector("img");
  photo.addEventListener("error", () => {
    photo.src = createPortrait(item);
  });

  card.querySelector("button").disabled = locked;
  card.addEventListener("click", () => togglePlayer(item));
  return card;
}

function togglePlayer(item) {
  const activeSet = selectedSetForTeam();
  const otherSet = selectedSetForTeam(state.activeSelectionTeam === "user" ? "cpu" : "user");
  if (state.playerMode === "multi" && otherSet.has(item.id)) return;

  const config = POSITIONS.find((position) => position.key === item.position);
  const selectedInPosition = getSelectedByPosition(item.position).length;

  if (activeSet.has(item.id)) {
    activeSet.delete(item.id);
  } else if (selectedInPosition < config.required) {
    activeSet.add(item.id);
  }

  renderSelection();
  renderSquadSummary();
}

function renderSquadSummary() {
  const activeSet = selectedSetForTeam();
  const total = activeSet.size;
  const p1Total = state.selectedIds.size;
  const p2Total = state.secondSelectedIds.size;
  const activeLabel = state.activeSelectionTeam === "user" ? "Player 1" : "Player 2";
  elements.squadTeamLabel.textContent = state.playerMode === "multi"
    ? state.activeSelectionTeam === "user" ? "Dream Cup XI - Player 1" : "Computer XI - Player 2"
    : "Dream Cup XI";
  elements.selectedCount.textContent = state.playerMode === "multi"
    ? `${activeLabel}: ${total}/11`
    : `${total}/11`;
  elements.playButton.disabled = !areRequiredTeamsComplete();
  elements.playButton.textContent = state.playerMode === "multi"
    ? `Ver escalações (${p1Total}/11 x ${p2Total}/11)`
    : "Ver escalações";
  elements.clearTeamButton.textContent = state.playerMode === "multi"
    ? `Limpar ${activeLabel}`
    : "Limpar escalação";
  elements.squadSummary.innerHTML = "";

  POSITIONS.forEach((position) => {
    const group = document.createElement("div");
    group.className = "summary-group";
    const selected = getSelectedByPosition(position.key);
    group.innerHTML = `
      <div class="summary-heading">
        <span>${position.plural}</span>
        <span>${selected.length}/${position.required}</span>
      </div>
    `;

    for (let index = 0; index < position.required; index += 1) {
      const item = selected[index];
      const slot = document.createElement("div");
      slot.className = `summary-slot${item ? " filled" : ""}`;
      slot.innerHTML = item
        ? `<span>${item.name}</span><strong>${item.overall}</strong>`
        : `<span>Vaga aberta</span><strong>${positionLabel(position.key)}</strong>`;
      group.appendChild(slot);
    }

    elements.squadSummary.appendChild(group);
  });
}

function clearTeam() {
  selectedSetForTeam().clear();
  renderSelection();
  renderSquadSummary();
}

function isTeamComplete() {
  return POSITIONS.every((position) => getSelectedByPosition(position.key).length === position.required);
}

function isTeamCompleteFor(team) {
  return POSITIONS.every((position) => getSelectedByPosition(position.key, team).length === position.required);
}

function areRequiredTeamsComplete() {
  return isTeamCompleteFor("user") && (state.playerMode !== "multi" || isTeamCompleteFor("cpu"));
}

function selectedSetForTeam(team = state.activeSelectionTeam) {
  return team === "cpu" ? state.secondSelectedIds : state.selectedIds;
}

function setActiveSelectionTeam(team) {
  if (team === "cpu" && state.playerMode !== "multi") return;
  state.activeSelectionTeam = team;
  renderSelection();
  renderSquadSummary();
}

function getSelectedByPosition(positionKey, team = state.activeSelectionTeam) {
  const selectedSet = selectedSetForTeam(team);
  return PLAYERS.filter((item) => item.position === positionKey && selectedSet.has(item.id));
}

function buildUserLineup() {
  return POSITIONS.flatMap((position) =>
    getSelectedByPosition(position.key, "user").sort((a, b) => b.overall - a.overall)
  );
}

function buildCpuLineup() {
  if (state.playerMode === "multi") {
    return POSITIONS.flatMap((position) =>
      getSelectedByPosition(position.key, "cpu").sort((a, b) => b.overall - a.overall)
    );
  }

  const selected = state.selectedIds;
  return POSITIONS.flatMap((position) =>
    PLAYERS
      .filter((item) => item.position === position.key && !selected.has(item.id))
      .sort((a, b) => b.overall - a.overall)
      .slice(0, position.required)
  );
}

function prepareSelectionFromSetup() {
  state.matchMode = selectedRadioValue(elements.modeRadios) || "full";
  state.playerMode = selectedRadioValue(elements.playerModeRadios) || "single";
  state.selectedIds.clear();
  state.secondSelectedIds.clear();
  state.activeSelectionTeam = "user";
  renderSelection();
  renderSquadSummary();
  showScreen("selection");
}

function selectedRadioValue(radios) {
  return [...radios].find((radio) => radio.checked)?.value;
}

// Prepara as entidades da partida, escala o computador e inicia o loop do canvas.
function startMatch() {
  if (!areRequiredTeamsComplete()) return;

  stopMatch();
  state.userLineup = buildUserLineup();
  state.cpuLineup = buildCpuLineup();
  state.entities = [];
  state.userPlayers = createTeamEntities(state.userLineup, "user");
  state.cpuPlayers = createTeamEntities(state.cpuLineup, "cpu");
  state.entities = [...state.userPlayers, ...state.cpuPlayers];
  state.score = { user: 0, cpu: 0 };
  state.matchLeft = state.matchMode === "penalties" ? 0 : MATCH_SECONDS;
  state.selectedIndex = Math.max(0, state.userPlayers.findIndex((item) => item.position !== "GK"));
  state.cpuSelectedIndex = Math.max(0, state.cpuPlayers.findIndex((item) => item.position !== "GK"));
  state.keys.clear();
  state.running = false;
  state.pausedAfterGoalUntil = 0;
  state.halftimeShown = false;
  state.inInterval = false;
  state.substitutionChoices = {};
  state.penalties = null;
  hideInterval();
  renderLineupPreview();
  showScreen("lineup");
}

function beginPreparedMatch() {
  if (!state.userPlayers.length || !state.cpuPlayers.length) return;

  stopMatch();
  state.running = true;
  state.keys.clear();
  state.shotPressed = false;
  state.cpuShotPressed = false;
  state.lastTime = performance.now();
  if (state.matchMode === "penalties") {
    setupPenaltyShootout();
  } else {
    resetBall("center");
  }
  updateHud();
  showScreen("match");
  resizeCanvas();
  state.animationId = requestAnimationFrame(gameLoop);
}

function stopMatch() {
  state.running = false;
  state.inInterval = false;
  hideInterval();
  if (state.animationId) {
    cancelAnimationFrame(state.animationId);
    state.animationId = null;
  }
}

function createTeamEntities(lineup, team) {
  const counters = {};
  return lineup.map((item) => {
    counters[item.position] = counters[item.position] || 0;
    const slot = counters[item.position];
    counters[item.position] += 1;

    const base = FORMATION[item.position][slot];
    const mirrored = team === "cpu" ? { x: FIELD_W - base.x, y: FIELD_H - base.y } : base;

    return {
      ...item,
      team,
      x: mirrored.x,
      y: mirrored.y,
      homeX: mirrored.x,
      homeY: mirrored.y,
      jerseyNumber: jerseyNumberFor(item.position, slot),
      vx: 0,
      vy: 0,
      radius: item.position === "GK" ? 15 : PLAYER_RADIUS,
      stamina: 100,
      maxStamina: 100,
      stealCooldown: 0,
      passCooldown: 0,
      shootCooldown: 0
    };
  });
}

function renderLineupPreview() {
  elements.lineupUser.innerHTML = "";
  elements.lineupCpu.innerHTML = "";

  state.userPlayers.forEach((item) => {
    elements.lineupUser.appendChild(createLineupMarker(item));
  });

  state.cpuPlayers.forEach((item) => {
    elements.lineupCpu.appendChild(createLineupMarker(item));
  });
}

function createLineupMarker(item) {
  const marker = document.createElement("div");
  marker.className = "lineup-player";
  marker.style.left = `${(item.homeX / FIELD_W) * 100}%`;
  marker.style.top = `${(item.homeY / FIELD_H) * 100}%`;
  marker.innerHTML = `
    <span class="lineup-number">${item.jerseyNumber}</span>
    <span class="lineup-name">${shortName(item.name)}</span>
  `;
  return marker;
}

function gameLoop(now) {
  const dt = Math.min((now - state.lastTime) / 1000, 0.033);
  state.lastTime = now;

  if (state.running) {
    updateGame(dt, now);
    drawGame();
    state.animationId = requestAnimationFrame(gameLoop);
  }
}

// Atualização principal: tempo, controles, IA, bola, roubadas, goleiros e gols.
function updateGame(dt, now) {
  if (state.matchMode === "penalties") {
    updatePenaltyShootout(dt, now);
    updateHud();
    return;
  }

  if (state.inInterval) {
    updateHud();
    return;
  }

  if (now < state.pausedAfterGoalUntil) {
    updateHud();
    return;
  }

  state.matchLeft = Math.max(0, state.matchLeft - dt);
  if (!state.halftimeShown && state.matchLeft <= MATCH_SECONDS / 2) {
    state.matchLeft = MATCH_SECONDS / 2;
    openHalftime();
    updateHud();
    return;
  }

  if (state.matchLeft <= 0) {
    finishMatch();
    return;
  }

  state.entities.forEach((item) => {
    item.stealCooldown = Math.max(0, item.stealCooldown - dt);
    item.passCooldown = Math.max(0, item.passCooldown - dt);
    item.shootCooldown = Math.max(0, item.shootCooldown - dt);
  });
  state.aiCooldown = Math.max(0, state.aiCooldown - dt);

  if (state.ball.owner?.position === "GK") {
    clearKeeperBall(state.ball.owner);
  }

  updateGoalkeepers(dt);
  updateUser(dt, now);
  if (state.playerMode === "multi") {
    updateSecondPlayer(dt, now);
  } else {
    updateCpu(dt, now);
  }
  updateSupportRuns(dt);
  if (state.playerMode === "multi") {
    updateCpuSupportRuns(dt);
  }
  updateBall(dt);
  handlePossession(now, dt);
  handleGoalkeepersSaves();
  updateStamina(dt);
  checkGoals(now);
  updateHud();
}

function updateUser(dt, now) {
  const selected = getSelectedPlayer();
  if (!selected) return;

  let dx = 0;
  let dy = 0;

  if (state.keys.has("a")) dx -= 1;
  if (state.keys.has("d")) dx += 1;
  if (state.keys.has("w")) dy -= 1;
  if (state.keys.has("s")) dy += 1;

  if (dx || dy) {
    const length = Math.hypot(dx, dy) || 1;
    movePlayer(selected, (dx / length) * playerSpeed(selected) * dt, (dy / length) * playerSpeed(selected) * dt);
  } else {
    selected.vx *= 0.84;
    selected.vy *= 0.84;
  }

  if (state.shotPressed) {
    state.shotPressed = false;
    handlePlayerAction(selected, now);
  }
}

function updateSecondPlayer(dt, now) {
  const selected = getCpuSelectedPlayer();
  if (!selected) return;

  let dx = 0;
  let dy = 0;

  if (state.keys.has("arrowleft")) dx -= 1;
  if (state.keys.has("arrowright")) dx += 1;
  if (state.keys.has("arrowup")) dy -= 1;
  if (state.keys.has("arrowdown")) dy += 1;

  if (dx || dy) {
    const length = Math.hypot(dx, dy) || 1;
    movePlayer(selected, (dx / length) * playerSpeed(selected) * dt, (dy / length) * playerSpeed(selected) * dt);
  } else {
    selected.vx *= 0.84;
    selected.vy *= 0.84;
  }

  if (state.cpuShotPressed) {
    state.cpuShotPressed = false;
    handlePlayerAction(selected, now);
  }
}

// Jogadores sem controle direto acompanham o ataque e recompõem quando perdem a bola.
function updateSupportRuns(dt) {
  updateTeamSupportRuns("user", dt);
}

function updateCpuSupportRuns(dt) {
  updateTeamSupportRuns("cpu", dt);
}

function updateTeamSupportRuns(team, dt) {
  const players = team === "user" ? state.userPlayers : state.cpuPlayers;
  const opponents = team === "user" ? state.cpuPlayers : state.userPlayers;
  const selected = team === "user" ? getSelectedPlayer() : getCpuSelectedPlayer();
  const hasBall = state.ball.owner?.team === team;
  const defending = state.ball.owner?.team && state.ball.owner.team !== team;
  const direction = team === "user" ? 1 : -1;
  const available = players.filter((item) => item.position !== "GK" && item !== selected && state.ball.owner !== item);
  const pressers = defending ? nearestPlayers(available, state.ball, 2) : [];

  available.forEach((item, index) => {
    if (pressers.includes(item)) {
      steerTo(item, state.ball.x, state.ball.y, playerSpeed(item) * 0.64, dt);
      return;
    }

    if (defending) {
      const mark = nearestPlayers(
        opponents.filter((opponent) => opponent.position !== "GK"),
        item,
        1
      )[0];
      const markX = mark ? mark.x - direction * 24 : item.homeX - direction * 22;
      const markY = mark ? mark.y : item.homeY;
      const targetX = clamp(markX, 76, FIELD_W - 82);
      const targetY = clamp(markY, 46, FIELD_H - 46);
      steerTo(item, targetX, targetY, playerSpeed(item) * 0.52, dt);
      return;
    }

    const attackShift = hasBall ? direction * 42 : 0;
    const laneOffset = ((index % 3) - 1) * 8;
    const targetX = clamp(item.homeX + attackShift + (state.ball.x - FIELD_W / 2) * 0.05, 76, FIELD_W - 82);
    const targetY = clamp(item.homeY + (state.ball.y - FIELD_H / 2) * 0.1 + laneOffset, 46, FIELD_H - 46);
    steerTo(item, targetX, targetY, playerSpeed(item) * 0.5, dt);
  });
}

// IA equilibrada: pressiona, recompõe, passa e chuta com pausas entre decisões.
function updateCpu(dt, now) {
  const cpuOwner = state.ball.owner?.team === "cpu" ? state.ball.owner : null;
  const userOwner = state.ball.owner?.team === "user" ? state.ball.owner : null;

  if (cpuOwner) {
    cpuAttack(cpuOwner, dt, now);
  } else {
    const chasers = nearestPlayers(state.cpuPlayers.filter((item) => item.position !== "GK"), state.ball, 2);
    state.cpuPlayers.forEach((item) => {
      if (item.position === "GK") return;

      if (chasers.includes(item)) {
        const speed = playerSpeed(item) * (userOwner ? 0.62 : 0.78);
        steerTo(item, state.ball.x, state.ball.y, speed, dt);
      } else {
        const compactness = userOwner && userOwner.x > FIELD_W * 0.52 ? -54 : 0;
        const targetX = clamp(item.homeX + compactness, 90, FIELD_W - 82);
        const targetY = clamp(item.homeY + (state.ball.y - FIELD_H / 2) * 0.11, 44, FIELD_H - 44);
        steerTo(item, targetX, targetY, playerSpeed(item) * 0.42, dt);
      }
    });
  }

  if (userOwner) {
    attemptCpuSteals(userOwner, dt);
  }
}

function cpuAttack(owner, dt, now) {
  const goal = { x: 10, y: FIELD_H / 2 };
  const distanceToGoal = distance(owner, goal);
  const inBox = owner.x < 230 && Math.abs(owner.y - FIELD_H / 2) < 165;
  const shootingLane = owner.x < 405 && Math.abs(owner.y - FIELD_H / 2) < 185;
  const shouldShoot = (shootingLane || distanceToGoal < 260) && owner.shootCooldown <= 0 && state.aiCooldown <= 0;

  if (shouldShoot && (inBox || Math.random() < 0.58)) {
    const cornerAim = owner.y < FIELD_H / 2 ? 50 : -50;
    const targetY = clamp(goal.y + cornerAim + randomBetween(-24, 24), GOAL_TOP + 24, GOAL_BOTTOM - 24);
    shootBall(owner, goal.x - 26, targetY, 405 + owner.attributes.shoot * 1.86);
    owner.shootCooldown = inBox ? 2.35 : 2.95;
    state.aiCooldown = inBox ? 1.22 : 1.55;
    return;
  }

  if (owner.passCooldown <= 0 && state.aiCooldown <= 0 && Math.random() < 0.026) {
    const target = chooseCpuPass(owner);
    if (target) {
      passBall(owner, target, 270 + owner.attributes.pass * 1.08);
      owner.passCooldown = 1.7;
      state.aiCooldown = 0.95;
      return;
    }
  }

  const laneY = clamp(FIELD_H / 2 + (owner.y - FIELD_H / 2) * 0.32, GOAL_TOP + 32, GOAL_BOTTOM - 32);
  const targetX = inBox ? 88 : 118;
  steerTo(owner, targetX, laneY, playerSpeed(owner) * 0.7, dt);

  state.cpuPlayers.forEach((item) => {
    if (item === owner || item.position === "GK") return;
    const targetX = clamp(item.homeX - 38, 90, FIELD_W - 90);
    const targetY = clamp(item.homeY + (state.ball.y - FIELD_H / 2) * 0.08, 48, FIELD_H - 48);
    steerTo(item, targetX, targetY, playerSpeed(item) * 0.42, dt);
  });
}

function updateGoalkeepers(dt) {
  const userKeeper = state.userPlayers.find((item) => item.position === "GK");
  const cpuKeeper = state.cpuPlayers.find((item) => item.position === "GK");

  if (userKeeper) {
    const targetY = clamp(state.ball.y, GOAL_TOP + 18, GOAL_BOTTOM - 18);
    steerTo(userKeeper, 56, targetY, keeperSpeed(userKeeper), dt);
  }

  if (cpuKeeper) {
    const targetY = clamp(state.ball.y, GOAL_TOP + 18, GOAL_BOTTOM - 18);
    steerTo(cpuKeeper, FIELD_W - 56, targetY, keeperSpeed(cpuKeeper), dt);
  }
}

// A bola pode estar presa a um jogador ou livre com velocidade e atrito.
function updateBall(dt) {
  if (state.ball.owner) {
    const owner = state.ball.owner;
    const dir = owner.team === "user" ? 1 : -1;
    state.ball.x = owner.x + dir * 17;
    state.ball.y = owner.y;
    state.ball.vx = owner.vx;
    state.ball.vy = owner.vy;
    state.lastTouchTeam = owner.team;
    return;
  }

  state.ball.x += state.ball.vx * dt;
  state.ball.y += state.ball.vy * dt;
  state.ball.vx *= Math.pow(0.987, dt * 60);
  state.ball.vy *= Math.pow(0.987, dt * 60);

  if (state.ball.y < 18 || state.ball.y > FIELD_H - 18) {
    state.ball.y = clamp(state.ball.y, 18, FIELD_H - 18);
    state.ball.vy *= -0.58;
  }

  if (state.ball.x < 3 && (state.ball.y < GOAL_TOP || state.ball.y > GOAL_BOTTOM)) {
    state.ball.x = 3;
    state.ball.vx = Math.abs(state.ball.vx) * 0.55;
  }

  if (state.ball.x > FIELD_W - 3 && (state.ball.y < GOAL_TOP || state.ball.y > GOAL_BOTTOM)) {
    state.ball.x = FIELD_W - 3;
    state.ball.vx = -Math.abs(state.ball.vx) * 0.55;
  }

  if (Math.hypot(state.ball.vx, state.ball.vy) < 8) {
    state.ball.vx = 0;
    state.ball.vy = 0;
  }
}

// Define posse, contato físico e roubadas sem deixar a IA roubar a todo instante.
function handlePossession(now, dt) {
  if (state.ball.owner) {
    const owner = state.ball.owner;
    const opponents = owner.team === "user" ? state.cpuPlayers : state.userPlayers;

    opponents.forEach((opponent) => {
      if (opponent.position === "GK") return;
      const close = distance(owner, opponent) < 22;
      if (!close || opponent.stealCooldown > 0) return;

      const manualBoost = (opponent.team === "user" && now < state.tackleBoostUntil) ||
        (opponent.team === "cpu" && now < state.cpuTackleBoostUntil)
        ? 0.9
        : 0;
      const cpuPenalty = opponent.team === "cpu" && state.playerMode === "single" ? -0.04 : 0;
      const chancePerSecond = clamp(0.48 + opponent.attributes.defense / 235 + manualBoost + cpuPenalty, 0.22, 1.75);

      if (Math.random() < chancePerSecond * dt) {
        state.ball.owner = opponent;
        state.lastTouchTeam = opponent.team;
        opponent.stealCooldown = opponent.team === "cpu" ? 1.85 : 0.55;
        owner.stealCooldown = 0.7;
        if (opponent.team === "user") {
          state.selectedIndex = state.userPlayers.indexOf(opponent);
        }
      }
    });
    return;
  }

  const candidates = state.entities
    .filter((item) => item.position !== "GK" || distance(item, state.ball) < 30)
    .sort((a, b) => distance(a, state.ball) - distance(b, state.ball));

  const nearest = candidates[0];
  if (!nearest) return;

  const pickupRange = nearest.position === "GK" ? 21 : 16;
  const ballSpeed = Math.hypot(state.ball.vx, state.ball.vy);
  if (distance(nearest, state.ball) < pickupRange && ballSpeed < 330) {
    if (nearest.position === "GK") {
      clearKeeperBall(nearest);
      return;
    }

    if (nearest.team === "cpu" && state.lastTouchTeam === "user" && Math.random() < 0.52) return;
    state.ball.owner = nearest;
    state.lastTouchTeam = nearest.team;
    if (nearest.team === "user" && nearest.position !== "GK") {
      state.selectedIndex = state.userPlayers.indexOf(nearest);
    }
  }
}

function attemptCpuSteals(userOwner, dt) {
  const defenders = nearestPlayers(state.cpuPlayers.filter((item) => item.position !== "GK"), userOwner, 2);
  defenders.forEach((defender) => {
    if (defender.stealCooldown > 0 || distance(defender, userOwner) > 24) return;
    const chancePerSecond = clamp(0.28 + defender.attributes.defense / 520, 0.24, 0.46);
    if (Math.random() < chancePerSecond * dt) {
      state.ball.owner = defender;
      defender.stealCooldown = 2.05;
      userOwner.stealCooldown = 0.8;
      state.lastTouchTeam = "cpu";
    }
  });
}

function handleGoalkeepersSaves() {
  if (state.ball.owner) return;

  const userKeeper = state.userPlayers.find((item) => item.position === "GK");
  const cpuKeeper = state.cpuPlayers.find((item) => item.position === "GK");

  if (userKeeper) tryKeeperSave(userKeeper, "user");
  if (cpuKeeper) tryKeeperSave(cpuKeeper, "cpu");
}

function tryKeeperSave(keeper, team) {
  const ballSpeed = Math.hypot(state.ball.vx, state.ball.vy);
  const saveRange = team === "cpu" ? 21 : 25;
  if (ballSpeed < 90 || distance(keeper, state.ball) > saveRange) return;

  const movingAtGoal = team === "user" ? state.ball.vx < 0 : state.ball.vx > 0;
  if (!movingAtGoal) return;

  const shotPower = clamp(ballSpeed / 560, 0.3, 1.4);
  const keeperNerf = team === "cpu" ? 0.24 : 0.1;
  const saveChance = clamp(0.42 + keeper.attributes.keeper / 265 - shotPower * 0.32 - keeperNerf, 0.12, team === "cpu" ? 0.5 : 0.6);
  if (Math.random() < saveChance) {
    state.ball.owner = null;
    state.ball.x = keeper.x + (team === "user" ? 22 : -22);
    state.ball.y = keeper.y + randomBetween(-10, 10);
    state.ball.vx = (team === "user" ? 1 : -1) * randomBetween(210, 330);
    state.ball.vy = randomBetween(-120, 120);
  }
}

function clearKeeperBall(keeper) {
  const teammates = keeper.team === "user" ? state.userPlayers : state.cpuPlayers;
  const target = teammates
    .filter((item) => item.position !== "GK")
    .sort((a, b) => distance(a, keeper) - distance(b, keeper))[0];

  if (target) {
    passBall(keeper, target, 300 + keeper.attributes.pass * 0.9);
  } else {
    state.ball.owner = null;
    state.ball.vx = keeper.team === "user" ? 260 : -260;
    state.ball.vy = randomBetween(-80, 80);
  }
}

function checkGoals(now) {
  if (state.ball.x > FIELD_W + BALL_RADIUS && state.ball.y > GOAL_TOP && state.ball.y < GOAL_BOTTOM) {
    state.score.user += 1;
    afterGoal("user", now);
  } else if (state.ball.x < -BALL_RADIUS && state.ball.y > GOAL_TOP && state.ball.y < GOAL_BOTTOM) {
    state.score.cpu += 1;
    afterGoal("cpu", now);
  }
}

function afterGoal(scoringTeam, now) {
  updateHud();
  resetPlayers();
  resetBall(scoringTeam === "user" ? "cpu" : "user");
  state.pausedAfterGoalUntil = now + 1200;
}

function resetPlayers() {
  state.entities.forEach((item) => {
    item.x = item.homeX;
    item.y = item.homeY;
    item.vx = 0;
    item.vy = 0;
    item.stealCooldown = 0;
    item.passCooldown = 0;
    item.shootCooldown = 0;
  });
}

function resetBall(kickoff) {
  state.ball = createBall();
  if (kickoff === "user") {
    const starter = state.userPlayers.find((item) => item.position === "ST") || state.userPlayers.find((item) => item.position !== "GK");
    if (starter) {
      starter.x = FIELD_W / 2 - 22;
      starter.y = FIELD_H / 2;
      state.ball.owner = starter;
    }
  } else if (kickoff === "cpu") {
    const starter = state.cpuPlayers.find((item) => item.position === "ST") || state.cpuPlayers.find((item) => item.position !== "GK");
    if (starter) {
      starter.x = FIELD_W / 2 + 22;
      starter.y = FIELD_H / 2;
      state.ball.owner = starter;
    }
  }
}

function setupPenaltyShootout() {
  state.penalties = {
    turn: "user",
    userTaken: 0,
    cpuTaken: 0,
    maxShots: 5,
    aimX: FIELD_W / 2,
    aimY: 178,
    shot: null,
    waitUntil: 0,
    message: "Player 1 cobra primeiro"
  };
  setupPenaltyTurn("user");
}

function setupPenaltyTurn(team) {
  const penalties = state.penalties;
  const shooter = penaltyShooter(team);
  const keeper = penaltyKeeper(team === "user" ? "cpu" : "user");
  const goal = penaltyGoalBox();
  penalties.turn = team;
  penalties.aimX = FIELD_W / 2;
  penalties.aimY = goal.y + goal.h * 0.48;
  penalties.shot = null;
  penalties.waitUntil = performance.now() + (team === "cpu" && state.playerMode === "single" ? 2800 : 0);
  state.shotPressed = false;
  state.cpuShotPressed = false;
  penalties.message = team === "user"
    ? "Player 1: mire com WASD e chute"
    : state.playerMode === "multi"
      ? "Player 2: mire com setas e chute"
      : "Defenda com WASD. O computador vai cobrar.";

  if (shooter) {
    shooter.x = FIELD_W / 2;
    shooter.y = 504;
    shooter.vx = 0;
    shooter.vy = 0;
  }

  if (keeper) {
    keeper.x = FIELD_W / 2;
    keeper.y = goal.y + goal.h * 0.64;
    keeper.vx = 0;
    keeper.vy = 0;
  }

  state.ball = createBall();
  state.ball.x = FIELD_W / 2;
  state.ball.y = 438;
}

function updatePenaltyShootout(dt, now) {
  const penalties = state.penalties;
  if (!penalties) return;

  const shooter = penaltyShooter(penalties.turn);
  const keeper = penaltyKeeper(penalties.turn === "user" ? "cpu" : "user");
  const defendingTeam = penalties.turn === "user" ? "cpu" : "user";
  const goal = penaltyGoalBox();

  if (penalties.shot?.resolved) {
    if (now >= penalties.waitUntil) {
      const bothCompletedSet = penalties.userTaken >= penalties.maxShots && penalties.cpuTaken >= penalties.maxShots;
      const canEndShootout = bothCompletedSet && penalties.userTaken === penalties.cpuTaken && state.score.user !== state.score.cpu;
      if (canEndShootout) {
        finishMatch();
      } else {
        setupPenaltyTurn(penalties.turn === "user" ? "cpu" : "user");
      }
    }
    return;
  }

  if (penalties.shot) {
    state.ball.x += state.ball.vx * dt;
    state.ball.y += state.ball.vy * dt;

    if (keeper) {
      if (isHumanPenaltyKeeper(defendingTeam)) {
        updatePenaltyKeeperControls(keeper, defendingTeam, dt);
      } else {
        steerTo(keeper, penalties.shot.diveX, penalties.shot.diveY, keeperSpeed(keeper) * 0.72, dt);
      }

      const saveRange = isHumanPenaltyKeeper(defendingTeam) ? 28 : 21;
      const ballInSaveZone = state.ball.y > goal.y - 10 && state.ball.y < goal.y + goal.h + 24;
      if (ballInSaveZone && distance(keeper, state.ball) < saveRange) {
        resolvePenalty(false, now, "Defesa do goleiro");
        return;
      }
    }

    if (state.ball.y <= goal.y + goal.h * 0.54 || state.ball.y < 20 || state.ball.x < 0 || state.ball.x > FIELD_W) {
      resolvePenalty(penalties.shot.onTarget, now, penalties.shot.onTarget ? "Gol na cobrança" : "Para fora");
    }
    return;
  }

  if (isHumanPenaltyShooter(penalties.turn)) {
    updatePenaltyAim(penalties.turn, dt);
    if (state.shotPressed) {
      state.shotPressed = false;
      if (penalties.turn === "user") shootPenalty("user");
    }
    if (state.cpuShotPressed) {
      state.cpuShotPressed = false;
      if (penalties.turn === "cpu") shootPenalty("cpu");
    }
  } else {
    state.shotPressed = false;
    state.cpuShotPressed = false;
  }

  if (keeper && isHumanPenaltyKeeper(defendingTeam)) {
    updatePenaltyKeeperControls(keeper, defendingTeam, dt);
  }

  if (penalties.turn === "cpu" && state.playerMode === "single") {
    const left = Math.max(0, Math.ceil((penalties.waitUntil - now) / 1000));
    penalties.message = `Defenda com WASD. Cobrança em ${left}`;
  }

  if (penalties.turn === "cpu" && state.playerMode === "single" && now >= penalties.waitUntil) {
    const sideAim = Math.random() < 0.5
      ? randomBetween(goal.w * 0.16, goal.w * 0.38)
      : randomBetween(goal.w * 0.62, goal.w * 0.84);
    const heightAim = Math.random() < 0.55
      ? randomBetween(goal.h * 0.18, goal.h * 0.42)
      : randomBetween(goal.h * 0.56, goal.h * 0.82);
    penalties.aimX = goal.x + sideAim;
    penalties.aimY = goal.y + heightAim;
    shootPenalty("cpu");
  }

  if (shooter) {
    shooter.y = approach(shooter.y, state.ball.y + 52, 130 * dt);
  }
}

function shootPenalty(team) {
  const penalties = state.penalties;
  const shooter = penaltyShooter(team);
  const keeper = penaltyKeeper(team === "user" ? "cpu" : "user");
  const goal = penaltyGoalBox();
  if (!penalties || !shooter || !keeper || penalties.shot) return;

  const humanShooter = isHumanPenaltyShooter(team);
  const pressure = humanShooter ? 0.2 : 0.26;
  const miss = (1 - clamp((shooter.attributes.shoot + shooter.overall) / 215, 0.58, 0.92)) * 105 * pressure;
  const rawTargetX = penalties.aimX + randomBetween(-miss, miss);
  const rawTargetY = penalties.aimY + randomBetween(-miss * 0.62, miss * 0.62);
  const targetX = clamp(rawTargetX, goal.x + 8, goal.x + goal.w - 8);
  const targetY = clamp(rawTargetY, goal.y + 8, goal.y + goal.h - 8);
  const onTarget = targetX > goal.x - 4 && targetX < goal.x + goal.w + 4 && targetY > goal.y - 4 && targetY < goal.y + goal.h + 4;
  const keeperReadX = randomBetween(-110, 110) + (keeper.attributes.keeper - 86) * 0.18;
  const keeperReadY = randomBetween(-68, 68);
  penalties.shot = {
    team,
    targetX,
    targetY,
    diveX: clamp(targetX + keeperReadX, goal.x + 18, goal.x + goal.w - 18),
    diveY: clamp(targetY + keeperReadY, goal.y + 24, goal.y + goal.h - 18),
    onTarget,
    resolved: false
  };

  kickPenaltyToward(targetX, targetY, 0.58);
}

function kickPenaltyToward(targetX, targetY, duration) {
  state.ball.owner = null;
  state.ball.vx = (targetX - state.ball.x) / duration;
  state.ball.vy = (targetY - state.ball.y) / duration;
}

function updatePenaltyAim(team, dt) {
  const penalties = state.penalties;
  const goal = penaltyGoalBox();
  const speed = 260 * dt;

  if (team === "user") {
    if (state.keys.has("a")) penalties.aimX -= speed;
    if (state.keys.has("d")) penalties.aimX += speed;
    if (state.keys.has("w")) penalties.aimY -= speed;
    if (state.keys.has("s")) penalties.aimY += speed;
  } else {
    if (state.keys.has("arrowleft")) penalties.aimX -= speed;
    if (state.keys.has("arrowright")) penalties.aimX += speed;
    if (state.keys.has("arrowup")) penalties.aimY -= speed;
    if (state.keys.has("arrowdown")) penalties.aimY += speed;
  }

  penalties.aimX = clamp(penalties.aimX, goal.x + 18, goal.x + goal.w - 18);
  penalties.aimY = clamp(penalties.aimY, goal.y + 18, goal.y + goal.h - 18);
}

function updatePenaltyKeeperControls(keeper, team, dt) {
  const goal = penaltyGoalBox();
  const speed = keeperSpeed(keeper) * 1.15 * dt;
  let dx = 0;
  let dy = 0;

  if (team === "user") {
    if (state.keys.has("a")) dx -= 1;
    if (state.keys.has("d")) dx += 1;
    if (state.keys.has("w")) dy -= 1;
    if (state.keys.has("s")) dy += 1;
  } else {
    if (state.keys.has("arrowleft")) dx -= 1;
    if (state.keys.has("arrowright")) dx += 1;
    if (state.keys.has("arrowup")) dy -= 1;
    if (state.keys.has("arrowdown")) dy += 1;
  }

  if (dx || dy) {
    const length = Math.hypot(dx, dy) || 1;
    movePlayer(keeper, (dx / length) * speed, (dy / length) * speed);
  }

  keeper.x = clamp(keeper.x, goal.x + 28, goal.x + goal.w - 28);
  keeper.y = clamp(keeper.y, goal.y + 34, goal.y + goal.h - 18);
}

function isHumanPenaltyShooter(team) {
  return team === "user" || state.playerMode === "multi";
}

function isHumanPenaltyKeeper(team) {
  return team === "user" || state.playerMode === "multi";
}

function penaltyGoalBox() {
  return { x: 304, y: 92, w: 352, h: 154 };
}

function resolvePenalty(scored, now, message) {
  const penalties = state.penalties;
  if (!penalties || penalties.shot?.resolved) return;

  if (scored) {
    state.score[penalties.turn] += 1;
  }

  if (penalties.turn === "user") {
    penalties.userTaken += 1;
  } else {
    penalties.cpuTaken += 1;
  }

  penalties.message = `${message}: ${state.score.user} x ${state.score.cpu}`;
  penalties.shot.resolved = true;
  penalties.waitUntil = now + 1100;
}

function penaltyShooter(team) {
  const players = team === "user" ? state.userPlayers : state.cpuPlayers;
  const taken = team === "user" ? state.penalties?.userTaken || 0 : state.penalties?.cpuTaken || 0;
  const order = players.filter((item) => item.position !== "GK").sort((a, b) => {
    const scoreA = a.attributes.shoot + a.overall + (a.position === "ST" ? 16 : a.position === "WING" ? 8 : 0);
    const scoreB = b.attributes.shoot + b.overall + (b.position === "ST" ? 16 : b.position === "WING" ? 8 : 0);
    return scoreB - scoreA;
  });
  return order[taken % order.length];
}

function penaltyKeeper(team) {
  const players = team === "user" ? state.userPlayers : state.cpuPlayers;
  return players.find((item) => item.position === "GK");
}

function penaltyClockLabel() {
  const penalties = state.penalties;
  if (!penalties) return "Pênaltis";
  return `Pênaltis ${penalties.userTaken}-${penalties.cpuTaken}`;
}

function openHalftime() {
  state.halftimeShown = true;
  state.inInterval = true;
  state.keys.clear();
  state.shotPressed = false;
  state.ball.owner = null;
  state.ball.vx = 0;
  state.ball.vy = 0;
  state.substitutionChoices = {};

  state.userPlayers.forEach((item, index) => {
    state.substitutionChoices[index] = item.id;
  });

  renderIntervalSubstitutions();
  elements.intervalScore.textContent = `${state.score.user} x ${state.score.cpu}`;
  elements.intervalOverlay.classList.add("active");
  elements.intervalOverlay.setAttribute("aria-hidden", "false");
}

function hideInterval() {
  elements.intervalOverlay.classList.remove("active");
  elements.intervalOverlay.setAttribute("aria-hidden", "true");
}

function renderIntervalSubstitutions() {
  elements.substitutionList.innerHTML = "";
  const cpuIds = new Set(state.cpuPlayers.map((item) => item.id));
  const chosenIds = Object.values(state.substitutionChoices);

  state.userPlayers.forEach((current, index) => {
    const row = document.createElement("div");
    row.className = "sub-row";

    const label = document.createElement("label");
    label.htmlFor = `sub-${index}`;
    label.innerHTML = `<span>${positionLabel(current.position)} #${current.jerseyNumber}</span><strong>${current.overall}</strong>`;

    const select = document.createElement("select");
    select.id = `sub-${index}`;
    select.dataset.index = String(index);

    const options = PLAYERS
      .filter((item) => item.position === current.position && !cpuIds.has(item.id))
      .sort((a, b) => b.overall - a.overall);

    options.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = `${item.name} - ${item.country} (${item.overall})`;
      option.selected = state.substitutionChoices[index] === item.id;
      option.disabled = chosenIds.includes(item.id) && state.substitutionChoices[index] !== item.id;
      select.appendChild(option);
    });

    row.appendChild(label);
    row.appendChild(select);
    elements.substitutionList.appendChild(row);
  });
}

function handleSubstitutionChange(event) {
  if (event.target.tagName !== "SELECT") return;
  state.substitutionChoices[event.target.dataset.index] = event.target.value;
  renderIntervalSubstitutions();
}

function continueSecondHalf() {
  applyHalftimeSubstitutions();
  hideInterval();
  state.inInterval = false;
  state.keys.clear();
  resetPlayers();
  resetBall(state.score.user <= state.score.cpu ? "user" : "cpu");
  state.lastTime = performance.now();
  state.pausedAfterGoalUntil = state.lastTime + 450;
}

function applyHalftimeSubstitutions() {
  const used = new Set();
  const previousStamina = new Map(state.userPlayers.map((item) => [item.id, item.stamina ?? 100]));
  const nextLineup = state.userPlayers.map((current, index) => {
    const choice = PLAYERS.find((item) => item.id === state.substitutionChoices[index]);
    const validChoice = choice && choice.position === current.position && !used.has(choice.id);
    const selected = validChoice ? choice : PLAYERS.find((item) => item.id === current.id);
    used.add(selected.id);
    return selected;
  });

  state.userLineup = nextLineup;
  state.userPlayers = createTeamEntities(nextLineup, "user");
  state.userPlayers.forEach((item) => {
    if (previousStamina.has(item.id)) {
      item.stamina = previousStamina.get(item.id);
    }
  });
  state.entities = [...state.userPlayers, ...state.cpuPlayers];
  state.selectedIndex = Math.max(0, state.userPlayers.findIndex((item) => item.position !== "GK"));
}

function createBall() {
  return {
    x: FIELD_W / 2,
    y: FIELD_H / 2,
    vx: 0,
    vy: 0,
    owner: null,
    radius: BALL_RADIUS
  };
}

function handlePlayerAction(selected, now) {
  if (!selected || selected.position === "GK") return;

  if (state.ball.owner === selected) {
    const closeToGoal = selected.team === "user"
      ? selected.x > FIELD_W * 0.64 && Math.abs(selected.y - FIELD_H / 2) < 170
      : selected.x < FIELD_W * 0.36 && Math.abs(selected.y - FIELD_H / 2) < 170;
    const target = closeToGoal ? null : selected.team === "user" ? chooseUserPass(selected) : chooseCpuPass(selected);

    if (target && selected.passCooldown <= 0) {
      passBall(selected, target, 330 + selected.attributes.pass * 1.25);
      selected.passCooldown = 0.55;
    } else if (selected.shootCooldown <= 0) {
      const targetX = selected.team === "user" ? FIELD_W + 18 : -18;
      const aimSpread = selected.team === "user" ? 34 : 44;
      const powerBonus = selected.team === "user" ? 26 : 0;
      shootBall(selected, targetX, FIELD_H / 2 + randomBetween(-aimSpread, aimSpread), 450 + powerBonus + selected.attributes.shoot * 2.55);
      selected.shootCooldown = 0.8;
    }
    return;
  }

  if (selected.team === "user") {
    state.tackleBoostUntil = now + 300;
  } else {
    state.cpuTackleBoostUntil = now + 300;
  }

  const opponentOwner = state.ball.owner && state.ball.owner.team !== selected.team ? state.ball.owner : null;
  if (opponentOwner && distance(selected, opponentOwner) < 34 && selected.stealCooldown <= 0) {
    const chance = clamp(0.34 + selected.attributes.defense / 360, 0.38, 0.78);
    if (Math.random() < chance) {
      state.ball.owner = selected;
      selected.stealCooldown = 0.35;
      opponentOwner.stealCooldown = 0.75;
      state.lastTouchTeam = selected.team;
    }
  } else if (distance(selected, state.ball) < 24) {
    state.ball.owner = selected;
  }
}

function handleSpaceAction(selected, now) {
  handlePlayerAction(selected, now);
}

function chooseUserPass(owner) {
  const candidates = state.userPlayers
    .filter((item) => item !== owner && item.position !== "GK")
    .map((item) => ({
      item,
      score: item.x * 0.7 - Math.abs(item.y - owner.y) * 0.4 + item.overall
    }))
    .sort((a, b) => b.score - a.score);

  return candidates[0]?.item || null;
}

function chooseCpuPass(owner) {
  const candidates = state.cpuPlayers
    .filter((item) => item !== owner && item.position !== "GK")
    .map((item) => ({
      item,
      score: (FIELD_W - item.x) * 0.7 - Math.abs(item.y - owner.y) * 0.4 + item.overall
    }))
    .sort((a, b) => b.score - a.score);

  return candidates[0]?.item || null;
}

function passBall(owner, target, power) {
  state.ball.owner = null;
  state.lastTouchTeam = owner.team;
  const lead = target.team === "user" ? 16 : -16;
  kickToward(owner, target.x + lead, target.y, power, 0.94);
}

function shootBall(owner, targetX, targetY, power) {
  state.ball.owner = null;
  state.lastTouchTeam = owner.team;
  const accuracy = clamp((owner.attributes.shoot + owner.overall) / 220, 0.55, 0.9);
  const teamControl = owner.team === "user"
    ? 0.74
    : owner.team === "cpu" && state.playerMode === "single"
      ? 0.78
      : 1;
  const miss = (1 - accuracy) * 115 * teamControl;
  kickToward(owner, targetX, targetY + randomBetween(-miss, miss), power, 1);
}

function kickToward(owner, targetX, targetY, power, control) {
  const angle = Math.atan2(targetY - owner.y, targetX - owner.x);
  const speed = power * randomBetween(0.88, 1.08) * control;
  state.ball.x = owner.x + Math.cos(angle) * 18;
  state.ball.y = owner.y + Math.sin(angle) * 18;
  state.ball.vx = Math.cos(angle) * speed;
  state.ball.vy = Math.sin(angle) * speed;
}

function handleKeyDown(event) {
  const key = normalizeKey(event);
  const gameKeys = [
    "arrowleft", "arrowright", "arrowup", "arrowdown",
    "w", "a", "s", "d", "q", "e", " ",
    "u", "o", "enter"
  ];
  if (!gameKeys.includes(key)) return;

  event.preventDefault();
  state.keys.add(key);

  if (!state.running) return;

  if (key === "q") {
    cycleSelected(-1);
  } else if (key === "e") {
    cycleSelected(1);
  } else if (key === " ") {
    state.shotPressed = true;
  } else if (state.playerMode === "multi" && key === "u") {
    cycleCpuSelected(-1);
  } else if (state.playerMode === "multi" && key === "o") {
    cycleCpuSelected(1);
  } else if (state.playerMode === "multi" && key === "enter") {
    state.cpuShotPressed = true;
  }
}

function normalizeKey(event) {
  const byCode = {
    ArrowLeft: "arrowleft",
    ArrowRight: "arrowright",
    ArrowUp: "arrowup",
    ArrowDown: "arrowdown",
    KeyW: "w",
    KeyA: "a",
    KeyS: "s",
    KeyD: "d",
    KeyQ: "q",
    KeyE: "e",
    KeyU: "u",
    KeyO: "o",
    Space: " ",
    Enter: "enter",
    NumpadEnter: "enter"
  };

  return byCode[event.code] || event.key.toLowerCase();
}

function cycleSelected(direction) {
  const selectable = state.userPlayers.filter((item) => item.position !== "GK");
  if (!selectable.length) return;

  const current = getSelectedPlayer();
  const currentSelectableIndex = Math.max(0, selectable.indexOf(current));
  const next = selectable[(currentSelectableIndex + direction + selectable.length) % selectable.length];
  state.selectedIndex = state.userPlayers.indexOf(next);
  updateHud();
}

function cycleCpuSelected(direction) {
  const selectable = state.cpuPlayers.filter((item) => item.position !== "GK");
  if (!selectable.length) return;

  const current = getCpuSelectedPlayer();
  const currentSelectableIndex = Math.max(0, selectable.indexOf(current));
  const next = selectable[(currentSelectableIndex + direction + selectable.length) % selectable.length];
  state.cpuSelectedIndex = state.cpuPlayers.indexOf(next);
  updateHud();
}

function handleCanvasClick(event) {
  if (!state.running) return;

  const rect = elements.canvas.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * FIELD_W;
  const y = ((event.clientY - rect.top) / rect.height) * FIELD_H;
  const clicked = state.userPlayers
    .filter((item) => item.position !== "GK")
    .find((item) => distance(item, { x, y }) <= item.radius + 9);

  if (clicked) {
    state.selectedIndex = state.userPlayers.indexOf(clicked);
    updateHud();
    return;
  }

  if (state.playerMode === "multi") {
    const clickedCpu = state.cpuPlayers
      .filter((item) => item.position !== "GK")
      .find((item) => distance(item, { x, y }) <= item.radius + 9);

    if (clickedCpu) {
      state.cpuSelectedIndex = state.cpuPlayers.indexOf(clickedCpu);
      updateHud();
    }
  }
}

function movePlayer(item, dx, dy) {
  const oldX = item.x;
  const oldY = item.y;
  item.x = clamp(item.x + dx, 22, FIELD_W - 22);
  item.y = clamp(item.y + dy, 22, FIELD_H - 22);
  item.vx = item.x - oldX;
  item.vy = item.y - oldY;
}

function steerTo(item, targetX, targetY, speed, dt) {
  const dx = targetX - item.x;
  const dy = targetY - item.y;
  const length = Math.hypot(dx, dy);
  if (length < 2) {
    item.vx *= 0.8;
    item.vy *= 0.8;
    return;
  }

  movePlayer(item, (dx / length) * speed * dt, (dy / length) * speed * dt);
}

function updateStamina(dt) {
  const selected = getSelectedPlayer();
  const cpuSelected = getCpuSelectedPlayer();

  state.entities.forEach((item) => {
    if (item.position === "GK") {
      item.stamina = clamp((item.stamina ?? 100) + 0.08 * dt, 76, 100);
      return;
    }

    const speedBase = basePlayerSpeed(item);
    const movementSpeed = Math.hypot(item.vx, item.vy) / Math.max(dt, 0.016);
    const movementRatio = clamp(movementSpeed / speedBase, 0, 1.2);
    const isControlled = item === selected || (state.playerMode === "multi" && item === cpuSelected);
    const hasBall = state.ball.owner === item;
    const physicalProtection = clamp(item.attributes.physical / 100, 0.55, 0.94);

    if (movementRatio > 0.18) {
      let drain = (0.14 + movementRatio * 0.28) * (1.16 - physicalProtection * 0.55);
      if (isControlled) drain += 0.05;
      if (hasBall) drain += 0.05;
      item.stamina = clamp((item.stamina ?? 100) - drain * dt, 22, 100);
    } else {
      const recovery = 0.1 + item.attributes.physical * 0.0012;
      item.stamina = clamp((item.stamina ?? 100) + recovery * dt, 22, 100);
    }
  });
}

function basePlayerSpeed(item) {
  const base = 112;
  const pace = item.position === "GK" ? item.attributes.keeper * 0.35 : item.attributes.pace;
  const staminaWeight = item.attributes.physical * 0.2;
  return clamp(base + pace * 1.03 + staminaWeight, 146, 225);
}

function playerSpeed(item) {
  const stamina = item.stamina ?? 100;
  const staminaFactor = clamp(0.68 + stamina * 0.0032, 0.74, 1);
  return basePlayerSpeed(item) * staminaFactor;
}

function keeperSpeed(item) {
  return clamp(128 + item.attributes.keeper * 0.75, 165, 205);
}

function staminaLabel(item) {
  if (!item || item.position === "GK" || typeof item.stamina !== "number") return "";
  return `(${Math.round(item.stamina)}%)`;
}

function updateHud() {
  elements.userScore.textContent = state.score.user;
  elements.cpuScore.textContent = state.score.cpu;
  elements.clock.textContent = state.matchMode === "penalties" ? penaltyClockLabel() : formatClock(state.matchLeft);
  elements.matchTitle.textContent = state.matchMode === "penalties"
    ? "Dream Cup XI x Computer XI - Pênaltis"
    : "Dream Cup XI x Computer XI";
  const selected = getSelectedPlayer();
  const cpuSelected = getCpuSelectedPlayer();
  elements.selectedPlayerLabel.textContent = state.playerMode === "multi"
    ? `P1: ${selected?.name || "-"} ${staminaLabel(selected)} | P2: ${cpuSelected?.name || "-"} ${staminaLabel(cpuSelected)}`
    : selected ? `Controle: ${selected.name} ${staminaLabel(selected)}` : "Controle: -";
}

function finishMatch() {
  stopMatch();
  elements.finalScore.textContent = `${state.score.user} x ${state.score.cpu}`;

  if (state.score.user > state.score.cpu) {
    elements.resultMessage.textContent = state.playerMode === "multi"
      ? "Player 1 venceu com o Dream Cup XI."
      : state.matchMode === "penalties"
        ? "Vitória nos pênaltis. Frieza total nas cobranças."
        : "Vitória do Dream Cup XI. Seu elenco respondeu em campo.";
  } else if (state.score.user < state.score.cpu) {
    elements.resultMessage.textContent = state.playerMode === "multi"
      ? "Player 2 venceu com o Computer XI."
      : state.matchMode === "penalties"
        ? "Derrota nos pênaltis. O outro lado foi mais preciso."
        : "Derrota apertada. A seleção do computador foi mais eficiente.";
  } else {
    elements.resultMessage.textContent = "Empate equilibrado. Clássico de Copa até o último lance.";
  }

  showScreen("result");
}

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[name].classList.add("active");
}

// Desenho do campo, atletas e bola. Toda a partida acontece neste canvas.
function drawGame() {
  ctx.clearRect(0, 0, FIELD_W, FIELD_H);
  if (state.matchMode === "penalties") {
    drawPenaltyShootout();
    drawBall();
    return;
  }
  drawPitch();
  drawPlayers();
  drawBall();
  drawOverlay();
}

function drawPitch() {
  ctx.fillStyle = "#15773b";
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);

  for (let index = 0; index < 12; index += 1) {
    ctx.fillStyle = index % 2 === 0 ? "rgba(255,255,255,0.045)" : "rgba(0,0,0,0.07)";
    ctx.fillRect((FIELD_W / 12) * index, 0, FIELD_W / 12, FIELD_H);
  }

  ctx.strokeStyle = "rgba(255,255,255,0.78)";
  ctx.lineWidth = 3;
  ctx.strokeRect(18, 18, FIELD_W - 36, FIELD_H - 36);

  ctx.beginPath();
  ctx.moveTo(FIELD_W / 2, 18);
  ctx.lineTo(FIELD_W / 2, FIELD_H - 18);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(FIELD_W / 2, FIELD_H / 2, 72, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.84)";
  ctx.beginPath();
  ctx.arc(FIELD_W / 2, FIELD_H / 2, 4, 0, Math.PI * 2);
  ctx.fill();

  drawBox(18, 142, 132, 276);
  drawBox(FIELD_W - 150, 142, 132, 276);
  drawBox(18, 214, 48, 132);
  drawBox(FIELD_W - 66, 214, 48, 132);

  ctx.fillStyle = "rgba(255,255,255,0.86)";
  ctx.fillRect(0, GOAL_TOP, 8, GOAL_BOTTOM - GOAL_TOP);
  ctx.fillRect(FIELD_W - 8, GOAL_TOP, 8, GOAL_BOTTOM - GOAL_TOP);
}

function drawBox(x, y, w, h) {
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 3;
  ctx.strokeRect(x, y, w, h);
}

function drawPlayers() {
  const selected = getSelectedPlayer();
  const cpuSelected = getCpuSelectedPlayer();
  const sorted = [...state.entities].sort((a, b) => a.y - b.y);

  sorted.forEach((item) => {
    const isSelected = item === selected || (state.playerMode === "multi" && item === cpuSelected);
    drawPlayerToken(item, isSelected);
  });
}

function drawPlayerToken(item, isSelected) {
  const main = item.team === "user" ? "#f0d58a" : "#5b0c20";
  const trim = item.team === "user" ? "#fff8e6" : "#d8ad43";

  if (isSelected) {
    ctx.beginPath();
    ctx.arc(item.x, item.y, item.radius + 8, 0, Math.PI * 2);
    ctx.strokeStyle = item.team === "user" ? "#d8ad43" : "#d74242";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(item.x + 2, item.y + 4, item.radius, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
  ctx.fillStyle = main;
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = trim;
  ctx.stroke();

  ctx.fillStyle = item.team === "user" ? "#241018" : "#fff8e6";
  ctx.font = "950 11px Inter, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(item.jerseyNumber), item.x, item.y + 1);

  ctx.font = "700 9px Inter, Arial, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.fillText(shortName(item.name), item.x, item.y + item.radius + 13);

  if (item.position !== "GK" && typeof item.stamina === "number") {
    const barW = 28;
    const barH = 4;
    const barX = item.x - barW / 2;
    const barY = item.y + item.radius + 20;
    const ratio = clamp(item.stamina / 100, 0, 1);
    ctx.fillStyle = "rgba(0,0,0,0.42)";
    ctx.fillRect(barX, barY, barW, barH);
    ctx.fillStyle = ratio > 0.55 ? "#3de071" : ratio > 0.32 ? "#d8ad43" : "#d74242";
    ctx.fillRect(barX, barY, barW * ratio, barH);
  }
}

function drawPenaltyShootout() {
  const penalties = state.penalties;
  if (!penalties) return;

  const shooter = penaltyShooter(penalties.turn);
  const keeper = penaltyKeeper(penalties.turn === "user" ? "cpu" : "user");
  const goal = penaltyGoalBox();

  ctx.fillStyle = "#15773b";
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);

  const gradient = ctx.createLinearGradient(0, 0, 0, FIELD_H);
  gradient.addColorStop(0, "rgba(255,255,255,0.08)");
  gradient.addColorStop(0.48, "rgba(0,0,0,0.02)");
  gradient.addColorStop(1, "rgba(0,0,0,0.22)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);

  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.moveTo(180, FIELD_H);
  ctx.lineTo(goal.x - 42, goal.y + goal.h + 24);
  ctx.lineTo(goal.x + goal.w + 42, goal.y + goal.h + 24);
  ctx.lineTo(FIELD_W - 180, FIELD_H);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "rgba(0,0,0,0.16)";
  ctx.fillRect(goal.x - 16, goal.y - 14, goal.w + 32, goal.h + 32);

  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(goal.x, goal.y, goal.w, goal.h);

  ctx.strokeStyle = "rgba(255,255,255,0.23)";
  ctx.lineWidth = 1;
  for (let x = goal.x + 28; x < goal.x + goal.w; x += 44) {
    ctx.beginPath();
    ctx.moveTo(x, goal.y);
    ctx.lineTo(x, goal.y + goal.h);
    ctx.stroke();
  }
  for (let y = goal.y + 24; y < goal.y + goal.h; y += 34) {
    ctx.beginPath();
    ctx.moveTo(goal.x, y);
    ctx.lineTo(goal.x + goal.w, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(255,255,255,0.94)";
  ctx.lineWidth = 7;
  ctx.strokeRect(goal.x, goal.y, goal.w, goal.h);

  ctx.strokeStyle = "rgba(216,173,67,0.76)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(FIELD_W / 2, 474, 112, Math.PI * 1.05, Math.PI * 1.95);
  ctx.stroke();

  if (!penalties.shot && isHumanPenaltyShooter(penalties.turn)) {
    ctx.strokeStyle = "rgba(216,173,67,0.88)";
    ctx.lineWidth = 2;
    ctx.setLineDash([7, 7]);
    ctx.beginPath();
    ctx.moveTo(state.ball.x, state.ball.y);
    ctx.lineTo(penalties.aimX, penalties.aimY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.arc(penalties.aimX, penalties.aimY, 9, 0, Math.PI * 2);
    ctx.strokeStyle = "#f0d58a";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  if (keeper) drawPlayerToken(keeper, true);
  if (shooter) drawPlayerToken(shooter, true);

  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.fillRect(FIELD_W / 2 - 238, 22, 476, 48);
  ctx.fillStyle = "#f0d58a";
  ctx.font = "900 18px Inter, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(penalties.message, FIELD_W / 2, 46);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(state.ball.x + 2, state.ball.y + 3, BALL_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(state.ball.x, state.ball.y, BALL_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#1c1c1c";
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(state.ball.x, state.ball.y, 2.4, 0, Math.PI * 2);
  ctx.fillStyle = "#1c1c1c";
  ctx.fill();
}

function drawOverlay() {
  if (performance.now() < state.pausedAfterGoalUntil) {
    ctx.fillStyle = "rgba(0,0,0,0.28)";
    ctx.fillRect(0, 0, FIELD_W, FIELD_H);
    ctx.fillStyle = "#f0d58a";
    ctx.font = "900 42px Inter, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("GOL!", FIELD_W / 2, FIELD_H / 2);
  }
}

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  elements.canvas.width = FIELD_W * dpr;
  elements.canvas.height = FIELD_H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (state.running) drawGame();
}

function createPortrait(item) {
  const colors = countryColors(item.country);
  const name = initials(item.name);
  const role = item.position;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 300">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="${colors[0]}"/>
          <stop offset="0.58" stop-color="#1b1116"/>
          <stop offset="1" stop-color="${colors[1]}"/>
        </linearGradient>
        <linearGradient id="shirt" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stop-color="${colors[1]}"/>
          <stop offset="1" stop-color="${colors[0]}"/>
        </linearGradient>
      </defs>
      <rect width="360" height="300" fill="url(#bg)"/>
      <path d="M0 238 C72 202 112 236 180 206 C250 174 292 204 360 172 L360 300 L0 300 Z" fill="rgba(255,255,255,0.12)"/>
      <circle cx="180" cy="112" r="54" fill="#f1c29b"/>
      <path d="M124 110 C130 58 164 38 203 51 C226 58 239 81 236 112 C214 96 180 95 124 110 Z" fill="#201116"/>
      <path d="M92 292 C100 210 134 174 180 174 C226 174 260 210 268 292 Z" fill="url(#shirt)"/>
      <path d="M135 194 L180 252 L225 194 C211 181 197 174 180 174 C163 174 149 181 135 194 Z" fill="#f6f3ee" opacity="0.95"/>
      <text x="180" y="245" text-anchor="middle" font-size="58" font-weight="900" font-family="Arial, sans-serif" fill="#1b1004">${name}</text>
      <rect x="22" y="22" width="92" height="34" rx="8" fill="rgba(255,255,255,0.88)"/>
      <text x="68" y="45" text-anchor="middle" font-size="17" font-weight="900" font-family="Arial, sans-serif" fill="#220912">${role}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function countryColors(country) {
  const palette = {
    Brasil: ["#0f8f3f", "#f7d117"],
    Argentina: ["#75bce8", "#ffffff"],
    França: ["#203f8f", "#d82035"],
    Bélgica: ["#111111", "#f7d117"],
    Itália: ["#126f45", "#f7f7f7"],
    Espanha: ["#b5162b", "#f1c232"],
    Marrocos: ["#b20d28", "#0e8f55"],
    Inglaterra: ["#ffffff", "#c8102e"],
    Holanda: ["#f26b21", "#ffffff"],
    Canadá: ["#d71920", "#ffffff"],
    Portugal: ["#006f45", "#c8102e"],
    Croácia: ["#d71920", "#ffffff"],
    Alemanha: ["#111111", "#f2c230"],
    Uruguai: ["#62a8e5", "#ffffff"],
    Egito: ["#c8102e", "#111111"],
    Noruega: ["#ba0c2f", "#00205b"],
    Polônia: ["#ffffff", "#dc143c"],
    Suécia: ["#006aa7", "#fecc00"]
  };

  return palette[country] || ["#7a1025", "#d8ad43"];
}

function dominantKey(item) {
  const map = {
    Velocidade: "pace",
    Chute: "shoot",
    Passe: "pass",
    Defesa: "defense",
    Físico: "physical",
    Reflexo: "keeper"
  };
  return map[item.dominant] || "overall";
}

function positionLabel(key) {
  return POSITIONS.find((position) => position.key === key)?.label || key;
}

function getSelectedPlayer() {
  return state.userPlayers[state.selectedIndex] || state.userPlayers.find((item) => item.position !== "GK");
}

function getCpuSelectedPlayer() {
  return state.cpuPlayers[state.cpuSelectedIndex] || state.cpuPlayers.find((item) => item.position !== "GK");
}

function nearestPlayers(players, target, amount) {
  return [...players]
    .sort((a, b) => distance(a, target) - distance(b, target))
    .slice(0, amount);
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function approach(value, target, step) {
  if (Math.abs(target - value) <= step) return target;
  return value + Math.sign(target - value) * step;
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function formatClock(seconds) {
  const safe = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(safe / 60).toString().padStart(2, "0");
  const rest = (safe % 60).toString().padStart(2, "0");
  return `${minutes}:${rest}`;
}

function initials(name) {
  return name
    .replace("Júnior", "Jr")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function jerseyNumberFor(position, slot) {
  const numbers = {
    GK: [1],
    FB: [2, 3],
    CB: [4, 5],
    MID: [6, 8],
    WING: [7, 11],
    ST: [9, 10]
  };

  return numbers[position]?.[slot] || slot + 12;
}

function shortName(name) {
  const parts = name.split(" ");
  if (parts.length <= 1) return name;
  const last = parts[parts.length - 1];
  return last.length <= 3 ? parts.slice(-2).join(" ") : last;
}
