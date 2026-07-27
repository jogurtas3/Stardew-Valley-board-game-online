const professions = [
  {
    id: "fishing",
    name: "Fishing",
    image: "assets/fishing.jpg",
    alt: "Fishing player mat",
    pawn: "assets/fishing-pawn.svg?v=20",
    tools: [
      ["Iridium Rod", "assets/iridium-rod.png"],
      ["Fiberglass Rod", "assets/fiberglass-rod.png"],
      ["Bamboo Rod", "assets/bamboo-rod.png"],
      ["Training Rod", "assets/training-rod.png"],
    ],
  },
  {
    id: "foraging",
    name: "Foraging",
    image: "assets/foraging.jpg",
    alt: "Foraging player mat",
    pawn: "assets/foraging-pawn.svg?v=20",
    tools: [
      ["Iridium Hoe", "assets/iridium-hoe.png"],
      ["Gold Hoe", "assets/gold-hoe.png"],
      ["Iron Hoe", "assets/iron-hoe.png"],
      ["Copper Hoe", "assets/copper-hoe.png"],
      ["Starting Hoe", "assets/hoe.png"],
    ],
  },
  {
    id: "mining",
    name: "Mining",
    image: "assets/mining.jpg",
    alt: "Mining player mat",
    pawn: "assets/mining-pawn.svg?v=20",
    tools: [
      ["Iridium Pickaxe", "assets/iridium-pickaxe.png"],
      ["Gold Pickaxe", "assets/gold-pickaxe.png"],
      ["Iron Pickaxe", "assets/iron-pickaxe.png"],
      ["Copper Pickaxe", "assets/copper-pickaxe.png"],
      ["Starting Pickaxe", "assets/pickaxe.png"],
    ],
  },
  {
    id: "farming",
    name: "Farming",
    image: "assets/farming.jpg",
    alt: "Farming player mat",
    pawn: "assets/farming-pawn.svg?v=20",
    tools: [
      ["Iridium Watering Can", "assets/iridium-watering-can.png"],
      ["Gold Watering Can", "assets/gold-watering-can.png"],
      ["Iron Watering Can", "assets/iron-watering-can.png"],
      ["Copper Watering Can", "assets/copper-watering-can.png"],
      ["Starting Watering Can", "assets/watering-can.png"],
    ],
  },
];

const welcomePicker = document.querySelector("#welcome-screen");
const welcomeHeader = document.querySelector(".welcome-header");
const newGameButton = document.querySelector("#new-game-button");
const viewBoardButton = document.querySelector("#view-board-button");
const viewBoardStaticButton = document.querySelector("#view-board-static-button");
const deckStageBack = document.querySelector("#deck-stage-back");
const tokenStageBack = document.querySelector("#token-stage-back");
const professionStageBack = document.querySelector("#profession-stage-back");
const boardStageBack = document.querySelector("#board-stage-back");
const deckSizePicker = document.querySelector("#deck-size-picker");
const deckSizeForm = document.querySelector("#deck-size-form");
const deckSizeInput = document.querySelector("#deck-size-input");
const deckSizeIncrease = document.querySelector("#deck-size-increase");
const deckSizeDecrease = document.querySelector("#deck-size-decrease");
const deckSizeTotal = document.querySelector("#deck-size-total");
const deckSizeError = document.querySelector("#deck-size-error");
const tokenPicker = document.querySelector("#token-picker");
const picker = document.querySelector("#profession-picker");
const professionActions = document.querySelector("#profession-actions");
const backButton = document.querySelector("#back-button");
const continueButton = document.querySelector("#continue-button");
const gameBoard = document.querySelector("#game-board");
const professionOption = document.querySelector("#profession-option");
const professionPreview = document.querySelector("#profession-preview");
const professionPawn = document.querySelector("#profession-pawn");
const boardPlayerMatImage = document.querySelector("#board-player-mat-image");
const playerToolDeck = document.querySelector("#player-tool-deck");
const ownedCardInput = document.querySelector("#owned-card-input");
const ownedCardsList = document.querySelector("#owned-cards-list");
const ownedCardsEmpty = document.querySelector("#owned-cards-empty");
const ownedCardsStatus = document.querySelector("#owned-cards-status");
const professionInstruction = document.querySelector("#profession-instruction");
const professionName = document.querySelector("#profession-name");

function showWelcomeScreen() {
  welcomePicker.classList.remove("is-loading");
}

if (welcomeHeader.complete) {
  showWelcomeScreen();
} else {
  welcomeHeader.addEventListener("load", showWelcomeScreen, { once: true });
  welcomeHeader.addEventListener("error", showWelcomeScreen, { once: true });
}
const previousButton = document.querySelector("#previous-profession");
const nextButton = document.querySelector("#next-profession");
const boardFrame = document.querySelector(".board-frame");
const boardCanvas = document.querySelector("#board-canvas");
const boardSurface = document.querySelector("#board-surface");
const boardImage = document.querySelector(".board-image");
const seasonDeck = document.querySelector("#season-deck");
const seasonDiscardPile = document.querySelector("#season-discard-pile");
const savedPathHighlights = document.querySelector("#saved-path-highlights");
const pathDrawingLayer = document.querySelector("#path-drawing-layer");
const pathDrawingLines = document.querySelector("#path-drawing-lines");
const playerMatDrawingLayer = document.querySelector("#player-mat-drawing-layer");
const playerMatDrawingLines = document.querySelector("#player-mat-drawing-lines");
const pathDrawToggle = document.querySelector("#path-draw-toggle");
const pathDrawingType = document.querySelector("#path-drawing-type");
const pathUndoButton = document.querySelector("#path-undo");
const pathClearButton = document.querySelector("#path-clear");
const pathCopyButton = document.querySelector("#path-copy");
const pathCoordinates = document.querySelector("#path-coordinates");
const pathToolStatus = document.querySelector("#path-tool-status");
const boardPawns = document.querySelector("#board-pawns");

const boardNodes = Object.freeze({
  farm: [40.7, 44.2],
  mountains: [70.4, 35.2],
  river: [17.4, 70.5],
  town: [58.8, 55.4],
  museum: [85.1, 59.2],
  ocean: [68, 75.8],
  animals: [37.5, 70.7],
});

const boardRoutes = Object.freeze({
  1: { from: "farm", to: "mountains", path: [[45.8, 41.2], [68.15, 36.05]] },
  2: { from: "farm", to: "river", path: [[34.5, 46.1], [20.65, 67.75]] },
  3: { from: "farm", to: "town", path: [[43.8, 47.6], [56.85, 52.15]] },
  4: { from: "mountains", to: "town", path: [[69.3, 39.4], [62.35, 48.05]] },
  5: { from: "mountains", to: "museum", path: [[72.1, 39.45], [80.65, 54.95]] },
  6: { from: "town", to: "museum", path: [[59.5, 55.3], [83, 60.05]] },
  7: { from: "museum", to: "ocean", path: [[82.95, 59.95], [71.55, 73.35]] },
  8: { from: "town", to: "ocean", path: [[61.65, 61.95], [66.8, 73.85]] },
  9: { from: "animals", to: "town", path: [[42.55, 69.5], [55.2, 61.45]] },
  10: { from: "farm", to: "animals", path: [[37.9, 48.5], [37.75, 68.7]] },
  11: { from: "river", to: "animals", path: [[22.2, 70.8], [32.95, 70.6]] },
});

const routeTileIds = Object.freeze({
  1: ["forage-1", "forage-2"],
  2: ["forage-5", "forage-6", "tree-1", "tree-3"],
  3: ["forage-2", "forage-4"],
  4: ["forage-2", "forage-11"],
  5: ["forage-3", "forage-11"],
  6: ["forage-8", "forage-11"],
  7: ["forage-8", "forage-9"],
  8: ["forage-7", "forage-8"],
  9: ["forage-7", "tree-2"],
  10: ["forage-4", "forage-5", "tree-2", "tree-3"],
  11: ["forage-10", "tree-3", "tree-4"],
});

const forageableTileFaces = Object.freeze([
  { name: "Daffodil 1", source: "assets/spring-daffodil-1.png" },
  { name: "Daffodil 2", source: "assets/spring-daffodil-2.png" },
  { name: "Fiber", source: "assets/spring-fiber.png" },
  { name: "Horseradish 2", source: "assets/spring-horseradish-2.png" },
  { name: "Horseradish 3", source: "assets/spring-horseradish-3.png" },
  { name: "Leek 2", source: "assets/spring-leek-2.png" },
  { name: "Leek 3", source: "assets/spring-leek-3.png" },
  { name: "Stone 1", source: "assets/spring-stone-1.png" },
  { name: "Stone 2", source: "assets/spring-stone-2.png" },
  { name: "Tree reward 1", source: "assets/spring-forageable-tree-1.png" },
  { name: "Tree reward 2", source: "assets/spring-forageable-tree-2.png" },
]);

const forageableBackSource = "assets/spring-forageable-back.png";
const treeBackSource = "assets/spring-tree-tile.png";
const woodTileFace = Object.freeze({ name: "Wood", source: "assets/spring-wood.png" });

// Keep every pawn and position ready for multiplayer, but only show the chosen player for now.
const multiplayerPawnsEnabled = false;
const pawnOffsets = Object.freeze([
  [-1.45, -0.55],
  [1.45, -0.55],
  [-1.45, 0.75],
  [1.45, 0.75],
]);

const farmhousePawnPositions = Object.freeze([
  [35.44, 42.71],
  [38.81, 38.87],
  [42.43, 38.15],
  [45.58, 45.07],
]);

const mountainsPawnPositions = Object.freeze([
  [70.63, 26.15],
  [73.75, 27.54],
  [63.67, 30.52],
  [67.01, 29.12],
]);

const townSquarePawnPositions = Object.freeze([
  [60.81, 56.83],
  [63.78, 56.00],
  [50.91, 50.99],
  [54.64, 52.38],
]);

const museumBlacksmithPawnPositions = Object.freeze([
  [87.90, 58.01],
  [90.13, 57.65],
  [81.63, 52.10],
  [83.92, 54.07],
]);

const marniesRanchPawnPositions = Object.freeze([
  [39.93, 67.44],
  [41.54, 66.33],
  [35.73, 67.97],
  [33.66, 66.94],
]);

const riverFishingPawnPositions = Object.freeze([
  [23.23, 68.08],
  [23.94, 72.03],
  [25.20, 66.83],
  [26.45, 69.87],
]);

const oceanFishingPawnPositions = Object.freeze([
  [73.21, 77.54],
  [70.48, 80.20],
  [72.46, 80.05],
  [74.61, 79.59],
]);

const seasonDeckAnimation = Object.freeze({
  seasonCount: 4,
  minimumCardsPerSeason: 4,
  maximumCardsPerSeason: 21,
  minimumCards: 16,
  maximumCards: 84,
  spreadInCardWidths: 2.8,
  slideDurationMs: 3500,
  maximumStaggerMs: 1300,
  bottomCardImage: "assets/spring-last-day-back.png?v=2",
  cardBackImage: "assets/spring-season-card-back.png?v=2",
  lastCardFrontImage: "assets/spring-last-day-front.png?v=2",
  standardCardFrontImages: [
    "assets/spring-season-card-1.png?v=2",
    "assets/spring-season-card-2.png?v=2",
    "assets/spring-season-card-3.png?v=2",
    "assets/spring-season-card-4.png?v=2",
  ],
});

[
  seasonDeckAnimation.lastCardFrontImage,
  ...seasonDeckAnimation.standardCardFrontImages,
  ...forageableTileFaces.map((face) => face.source),
  woodTileFace.source,
].forEach((source) => {
  const image = new Image();
  image.src = source;
});

let currentProfessionIndex = 0;
let selectedToken = null;
let boardScale = 1;
let boardX = 0;
let boardY = 0;
let isDraggingBoard = false;
let lastPointerX = 0;
let lastPointerY = 0;
let seasonDealTimer = null;
let seasonDrawTimer = null;
let isDrawingSeasonCard = false;
let tilePlacementTimer = null;
let setupSequenceVersion = 0;
let boardReturnTarget = "welcome";
let isPathDrawingMode = false;
let isDrawingGuideLine = false;
let activeGuideStroke = null;
let activePawnId = professions[0].id;
let pendingRouteId = null;
const pawnStates = new Map();
const tileRevealTimers = new Map();
const guideStrokes = [];
const ownedCardsStorageKey = "stardew-owned-player-cards-v1";
const maximumOwnedCards = 12;
const ownedCardsByProfession = loadOwnedCards();

function loadOwnedCards() {
  try {
    const savedCards = JSON.parse(localStorage.getItem(ownedCardsStorageKey) || "{}");
    return savedCards && typeof savedCards === "object" ? savedCards : {};
  } catch {
    return {};
  }
}

function saveOwnedCards() {
  try {
    localStorage.setItem(ownedCardsStorageKey, JSON.stringify(ownedCardsByProfession));
    ownedCardsStatus.textContent = "Cards saved in this browser.";
  } catch {
    ownedCardsStatus.textContent = "The cards could not be saved. Try smaller image files.";
  }
}

function renderOwnedCards() {
  const profession = professions[currentProfessionIndex];
  const cards = ownedCardsByProfession[profession.id] || [];
  const fragment = document.createDocumentFragment();

  cards.forEach((card) => {
    const cardElement = document.createElement("article");
    const image = document.createElement("img");
    const name = document.createElement("span");
    const removeButton = document.createElement("button");

    cardElement.className = "owned-card";
    cardElement.setAttribute("role", "listitem");
    image.src = card.image;
    image.alt = card.name;
    image.draggable = false;
    name.textContent = card.name;
    removeButton.className = "owned-card-remove";
    removeButton.type = "button";
    removeButton.textContent = "×";
    removeButton.setAttribute("aria-label", `Remove ${card.name}`);
    removeButton.addEventListener("click", (event) => {
      event.stopPropagation();
      ownedCardsByProfession[profession.id] = cards.filter((entry) => entry.id !== card.id);
      saveOwnedCards();
      renderOwnedCards();
    });

    cardElement.append(image, name, removeButton);
    fragment.append(cardElement);
  });

  ownedCardsList.replaceChildren(fragment);
  ownedCardsEmpty.hidden = cards.length > 0;
}

function cardImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const source = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      const scale = Math.min(1, 700 / image.naturalWidth, 1000 / image.naturalHeight);
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(source);
      resolve(canvas.toDataURL("image/webp", 0.82));
    };
    image.onerror = () => {
      URL.revokeObjectURL(source);
      reject(new Error("Could not read card image"));
    };
    image.src = source;
  });
}

ownedCardInput.addEventListener("change", async () => {
  const profession = professions[currentProfessionIndex];
  const cards = ownedCardsByProfession[profession.id] || [];
  const availableSlots = Math.max(0, maximumOwnedCards - cards.length);
  const files = [...ownedCardInput.files].slice(0, availableSlots);

  ownedCardsStatus.textContent = availableSlots === 0 ? "This player already has 12 cards." : "Adding cards…";

  for (const file of files) {
    try {
      cards.push({
        id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
        name: file.name.replace(/\.[^.]+$/, ""),
        image: await cardImageFromFile(file),
      });
    } catch {
      ownedCardsStatus.textContent = `${file.name} could not be added.`;
    }
  }

  ownedCardsByProfession[profession.id] = cards;
  ownedCardInput.value = "";
  saveOwnedCards();
  renderOwnedCards();
});

async function renderSavedPathHighlights() {
  try {
    const response = await fetch("path-highlight-coordinates.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Could not load saved path highlights: ${response.status}`);
    }

    const data = await response.json();
    const fragment = document.createDocumentFragment();

    data.figures.forEach((figure) => {
      if (!figure.connectedShape || !boardRoutes[figure.id]) {
        return;
      }

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.classList.add("saved-path-area");
      path.setAttribute("d", figure.connectedShape);
      path.dataset.figureId = String(figure.id);
      fragment.append(path);
    });

    savedPathHighlights.replaceChildren(fragment);
    updateRouteAvailability();
  } catch (error) {
    console.error(error);
  }
}

function renderPlayerToolDeck(profession) {
  const fragment = document.createDocumentFragment();

  profession.tools.forEach(([name, source], index) => {
    const image = document.createElement("img");
    image.src = source;
    image.alt = name;
    image.draggable = false;
    image.style.setProperty("--tool-card-index", index);
    fragment.append(image);
  });

  playerToolDeck.replaceChildren(fragment);
  playerToolDeck.tabIndex = 0;
  playerToolDeck.setAttribute("role", "button");
  playerToolDeck.setAttribute("aria-label", `${profession.name} tool cards; starting tool on top. Activate to remove the top card.`);
}

function removeTopPlayerToolCard() {
  const topCard = playerToolDeck.lastElementChild;
  if (!topCard || topCard.classList.contains("is-removing")) {
    return;
  }

  topCard.classList.add("is-removing");
  topCard.addEventListener("animationend", () => {
    topCard.remove();
    const nextCard = playerToolDeck.lastElementChild;
    playerToolDeck.setAttribute(
      "aria-label",
      nextCard ? `${nextCard.alt} is face up. Activate to remove it.` : "Tool card pile is empty.",
    );
  }, { once: true });
}

playerToolDeck.addEventListener("click", (event) => {
  event.stopPropagation();
  removeTopPlayerToolCard();
});

playerToolDeck.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  removeTopPlayerToolCard();
});

function renderProfession() {
  const profession = professions[currentProfessionIndex];

  professionPreview.src = profession.image;
  professionPreview.alt = profession.alt;
  professionPawn.src = profession.pawn;
  professionPawn.alt = `${profession.name} player pawn`;
  boardPlayerMatImage.src = profession.image;
  boardPlayerMatImage.alt = profession.alt;
  renderPlayerToolDeck(profession);
  renderOwnedCards();
  professionInstruction.textContent = "Select your player mat to continue:";
  professionName.textContent = profession.name;
  professionOption.setAttribute("aria-label", `Choose ${profession.name}`);
}

function changeProfession(direction) {
  currentProfessionIndex =
    (currentProfessionIndex + direction + professions.length) % professions.length;
  renderProfession();
}

function showSelectedProfession() {
  professionName.classList.add("is-placeholder");
  professionActions.hidden = false;
  previousButton.disabled = true;
  nextButton.disabled = true;
  professionOption.disabled = true;
  backButton.focus();
}

function getBoardLayout() {
  const viewportWidth = boardCanvas.clientWidth;
  const viewportHeight = boardCanvas.clientHeight;
  const surfaceSize = viewportHeight;
  const baseLeft = (viewportWidth - surfaceSize) / 2;

  return { viewportWidth, viewportHeight, surfaceSize, baseLeft };
}

function clampBoardPosition() {
  const { viewportWidth, viewportHeight, surfaceSize, baseLeft } = getBoardLayout();
  const minimumTotalX = viewportWidth - surfaceSize * boardScale;
  const minimumY = viewportHeight - surfaceSize * boardScale;

  boardX = Math.min(-baseLeft, Math.max(minimumTotalX - baseLeft, boardX));
  boardY = Math.min(0, Math.max(minimumY, boardY));
}

function renderBoardView() {
  const { surfaceSize, baseLeft } = getBoardLayout();

  boardSurface.style.width = `${surfaceSize}px`;
  boardSurface.style.height = `${surfaceSize}px`;
  clampBoardPosition();
  boardSurface.style.transform =
    `translate3d(${baseLeft + boardX}px, ${boardY}px, 0) scale(${boardScale})`;
  boardCanvas.classList.toggle("is-zoomed", boardScale > 1);
}

function resetBoardView() {
  boardFrame.classList.remove("is-expanded");
  boardScale = 1;
  boardX = 0;
  boardY = 0;
  isDraggingBoard = false;
  boardCanvas.classList.remove("is-dragging");
  renderBoardView();
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function playBoardSetupSequence() {
  const sequenceVersion = ++setupSequenceVersion;
  const deckAnimationDuration =
    seasonDeckAnimation.slideDurationMs + seasonDeckAnimation.maximumStaggerMs + 100;

  boardSurface.classList.add("is-waiting-for-deck", "is-waiting-for-tiles");

  try {
    await boardImage.decode();
  } catch {
    // The load event still displays the board if decode() is unavailable or fails.
  }

  await delay(450);
  if (sequenceVersion !== setupSequenceVersion) return;

  boardSurface.classList.remove("is-waiting-for-deck");
  playSeasonDeckAnimation();

  await delay(deckAnimationDuration + 180);
  if (sequenceVersion !== setupSequenceVersion) return;

  boardSurface.classList.remove("is-waiting-for-tiles");
  playTilePlacementAnimation();
}

function showGameBoard(animateSetup = true, returnTarget = "welcome") {
  setupSequenceVersion += 1;
  boardReturnTarget = returnTarget;
  clearTimeout(tilePlacementTimer);
  boardSurface.classList.remove(
    "is-season-dealing",
    "is-placing-tiles",
    "is-waiting-for-deck",
    "is-waiting-for-tiles",
  );
  welcomePicker.hidden = true;
  deckSizePicker.hidden = true;
  tokenPicker.hidden = true;
  picker.hidden = true;
  gameBoard.hidden = false;
  gameBoard.classList.toggle("is-static-view", !animateSetup);
  clearTileChoice();
  resetMapTiles();
  setPlayerPawn(true);
  setPathDrawingMode(false);
  resetBoardView();

  if (animateSetup) {
    playBoardSetupSequence();
  }
}

function updateDeckSizeSummary(cardsPerSeason) {
  if (!Number.isInteger(cardsPerSeason)) {
    deckSizeTotal.textContent = "Enter a whole number of cards per season.";
    return;
  }

  const roundsPerSeason = Math.max(0, cardsPerSeason - 1);
  const totalCards = cardsPerSeason * seasonDeckAnimation.seasonCount;
  deckSizeTotal.textContent = `${cardsPerSeason} cards per season: ${roundsPerSeason} rounds + 1 Last Day. ${totalCards} Season Cards total.`;
}

function renderSeasonDeck(requestedCardCount = seasonDeck.dataset.cardCount) {
  const parsedCount = Number.parseInt(requestedCardCount, 10);
  const requestedCardsPerSeason = Math.round(
    (Number.isFinite(parsedCount) ? parsedCount : seasonDeckAnimation.minimumCards)
      / seasonDeckAnimation.seasonCount,
  );
  const cardsPerSeason = Math.min(
    seasonDeckAnimation.maximumCardsPerSeason,
    Math.max(seasonDeckAnimation.minimumCardsPerSeason, requestedCardsPerSeason),
  );
  const cardCount = cardsPerSeason * seasonDeckAnimation.seasonCount;
  const fragment = document.createDocumentFragment();
  const maximumOffset = seasonDeckAnimation.spreadInCardWidths * 100;

  clearTimeout(seasonDrawTimer);
  isDrawingSeasonCard = false;
  boardSurface.querySelectorAll(".drawn-season-card").forEach((card) => card.remove());
  seasonDiscardPile.replaceChildren();
  seasonDiscardPile.setAttribute("aria-label", "Face-up discarded Season Cards");
  seasonDeck.disabled = false;
  seasonDeck.replaceChildren();
  seasonDeck.dataset.cardCount = String(cardCount);
  seasonDeck.dataset.cardsPerSeason = String(cardsPerSeason);
  seasonDeck.style.setProperty("--deal-duration", `${seasonDeckAnimation.slideDurationMs}ms`);
  seasonDeck.setAttribute("aria-label", `Draw a Season Card. ${cardCount} cards remain.`);

  for (let index = 0; index < cardCount; index += 1) {
    const card = document.createElement("img");
    const progress = index / (cardCount - 1);
    const staggerProgress = index === 0 ? 0 : (index - 1) / (cardCount - 2);
    const drawPosition = cardCount - 1 - index;
    const isLastDay = drawPosition % cardsPerSeason === cardsPerSeason - 1;

    card.className = "season-card";
    card.src = isLastDay
      ? seasonDeckAnimation.bottomCardImage
      : seasonDeckAnimation.cardBackImage;
    card.alt = "";
    card.draggable = false;
    card.dataset.lastDay = String(isLastDay);
    card.setAttribute("aria-hidden", "true");
    card.style.setProperty("--fan-offset", `${maximumOffset * progress}%`);
    card.style.setProperty("--deal-delay", `${seasonDeckAnimation.maximumStaggerMs * staggerProgress}ms`);
    card.style.setProperty("--layer", String(index + 2));
    fragment.append(card);
  }

  seasonDeck.append(fragment);
  return cardCount;
}

function playSeasonDeckAnimation() {
  clearTimeout(seasonDealTimer);
  boardSurface.classList.remove("is-season-dealing");
  void boardSurface.offsetWidth;
  boardSurface.classList.add("is-season-dealing");
  seasonDealTimer = setTimeout(() => {
    boardSurface.classList.remove("is-season-dealing");
  }, seasonDeckAnimation.slideDurationMs + seasonDeckAnimation.maximumStaggerMs + 100);
}

function setSeasonCardCount(cardCount, animate = true) {
  const renderedCount = renderSeasonDeck(cardCount);
  const cardsPerSeason = renderedCount / seasonDeckAnimation.seasonCount;
  deckSizeInput.value = String(cardsPerSeason);
  updateDeckSizeSummary(cardsPerSeason);

  if (animate && !gameBoard.hidden) {
    playSeasonDeckAnimation();
  }

  return renderedCount;
}

globalThis.setSeasonCardCount = setSeasonCardCount;

function randomSeasonCardIndex(maximum) {
  if (globalThis.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    const limit = Math.floor(0x100000000 / maximum) * maximum;

    do {
      globalThis.crypto.getRandomValues(values);
    } while (values[0] >= limit);

    return values[0] % maximum;
  }

  return Math.floor(Math.random() * maximum);
}

function drawSeasonCard() {
  if (
    isDrawingSeasonCard
    || boardSurface.classList.contains("is-season-dealing")
    || seasonDeck.childElementCount === 0
  ) {
    return;
  }

  const remainingBeforeDraw = seasonDeck.childElementCount;
  const topCard = seasonDeck.lastElementChild;
  const frontImage = topCard.dataset.lastDay === "true"
    ? seasonDeckAnimation.lastCardFrontImage
    : seasonDeckAnimation.standardCardFrontImages[
      randomSeasonCardIndex(seasonDeckAnimation.standardCardFrontImages.length)
    ];
  const drawnCard = document.createElement("div");
  const inner = document.createElement("div");
  const back = document.createElement("img");
  const front = document.createElement("img");

  drawnCard.className = "drawn-season-card";
  drawnCard.setAttribute("aria-hidden", "true");
  inner.className = "drawn-season-card__inner";
  back.className = "drawn-season-card__face drawn-season-card__back";
  back.src = topCard.src;
  back.alt = "";
  front.className = "drawn-season-card__face drawn-season-card__front";
  front.src = frontImage;
  front.alt = "";
  inner.append(back, front);
  drawnCard.append(inner);

  isDrawingSeasonCard = true;
  seasonDeck.disabled = true;
  topCard.remove();
  seasonDeck.dataset.cardCount = String(remainingBeforeDraw - 1);
  seasonDeck.setAttribute(
    "aria-label",
    remainingBeforeDraw > 1
      ? `Draw a Season Card. ${remainingBeforeDraw - 1} cards remain.`
      : "The Season Card deck is empty.",
  );
  boardSurface.append(drawnCard);

  seasonDrawTimer = setTimeout(() => {
    const discardedCard = document.createElement("img");

    discardedCard.className = "discarded-season-card";
    discardedCard.src = frontImage;
    discardedCard.alt = "";
    discardedCard.draggable = false;
    discardedCard.setAttribute("aria-hidden", "true");
    seasonDiscardPile.append(discardedCard);
    seasonDiscardPile.setAttribute(
      "aria-label",
      `${seasonDiscardPile.childElementCount} face-up discarded Season Cards`,
    );
    drawnCard.remove();
    isDrawingSeasonCard = false;
    seasonDeck.disabled = seasonDeck.childElementCount === 0;
  }, 4650);
}

seasonDeck.addEventListener("click", drawSeasonCard);

function pawnPositionFor(state, nodeId = state.node) {
  if (nodeId === "farm") {
    return farmhousePawnPositions[state.index];
  }
  if (nodeId === "mountains") {
    return mountainsPawnPositions[state.index];
  }
  if (nodeId === "town") {
    return townSquarePawnPositions[state.index];
  }
  if (nodeId === "museum") {
    return museumBlacksmithPawnPositions[state.index];
  }
  if (nodeId === "animals") {
    return marniesRanchPawnPositions[state.index];
  }
  if (nodeId === "river") {
    return riverFishingPawnPositions[state.index];
  }
  if (nodeId === "ocean") {
    return oceanFishingPawnPositions[state.index];
  }

  const center = boardNodes[nodeId];
  const offset = pawnOffsets[state.index];
  return [center[0] + offset[0], center[1] + offset[1]];
}

function updateRouteAvailability() {
  const state = pawnStates.get(activePawnId);
  savedPathHighlights.querySelectorAll(".saved-path-area").forEach((path) => {
    const route = boardRoutes[path.dataset.figureId];
    const isReachable = Boolean(
      state
      && !state.animation
      && pendingRouteId === null
      && route
      && (state.node === route.from || state.node === route.to),
    );
    path.classList.toggle("is-reachable", isReachable);
    path.classList.toggle("is-awaiting-tile", path.dataset.figureId === pendingRouteId);
  });
}

function selectPawn(pawnId) {
  if (pendingRouteId !== null) {
    return;
  }

  activePawnId = pawnId;
  const selectedState = pawnStates.get(pawnId);
  if (selectedState) {
    currentProfessionIndex = selectedState.index;
    renderProfession();
  }
  pawnStates.forEach((state) => {
    const isActive = state.profession.id === pawnId;
    state.element.classList.toggle("is-active", isActive);
    state.element.setAttribute("aria-pressed", String(isActive));
  });
  updateRouteAvailability();
}

function createBoardPawns() {
  if (pawnStates.size > 0) {
    return;
  }

  professions.forEach((profession, index) => {
    const element = document.createElement("button");
    const image = document.createElement("img");
    const state = {
      profession,
      index,
      node: "farm",
      element,
      animation: null,
      arrivalTimer: null,
    };

    element.className = "sliding-pawn";
    element.type = "button";
    element.dataset.pawnId = profession.id;
    element.setAttribute("aria-label", `Select ${profession.name} player pawn`);
    element.setAttribute("aria-pressed", "false");
    image.src = profession.pawn;
    image.alt = "";
    image.draggable = false;
    element.append(image);
    element.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      selectPawn(profession.id);
    });
    boardPawns.append(element);
    pawnStates.set(profession.id, state);
  });
}

function renderPawnPosition(state) {
  const [left, top] = pawnPositionFor(state);
  state.element.style.setProperty("--pawn-left", `${left}%`);
  state.element.style.setProperty("--pawn-top", `${top}%`);
}

function setPlayerPawn(visible) {
  createBoardPawns();
  boardPawns.hidden = !visible;
  if (!visible) {
    return;
  }

  activePawnId = professions[currentProfessionIndex].id;
  pawnStates.forEach((state) => {
    renderPawnPosition(state);
    state.element.hidden = !multiplayerPawnsEnabled && state.profession.id !== activePawnId;
  });
  selectPawn(activePawnId);
}

function showUnavailableRoute(state) {
  state.element.classList.remove("is-unavailable");
  void state.element.offsetWidth;
  state.element.classList.add("is-unavailable");
  setTimeout(() => state.element.classList.remove("is-unavailable"), 360);
}

function buildPawnHopKeyframes(points) {
  const segmentLengths = points.slice(1).map((point, index) =>
    Math.hypot(point[0] - points[index][0], point[1] - points[index][1]),
  );
  const totalDistance = segmentLengths.reduce((sum, distance) => sum + distance, 0);
  const hopCount = Math.max(3, Math.ceil(totalDistance / 2.6));
  const keyframes = [];

  for (let step = 0; step <= hopCount * 2; step += 1) {
    const progress = step / (hopCount * 2);
    const targetDistance = progress * totalDistance;
    let traversed = 0;
    let segmentIndex = 0;

    while (
      segmentIndex < segmentLengths.length - 1
      && traversed + segmentLengths[segmentIndex] < targetDistance
    ) {
      traversed += segmentLengths[segmentIndex];
      segmentIndex += 1;
    }

    const segmentLength = segmentLengths[segmentIndex] || 1;
    const segmentProgress = Math.min(1, (targetDistance - traversed) / segmentLength);
    const from = points[segmentIndex];
    const to = points[segmentIndex + 1];
    const left = from[0] + (to[0] - from[0]) * segmentProgress;
    const top = from[1] + (to[1] - from[1]) * segmentProgress;
    const isAirborne = step % 2 === 1;

    keyframes.push({
      left: `${left}%`,
      top: `${top}%`,
      transform: isAirborne
        ? "translate(-50%, -82%) translateY(-11px) scale(1.07)"
        : "translate(-50%, -82%) translateY(0) scale(1)",
      offset: progress,
    });
  }

  return { keyframes, totalDistance };
}

function shuffle(items) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[randomIndex]] = [items[randomIndex], items[index]];
  }
  return items;
}

function cancelTileRevealTimers() {
  tileRevealTimers.forEach((timer) => clearTimeout(timer));
  tileRevealTimers.clear();
  boardSurface.querySelectorAll(".drawn-map-tile").forEach((tile) => tile.remove());
}

function resetMapTiles() {
  cancelTileRevealTimers();
  const shuffledForageables = shuffle([...forageableTileFaces]);

  boardSurface.querySelectorAll(".forageable-tile").forEach((tile, index) => {
    const face = shuffledForageables[index];
    tile.dataset.faceSource = face.source;
    tile.dataset.faceName = face.name;
    tile.src = forageableBackSource;
    tile.alt = "Facedown Spring forageable tile";
    tile.hidden = false;
    tile.classList.remove("is-being-revealed", "is-being-collected");
  });

  boardSurface.querySelectorAll(".tree-tile").forEach((tile) => {
    tile.dataset.faceSource = woodTileFace.source;
    tile.dataset.faceName = woodTileFace.name;
    tile.src = treeBackSource;
    tile.alt = "Spring tree tile";
    tile.hidden = false;
    tile.classList.remove("is-being-revealed", "is-being-collected");
  });
}

function tilesBesideRoute(figureId) {
  const tileIds = routeTileIds[figureId] ?? [];
  return tileIds
    .map((tileId) => boardSurface.querySelector(`[data-tile-id="${tileId}"]`))
    .filter((tile) => tile && !tile.hidden);
}

function clearTileChoice(releaseRoute = true) {
  boardSurface.classList.remove("is-choosing-route-tile");
  boardSurface.querySelectorAll(".map-tile.is-route-choice").forEach((tile) => {
    tile.classList.remove("is-route-choice");
    tile.removeAttribute("role");
    tile.removeAttribute("tabindex");
  });
  if (releaseRoute) {
    pendingRouteId = null;
  }
  updateRouteAvailability();
}

function chooseTileBeforeMoving(figureId, tiles) {
  pendingRouteId = String(figureId);
  boardSurface.classList.add("is-choosing-route-tile");
  tiles.forEach((tile) => {
    tile.classList.add("is-route-choice");
    tile.setAttribute("role", "button");
    tile.setAttribute("tabindex", "0");
  });
  updateRouteAvailability();
}

function hopPawnAlongRoute(figureId, tileChoiceComplete = false) {
  const route = boardRoutes[figureId];
  const state = pawnStates.get(activePawnId);
  if (!route || !state || boardPawns.hidden || isPathDrawingMode || state.animation) {
    return;
  }

  if (state.node !== route.from && state.node !== route.to) {
    showUnavailableRoute(state);
    return;
  }

  if (!tileChoiceComplete) {
    const routeTiles = tilesBesideRoute(figureId);
    if (routeTiles.length > 0) {
      chooseTileBeforeMoving(figureId, routeTiles);
      return;
    }
  }

  clearTimeout(state.arrivalTimer);
  const movingForward = state.node === route.from;
  const destinationNode = movingForward ? route.to : route.from;
  const routePoints = movingForward ? route.path : [...route.path].reverse();
  const startPosition = pawnPositionFor(state);
  const destinationPosition = pawnPositionFor(state, destinationNode);
  const points = [startPosition, ...routePoints, destinationPosition];
  const { keyframes, totalDistance } = buildPawnHopKeyframes(points);

  state.node = destinationNode;
  renderPawnPosition(state);
  state.element.classList.remove("is-arriving", "is-unavailable");
  state.element.classList.add("is-hopping");
  updateRouteAvailability();

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  state.animation = state.element.animate(
    reducedMotion ? [keyframes[0], keyframes.at(-1)] : keyframes,
    {
      duration: reducedMotion ? 1 : Math.min(3000, Math.max(900, totalDistance * 72)),
      easing: "linear",
    },
  );
  const activeAnimation = state.animation;
  state.animation.addEventListener("finish", () => {
    if (state.animation !== activeAnimation) {
      return;
    }
    state.animation = null;
    state.element.classList.remove("is-hopping");
    updateRouteAvailability();
    state.element.classList.add("is-arriving");
    state.arrivalTimer = setTimeout(() => state.element.classList.remove("is-arriving"), 280);
  }, { once: true });
}

savedPathHighlights.addEventListener("click", (event) => {
  const selectedPath = event.target.closest(".saved-path-area");
  if (!selectedPath || boardPawns.hidden || isPathDrawingMode) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  if (pendingRouteId !== null) {
    if (selectedPath.dataset.figureId === pendingRouteId) {
      clearTileChoice();
    }
    return;
  }

  hopPawnAlongRoute(selectedPath.dataset.figureId);
});

function collectRouteTile(tile) {
  if (!tile.classList.contains("is-route-choice") || pendingRouteId === null) {
    return;
  }

  const routeId = pendingRouteId;
  const drawnTile = document.createElement("div");
  const inner = document.createElement("div");
  const back = document.createElement("img");
  const front = document.createElement("img");

  drawnTile.className = "drawn-map-tile";
  drawnTile.style.setProperty("--tile-start-left", tile.style.getPropertyValue("--left"));
  drawnTile.style.setProperty("--tile-start-top", tile.style.getPropertyValue("--top"));
  drawnTile.setAttribute("role", "img");
  drawnTile.setAttribute("aria-label", tile.dataset.faceName);
  inner.className = "drawn-map-tile__inner";
  back.className = "drawn-map-tile__face drawn-map-tile__back";
  back.src = tile.src;
  back.alt = "";
  front.className = "drawn-map-tile__face drawn-map-tile__front";
  front.src = tile.dataset.faceSource;
  front.alt = "";
  inner.append(back, front);
  drawnTile.append(inner);

  clearTileChoice(false);
  tile.hidden = true;
  boardSurface.append(drawnTile);

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealTimer = setTimeout(() => {
    tileRevealTimers.delete(tile);
    drawnTile.remove();
    pendingRouteId = null;
    updateRouteAvailability();
    hopPawnAlongRoute(routeId, true);
  }, reducedMotion ? 1800 : 4650);

  tileRevealTimers.set(tile, revealTimer);
}

boardSurface.addEventListener("click", (event) => {
  const tile = event.target.closest(".map-tile.is-route-choice");
  if (!tile) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  collectRouteTile(tile);
});

boardSurface.addEventListener("keydown", (event) => {
  const tile = event.target.closest(".map-tile.is-route-choice");
  if (!tile || (event.key !== "Enter" && event.key !== " ")) {
    return;
  }

  event.preventDefault();
  collectRouteTile(tile);
});

function setPathDrawingMode(enabled) {
  if (enabled && pendingRouteId !== null) {
    clearTileChoice();
  }

  isPathDrawingMode = enabled;
  isDrawingGuideLine = false;
  activeGuideStroke = null;
  pathDrawingLayer.classList.toggle("is-active", enabled);
  playerMatDrawingLayer.classList.toggle("is-active", enabled);
  boardCanvas.classList.toggle("is-path-drawing", enabled);
  pathDrawToggle.setAttribute("aria-pressed", String(enabled));
  pathDrawToggle.textContent = enabled ? "Stop drawing" : "Draw lines";
  pathToolStatus.textContent = enabled
    ? pathDrawingType.value === "straight"
      ? "Drag from the start to the end of each straight line."
      : "Drag over the board to draw freehand lines."
    : "";
}

function eventToDrawingPoint(event, layer) {
  const bounds = layer.getBoundingClientRect();
  return [
    Math.max(0, Math.min(100, (event.clientX - bounds.left) / bounds.width * 100)),
    Math.max(0, Math.min(100, (event.clientY - bounds.top) / bounds.height * 100)),
  ];
}

function formatGuideCoordinates() {
  const areaCounts = { board: 0, playerMat: 0 };
  pathCoordinates.value = guideStrokes
    .map(({ points, area }) => {
      areaCounts[area] += 1;
      const commands = points.map(([x, y], pointIndex) =>
        `${pointIndex === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`,
      );
      const prefix = area === "playerMat" ? "Player Mat Line" : "Line";
      return `${prefix} ${areaCounts[area]}: ${commands.join(" ")}`;
    })
    .join(" ");
}

function updateGuideStroke(stroke) {
  if (stroke.type === "straight") {
    const [start, end] = stroke.points;
    stroke.element.setAttribute("x1", start[0].toFixed(3));
    stroke.element.setAttribute("y1", start[1].toFixed(3));
    stroke.element.setAttribute("x2", end[0].toFixed(3));
    stroke.element.setAttribute("y2", end[1].toFixed(3));
    return;
  }

  stroke.element.setAttribute(
    "points",
    stroke.points.map(([x, y]) => `${x.toFixed(3)},${y.toFixed(3)}`).join(" "),
  );
}

function bindDrawingLayer(layer, lines, area) {
  layer.addEventListener("pointerdown", (event) => {
    if (!isPathDrawingMode || (event.pointerType === "mouse" && event.button !== 0)) return;

    event.preventDefault();
    event.stopPropagation();
    const type = pathDrawingType.value;
    const element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      type === "straight" ? "line" : "polyline",
    );
    const firstPoint = eventToDrawingPoint(event, layer);
    const stroke = {
      element,
      layer,
      area,
      type,
      points: type === "straight" ? [firstPoint, firstPoint] : [firstPoint],
    };

    element.classList.add("path-guide-line");
    lines.append(element);
    guideStrokes.push(stroke);
    activeGuideStroke = stroke;
    isDrawingGuideLine = true;
    layer.setPointerCapture(event.pointerId);
    updateGuideStroke(stroke);
  });

  layer.addEventListener("pointermove", (event) => {
    if (!isDrawingGuideLine || !activeGuideStroke || activeGuideStroke.layer !== layer) return;

    event.preventDefault();
    event.stopPropagation();
    const point = eventToDrawingPoint(event, layer);
    if (activeGuideStroke.type === "straight") {
      activeGuideStroke.points[1] = point;
      updateGuideStroke(activeGuideStroke);
      return;
    }

    const previous = activeGuideStroke.points.at(-1);
    if (Math.hypot(point[0] - previous[0], point[1] - previous[1]) < 0.12) return;
    activeGuideStroke.points.push(point);
    updateGuideStroke(activeGuideStroke);
  });

  const finishGuideStroke = (event) => {
    if (!isDrawingGuideLine || activeGuideStroke?.layer !== layer) return;
    event.preventDefault();
    event.stopPropagation();
    isDrawingGuideLine = false;
    activeGuideStroke = null;
    if (layer.hasPointerCapture(event.pointerId)) layer.releasePointerCapture(event.pointerId);
    formatGuideCoordinates();
    pathToolStatus.textContent = "Line saved. Draw another line or copy the coordinates.";
  };

  layer.addEventListener("pointerup", finishGuideStroke);
  layer.addEventListener("pointercancel", finishGuideStroke);
  layer.addEventListener("dblclick", (event) => {
    event.preventDefault();
    event.stopPropagation();
  });
}

bindDrawingLayer(pathDrawingLayer, pathDrawingLines, "board");
bindDrawingLayer(playerMatDrawingLayer, playerMatDrawingLines, "playerMat");

pathDrawToggle.addEventListener("click", () => {
  setPathDrawingMode(!isPathDrawingMode);
});

pathDrawingType.addEventListener("change", () => {
  if (isPathDrawingMode) {
    setPathDrawingMode(true);
  }
});

pathUndoButton.addEventListener("click", () => {
  const stroke = guideStrokes.pop();
  stroke?.element.remove();
  formatGuideCoordinates();
  pathToolStatus.textContent = stroke ? "Last line removed." : "There are no lines to remove.";
});

pathClearButton.addEventListener("click", () => {
  guideStrokes.length = 0;
  pathDrawingLines.replaceChildren();
  playerMatDrawingLines.replaceChildren();
  formatGuideCoordinates();
  pathToolStatus.textContent = "All lines cleared.";
});

pathCopyButton.addEventListener("click", async () => {
  if (!pathCoordinates.value) {
    pathToolStatus.textContent = "Draw at least one line first.";
    return;
  }

  try {
    await navigator.clipboard.writeText(pathCoordinates.value);
    pathToolStatus.textContent = "Coordinates copied. Paste them into the chat.";
  } catch {
    pathCoordinates.focus();
    pathCoordinates.select();
    document.execCommand("copy");
    pathToolStatus.textContent = "Coordinates copied. Paste them into the chat.";
  }
});

function playTilePlacementAnimation() {
  const tiles = [...boardSurface.querySelectorAll(".map-tile")];
  const pawns = [...boardPawns.querySelectorAll(".sliding-pawn:not([hidden])")];
  const staggerMs = 130;
  const animationMs = 850;
  const tileSequenceDuration = Math.max(0, tiles.length - 1) * staggerMs;

  clearTimeout(tilePlacementTimer);
  boardSurface.classList.remove("is-placing-tiles");
  tiles.forEach((tile, index) => {
    tile.style.setProperty("--tile-delay", `${index * staggerMs}ms`);
  });
  pawns.forEach((pawn, index) => {
    const delay = tileSequenceDuration * (index + 1) / (pawns.length + 1);
    pawn.style.setProperty("--pawn-placement-delay", `${Math.round(delay)}ms`);
  });

  void boardSurface.offsetWidth;
  boardSurface.classList.add("is-placing-tiles");
  tilePlacementTimer = setTimeout(() => {
    boardSurface.classList.remove("is-placing-tiles");
  }, animationMs + tileSequenceDuration + 100);
}

newGameButton.addEventListener("click", () => {
  welcomePicker.hidden = true;
  deckSizePicker.hidden = false;
  deckSizeInput.focus();
});

deckStageBack.addEventListener("click", () => {
  deckSizePicker.hidden = true;
  welcomePicker.hidden = false;
  newGameButton.focus();
});

tokenStageBack.addEventListener("click", () => {
  tokenPicker.hidden = true;
  deckSizePicker.hidden = false;
  deckSizeInput.focus();
});

professionStageBack.addEventListener("click", () => {
  picker.hidden = true;
  tokenPicker.hidden = false;
  document.querySelector(".token-option").focus();
});

boardStageBack.addEventListener("click", () => {
  setupSequenceVersion += 1;
  clearTimeout(seasonDealTimer);
  clearTimeout(tilePlacementTimer);
  boardSurface.classList.remove(
    "is-season-dealing",
    "is-placing-tiles",
    "is-waiting-for-deck",
    "is-waiting-for-tiles",
  );
  clearTileChoice();
  cancelTileRevealTimers();
  setPathDrawingMode(false);
  gameBoard.classList.remove("is-static-view");
  gameBoard.hidden = true;

  if (boardReturnTarget === "profession") {
    picker.hidden = false;
    continueButton.focus();
  } else {
    welcomePicker.hidden = false;
    newGameButton.focus();
  }
});

viewBoardButton.addEventListener("click", () => showGameBoard(true, "welcome"));
viewBoardStaticButton.addEventListener("click", () => showGameBoard(false, "welcome"));

function stepDeckSize(direction) {
  const currentValue = Number(deckSizeInput.value);
  const nextValue = Math.min(
    seasonDeckAnimation.maximumCardsPerSeason,
    Math.max(
      seasonDeckAnimation.minimumCardsPerSeason,
      (Number.isFinite(currentValue) ? currentValue : seasonDeckAnimation.minimumCardsPerSeason) + direction,
    ),
  );
  deckSizeInput.value = String(nextValue);
  deckSizeInput.dispatchEvent(new Event("input", { bubbles: true }));
}

deckSizeIncrease.addEventListener("click", () => stepDeckSize(1));
deckSizeDecrease.addEventListener("click", () => stepDeckSize(-1));

deckSizeInput.addEventListener("input", () => {
  deckSizeInput.removeAttribute("aria-invalid");
  deckSizeError.textContent = "";
  updateDeckSizeSummary(Number(deckSizeInput.value));
});

deckSizeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const cardsPerSeason = Number(deckSizeInput.value);

  if (
    !Number.isInteger(cardsPerSeason)
    || cardsPerSeason < seasonDeckAnimation.minimumCardsPerSeason
    || cardsPerSeason > seasonDeckAnimation.maximumCardsPerSeason
  ) {
    deckSizeInput.setAttribute("aria-invalid", "true");
    deckSizeError.textContent = `Enter a whole number from ${seasonDeckAnimation.minimumCardsPerSeason} to ${seasonDeckAnimation.maximumCardsPerSeason}.`;
    deckSizeInput.focus();
    return;
  }

  setSeasonCardCount(cardsPerSeason * seasonDeckAnimation.seasonCount, false);
  deckSizePicker.hidden = true;
  tokenPicker.hidden = false;
  document.querySelector(".token-option").focus();
});

document.querySelectorAll(".token-option").forEach((option) => {
  option.addEventListener("click", () => {
    selectedToken = option.dataset.token;
    tokenPicker.hidden = true;
    picker.hidden = false;
    professionOption.focus();
  });
});

previousButton.addEventListener("click", () => changeProfession(-1));
nextButton.addEventListener("click", () => changeProfession(1));
professionOption.addEventListener("click", showSelectedProfession);

backButton.addEventListener("click", () => {
  professionActions.hidden = true;
  professionName.classList.remove("is-placeholder");
  previousButton.disabled = false;
  nextButton.disabled = false;
  professionOption.disabled = false;
  professionOption.focus();
});

continueButton.addEventListener("click", () => showGameBoard(true, "profession"));

function isInteractiveBoardTarget(target) {
  return target instanceof Element && Boolean(target.closest(
    "button, [role='button'], .saved-path-area, .map-tile",
  ));
}

boardCanvas.addEventListener("dblclick", (event) => {
  if (isInteractiveBoardTarget(event.target)) {
    return;
  }

  event.preventDefault();

  if (boardScale > 1) {
    resetBoardView();
    return;
  }

  boardFrame.classList.add("is-expanded");

  const { viewportWidth, viewportHeight, surfaceSize, baseLeft } = getBoardLayout();
  boardScale = 2.5;
  boardX = viewportWidth / 2 - surfaceSize * boardScale / 2 - baseLeft;
  boardY = viewportHeight / 2 - surfaceSize * boardScale / 2;
  renderBoardView();
});

boardCanvas.addEventListener("pointerdown", (event) => {
  if (boardScale === 1 || event.button !== 0 || isInteractiveBoardTarget(event.target)) {
    return;
  }

  event.preventDefault();
  isDraggingBoard = true;
  lastPointerX = event.clientX;
  lastPointerY = event.clientY;
  boardCanvas.classList.add("is-dragging");
  boardCanvas.setPointerCapture(event.pointerId);
});

boardCanvas.addEventListener("pointermove", (event) => {
  if (!isDraggingBoard) {
    return;
  }

  boardX += event.clientX - lastPointerX;
  boardY += event.clientY - lastPointerY;
  lastPointerX = event.clientX;
  lastPointerY = event.clientY;
  renderBoardView();
});

function stopBoardDragging(event) {
  if (!isDraggingBoard) {
    return;
  }

  isDraggingBoard = false;
  boardCanvas.classList.remove("is-dragging");

  if (boardCanvas.hasPointerCapture(event.pointerId)) {
    boardCanvas.releasePointerCapture(event.pointerId);
  }
}

boardCanvas.addEventListener("pointerup", stopBoardDragging);
boardCanvas.addEventListener("pointercancel", stopBoardDragging);
window.addEventListener("resize", () => {
  if (!gameBoard.hidden) {
    renderBoardView();
  }
});

const pageParameters = new URLSearchParams(window.location.search);
const cardCountFromUrl = pageParameters.get("cards");
const initialCardCount = renderSeasonDeck(cardCountFromUrl ?? seasonDeck.dataset.cardCount);
const initialCardsPerSeason = initialCardCount / seasonDeckAnimation.seasonCount;
deckSizeInput.value = String(initialCardsPerSeason);
updateDeckSizeSummary(initialCardsPerSeason);
renderSavedPathHighlights();
renderProfession();
