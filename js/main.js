/* main.js — Navbar, mobile menu, smooth scroll, active section, contact form */
(function () {
  'use strict';

  /* ── Elements ─────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const menuBtn = document.getElementById('mobile-menu-btn');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('mobile-overlay');
  const closeBtn = document.getElementById('mobile-close-btn');
  const navLinks = document.querySelectorAll('[data-nav]');
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

  /* ── Contact Form — Web3Forms Integration ─────────── */

  // ╔═══════════════════════════════════════════════════╗
  // ║  Paste your Web3Forms Access Key below            ║
  // ║  Get it free at: https://web3forms.com            ║
  // ╚═══════════════════════════════════════════════════╝
  const WEB3FORMS_ACCESS_KEY = '24587553-aecd-4436-9bd6-55a37f76dff1';

  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      e.preventDefault();

      // ── Basic validation ───────────────────────────
      const nameVal = contactForm.querySelector('#contact-name').value.trim();
      const emailVal = contactForm.querySelector('#contact-email').value.trim();
      const messageVal = contactForm.querySelector('#contact-message').value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!nameVal || !emailVal || !messageVal) {
        showFormError('Please fill in all fields before sending.'); return;
      }
      if (!emailRegex.test(emailVal)) {
        showFormError('Please enter a valid email address.'); return;
      }

      // ── Show spinner ───────────────────────────────
      const btn = contactForm.querySelector('.submit-btn');
      const txtNode = btn.querySelector('.btn-label');
      const spinner = btn.querySelector('.btn-spinner');
      btn.disabled = true;
      txtNode.style.display = 'none';
      spinner.style.display = 'flex';
      clearFormError();

      // ── Send via Web3Forms ─────────────────────────
      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY,
            name: nameVal,
            email: emailVal,
            message: messageVal,
            subject: `New Portfolio Message from ${nameVal}`
          })
        });

        const data = await res.json();

        if (data.success) {
          // ✅ Success
          contactForm.style.display = 'none';
          formSuccess.style.display = 'flex';

          setTimeout(() => {
            contactForm.reset();
            contactForm.style.display = 'flex';
            formSuccess.style.display = 'none';
            btn.disabled = false;
            txtNode.style.display = 'flex';
            spinner.style.display = 'none';
          }, 5000);

        } else {
          throw new Error(data.message || 'Submission failed');
        }

      } catch (err) {
        // ❌ Failure — re-enable button, show error
        btn.disabled = false;
        txtNode.style.display = 'flex';
        spinner.style.display = 'none';
        showFormError('Failed to send — please try again or email me directly at bhagikaru2003@gmail.com');
        console.error('Web3Forms error:', err);
      }
    });
  }

  function showFormError(msg) {
    let el = document.getElementById('form-error-msg');
    if (!el) {
      el = document.createElement('p');
      el.id = 'form-error-msg';
      el.style.cssText = 'color:#f87171;font-size:0.85rem;margin-top:-0.5rem;padding:0.6rem 0.8rem;background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.3);border-radius:8px;';
      contactForm.querySelector('.submit-btn').insertAdjacentElement('beforebegin', el);
    }
    el.textContent = msg;
    el.style.display = 'block';
  }

  function clearFormError() {
    const el = document.getElementById('form-error-msg');
    if (el) el.style.display = 'none';
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
      icon.style.color = color;
      icon.style.borderColor = color + '66';
      icon.style.boxShadow = `0 0 16px ${color}44`;
    });
    icon.addEventListener('mouseleave', () => {
      icon.style.color = '';
      icon.style.borderColor = '';
      icon.style.boxShadow = '';
    });
  });

  /* ── Interactive Image Gallery / Carousel ──────────────── */
  document.querySelectorAll('[data-gallery]').forEach(gallery => {
    const slides = gallery.querySelectorAll('.comp-gallery-slide');
    const dots = gallery.querySelectorAll('.gallery-dot');
    const badgeText = gallery.querySelector('.gallery-badge-txt');
    const captionText = gallery.querySelector('.gallery-caption');
    const prevBtn = gallery.querySelector('.gallery-nav-btn.prev');
    const nextBtn = gallery.querySelector('.gallery-nav-btn.next');
    let current = 0;

    function goTo(idx) {
      if (!slides.length) return;
      current = (idx + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('active', i === current));
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
      if (badgeText) badgeText.textContent = `${current + 1}/${slides.length}`;
      if (captionText) {
        const cap = slides[current]?.getAttribute('data-caption') || '';
        captionText.textContent = cap;
      }
    }

    prevBtn?.addEventListener('click', e => {
      e.stopPropagation();
      goTo(current - 1);
    });

    nextBtn?.addEventListener('click', e => {
      e.stopPropagation();
      goTo(current + 1);
    });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', e => {
        e.stopPropagation();
        goTo(i);
      });
    });

    // Clicking anywhere on the gallery swaps to the next image
    gallery.addEventListener('click', () => {
      goTo(current + 1);
    });

    // Mobile swipe support
    let touchStartX = 0;
    gallery.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    gallery.addEventListener('touchend', e => {
      const touchEndX = e.changedTouches[0].screenX;
      if (touchEndX < touchStartX - 40) {
        goTo(current + 1);
      } else if (touchEndX > touchStartX + 40) {
        goTo(current - 1);
      }
    }, { passive: true });
  });

  /* ── Horizontal Timeline Navigation & Scroll/Drag ─────── */
  const timelineEl = document.getElementById('competition-timeline');
  const compSection = document.getElementById('competition');
  const tPrevBtn = document.getElementById('timeline-prev');
  const tNextBtn = document.getElementById('timeline-next');

  if (timelineEl) {
    const scrollAmount = 440;

    function updateNavBtns() {
      const maxScroll = timelineEl.scrollWidth - timelineEl.clientWidth;
      if (tPrevBtn) {
        const atStart = timelineEl.scrollLeft <= 8;
        tPrevBtn.style.opacity = atStart ? '0.4' : '1';
        tPrevBtn.style.pointerEvents = atStart ? 'none' : 'auto';
      }
      if (tNextBtn) {
        const atEnd = timelineEl.scrollLeft >= maxScroll - 8;
        tNextBtn.style.opacity = atEnd ? '0.4' : '1';
        tNextBtn.style.pointerEvents = atEnd ? 'none' : 'auto';
      }
    }

    tPrevBtn?.addEventListener('click', () => {
      timelineEl.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    tNextBtn?.addEventListener('click', () => {
      timelineEl.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    timelineEl.addEventListener('scroll', updateNavBtns, { passive: true });
    window.addEventListener('resize', updateNavBtns, { passive: true });
    updateNavBtns();

    /* ── Translate vertical scroll down/up to horizontal flow ── */
    const trackWrap = compSection?.querySelector('.timeline-track-wrap') || timelineEl;

    trackWrap.addEventListener('wheel', e => {
      // If user is already scrolling horizontally via trackpad or shiftKey, allow default
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) return;

      const maxScroll = timelineEl.scrollWidth - timelineEl.clientWidth;
      if (maxScroll <= 0) return;

      const atStart = timelineEl.scrollLeft <= 8;
      const atEnd = timelineEl.scrollLeft >= maxScroll - 8;

      // Scrolling down and not at end: flow smoothly to the right
      if (e.deltaY > 0 && !atEnd) {
        e.preventDefault();
        const delta = Math.abs(e.deltaY) >= 50 ? 380 : e.deltaY * 1.8;
        timelineEl.scrollBy({ left: delta, behavior: 'smooth' });
      }
      // Scrolling up and not at start: flow smoothly to the left
      else if (e.deltaY < 0 && !atStart) {
        e.preventDefault();
        const delta = Math.abs(e.deltaY) >= 50 ? -380 : e.deltaY * 1.8;
        timelineEl.scrollBy({ left: delta, behavior: 'smooth' });
      }
      // If at end and scrolling down, or at start and scrolling up -> let page scroll normally
    }, { passive: false });

    /* ── Mouse Drag-to-Scroll ───────────────────────────── */
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    let isDragging = false;

    timelineEl.addEventListener('mousedown', e => {
      // Ignore if clicking buttons, links, or photo gallery controls
      if (e.target.closest('button, a, input, textarea, .gallery-nav-btn, .gallery-dot')) return;
      isDown = true;
      isDragging = false;
      startX = e.pageX - timelineEl.offsetLeft;
      scrollStart = timelineEl.scrollLeft;
      timelineEl.style.scrollBehavior = 'auto';
    });

    window.addEventListener('mousemove', e => {
      if (!isDown) return;
      const x = e.pageX - timelineEl.offsetLeft;
      const walk = (x - startX) * 1.4;
      if (Math.abs(walk) > 4) {
        isDragging = true;
        timelineEl.style.cursor = 'grabbing';
      }
      timelineEl.scrollLeft = scrollStart - walk;
    });

    const endDrag = () => {
      if (!isDown) return;
      isDown = false;
      timelineEl.style.cursor = 'grab';
      timelineEl.style.scrollBehavior = 'smooth';
      setTimeout(() => { isDragging = false; }, 50);
    };

    window.addEventListener('mouseup', endDrag);

    // Prevent link clicks if user was actively dragging
    timelineEl.addEventListener('click', e => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  }
})();
