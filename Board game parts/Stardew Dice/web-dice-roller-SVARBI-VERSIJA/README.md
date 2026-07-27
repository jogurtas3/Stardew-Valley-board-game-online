# Stardew kauliuko ridenimo komponentas

Komponentas naudoja CSS 3D kubą ir tikrų kauliuko nuotraukų simbolius, o ne taškus.

Kauliuko sienos:

- 3 širdys;
- 2 „Junimo“;
- 1 „Stardrop“.

## Failai

- `index.html` – demonstracija ir komponento HTML;
- `dice-roller.css` – išvaizda, 3D animacija ir prisitaikymas telefonams;
- `dice-roller.js` – saugus atsitiktinis rezultatas, animacija ir dalelės.

## Įdėjimas į svetainę

1. Iš `index.html` nukopijuok visą `<main class="stardew-dice" ...>` bloką.
2. Prie svetainės `<head>` prijunk:

```html
<link rel="stylesheet" href="dice-roller.css">
```

3. Prieš uždarant `</body>` prijunk:

```html
<script src="dice-roller.js"></script>
```

## Rezultato panaudojimas žaidime

Komponentas po kiekvieno metimo išsiunčia `stardew-dice:result` įvykį:

```js
document.addEventListener("stardew-dice:result", (event) => {
  console.log(event.detail);
  // { index: 0–5, name: "Širdis", type: "heart" }
});
```

Programiškai ridenti galima taip:

```js
const dice = document.querySelector("[data-stardew-dice]");
dice.stardewDiceRoller.roll();
```

Testuojant konkrečią sieną galima perduoti indeksą nuo 0 iki 5:

```js
dice.stardewDiceRoller.roll(5); // Stardrop
```

## Simbolių keitimas

Kauliuko sienoms naudojami iš originalių nuotraukų paruošti failai:

- `assets/heart-side-3.png` – iš `Heart side 3.jpg`;
- `assets/junimo-side-1.png` – iš `Junimo side 1.jpg`;
- `assets/stardrop-side.png` – iš `Stardrop side.jpg`.

Nuotraukų adresai nustatyti `index.html`, o rezultatų pavadinimai ir sienų pasiskirstymas – `dice-roller.js` masyve `RESULTS`.


## Išsaugota versija

Tai svarbi, atskirai išsaugota kauliuko versija.
