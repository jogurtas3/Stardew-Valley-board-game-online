(() => {
  const RESULTS = [
    { name: "Stardrop", type: "stardrop", rotation: [0, 0, 0] },
    { name: "Širdis", type: "heart", rotation: [0, 180, 0] },
    { name: "Širdis", type: "heart", rotation: [0, -90, 0] },
    { name: "Širdis", type: "heart", rotation: [0, 90, 0] },
    { name: "Junimo", type: "junimo", rotation: [-90, 0, 0] },
    { name: "Junimo", type: "junimo", rotation: [90, 0, 180] }
  ];

  const PARTICLES = {
    heart: ["#ff3045", "#ff7d8a", "#ffd0d4"],
    junimo: ["#4fbd3b", "#9be34f", "#245e32"],
    stardrop: ["#8148d8", "#d07be8", "#f3d36a"]
  };

  function secureRandom(max) {
    if (globalThis.crypto?.getRandomValues) {
      const values = new Uint32Array(1);
      const limit = Math.floor(0x100000000 / max) * max;
      do globalThis.crypto.getRandomValues(values); while (values[0] >= limit);
      return values[0] % max;
    }
    return Math.floor(Math.random() * max);
  }

  class StardewDiceRoller {
    constructor(root) {
      this.root = root;
      this.cube = root.querySelector(".stardew-dice__cube");
      this.button = root.querySelector(".stardew-dice__button");
      this.result = root.querySelector(".stardew-dice__result");
      this.particleLayer = root.querySelector(".stardew-dice__particles");
      // Virtualus ankstesnis ridenimas užtikrina vienodą pirmo ir vėlesnių metimų animaciją.
      this.rollNumber = 1;
      this.rolling = false;
      this.cube.style.transition = "none";
      this.cube.style.transform = "rotateZ(1080deg) rotateX(1067deg) rotateY(1104deg)";
      void this.cube.offsetWidth;
      this.cube.style.removeProperty("transition");
      this.button.addEventListener("click", () => this.roll());
      this.cube.querySelectorAll(".stardew-dice__corner").forEach((corner) => {
        ["top", "left", "right"].forEach((position) => {
          const detail = document.createElement("b");
          detail.className = `stardew-dice__corner-detail stardew-dice__corner-detail--${position}`;
          detail.setAttribute("aria-hidden", "true");
          corner.append(detail);
        });
      });
      this.updateChamferedCorners();

      if (globalThis.ResizeObserver) {
        this.cornerObserver = new ResizeObserver(() => this.updateChamferedCorners());
        this.cornerObserver.observe(this.cube);
      } else {
        globalThis.addEventListener("resize", () => this.updateChamferedCorners());
      }
    }

    updateChamferedCorners() {
      const size = this.cube.offsetWidth;
      const half = size / 2;
      const cut = size * 0.20;
      const triangleWidth = cut * Math.SQRT2;
      const triangleHeight = cut * Math.sqrt(1.5);

      this.cube.querySelectorAll(".stardew-dice__corner").forEach((corner) => {
        const [sx, sy, sz] = corner.dataset.corner.split(",").map(Number);
        const p1 = [sx * (half - cut), sy * half, sz * half];
        const p2 = [sx * half, sy * (half - cut), sz * half];
        const p3 = [sx * half, sy * half, sz * (half - cut)];
        const u = p3.map((value, axis) => (value - p2[axis]) / triangleWidth);
        const p1MinusP2 = p1.map((value, axis) => value - p2[axis]);
        const v = u.map((value, axis) => (value * triangleWidth / 2 - p1MinusP2[axis]) / triangleHeight);
        const center = p1.map((value, axis) => (value + p2[axis] + p3[axis]) / 3);
        const length = Math.hypot(...center);
        const normal = center.map((value) => value / length);
        const matrix = [
          u[0], u[1], u[2], 0,
          v[0], v[1], v[2], 0,
          normal[0], normal[1], normal[2], 0,
          center[0], center[1], center[2], 1
        ].map((value) => Math.abs(value) < 1e-8 ? 0 : Number(value.toFixed(6)));

        corner.style.width = `${triangleWidth}px`;
        corner.style.height = `${triangleHeight}px`;
        corner.style.marginLeft = `${-triangleWidth / 2}px`;
        corner.style.marginTop = `${-triangleHeight * 2 / 3}px`;
        corner.style.transform = `matrix3d(${matrix.join(",")})`;
      });
    }

    roll(forcedIndex) {
      if (this.rolling) return;
      this.rolling = true;
      this.rollNumber += 1;

      const index = Number.isInteger(forcedIndex)
        ? Math.max(0, Math.min(RESULTS.length - 1, forcedIndex))
        : secureRandom(RESULTS.length);
      const rolled = RESULTS[index];
      const fullTurns = this.rollNumber * 1080;

      this.button.disabled = true;
      this.button.textContent = "Ridenama…";
      this.result.textContent = "Kauliukas rieda…";
      this.cube.classList.remove("is-rolling");
      void this.cube.offsetWidth;
      this.cube.classList.add("is-rolling");
      this.cube.style.transform = `rotateZ(${fullTurns + rolled.rotation[2]}deg) rotateX(${fullTurns + rolled.rotation[0]}deg) rotateY(${fullTurns + rolled.rotation[1]}deg)`;

      const finish = () => {
        this.cube.classList.remove("is-rolling");
        this.result.textContent = `Išridenai: ${rolled.name}`;
        this.button.textContent = "Ridenti dar kartą";
        this.button.disabled = false;
        this.rolling = false;
        this.burst(rolled.type);
        this.root.dispatchEvent(new CustomEvent("stardew-dice:result", {
          bubbles: true,
          detail: { index, name: rolled.name, type: rolled.type }
        }));
      };

      if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setTimeout(finish, 30);
      } else {
        setTimeout(finish, 3630);
      }

      return index;
    }

    burst(type) {
      const colors = PARTICLES[type];
      const count = type === "stardrop" ? 22 : 15;
      this.particleLayer.replaceChildren();

      for (let i = 0; i < count; i += 1) {
        const particle = document.createElement("i");
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.35;
        const distance = 75 + Math.random() * 105;
        particle.className = "stardew-dice__particle";
        particle.style.setProperty("--particle-color", colors[i % colors.length]);
        particle.style.setProperty("--particle-size", `${6 + Math.random() * 9}px`);
        particle.style.setProperty("--particle-x", `${Math.cos(angle) * distance}px`);
        particle.style.setProperty("--particle-y", `${Math.sin(angle) * distance}px`);
        particle.style.setProperty("--particle-rotation", `${Math.random() * 540 - 270}deg`);
        particle.style.setProperty("--particle-radius", type === "heart" ? "45% 45% 55% 55%" : type === "junimo" ? "80% 10% 80% 10%" : "20%");
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
