document.addEventListener('DOMContentLoaded', function () {
    const logob = document.querySelector('.logob');

    window.addEventListener('scroll', function () {
      // Get the scroll position
      const scrollPosition = window.scrollY;

      // Set the threshold for when the animation should start
      const threshold = 100;

      // Check if the scroll position is beyond the threshold
      if (scrollPosition > threshold) {
        logob.classList.add('slide-left');
      } else {
        logob.classList.remove('slide-left');
      }
    });
  });