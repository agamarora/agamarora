// main.js

import {
  typeLetter,
  typeAndDeleteLoop,
  scrambleToWords,
  setupThemeToggle,
  scrambleToWordsLockFinal,
  greetings,
  imagining,
  swapLogosForTheme
} from './utils.js';

// Make key utilities available globally
window.setupThemeToggle = setupThemeToggle;
window.swapLogosForTheme = swapLogosForTheme;

// --- Detect and apply saved or preferred theme immediately ---
const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const isDark = savedTheme === "dark" || (!savedTheme && prefersDark);

// ✅ Apply theme class
document.body.classList.toggle("dark-theme", isDark);

// ✅ NEW: Immediately set the right logos
swapLogosForTheme(isDark ? "dark" : "light");



// --- Initialize everything after DOM loads ---
document.addEventListener("DOMContentLoaded", () => {
  typeLetter("......", "landing-typewriter", 690);
  typeAndDeleteLoop(greetings, "greeting", 150, 50, 1500);
  typeAndDeleteLoop(imagining, "imagining", 150, 50, 1500);
  setupThemeToggle();

  const heroScramble = document.getElementById("hero-scramble");
  if (heroScramble) {
    const rawWords = [
      "modular",
      "scalable",
      "valuable",
      "efficient",
    ];

    const maxLength = Math.max(...rawWords.map(w => w.length));

    // Helper to pad with equal left and right spacing
    const centerPad = (word, length) => {
      const totalPadding = length - word.length;
      const padStart = Math.floor(totalPadding / 2);
      const padEnd = totalPadding - padStart;
      return " ".repeat(padStart) + word + " ".repeat(padEnd);
    };

    const paddedWords = rawWords.map(word => centerPad(word, maxLength));
    const paddedFinal = centerPad("impactful", maxLength);


    scrambleToWordsLockFinal(paddedWords, "hero-scramble", paddedFinal, 100, 1500);
  }



  function initializeScrambleEffect(words, finalWord, elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      const maxLength = Math.max(...words.map(w => w.length));

      // Helper to pad with equal left and right spacing
      const centerPad = (word, length) => {
        const totalPadding = length - word.length;
        const padStart = Math.floor(totalPadding / 2);
        const padEnd = totalPadding - padStart;
        return " ".repeat(padStart) + word + " ".repeat(padEnd);
      };

      const paddedWords = words.map(word => centerPad(word, maxLength));
      const paddedFinal = centerPad(finalWord, maxLength);

      scrambleToWordsLockFinal(paddedWords, elementId, paddedFinal, 100, 1500);
    }
  }


  // Example usage
  initializeScrambleEffect(
    imagining,
    "build",
    "imagining-scramble"
  );
});
