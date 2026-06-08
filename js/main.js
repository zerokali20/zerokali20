/* main.js — Navbar, mobile menu, smooth scroll, active section, contact form */
(function () {
  'use strict';

  /* ── Elements ─────────────────────────────────────── */
  const navbar      = document.getElementById('navbar');
  const menuBtn     = document.getElementById('mobile-menu-btn');
  const drawer      = document.getElementById('mobile-drawer');
  const overlay     = document.getElementById('mobile-overlay');
  const closeBtn    = document.getElementById('mobile-close-btn');
  const navLinks    = document.querySelectorAll('[data-nav]');
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  const SECTIONS = ['about', 'projects', 'competition', 'qualifications', 'skills', 'contact'];

  /* ── Smooth Scroll ────────────────────────────────── */
  function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const raw = a.getAttribute('href');
      if (raw === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        closeMobile();
        return;
      }
      const id = raw.replace('#', '');
      if (document.getElementById(id)) {
        e.preventDefault();
        closeMobile();
        scrollTo(id);
      }
    });
  });

  /* ── Navbar Scroll + Active Section ──────────────── */
  function updateNavbar() {
    const y = window.scrollY;

    /* Glass navbar after scrolling 20px */
    navbar.classList.toggle('scrolled', y > 20);

    /* Active link detection */
    let active = '';
    for (const id of [...SECTIONS].reverse()) {
      const sec = document.getElementById(id);
      if (sec && y >= sec.offsetTop - 130) { active = id; break; }
    }

    navLinks.forEach(link => {
      const target = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', target === active);
    });
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  /* ── Mobile Drawer ────────────────────────────────── */
  function openMobile() {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMobile() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  menuBtn?.addEventListener('click', openMobile);
  closeBtn?.addEventListener('click', closeMobile);
  overlay?.addEventListener('click', closeMobile);

  /* Close drawer with Escape key */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMobile();
  });

  /* ── Contact Form Simulation ──────────────────────── */
  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      e.preventDefault();

      const btn     = contactForm.querySelector('.submit-btn');
      const txtNode = btn.querySelector('.btn-label');
      const spinner = btn.querySelector('.btn-spinner');

      btn.disabled    = true;
      txtNode.style.display  = 'none';
      spinner.style.display  = 'flex';

      await new Promise(r => setTimeout(r, 1600));

      contactForm.style.display = 'none';
      formSuccess.style.display = 'flex';

      setTimeout(() => {
        contactForm.reset();
        contactForm.style.display = 'flex';
        formSuccess.style.display = 'none';
        btn.disabled   = false;
        txtNode.style.display = 'flex';
        spinner.style.display = 'none';
      }, 5000);
    });
  }

  /* ── Scroll-to-top buttons ────────────────────────── */
  document.querySelectorAll('[data-scroll-top]').forEach(el => {
    el.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  });

  /* ── Project & skill card hover glow ─────────────── */
  document.querySelectorAll('[data-glow-color]').forEach(card => {
    const color = card.getAttribute('data-glow-color');
    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = `0 20px 60px ${color}22, 0 0 0 1px ${color}44`;
      card.style.borderColor = `${color}44`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
      card.style.borderColor = '';
    });
  });

  /* ── Social icon color hover ──────────────────────── */
  document.querySelectorAll('[data-hover-color]').forEach(icon => {
    const color = icon.getAttribute('data-hover-color');
    icon.addEventListener('mouseenter', () => {
      icon.style.color       = color;
      icon.style.borderColor = color + '66';
      icon.style.boxShadow   = `0 0 16px ${color}44`;
    });
    icon.addEventListener('mouseleave', () => {
      icon.style.color       = '';
      icon.style.borderColor = '';
      icon.style.boxShadow   = '';
    });
  });
})();
