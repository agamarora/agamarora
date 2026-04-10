// utils.js

// --- Constants (export if reused across files) ---
export const greetings = [
  "Hello",        // English
  "Hola",         // Spanish
  "Bonjour",      // French
  "नमस्ते",        // Hindi
  "こんにちは",      // Japanese
  "안녕하세요",       // Korean
  "Shalom",       // Hebrew
];

export const imagining = [
  "imagine",   // 10 chars + 1 space
  "design",   // 11 chars
  "dream",   // 11 chars
  "tinker",   // 11 chars
  "break",   // 11 chars
  "create",   // 11 chars
  "innovate",
  "fail",
];




// --- Logos switching ---
export function swapLogosForTheme(theme) {
  document.querySelectorAll('.logo').forEach(img => {
    const newSrc = theme === 'dark' ? img.dataset.dark : img.dataset.light;
    if (newSrc && img.src !== newSrc) {
      img.src = newSrc;
    }
  });
}


// --- Theme Toggle Logic ---
export function setupThemeToggle() {
  const themeToggle = document.querySelector(".theme-toggle");
  if (!themeToggle) return;

  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-theme");
    localStorage.setItem("theme", isDark ? "dark" : "light");

    themeToggle.title = isDark ? "Toggle Light Mode" : "Toggle Dark Mode";

    const srText = themeToggle.querySelector(".theme-toggle-sr");
    if (srText) {
      srText.textContent = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";
    }

    swapLogosForTheme(isDark ? "dark" : "light");


  });
}

// --- Typewriter (Single Run) ---
export function typeLetter(text, elementId, speed = 69) {
  let index = 0;

  function type() {
    const typewriterElement = document.getElementById(elementId);
    if (!typewriterElement) return;

    if (index < text.length) {
      typewriterElement.textContent += text.charAt(index);
      index++;
      setTimeout(type, speed);
    }
  }

  type();
}

// --- Typewriter Loop with Delete ---
export function typeAndDeleteLoop(words, elementId, typeSpeed = 100, deleteSpeed = 50, delayBetween = 1000) {
  const element = document.getElementById(elementId);
  if (!element) return;

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeLoop() {
    const currentWord = words[wordIndex];
    const visibleText = currentWord.substring(0, charIndex);
    element.textContent = visibleText;

    if (isDeleting) {
      if (charIndex > 0) {
        charIndex--;
        setTimeout(typeLoop, deleteSpeed);
      } else {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(typeLoop, typeSpeed);
      }
    } else {
      if (charIndex < currentWord.length) {
        charIndex++;
        setTimeout(typeLoop, typeSpeed);
      } else {
        isDeleting = true;
        setTimeout(typeLoop, delayBetween);
      }
    }
  }

  typeLoop();
}

// --- Scramble to Words ---
export function scrambleToWords(words, elementId, speed = 50, pause = 1500) {
  const element = document.getElementById(elementId);
  if (!element) return;

  let current = 0;
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const maxLength = Math.max(...words.map(w => w.length));
  const paddedWords = words.map(w => w.padEnd(maxLength, " "));

  function scrambleAndReveal(from, to, onComplete) {
    let iterations = 0;
    const totalIterations = 10;

    const interval = setInterval(() => {
      let result = "";

      for (let i = 0; i < to.length; i++) {
        if (iterations < totalIterations) {
          const shouldShowTarget = Math.random() < iterations / totalIterations;
          result += shouldShowTarget ? to[i] : chars.charAt(Math.floor(Math.random() * chars.length));
        } else {
          result += to[i];
        }
      }

      element.textContent = result;

      if (iterations++ >= totalIterations) {
        clearInterval(interval);
        onComplete();
      }
    }, speed);
  }

  function next() {
    const from = paddedWords[current];
    current = (current + 1) % paddedWords.length;
    const to = paddedWords[current];

    scrambleAndReveal(from, to, () => {
      setTimeout(next, pause);
    });
  }

  element.textContent = paddedWords[0];
  setTimeout(next, pause);
}


// Scramble and Lock at a Word
export function scrambleToWordsLockFinal(words, elementId, finalWord = "", speed = 50, pause = 1500) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const maxLength = Math.max(...words.map(w => w.length));
  const paddedWords = words.map(w => w.padEnd(maxLength, " "));
  const paddedFinal = finalWord.padEnd(maxLength, " ");
  let current = 0;

  function scrambleAndReveal(from, to, onComplete) {
    let iterations = 0;
    const totalIterations = 10;

    const interval = setInterval(() => {
      let result = "";

      for (let i = 0; i < to.length; i++) {
        if (iterations < totalIterations) {
          const shouldShowTarget = Math.random() < iterations / totalIterations;
          result += shouldShowTarget ? to[i] : chars.charAt(Math.floor(Math.random() * chars.length));
        } else {
          result += to[i];
        }
      }

      element.textContent = result;

      if (iterations++ >= totalIterations) {
        clearInterval(interval);
        onComplete();
      }
    }, speed);
  }

  function next() {
    if (current < paddedWords.length) {
      const from = paddedWords[current];
      const to = paddedWords[current + 1] || paddedFinal;

      current++;
      scrambleAndReveal(from, to, () => {
        if (current < paddedWords.length) {
          setTimeout(next, pause);
        }
      });
    } else {
      // Final scramble to lock-in word
      scrambleAndReveal(paddedWords[paddedWords.length - 1], paddedFinal, () => {
        element.textContent = paddedFinal;
        element.classList.add("locked");
      });
    }
  }

  element.textContent = paddedWords[0];
  setTimeout(next, pause);
}


// Scroll to Element (inside explore-wrapper) with easing + scroll snap fix

export function scrollToElement(element, duration = 1000) {
  const wrapper = document.querySelector('.explore-wrapper');
  if (!wrapper || !element) return;

  const start = wrapper.scrollTop;
  const end = element.offsetTop - wrapper.offsetTop;
  const distance = end - start;
  const startTime = performance.now();

  // Disable snap
  const prevSnap = wrapper.style.scrollSnapType;
  wrapper.style.scrollSnapType = 'none';

  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);

    wrapper.scrollTop = start + distance * eased;

    if (elapsed < duration) {
      requestAnimationFrame(step);
    } else {
      // Re-enable snapping after scroll finishes
      wrapper.style.scrollSnapType = prevSnap || 'y mandatory';
    }
  }

  requestAnimationFrame(step);
}
