/**
 * Maverick Business Academy
 * Main — App Bootstrap / Lenis Smooth Scroll
 * 
 * Responsibilities:
 *  - Lenis smooth scroll setup
 *  - GSAP ScrollTrigger connection
 *  - Loading state management
 *  - Global utilities
 */

(function() {
  'use strict';

  // =========================================================
  // LENIS SMOOTH SCROLL SETUP
  // =========================================================

  let lenis = null;

  // Global flag for reliable event handling
  window.__lenisReady = false;

  function initLenis() {
    try {
      // Bail if Lenis is not loaded
      if (typeof Lenis === 'undefined') {
        console.error('Lenis library not loaded');
        window.__lenisReady = true;
        document.dispatchEvent(new CustomEvent('lenisReady'));
        return;
      }

      // Initialize Lenis
      lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2
      });

      // Connect Lenis to GSAP ScrollTrigger
      // Without this, ScrollTrigger fires at wrong positions
      if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
      } else {
        // Fallback RAF loop if GSAP isn't present
        function raf(time) {
          lenis.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }

      // Make Lenis globally available for other scripts
      window.lenisInstance = lenis;

      console.log('Maverick — Lenis Smooth Scroll Initialized');

      // Set global flag and dispatch event
      window.__lenisReady = true;
      document.dispatchEvent(new CustomEvent('lenisReady'));
    } catch (err) {
      console.error('Lenis init failed:', err);
      window.__lenisReady = true;
      document.dispatchEvent(new CustomEvent('lenisReady'));
    }
  }

  // =========================================================
  // LOADING STATE
  // =========================================================

  function initLoadingState() {
    // Remove is-loading class from body
    // This triggers the CSS eyebrow line animation
    // and allows hero entrance animations to run
    function removeLoadingClass() {
      document.body.classList.remove('is-loading');
    }

    if (document.readyState === 'complete') {
      // Page already loaded
      removeLoadingClass();
    } else {
      window.addEventListener('load', removeLoadingClass);
    }
  }

  // =========================================================
  // GLOBAL UTILITIES
  // =========================================================

  // Smooth scroll to anchor helper
  // Uses Lenis if available, falls back to GSAP ScrollTo, then native
  window.maverickScrollTo = function(target, options = {}) {
    const offset = options.offset || 0;
    const duration = options.duration || 1.2;

    // Try Lenis first
    if (lenis) {
      lenis.scrollTo(target, {
        offset: offset,
        duration: duration
      });
      return;
    }

    // Try GSAP ScrollTo
    if (typeof gsap !== 'undefined' && gsap.plugins && gsap.plugins.scrollTo) {
      gsap.to(window, {
        duration: duration,
        scrollTo: {
          y: target,
          offsetY: -offset
        },
        ease: 'power3.inOut'
      });
      return;
    }

    // Native fallback
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  // Anchor link smooth scroll (progressive enhancement)
  function initAnchorScrolling() {
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const hash = link.getAttribute('href');
      if (hash === '#' || hash.length < 2) return;

      const targetEl = document.querySelector(hash);
      if (!targetEl) return;

      e.preventDefault();
      window.maverickScrollTo(targetEl, { offset: 90 });
    });
  }

  function initFAQAccordion() {

    const items = document.querySelectorAll(".faq__item");

    if (!items.length) return;

    items.forEach(item => {

      const button = item.querySelector(".faq__question");

      button.addEventListener("click", () => {

        const isActive = item.classList.contains("active");

        items.forEach(faq => {
          faq.classList.remove("active");
        });

        if (!isActive) {
          item.classList.add("active");
        }

      });

    });

  }
  // =========================================================
  // INITIALIZE
  // =========================================================

  function init() {
    // Lenis must initialize before ScrollTrigger-dependent scripts
    initLenis();

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }

    document.dispatchEvent(new CustomEvent('lenisReady'));

    initLoadingState();
    initAnchorScrolling();
    initFAQAccordion();

    console.log('Maverick Homepage Initialized');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

(function () {
  'use strict';

  const scrollToTopBtn = document.getElementById('scroll-to-top');
  const whatsappBtn = document.getElementById('whatsapp-float');

  if (scrollToTopBtn) {
    const toggleVisibility = () => {
      const shouldShow = window.scrollY > Math.max(window.innerHeight * 0.8, 800);
      scrollToTopBtn.classList.toggle('is-visible', shouldShow);
    };

    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility, { passive: true });

    scrollToTopBtn.addEventListener('click', (event) => {
      event.preventDefault();
      if (window.lenisInstance) {
        window.lenisInstance.scrollTo(0, { duration: 1.2 });
      } else if (window.gsap && window.gsap.to) {
        window.gsap.to(window, { duration: 1.2, scrollTo: 0, ease: 'power3.inOut' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  if (whatsappBtn) {
    const phone = '971500000000';
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    whatsappBtn.setAttribute('href', isMobile ? `https://wa.me/${phone}` : `https://web.whatsapp.com/send?phone=${phone}`);
  }
})();
