(() => {
  const ROTATIONS = [
    [0, 0, 0], [0, 180, 0], [0, -90, 0],
    [0, 90, 0], [-90, 0, 0], [90, 0, 180],
  ];

  const DICE = {
    stardew: {
      title: "Stardew Dice",
      faces: ["stardrop", "heart", "heart", "heart", "junimo", "junimo"],
      names: ["Stardrop", "Heart", "Heart", "Heart", "Junimo", "Junimo"],
    },
    animal: {
      title: "Animal Dice",
      // Physical layout reconstructed from all eight Reference/corner*.jpg photos:
      // front, back, right, left, top, bottom.
      faces: ["cow", "chicken", "duck", "sheep", "rabbit", "goat"],
      names: ["Cow", "Chicken", "Duck", "Sheep", "Rabbit", "Goat"],
      imageRotations: [0, 0, 0, 0, 0, 180],
    },
  };

  const FACE_CLASSES = ["front", "back", "right", "left", "top", "bottom"];
  // Tas pats pradinis -13° / 24° kampas, išlaikant ridenimų Z/X/Y apsisukimų būseną.
  const INITIAL_TRANSFORM = "rotateZ(1080deg) rotateX(1067deg) rotateY(1104deg)";

  const PARTICLES = {
    heart: ["#ff3045", "#ff7d8a", "#ffd0d4"],
    junimo: ["#4fbd3b", "#9be34f", "#245e32"],
    stardrop: ["#8148d8", "#d07be8", "#f3d36a"],
    animal: ["#f4d38a", "#b9773e", "#fff4ce"],
  };

  const USE_CASES = {
    1: "Use for Open Geodes (1 die per Geode).",
    2: "Use for Explore the Mine.",
    3: "Use for Fishing.",
  };

  const ANIMAL_USE_CASE = "Use for collecting from animals.";

  function secureRandom(maximum) {
    if (globalThis.crypto?.getRandomValues) {
      const values = new Uint32Array(1);
      const limit = Math.floor(0x100000000 / maximum) * maximum;
      do globalThis.crypto.getRandomValues(values); while (values[0] >= limit);
      return values[0] % maximum;
    }
    return Math.floor(Math.random() * maximum);
  }

  class StardewDiceRoller {
    constructor(root) {
      this.root = root;
      this.button = root.querySelector(".stardew-dice__button");
      this.result = root.querySelector(".stardew-dice__result");
      this.countHint = root.querySelector(".stardew-dice__count-hint");
      this.heading = root.querySelector(".stardew-dice__heading h2");
      this.countControl = root.querySelector(".stardew-dice__count");
      this.typeButtons = [...root.querySelectorAll("[data-dice-type]")];
      this.particleLayer = root.querySelector(".stardew-dice__particles");
      this.diceRow = root.querySelector(".stardew-dice__dice-row");
      this.countButtons = [...root.querySelectorAll("[data-dice-count]")]
        .filter((button) => button.tagName === "BUTTON");
      // Virtualus ankstesnis ridenimas užtikrina, kad pirmas metimas prasidėtų
      // nuo tokios pačios didelių Z/X/Y kampų būsenos kaip visi kiti.
      this.rollNumber = 1;
      this.rolling = false;

      const sourceScene = this.diceRow.querySelector(".stardew-dice__scene");
      this.diceRow.append(sourceScene.cloneNode(true), sourceScene.cloneNode(true));
      this.scenes = [...this.diceRow.querySelectorAll(".stardew-dice__scene")];
      this.cubes = this.scenes.map((scene) => scene.querySelector(".stardew-dice__cube"));

      this.resetPerspective();

      this.cubes.forEach((cube) => {
        cube.querySelectorAll(".stardew-dice__corner").forEach((corner) => {
          ["top", "left", "right"].forEach((position) => {
            const detail = document.createElement("b");
            detail.className = `stardew-dice__corner-detail stardew-dice__corner-detail--${position}`;
            detail.setAttribute("aria-hidden", "true");
            corner.append(detail);
          });
        });
      });

      this.button.addEventListener("click", () => this.roll());
      this.countButtons.forEach((button) => {
        button.addEventListener("click", () => this.setCount(Number(button.dataset.diceCount)));
      });
      this.typeButtons.forEach((button) => {
        button.addEventListener("click", () => this.setType(button.dataset.diceType));
      });

      this.stardewCount = Number(root.dataset.diceCount) || 3;
      this.type = "stardew";
      this.setType("stardew");
      this.updateChamferedCorners();

      if (globalThis.ResizeObserver) {
        this.cornerObserver = new ResizeObserver(() => this.updateChamferedCorners());
        this.cubes.forEach((cube) => this.cornerObserver.observe(cube));
      } else {
        globalThis.addEventListener("resize", () => this.updateChamferedCorners());
      }
    }

    setType(type) {
      if (this.rolling || !DICE[type]) return;
      if (this.type === "stardew" && this.count) this.stardewCount = this.count;
      this.type = type;
      this.root.dataset.diceType = type;
      this.heading.textContent = DICE[type].title;
      this.countControl.hidden = false;
      this.countControl.setAttribute("aria-label",
        type === "animal" ? "Number of Animal Dice (always 3)" : "Number of Stardew Dice");
      this.countButtons.forEach((button) => {
        const isAnimal = type === "animal";
        button.hidden = isAnimal && Number(button.dataset.diceCount) !== 3;
        button.disabled = isAnimal;
      });
      this.typeButtons.forEach((button) => {
        const selected = button.dataset.diceType === type;
        button.classList.toggle("is-selected", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
      this.cubes.forEach((cube) => {
        FACE_CLASSES.forEach((faceClass, index) => {
          const image = cube.querySelector(`.stardew-dice__face--${faceClass} img`);
          image.src = type === "animal"
            ? `assets/animal-dice-${DICE.animal.faces[index]}.png?v=1`
            : `assets/dice-${DICE.stardew.faces[index]}.png?v=4`;
          const rotation = type === "animal"
            ? DICE.animal.imageRotations[index]
            : faceClass === "bottom" ? 180 : 0;
          image.style.transform = `rotate(${rotation}deg)`;
        });
      });
      this.setCount(type === "animal" ? 3 : this.stardewCount);
    }

    resetPerspective() {
      this.rollNumber = 1;
      this.cubes.forEach((cube) => {
        cube.classList.remove("is-rolling");
        cube.style.transition = "none";
        cube.style.transform = INITIAL_TRANSFORM;
        void cube.offsetWidth;
        cube.style.removeProperty("transition");
      });
    }

    setCount(count) {
      if (this.rolling) return;
      this.count = this.type === "animal" ? 3 : Math.max(1, Math.min(3, count));
      this.resetPerspective();
      if (this.type === "stardew") this.stardewCount = this.count;
      this.root.dataset.diceCount = String(this.count);
      this.scenes.forEach((scene, index) => {
        scene.hidden = index >= this.count;
      });
      this.countButtons.forEach((button) => {
        const selected = Number(button.dataset.diceCount) === this.count;
        button.classList.toggle("is-selected", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
      const noun = this.count === 1 ? "die" : "dice";
      if (this.countHint) {
        this.countHint.textContent = this.type === "animal" ? ANIMAL_USE_CASE : USE_CASES[this.count];
      }
      this.result.textContent = "";
      if (this.type === "animal") {
        this.button.textContent = this.count === 1 ? "Roll Animal Die" : "Roll Animal Dice";
      } else {
        this.button.textContent = this.count === 1 ? "Roll Stardew Die" : "Roll Stardew Dice";
      }
      requestAnimationFrame(() => this.updateChamferedCorners());
    }

    updateChamferedCorners() {
      this.cubes.forEach((cube) => {
        const size = cube.offsetWidth;
        if (!size) return;
        const half = size / 2;
        const cut = size * 0.20;
        const triangleWidth = cut * Math.SQRT2;
        const triangleHeight = cut * Math.sqrt(1.5);

        cube.querySelectorAll(".stardew-dice__corner").forEach((corner) => {
          const [sx, sy, sz] = corner.dataset.corner.split(",").map(Number);
          const p1 = [sx * (half - cut), sy * half, sz * half];
          const p2 = [sx * half, sy * (half - cut), sz * half];
          const p3 = [sx * half, sy * half, sz * (half - cut)];
          const u = p3.map((value, axis) => (value - p2[axis]) / triangleWidth);
          const p1MinusP2 = p1.map((value, axis) => value - p2[axis]);
          const v = u.map((value, axis) =>
            (value * triangleWidth / 2 - p1MinusP2[axis]) / triangleHeight);
          const center = p1.map((value, axis) => (value + p2[axis] + p3[axis]) / 3);
          const length = Math.hypot(...center);
          const normal = center.map((value) => value / length);
          const matrix = [
            u[0], u[1], u[2], 0,
            v[0], v[1], v[2], 0,
            normal[0], normal[1], normal[2], 0,
            center[0], center[1], center[2], 1,
          ].map((value) => Math.abs(value) < 1e-8 ? 0 : Number(value.toFixed(6)));

          corner.style.width = `${triangleWidth}px`;
          corner.style.height = `${triangleHeight}px`;
          corner.style.marginLeft = `${-triangleWidth / 2}px`;
          corner.style.marginTop = `${-triangleHeight * 2 / 3}px`;
          corner.style.transform = `matrix3d(${matrix.join(",")})`;
        });
      });
    }

    roll(forcedIndex) {
      if (this.rolling) return;
      this.rolling = true;
      this.rollNumber += 1;

      const die = DICE[this.type];
      const rolledResults = Array.from({ length: this.count }, () => {
        const index = Number.isInteger(forcedIndex)
          ? Math.max(0, Math.min(die.faces.length - 1, forcedIndex))
          : secureRandom(die.faces.length);
        return {
          index,
          name: die.names[index],
          type: this.type === "animal" ? "animal" : die.faces[index],
          rotation: ROTATIONS[index],
        };
      });
      const fullTurns = this.rollNumber * 1080;

      this.countButtons.forEach((button) => { button.disabled = true; });
      this.typeButtons.forEach((button) => { button.disabled = true; });
      this.button.disabled = true;
      this.button.textContent = "Rolling…";
      this.result.textContent = "The dice are rolling…";

      rolledResults.forEach((rolled, index) => {
        const cube = this.cubes[index];
        cube.classList.remove("is-rolling");
        void cube.offsetWidth;
        cube.classList.add("is-rolling");
        cube.style.transform =
          `rotateZ(${fullTurns + rolled.rotation[2]}deg) ` +
          `rotateX(${fullTurns + rolled.rotation[0]}deg) ` +
          `rotateY(${fullTurns + rolled.rotation[1]}deg)`;
      });

      const finish = () => {
        this.cubes.slice(0, this.count).forEach((cube) => cube.classList.remove("is-rolling"));
        this.result.textContent = `Rolled: ${rolledResults.map(({ name }) => name).join(", ")}`;
        this.button.textContent = "Roll Again";
        this.button.disabled = false;
        this.countButtons.forEach((button) => { button.disabled = false; });
        this.typeButtons.forEach((button) => { button.disabled = false; });
        this.rolling = false;
        this.burst(rolledResults.map(({ type }) => type));
        this.root.dispatchEvent(new CustomEvent("stardew-dice:result", {
          bubbles: true,
          detail: { diceType: this.type, count: this.count, results: rolledResults },
        }));
      };

      setTimeout(finish,
        matchMedia("(prefers-reduced-motion: reduce)").matches ? 30 : 3630);
      return rolledResults.map(({ index }) => index);
    }

    burst(types) {
      const count = 10 + types.length * 5;
      this.particleLayer.replaceChildren();

      for (let index = 0; index < count; index += 1) {
        const type = types[index % types.length];
        const colors = PARTICLES[type];
        const particle = document.createElement("i");
        const angle = (Math.PI * 2 * index) / count + Math.random() * 0.35;
        const distance = 55 + Math.random() * 90;
        particle.className = "stardew-dice__particle";
        particle.style.setProperty("--particle-color", colors[index % colors.length]);
        particle.style.setProperty("--particle-size", `${5 + Math.random() * 7}px`);
        particle.style.setProperty("--particle-x", `${Math.cos(angle) * distance}px`);
        particle.style.setProperty("--particle-y", `${Math.sin(angle) * distance}px`);
        particle.style.setProperty("--particle-rotation", `${Math.random() * 540 - 270}deg`);
        particle.style.setProperty("--particle-radius",
          type === "heart" ? "45% 45% 55% 55%" : type === "junimo" ? "80% 10% 80% 10%" : "20%");
        this.particleLayer.append(particle);
      }
      setTimeout(() => this.particleLayer.replaceChildren(), 760);
    }
  }

  document.querySelectorAll("[data-stardew-dice]").forEach((root) => {
    root.stardewDiceRoller = new StardewDiceRoller(root);
  });

  globalThis.StardewDiceRoller = StardewDiceRoller;
})();
