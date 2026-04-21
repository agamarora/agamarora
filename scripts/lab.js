/**
 * Lab.js - Simplified functionality for the Lab page.
 * Removed any theme toggle references which were not required.
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // Fade-in all featured projects on the lab page.
  const projectFeatures = document.querySelectorAll('.project-feature');
  projectFeatures.forEach((el, i) => {
    setTimeout(() => el.classList.add('loaded'), 300 + i * 120);
  });
  
  // Video functionality.
  const video = document.querySelector('.project-media video');
  if (video) {
    video.preload = 'metadata';
    video.addEventListener('click', function() {
      this.paused ? this.play() : this.pause();
    });
  }
});