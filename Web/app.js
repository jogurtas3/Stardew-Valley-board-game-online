const professions = [
  {
    id: "fishing",
    name: "Fishing",
    image: "assets/fishing.jpg",
    alt: "Fishing player mat",
    pawn: "assets/fishing-pawn.svg?v=20",
  },
  {
    id: "foraging",
    name: "Foraging",
    image: "assets/foraging.jpg",
    alt: "Foraging player mat",
    pawn: "assets/foraging-pawn.svg?v=20",
  },
  {
    id: "mining",
    name: "Mining",
    image: "assets/mining.jpg",
    alt: "Mining player mat",
    pawn: "assets/mining-pawn.svg?v=20",
  },
  {
    id: "farming",
    name: "Farming",
    image: "assets/farming.jpg",
    alt: "Farming player mat",
    pawn: "assets/farming-pawn.svg?v=20",
  },
];

const welcomePicker = document.querySelector("#welcome-picker");
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
const professionInstruction = document.querySelector("#profession-instruction");
const professionName = document.querySelector("#profession-name");
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

const pawnOffsets = Object.freeze([
  [-1.45, -0.55],
  [1.45, -0.55],
  [-1.45, 0.75],
  [1.45, 0.75],
]);

const seasonDeckAnimation = Object.freeze({
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
const pawnStates = new Map();
const guideStrokes = [];

async function renderSavedPathHighlights() {
  try {
    const response = await fetch("path-highlight-coordinates.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Could not load saved path highlights: ${response.status}`);
    }

    const data = await response.json();
    const fragment = document.createDocumentFragment();

    data.figures.forEach((figure) => {
      if (!figure.connectedShape) {
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

function renderProfession() {
  const profession = professions[currentProfessionIndex];

  professionPreview.src = profession.image;
  professionPreview.alt = profession.alt;
  professionPawn.src = profession.pawn;
  professionPawn.alt = `${profession.name} player pawn`;
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
  setPlayerPawn(returnTarget === "profession");
  setPathDrawingMode(false);
  resetBoardView();

  if (animateSetup) {
    playBoardSetupSequence();
  }
}

function renderSeasonDeck(requestedCardCount = seasonDeck.dataset.cardCount) {
  const parsedCount = Number.parseInt(requestedCardCount, 10);
  const cardCount = Math.min(
    seasonDeckAnimation.maximumCards,
    Math.max(seasonDeckAnimation.minimumCards, Number.isFinite(parsedCount) ? parsedCount : seasonDeckAnimation.minimumCards),
  );
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
  seasonDeck.style.setProperty("--deal-duration", `${seasonDeckAnimation.slideDurationMs}ms`);
  seasonDeck.setAttribute("aria-label", `Draw a Spring season card. ${cardCount} cards remain.`);

  for (let index = 0; index < cardCount; index += 1) {
    const card = document.createElement("img");
    const progress = index / (cardCount - 1);
    const staggerProgress = index === 0 ? 0 : (index - 1) / (cardCount - 2);

    card.className = "season-card";
    card.src = index === 0
      ? seasonDeckAnimation.bottomCardImage
      : seasonDeckAnimation.cardBackImage;
    card.alt = "";
    card.draggable = false;
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
  deckSizeInput.value = String(renderedCount);

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
  const frontImage = remainingBeforeDraw === 1
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
      ? `Draw a Spring season card. ${remainingBeforeDraw - 1} cards remain.`
      : "The Spring season deck is empty.",
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
      && route
      && (state.node === route.from || state.node === route.to),
    );
    path.classList.toggle("is-reachable", isReachable);
  });
}

function selectPawn(pawnId) {
  activePawnId = pawnId;
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
  pawnStates.forEach(renderPawnPosition);
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

function hopPawnAlongRoute(figureId) {
  const route = boardRoutes[figureId];
  const state = pawnStates.get(activePawnId);
  if (!route || !state || boardPawns.hidden || isPathDrawingMode || state.animation) {
    return;
  }

  if (state.node !== route.from && state.node !== route.to) {
    showUnavailableRoute(state);
    return;
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
  hopPawnAlongRoute(selectedPath.dataset.figureId);
});

function setPathDrawingMode(enabled) {
  isPathDrawingMode = enabled;
  isDrawingGuideLine = false;
  activeGuideStroke = null;
  pathDrawingLayer.classList.toggle("is-active", enabled);
  boardCanvas.classList.toggle("is-path-drawing", enabled);
  pathDrawToggle.setAttribute("aria-pressed", String(enabled));
  pathDrawToggle.textContent = enabled ? "Stop drawing" : "Draw lines";
  pathToolStatus.textContent = enabled
    ? pathDrawingType.value === "straight"
      ? "Drag from the start to the end of each straight line."
      : "Drag over the board to draw freehand lines."
    : "";
}

function eventToBoardPoint(event) {
  const bounds = pathDrawingLayer.getBoundingClientRect();
  return [
    Math.max(0, Math.min(100, (event.clientX - bounds.left) / bounds.width * 100)),
    Math.max(0, Math.min(100, (event.clientY - bounds.top) / bounds.height * 100)),
  ];
}

function formatGuideCoordinates() {
  pathCoordinates.value = guideStrokes
    .map(({ points }, index) => {
      const commands = points.map(([x, y], pointIndex) =>
        `${pointIndex === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`,
      );
      return `Line ${index + 1}: ${commands.join(" ")}`;
    })
    .join("\n");
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

pathDrawingLayer.addEventListener("pointerdown", (event) => {
  if (!isPathDrawingMode || (event.pointerType === "mouse" && event.button !== 0)) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  const type = pathDrawingType.value;
  const element = document.createElementNS(
    "http://www.w3.org/2000/svg",
    type === "straight" ? "line" : "polyline",
  );
  const firstPoint = eventToBoardPoint(event);
  const stroke = {
    element,
    type,
    points: type === "straight"
      ? [firstPoint, firstPoint]
      : [firstPoint],
  };

  element.classList.add("path-guide-line");
  pathDrawingLines.append(element);
  guideStrokes.push(stroke);
  activeGuideStroke = stroke;
  isDrawingGuideLine = true;
  pathDrawingLayer.setPointerCapture(event.pointerId);
  updateGuideStroke(stroke);
});

pathDrawingLayer.addEventListener("pointermove", (event) => {
  if (!isDrawingGuideLine || !activeGuideStroke) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  const point = eventToBoardPoint(event);

  if (activeGuideStroke.type === "straight") {
    activeGuideStroke.points[1] = point;
    updateGuideStroke(activeGuideStroke);
    return;
  }

  const previous = activeGuideStroke.points.at(-1);
  const distance = Math.hypot(point[0] - previous[0], point[1] - previous[1]);

  if (distance < 0.12) {
    return;
  }

  activeGuideStroke.points.push(point);
  updateGuideStroke(activeGuideStroke);
});

function finishGuideStroke(event) {
  if (!isDrawingGuideLine) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  isDrawingGuideLine = false;
  activeGuideStroke = null;
  if (pathDrawingLayer.hasPointerCapture(event.pointerId)) {
    pathDrawingLayer.releasePointerCapture(event.pointerId);
  }
  formatGuideCoordinates();
  pathToolStatus.textContent = "Line saved. Draw another line or copy the coordinates.";
}

pathDrawingLayer.addEventListener("pointerup", finishGuideStroke);
pathDrawingLayer.addEventListener("pointercancel", finishGuideStroke);
pathDrawingLayer.addEventListener("dblclick", (event) => {
  event.preventDefault();
  event.stopPropagation();
});

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
  const staggerMs = 130;
  const animationMs = 850;

  clearTimeout(tilePlacementTimer);
  boardSurface.classList.remove("is-placing-tiles");
  tiles.forEach((tile, index) => {
    tile.style.setProperty("--tile-delay", `${index * staggerMs}ms`);
  });

  void boardSurface.offsetWidth;
  boardSurface.classList.add("is-placing-tiles");
  tilePlacementTimer = setTimeout(() => {
    boardSurface.classList.remove("is-placing-tiles");
  }, animationMs + Math.max(0, tiles.length - 1) * staggerMs + 100);
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

deckSizeInput.addEventListener("input", () => {
  deckSizeInput.removeAttribute("aria-invalid");
  deckSizeError.textContent = "";
});

deckSizeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const cardCount = Number(deckSizeInput.value);

  if (
    !Number.isInteger(cardCount)
    || cardCount < seasonDeckAnimation.minimumCards
    || cardCount > seasonDeckAnimation.maximumCards
  ) {
    deckSizeInput.setAttribute("aria-invalid", "true");
    deckSizeError.textContent = `Enter a whole number from ${seasonDeckAnimation.minimumCards} to ${seasonDeckAnimation.maximumCards}.`;
    deckSizeInput.focus();
    return;
  }

  setSeasonCardCount(cardCount, false);
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

boardCanvas.addEventListener("dblclick", (event) => {
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
  if (boardScale === 1 || event.button !== 0) {
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
deckSizeInput.value = String(initialCardCount);
renderSavedPathHighlights();
renderProfession();
