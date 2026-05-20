/* ============================================================
   CCN London — Animated Count-Up
   Triggered by Intersection Observer at 50% visibility
   ============================================================ */

(() => {
  'use strict';

  const counters = document.querySelectorAll('.stats__number:not(.stats__number--static)');
  if (counters.length === 0) return;

  const duration = 2000; // ms

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOut(progress) * target);

      el.textContent = value + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => observer.observe(counter));
  } else {
    // Fallback: animate immediately
    counters.forEach(animateCounter);
  }
})();
