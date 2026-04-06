/**
 * Lab.js - Simplified functionality for the Lab page.
 * Removed any theme toggle references which were not required.
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // Animation for featured project element.
  const projectFeature = document.getElementById('vapi-project');
  if (projectFeature) {
    setTimeout(() => {
      projectFeature.classList.add('loaded');
    }, 300);
  }
  
  // Video functionality.
  const video = document.querySelector('.project-media video');
  if (video) {
    video.preload = 'metadata';
    video.addEventListener('click', function() {
      this.paused ? this.play() : this.pause();
    });
  }
});