/**
 * Performance Detailing Mobile Services
 * Main JavaScript
 */

(function () {
  'use strict';

  /* =========================================================
     NAVBAR — scroll effect + active link highlighting
  ========================================================= */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // run on load

  // Highlight active nav link based on scroll position
  const sections = document.querySelectorAll('section[id], .hero[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function setActiveLink() {
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* =========================================================
     MOBILE MENU — hamburger toggle
  ========================================================= */
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');

  function toggleMenu(open) {
    const isOpen = typeof open === 'boolean' ? open : !hamburger.classList.contains('open');
    hamburger.classList.toggle('open', isOpen);
    navLinksContainer.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  hamburger.addEventListener('click', () => toggleMenu());

  // Close menu when a link is clicked
  navLinksContainer.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) {
      toggleMenu(false);
      hamburger.focus();
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (
      hamburger.classList.contains('open') &&
      !hamburger.contains(e.target) &&
      !navLinksContainer.contains(e.target)
    ) {
      toggleMenu(false);
    }
  });

  /* =========================================================
     SCROLL REVEAL — animate elements as they enter viewport
  ========================================================= */
  function initScrollReveal() {
    const targets = document.querySelectorAll(
      '.service-card, .review-card, .step, .about-content, .about-img-wrap, ' +
      '.contact-form, .contact-info, .trust-item, .section-header'
    );

    targets.forEach((el, i) => {
      el.classList.add('reveal');
      // Stagger cards within their grid
      if (el.classList.contains('service-card') || el.classList.contains('review-card')) {
        const siblings = el.parentElement.querySelectorAll('.service-card, .review-card');
        const index = Array.from(siblings).indexOf(el);
        if (index > 0 && index <= 4) {
          el.classList.add('reveal-delay-' + index);
        }
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
  }

  // Respect prefers-reduced-motion
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    initScrollReveal();
  }

  /* =========================================================
     CONTACT FORM — validation + simulated submission
  ========================================================= */
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Clear previous errors
      form.querySelectorAll('.error').forEach((el) => el.classList.remove('error'));

      // Validate required fields
      const required = form.querySelectorAll('[required]');
      required.forEach((field) => {
        const value = field.value.trim();
        if (!value) {
          field.classList.add('error');
          valid = false;
        }
      });

      // Validate email format
      const emailField = form.querySelector('#email');
      if (emailField && emailField.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value.trim())) {
          emailField.classList.add('error');
          valid = false;
        }
      }

      // Validate phone (basic)
      const phoneField = form.querySelector('#phone');
      if (phoneField && phoneField.value.trim()) {
        const cleaned = phoneField.value.replace(/\D/g, '');
        if (cleaned.length < 10) {
          phoneField.classList.add('error');
          valid = false;
        }
      }

      if (!valid) {
        // Focus first error
        const firstError = form.querySelector('.error');
        if (firstError) firstError.focus();
        return;
      }

      // Simulate submission (no backend)
      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      setTimeout(() => {
        form.querySelectorAll('input, select, textarea').forEach((field) => {
          field.value = '';
        });
        formSuccess.hidden = false;
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send My Quote Request';
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 1000);
    });

    // Remove error class on input
    form.querySelectorAll('input, select, textarea').forEach((field) => {
      field.addEventListener('input', () => field.classList.remove('error'));
    });
  }

  /* =========================================================
     SMOOTH SCROLL — for browsers that don't support CSS scroll-behavior
  ========================================================= */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* =========================================================
     FAB — hide when contact section is visible on desktop
  ========================================================= */
  const fabCall = document.querySelector('.fab-call');
  const contactSection = document.getElementById('contact');

  if (fabCall && contactSection) {
    const fabObserver = new IntersectionObserver(
      ([entry]) => {
        fabCall.style.opacity = entry.isIntersecting ? '0' : '1';
        fabCall.style.pointerEvents = entry.isIntersecting ? 'none' : '';
      },
      { threshold: 0.3 }
    );
    fabObserver.observe(contactSection);
  }

  /* =========================================================
     PHONE NUMBER FORMATTING
  ========================================================= */
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let digits = e.target.value.replace(/\D/g, '').substring(0, 10);
      let formatted = '';
      if (digits.length > 0) formatted = '(' + digits.substring(0, 3);
      if (digits.length >= 4) formatted += ') ' + digits.substring(3, 6);
      if (digits.length >= 7) formatted += '-' + digits.substring(6, 10);
      e.target.value = formatted;
    });
  }

})();
