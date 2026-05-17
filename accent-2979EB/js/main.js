/* ============================================================
   CCN London — Main JavaScript
   Nav, mobile menu, Intersection Observer, accordion, team filter
   ============================================================ */

(() => {
  'use strict';

  // ── Navbar scroll shadow ──
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('navbar--scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Mobile menu ──
  const hamburger = document.querySelector('.navbar__hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.mobile-menu__overlay');

  const toggleMenu = (open) => {
    const isOpen = typeof open === 'boolean' ? open : !mobileMenu.classList.contains('mobile-menu--open');

    mobileMenu.classList.toggle('mobile-menu--open', isOpen);
    overlay.classList.toggle('mobile-menu__overlay--visible', isOpen);
    hamburger.classList.toggle('navbar__hamburger--open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  if (hamburger) {
    hamburger.addEventListener('click', () => toggleMenu());
  }

  if (overlay) {
    overlay.addEventListener('click', () => toggleMenu(false));
  }

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu?.classList.contains('mobile-menu--open')) {
      toggleMenu(false);
      hamburger?.focus();
    }
  });

  // ── Intersection Observer for .reveal elements ──
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: show all immediately
    revealElements.forEach((el) => el.classList.add('reveal--visible'));
  }

  // ── Accordion (FAQ) ──
  const accordionTriggers = document.querySelectorAll('.accordion__trigger');

  accordionTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion__item');
      const isOpen = item.classList.contains('accordion__item--open');

      // Close all
      document.querySelectorAll('.accordion__item--open').forEach((openItem) => {
        openItem.classList.remove('accordion__item--open');
        openItem.querySelector('.accordion__trigger')?.setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked
      if (!isOpen) {
        item.classList.add('accordion__item--open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ── Team Filter ──
  const filterBtns = document.querySelectorAll('.team__filter-btn');
  const teamCards = document.querySelectorAll('.team-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active state
      filterBtns.forEach((b) => {
        b.classList.remove('team__filter-btn--active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('team__filter-btn--active');
      btn.setAttribute('aria-selected', 'true');

      // Filter cards
      teamCards.forEach((card) => {
        if (filter === 'all' || card.dataset.role === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();
