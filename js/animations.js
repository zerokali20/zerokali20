/* animations.js — Scroll-triggered entrance animations via IntersectionObserver */
(function () {
  const IO_OPTIONS = { threshold: 0.12, rootMargin: '0px 0px -60px 0px' };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, IO_OPTIONS);

  /* Observe direct animation targets */
  document.querySelectorAll(
    '.anim-up, .anim-left, .anim-right, .anim-scale, .anim-fade'
  ).forEach(el => observer.observe(el));

  /* Stagger groups — animate each child with progressive delay */
  document.querySelectorAll('[data-stagger]').forEach(container => {
    Array.from(container.children).forEach((child, i) => {
      child.classList.add('anim-up');
      child.style.transitionDelay = `${i * 0.09}s`;
      observer.observe(child);
    });
  });

  /* Section labels — fast fade in */
  document.querySelectorAll('.section-label').forEach(el => {
    el.classList.add('anim-up');
    observer.observe(el);
  });
})();
