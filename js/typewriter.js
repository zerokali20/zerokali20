/* typewriter.js — Cyclic typewriter effect */
(function () {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  const STRINGS = [
    'Computer Engineering Student',
    'AI & ML Enthusiast',
    'Full-Stack Developer',
    'Cybersecurity Explorer',
    'Robotics Builder',
  ];

  let sIdx = 0;
  let cIdx = 0;
  let deleting = false;

  function tick() {
    const current = STRINGS[sIdx];

    if (!deleting && cIdx <= current.length) {
      el.textContent = current.substring(0, cIdx++);
      setTimeout(tick, 80);
    } else if (!deleting && cIdx > current.length) {
      deleting = true;
      setTimeout(tick, 2200);
    } else if (deleting && cIdx > 0) {
      el.textContent = current.substring(0, --cIdx);
      setTimeout(tick, 38);
    } else {
      deleting = false;
      sIdx = (sIdx + 1) % STRINGS.length;
      setTimeout(tick, 220);
    }
  }

  setTimeout(tick, 900);
})();
