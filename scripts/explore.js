import { scrollToElement } from './utils.js';


document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.explore-wrapper');
  const sections = wrapper.querySelectorAll('section');
  const buttons = wrapper.querySelectorAll('.scroll-down button');

  buttons.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      // If we're on the last button, loop to top
      const next = sections[idx + 1] || sections[0];
      scrollToElement(next, 1200);
    });
  });
});
