/**
 * Maverick Business Academy
 * Animations â€” Hero Cinematic Entrance + Scroll
 *              Numbers Section Reveal + Counters
 *
 * TYPE 1 â€” ENTRANCE ANIMATIONS
 *   Choreographed GSAP timeline, runs once on page load
 *
 * TYPE 2 â€” SCROLL ANIMATIONS
 *   ScrollTrigger-driven parallax / fade-outs / reveals
 */

(function () {
  "use strict";

  // Register GSAP plugins
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  } else {
    console.warn("Animations: GSAP or ScrollTrigger not loaded.");
    return;
  }

  // =========================================================
  // UTILITY â€” Element Check
  // =========================================================

  function elementExists(selector) {
    return document.querySelector(selector) !== null;
  }

  // =========================================================
  // UTILITY â€” Mobile Detection
  // =========================================================

  function isMobile() {
    return window.innerWidth < 768;
  }

  // =========================================================
  // UTILITY â€” Debounce Function
  // =========================================================

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // =========================================================
  // UNIFIED INFINITE SLIDER
  // Prevents duplicate initialization, proper cleanup, mobile optimized
  // =========================================================

  const activeSliders = new Map(); // Track active sliders for cleanup

  function initInfiniteSlider(trackSelector, wrapperSelector, options = {}) {
    const {
      duration = 50,
      direction = 'left',
      enableOnMobile = false,
    } = options;

    // Check if already initialized
    if (activeSliders.has(trackSelector)) {
      console.warn(`Slider ${trackSelector} already initialized`);
      return activeSliders.get(trackSelector);
    }

    // Skip on mobile if disabled
    if (!enableOnMobile && isMobile()) {
      console.log(`Slider ${trackSelector} disabled on mobile`);
      return null;
    }

    const sliderTrack = document.querySelector(trackSelector);
    const sliderWrapper = document.querySelector(wrapperSelector);

    if (!sliderTrack || !sliderWrapper) {
      console.warn(`Slider elements not found: ${trackSelector}, ${wrapperSelector}`);
      return null;
    }

    const cards = sliderTrack.children;
    if (cards.length === 0) {
      console.warn(`No cards found in ${trackSelector}`);
      return null;
    }

    // Clone cards ONCE for seamless loop
    const originalCards = Array.from(cards);
    originalCards.forEach((card) => {
      const clone = card.cloneNode(true);
      sliderTrack.appendChild(clone);
    });

    // Set will-change for GPU acceleration
    sliderTrack.style.willChange = "transform";

    // Calculate total width
    const totalWidth = sliderTrack.scrollWidth / 2;

    // Create timeline with proper configuration
    const sliderTl = gsap.timeline({
      repeat: -1,
      defaults: { ease: "none" },
      onRepeat: () => {
        // Reset position instantly for seamless loop
        gsap.set(sliderTrack, { x: 0 });
      }
    });

    // Animate based on direction
    const targetX = direction === 'left' ? -totalWidth : totalWidth;
    sliderTl.to(sliderTrack, {
      x: targetX,
      duration: duration,
      ease: "none",
    });

    // Pause on hover with proper event handling
    const handleMouseEnter = () => sliderTl.pause();
    const handleMouseLeave = () => sliderTl.play();

    sliderWrapper.addEventListener("mouseenter", handleMouseEnter, { passive: true });
    sliderWrapper.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    // Store references for cleanup
    const sliderInstance = {
      timeline: sliderTl,
      track: sliderTrack,
      wrapper: sliderWrapper,
      eventListeners: [
        { element: sliderWrapper, event: 'mouseenter', handler: handleMouseEnter },
        { element: sliderWrapper, event: 'mouseleave', handler: handleMouseLeave },
      ],
      cleanup: function() {
        // Kill timeline
        this.timeline.kill();
        
        // Remove event listeners
        this.eventListeners.forEach(({ element, event, handler }) => {
          element.removeEventListener(event, handler);
        });
        
        // Remove clones
        const allCards = Array.from(this.track.children);
        const cardsToRemove = allCards.slice(originalCards.length);
        cardsToRemove.forEach(card => card.remove());
        
        // Reset styles
        this.track.style.willChange = '';
        gsap.set(this.track, { x: 0, clearProps: 'transform' });
        
        // Remove from active sliders
        activeSliders.delete(trackSelector);
      }
    };

    // Store in active sliders map
    activeSliders.set(trackSelector, sliderInstance);

    return sliderInstance;
  }

  // Cleanup all sliders (call on page unload/SPA navigation)
  function cleanupAllSliders() {
    activeSliders.forEach((slider) => slider.cleanup());
    activeSliders.clear();
  }

  // Cleanup all ScrollTrigger instances
  function cleanupAllScrollTriggers() {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }

  // Global cleanup function
  function cleanupAllAnimations() {
    cleanupAllSliders();
    cleanupAllScrollTriggers();
  }

  // Add cleanup on page unload
  window.addEventListener('beforeunload', cleanupAllAnimations);

  // =========================================================
  // HERO ENTRANCE ANIMATION
  // initHeroAnimations()
  // =========================================================

  function initHeroAnimations() {
    const hero = document.querySelector("#hero");
    if (!hero) return;

    // Set initial states explicitly to prevent FOUC
    // Video / overlay
    if (elementExists(".hero__video")) {
      gsap.set(".hero__video", { opacity: 0 });
    }
    if (elementExists(".hero__overlay")) {
      gsap.set(".hero__overlay", { opacity: 0 });
    }

    // Accent bar
    if (elementExists(".hero__accent-bar")) {
      gsap.set(".hero__accent-bar", {
        opacity: 0,
        scaleY: 0,
        transformOrigin: "top center",
      });
    }

    // Eyebrow line â€“ CSS handles initial 0 width, GSAP will animate it
    if (elementExists(".hero__eyebrow-line")) {
      gsap.set(".hero__eyebrow-line", { width: 0 });
    }

    // Eyebrow text reveal
    if (elementExists(".hero__eyebrow .text-reveal-inner")) {
      gsap.set(".hero__eyebrow .text-reveal-inner", { y: "110%" });
    }

    // Headline words
    const heroWords = document.querySelectorAll("[data-hero-word]");
    if (heroWords.length) {
      gsap.set(heroWords, { y: "110%" });
    }

    // Subheading / CTAs / Trust â€“ .fade-up in CSS already sets opacity 0, y 40
    // Ensure ScrollTrigger doesn't conflict during entrance
    const fadeUps = document.querySelectorAll(
      "[data-hero-sub], [data-hero-ctas], [data-hero-trust]",
    );
    if (fadeUps.length) {
      gsap.set(fadeUps, { opacity: 0, y: 30 });
    }

    // =========================================================
    // Master Entrance Timeline
    // =========================================================
    const heroTl = gsap.timeline({ delay: 0.3 });

    // STEP 1 â€” Video fade in (duration 1.5s)
    if (elementExists(".hero__video")) {
      heroTl.fromTo(
        ".hero__video",
        { opacity: 0 },
        { opacity: 1, duration: 1.5, ease: "power2.out", overwrite: true },
        0,
      );
    }

    // STEP 2 â€” Overlay settles (duration 1.0s)
    if (elementExists(".hero__overlay")) {
      heroTl.fromTo(
        ".hero__overlay",
        { opacity: 0 },
        { opacity: 1, duration: 1.0, ease: "power2.inOut", overwrite: true },
        "<",
      );
    }

    // STEP 3 â€” Accent bar draws in (duration 0.8s)
    if (elementExists(".hero__accent-bar")) {
      heroTl.fromTo(
        ".hero__accent-bar",
        { opacity: 0, scaleY: 0 },
        {
          opacity: 1,
          scaleY: 1,
          duration: 0.8,
          ease: "power3.out",
          transformOrigin: "top center",
          overwrite: true,
        },
        0.6,
      );
    }

    // STEP 4 â€” Eyebrow line draws (duration 0.6s)
    if (elementExists(".hero__eyebrow-line")) {
      heroTl.fromTo(
        ".hero__eyebrow-line",
        { width: "0px" },
        { width: "40px", duration: 0.6, ease: "power2.out", overwrite: true },
        0.8,
      );
    }

    // STEP 5 â€” Eyebrow text slides up (duration 0.7s)
    if (elementExists(".hero__eyebrow .text-reveal-inner")) {
      heroTl.fromTo(
        ".hero__eyebrow .text-reveal-inner",
        { y: "110%" },
        { y: "0%", duration: 0.7, ease: "power3.out", overwrite: true },
        1.0,
      );
    }

    // STEP 6 â€” Headline lines slide up one by one (staggered)
    if (heroWords.length) {
      heroTl.fromTo(
        heroWords,
        { y: "110%" },
        {
          y: "0%",
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          overwrite: true,
        },
        1.2,
      );
    }

    // STEP 7 â€” Subheading fades up (duration 0.8s)
    if (elementExists("[data-hero-sub]")) {
      heroTl.fromTo(
        "[data-hero-sub]",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          overwrite: true,
        },
        1.7,
      );
    }

    // STEP 8 â€” CTA buttons fade up (duration 0.7s)
    if (elementExists("[data-hero-ctas]")) {
      heroTl.fromTo(
        "[data-hero-ctas]",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          overwrite: true,
        },
        1.9,
      );
    }

    // STEP 9 â€” Trust indicators fade up (duration 0.6s)
    if (elementExists("[data-hero-trust]")) {
      heroTl.fromTo(
        "[data-hero-trust]",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          overwrite: true,
        },
        2.1,
      );
    }

    return heroTl;
  }

  // =========================================================
  // HERO SCROLL ANIMATIONS
  // initHeroScrollAnimations()
  // =========================================================

  function initHeroScrollAnimations() {
    const hero = document.querySelector("#hero");
    if (!hero) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isMobile = window.innerWidth < 768;

    // Intensity adjustments
    let contentY = isMobile ? -40 : -80;
    let videoScale = 1.08;
    let grainY = -30;

    if (prefersReducedMotion) {
      contentY *= 0.5;
      videoScale = 1.03;
      grainY *= 0.5;
    }
    if (isMobile) {
      grainY = 0; // disable grain parallax on mobile
    }

    // ---------------------------------------------------------
    // SCROLL ANIMATION 1 â€” Content scrolls out
    // Y drift + opacity fade
    // ---------------------------------------------------------
    if (elementExists(".hero__content")) {
      // Y drift â€“ full hero scroll
      gsap.to(".hero__content", {
        y: contentY,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // Opacity fade â€“ reaches 0 at ~50% scroll
      gsap.to(".hero__content", {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "center top",
          scrub: true,
        },
      });
    }

    // ---------------------------------------------------------
    // SCROLL ANIMATION 3 â€” Video subtle scale (parallax)
    // ---------------------------------------------------------
    if (
      elementExists(".hero__video-fallback") ||
      elementExists(".hero__video")
    ) {
      gsap.to([".hero__video-fallback", ".hero__video"], {
        scale: videoScale,
        ease: "none",
        transformOrigin: "center center",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: 2,
        },
      });
    }

    // ---------------------------------------------------------
    // SCROLL ANIMATION 4 â€” Grain texture parallax
    // ---------------------------------------------------------
    if (grainY !== 0 && elementExists(".hero__grain")) {
      gsap.to(".hero__grain", {
        y: grainY,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }
  }

  // =========================================================
  // â”€â”€ Numbers Section Animations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Impact Beyond Education â€” Scroll reveals + counters
  // =========================================================

  // Counter animation helper
  function animateCounter(element, target, duration) {
    const obj = { value: 0 };

    gsap.to(obj, {
      value: target,
      duration: duration,
      ease: "power2.out",
      onUpdate: function () {
        element.textContent = Math.round(obj.value).toLocaleString("en-US");
      },
      onComplete: function () {
        element.textContent = target.toLocaleString("en-US");
      },
    });
  }

  // Get counter duration based on target value
  function getCounterDuration(target) {
    if (target >= 1000) return 2.0;
    if (target >= 100) return 1.8;
    if (target >= 50) return 1.5;
    if (target >= 20) return 1.2;
    return 1.0;
  }

  function initNumbersAnimations() {
    // Guard: check if numbers section exists
    const numbersSection = document.querySelector("#numbers");
    if (!numbersSection) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // If reduced motion: make everything visible, run counters instantly
    if (prefersReducedMotion) {
      // Make all reveal elements visible
      gsap.set(
        [
          "#numbers .text-reveal-inner",
          "#numbers .fade-up",
          ".numbers__section-divider-line",
          ".numbers__card-line",
          ".numbers__header-divider",
        ],
        { clearProps: "all", opacity: 1 },
      );

      gsap.set("#numbers .text-reveal-inner", { y: "0%" });

      // Run counters instantly (duration 0)
      const cards = document.querySelectorAll(".numbers__card");
      cards.forEach((card) => {
        const target = parseInt(card.getAttribute("data-counter-target"), 10);
        const counterEl = card.querySelector("[data-counter]");
        if (!isNaN(target) && counterEl) {
          counterEl.textContent = target.toLocaleString("en-US");
        }
      });
      return;
    }

    // Use matchMedia for responsive animation intensity
    ScrollTrigger.matchMedia({
      // =========================================================
      // DESKTOP (min-width: 769px) â€” Full animations
      // =========================================================
      "(min-width: 769px)": function () {
        // --- 1. Heading text reveal ---
        const headingLines = numbersSection.querySelectorAll(
          ".numbers__heading-line .text-reveal-inner",
        );
        if (headingLines.length) {
          gsap.fromTo(
            headingLines,
            { y: "110%" },
            {
              y: "0%",
              duration: 0.9,
              stagger: 0.12,
              ease: "power3.out",
              scrollTrigger: {
                trigger: "#numbers",
                start: "top 75%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // Section label fade up
        const sectionLabel = numbersSection.querySelector(".section-label");
        if (sectionLabel) {
          gsap.fromTo(
            sectionLabel,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: "#numbers",
                start: "top 75%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // --- 2. Divider line draw ---
        const dividerLine = numbersSection.querySelector(
          ".numbers__section-divider-line",
        );
        if (dividerLine) {
          gsap.fromTo(
            dividerLine,
            { scaleX: 0, transformOrigin: "left center" },
            {
              scaleX: 1,
              duration: 1.2,
              ease: "power2.inOut",
              scrollTrigger: {
                trigger: ".numbers__section-divider",
                start: "top 85%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // --- 3. Context text fade up ---
        const numbersContext =
          numbersSection.querySelector(".numbers__context");
        if (numbersContext) {
          gsap.fromTo(
            numbersContext,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".numbers__context",
                start: "top 80%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // --- 4. Stats cards stagger reveal ---
        const cards = numbersSection.querySelectorAll(".numbers__card");
        if (cards.length) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".numbers__grid",
                start: "top 80%",
                toggleActions: "play none none none",
              },
            },
          );

          // Card accent lines
          const cardLines = numbersSection.querySelectorAll(
            ".numbers__card-line",
          );
          if (cardLines.length) {
            gsap.fromTo(
              cardLines,
              { scaleX: 0, transformOrigin: "left center" },
              {
                scaleX: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.inOut",
                delay: 0.3,
                scrollTrigger: {
                  trigger: ".numbers__grid",
                  start: "top 75%",
                  toggleActions: "play none none none",
                },
              },
            );
          }
        }

        // --- 5. Counter animations ---
        const counterCards = document.querySelectorAll(".numbers__card");
        counterCards.forEach((card) => {
          const targetAttr = card.getAttribute("data-counter-target");
          const target = parseInt(targetAttr, 10);
          const counterEl = card.querySelector("[data-counter]");

          if (isNaN(target) || !counterEl) return;

          const duration = getCounterDuration(target);

          ScrollTrigger.create({
            trigger: card,
            start: "top 85%",
            once: true,
            onEnter: () => animateCounter(counterEl, target, duration),
          });
        });

        // --- 6. Header divider vertical line ---
        const headerDivider = numbersSection.querySelector(
          ".numbers__header-divider",
        );
        if (headerDivider) {
          gsap.fromTo(
            headerDivider,
            { scaleY: 0, opacity: 0, transformOrigin: "top center" },
            {
              scaleY: 1,
              opacity: 1,
              duration: 1.0,
              ease: "power2.out",
              delay: 0.4,
              scrollTrigger: {
                trigger: ".numbers__header",
                start: "top 75%",
                toggleActions: "play none none none",
              },
            },
          );
        }
      },

      // =========================================================
      // MOBILE (max-width: 768px) â€” Simplified animations
      // =========================================================
      "(max-width: 768px)": function () {
        // 1. Heading text reveal
        const headingLines = numbersSection.querySelectorAll(
          ".numbers__heading-line .text-reveal-inner",
        );
        if (headingLines.length) {
          gsap.fromTo(
            headingLines,
            { y: "110%" },
            {
              y: "0%",
              duration: 0.9,
              stagger: 0.12,
              ease: "power3.out",
              scrollTrigger: {
                trigger: "#numbers",
                start: "top 75%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // Section label
        const sectionLabel = numbersSection.querySelector(".section-label");
        if (sectionLabel) {
          gsap.fromTo(
            sectionLabel,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: "#numbers",
                start: "top 75%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // 2. Divider line draw
        const dividerLine = numbersSection.querySelector(
          ".numbers__section-divider-line",
        );
        if (dividerLine) {
          gsap.fromTo(
            dividerLine,
            { scaleX: 0, transformOrigin: "left center" },
            {
              scaleX: 1,
              duration: 1.2,
              ease: "power2.inOut",
              scrollTrigger: {
                trigger: ".numbers__section-divider",
                start: "top 85%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // 3. Context text fade up (reduced y travel)
        const numbersContext =
          numbersSection.querySelector(".numbers__context");
        if (numbersContext) {
          gsap.fromTo(
            numbersContext,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".numbers__context",
                start: "top 80%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // 4. Stats cards stagger reveal (reduced)
        const cards = numbersSection.querySelectorAll(".numbers__card");
        if (cards.length) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.06,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".numbers__grid",
                start: "top 80%",
                toggleActions: "play none none none",
              },
            },
          );

          // Card accent lines
          const cardLines = numbersSection.querySelectorAll(
            ".numbers__card-line",
          );
          if (cardLines.length) {
            gsap.fromTo(
              cardLines,
              { scaleX: 0, transformOrigin: "left center" },
              {
                scaleX: 1,
                duration: 0.6,
                stagger: 0.06,
                ease: "power2.inOut",
                delay: 0.2,
                scrollTrigger: {
                  trigger: ".numbers__grid",
                  start: "top 75%",
                  toggleActions: "play none none none",
                },
              },
            );
          }
        }

        // 5. Counter animations (same on mobile)
        const counterCards = document.querySelectorAll(".numbers__card");
        counterCards.forEach((card) => {
          const targetAttr = card.getAttribute("data-counter-target");
          const target = parseInt(targetAttr, 10);
          const counterEl = card.querySelector("[data-counter]");

          if (isNaN(target) || !counterEl) return;

          const duration = getCounterDuration(target);

          ScrollTrigger.create({
            trigger: card,
            start: "top 85%",
            once: true,
            onEnter: () => animateCounter(counterEl, target, duration),
          });
        });

        // 6. Header divider â€“ hidden on mobile via CSS, skip animating
      },
    });
  }

  // =========================================================
  // â”€â”€ What Is Maverick Section Animations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Cinematic pinned scroll storytelling
  // =========================================================

function initWIMAnimations() {
  // ── Guard ──────────────────────────────────────────────────
  const section = document.querySelector("#what-is-maverick");
  if (!section) return;

  // ── Element References ─────────────────────────────────────
  const pinWrapper     = section.querySelector(".wim__pin-wrapper");
  const headingWrapper = section.querySelector(".wim__heading-wrapper");
  const label          = section.querySelector(".wim__label");
  const bgImage        = section.querySelector(".wim__bg-image");
  const finalEl        = section.querySelector(".wim__final");
  const statements     = gsap.utils.toArray(
                           section.querySelectorAll(".wim__statement")
                         );
  const totalStatements = statements.length;

  // ── Bail early if critical elements missing ────────────────
  if (!pinWrapper || !headingWrapper || totalStatements === 0) {
    console.warn("WIM: Required elements not found, skipping animations.");
    return;
  }

  // ── Kill any stale ScrollTriggers for this section ─────────
  ScrollTrigger.getAll().forEach((st) => {
    if (st.trigger === section) st.kill();
  });

  // ── Reduced Motion: show everything, no animation ─────────
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    gsap.set([headingWrapper, label, finalEl, pinWrapper], {
      clearProps: "all",
      opacity: 1,
      y: 0,
    });
    gsap.set(statements, { clearProps: "all", opacity: 1 });
    statements.forEach((stmt) => {
      const txt = stmt.querySelector(".wim__statement-text");
      if (txt) gsap.set(txt, { clearProps: "all", y: "0%" });
    });
    if (bgImage) gsap.set(bgImage, { clearProps: "all" });
    return;
  }

  // ─────────────────────────────────────────────────────────────
  // RESPONSIVE CONFIG
  // window.innerWidth check — no matchMedia conflict
  // ─────────────────────────────────────────────────────────────

  const isMobile = window.innerWidth <= 768;

  const cfg = isMobile
    ? {
        // ── MOBILE ──
        headingInitY   : "-8vh",
        headingSettleY : "-2vh",
        entryStart     : "top 70%",
        entryEnd       : "top 20%",
        pinEnd         : "+=110%",
        bgScale        : 1.08,
        labelOpacity   : 1,
        scrubEntry     : 0.8,
        scrubPin       : 1,
      }
    : {
        // ── DESKTOP ──
        headingInitY   : "-15vh",
        headingSettleY : "-3vh",
        entryStart     : "top 65%",
        entryEnd       : "top 15%",
        pinEnd         : "+=140%",
        bgScale        : 1.12,
        labelOpacity   : 0.9,
        scrubEntry     : 1,
        scrubPin       : 1.2,
      };

  // ─────────────────────────────────────────────────────────────
  // TIMELINE POSITIONS  (normalized  0.0 → 1.0)
  //
  //  0.0  ──────── BG zoom starts
  //  0.05 ──────── Statement 1 reveals
  //   ...           (each statement spaced evenly)
  //  0.62 ──────── Last statement done
  //  0.66 ──────── Final line "Real transformation. Real impact."
  //
  //  ── FADEOUT ZONE ──────────────────────────────────────────
  //  0.88 ──────── Fade starts  (was 0.75 — TOO EARLY = bug)
  //  1.00 ──────── Fade ends = pin releases
  //
  //  scrub: 1.2 means scroll-up = smooth reverse fade-in ✅
  // ─────────────────────────────────────────────────────────────

  const STMT_START    = 0.05;
  const STMT_ZONE_END = 0.62;
  const FINAL_POS     = 0.66;
  const FADE_START    = 0.88;  // ✅ FIX: was 0.75 (too early)
  const FADE_DUR      = 0.12;  // 0.88 + 0.12 = 1.0 (ends exactly at pin release)

  // Dynamic gap between statements
  const stmtZone = STMT_ZONE_END - STMT_START;
  const STMT_GAP = totalStatements > 1
    ? stmtZone / (totalStatements - 1)
    : 0;

  // ─────────────────────────────────────────────────────────────
  // STEP 1 — INITIAL STATES
  // Set before any ScrollTrigger fires
  // ─────────────────────────────────────────────────────────────

  gsap.set(headingWrapper, { y: cfg.headingInitY, opacity: 0 });
  gsap.set(label,          { y: 10, opacity: 0 });
  gsap.set(statements,     { opacity: 0 });
  gsap.set(finalEl,        { y: 12, opacity: 0 });
  gsap.set(pinWrapper,     { opacity: 1 }); // ✅ ensure not pre-hidden

  statements.forEach((stmt) => {
    const txt = stmt.querySelector(".wim__statement-text");
    if (txt) gsap.set(txt, { y: "100%" });
  });

  if (bgImage) gsap.set(bgImage, { scale: 1 });

  // ─────────────────────────────────────────────────────────────
  // STEP 2 — PHASE 1: ENTRY ANIMATION
  // Heading + label slide in as section enters viewport
  // scrub = smooth on scroll-up too (reverse entry)
  // ─────────────────────────────────────────────────────────────

  const entryTl = gsap.timeline({
    scrollTrigger: {
      trigger : section,
      start   : cfg.entryStart,
      end     : cfg.entryEnd,
      scrub   : cfg.scrubEntry,
    },
  });

  entryTl
    .to(headingWrapper, {
      y        : "0vh",
      opacity  : 1,
      duration : 1,
      ease     : "power2.out",
    })
    .to(
      label,
      {
        y        : 0,
        opacity  : cfg.labelOpacity,
        duration : 0.7,
        ease     : "power2.out",
      },
      "-=0.5"
    );

  // ─────────────────────────────────────────────────────────────
  // STEP 3 — PHASE 2: PINNED SCROLL TIMELINE
  //
  // pin: pinWrapper → only content is pinned, not the BG
  // This allows BG to scroll naturally (parallax feel)
  // invalidateOnRefresh → correct recalc on resize
  // ─────────────────────────────────────────────────────────────

  const wimTl = gsap.timeline({
    scrollTrigger: {
      trigger             : section,
      start               : "top top",
      end                 : cfg.pinEnd,
      scrub               : cfg.scrubPin, // ✅ scrub = auto reverse on scroll-up
      pin                 : pinWrapper,
      anticipatePin       : 1,
      pinSpacing          : true,
      invalidateOnRefresh : true,         // ✅ correct calc after resize
    },
  });

  // ── BG Zoom (full scroll duration) ──────────────────────────
  if (bgImage) {
    wimTl.to(
      bgImage,
      {
        scale    : cfg.bgScale,
        duration : 1,     // 1.0 = full normalized duration
        ease     : "none",
      },
      0  // starts at position 0
    );
  }

  // ── Heading: subtle upward drift while pinned ────────────────
  wimTl.to(
    headingWrapper,
    {
      y        : cfg.headingSettleY,
      duration : 0.3,
      ease     : "power1.inOut",
    },
    0
  );

  // ── Statements: reveal one by one ───────────────────────────
  statements.forEach((stmt, index) => {
    const stmtText = stmt.querySelector(".wim__statement-text");
    const pos      = STMT_START + index * STMT_GAP;

    // Opacity reveal
    wimTl.to(
      stmt,
      {
        opacity  : 1,
        duration : 0.15,
        ease     : "power2.out",
      },
      pos
    );

    // Text clip-reveal (slide up from hidden)
    if (stmtText) {
      wimTl.to(
        stmtText,
        {
          y        : "0%",
          duration : 0.18,
          ease     : "power3.out",
        },
        pos
      );
    }
  });

  // ── Final tagline reveal ─────────────────────────────────────
  wimTl.to(
    finalEl,
    {
      opacity  : 1,
      y        : 0,
      duration : 0.08,
      ease     : "power2.out",
    },
    FINAL_POS
  );

  // ── FADEOUT — last 12% of scroll only ───────────────────────
  //
  // ✅ FIX EXPLANATION:
  //   OLD: FADE_START=0.75 → text faded when section was still
  //        50%+ in viewport. User could see blank section.
  //
  //   NEW: FADE_START=0.88 → text only fades when section is
  //        almost completely leaving viewport (last 12% of pin)
  //
  //   scrub:1.2 → scroll UP pe automatic smooth fade-IN reverse ✅
  //   ease:"power1.inOut" → gradual, not sudden ✅
  // ────────────────────────────────────────────────────────────

  wimTl.to(
    pinWrapper,
    {
      opacity  : 0,
      duration : FADE_DUR,        // 0.12 = last 12% of total scroll
      ease     : "power1.inOut",  // smooth, not abrupt
    },
    FADE_START                    // 0.88 = starts at 88%
  );
}

  // =========================================================
  // â”€â”€ Who We Are Section Animations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Split-screen layout with image accent corner
  // =========================================================

  function initWWAAnimations() {
    if (!elementExists("#who-we-are")) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // If reduced motion: make everything visible
    if (prefersReducedMotion) {
      gsap.set(
        [
          ".wwa__heading-line .text-reveal-inner",
          ".wwa__body",
          ".wwa__stats",
          ".wwa__cta",
          ".wwa__image-accent",
        ],
        { clearProps: "all", opacity: 1 },
      );
      gsap.set(".wwa__heading-line .text-reveal-inner", { y: "0%" });
      return;
    }

    // Use matchMedia for responsive animation intensity
    ScrollTrigger.matchMedia({
      // =========================================================
      // DESKTOP (min-width: 769px) â€” Full animations
      // =========================================================
      "(min-width: 769px)": function () {
        // 1. Section label fade up
        const sectionLabel = document.querySelector(
          "#who-we-are .section-label",
        );
        if (sectionLabel) {
          gsap.fromTo(
            sectionLabel,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: "#who-we-are",
                start: "top 75%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // 2. Heading lines text reveal stagger
        const headingLines = document.querySelectorAll(
          ".wwa__heading-line .text-reveal-inner",
        );
        if (headingLines.length) {
          gsap.fromTo(
            headingLines,
            { y: "110%" },
            {
              y: "0%",
              duration: 0.9,
              stagger: 0.12,
              ease: "power3.out",
              scrollTrigger: {
                trigger: "#who-we-are",
                start: "top 75%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // 3. Body text fade up
        const bodyText = document.querySelector(".wwa__body");
        if (bodyText) {
          gsap.fromTo(
            bodyText,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".wwa__body",
                start: "top 80%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // 4. Stats fade up
        const stats = document.querySelector(".wwa__stats");
        if (stats) {
          gsap.fromTo(
            stats,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".wwa__stats",
                start: "top 80%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // 5. CTA button fade up
        const cta = document.querySelector(".wwa__cta");
        if (cta) {
          gsap.fromTo(
            cta,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".wwa__cta",
                start: "top 85%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // 6. Image parallax (subtle vertical y)
        const image = document.querySelector(".wwa__image");
        if (image) {
          gsap.to(image, {
            y: -40,
            ease: "none",
            scrollTrigger: {
              trigger: ".wwa__image-col",
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          });
        }

        // 7. Image accent corner fade in with delay
        const imageAccent = document.querySelector(".wwa__image-accent");
        if (imageAccent) {
          gsap.fromTo(
            imageAccent,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".wwa__image-wrapper",
                start: "top 70%",
                toggleActions: "play none none none",
              },
            },
          );
        }
      },

      // =========================================================
      // MOBILE (max-width: 768px) â€” Simplified animations
      // =========================================================
      "(max-width: 768px)": function () {
        // 1. Section label fade up
        const sectionLabel = document.querySelector(
          "#who-we-are .section-label",
        );
        if (sectionLabel) {
          gsap.fromTo(
            sectionLabel,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: "#who-we-are",
                start: "top 75%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // 2. Heading lines text reveal stagger
        const headingLines = document.querySelectorAll(
          ".wwa__heading-line .text-reveal-inner",
        );
        if (headingLines.length) {
          gsap.fromTo(
            headingLines,
            { y: "110%" },
            {
              y: "0%",
              duration: 0.9,
              stagger: 0.12,
              ease: "power3.out",
              scrollTrigger: {
                trigger: "#who-we-are",
                start: "top 75%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // 3. Body text fade up (reduced y travel)
        const bodyText = document.querySelector(".wwa__body");
        if (bodyText) {
          gsap.fromTo(
            bodyText,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".wwa__body",
                start: "top 80%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // 4. Stats fade up (reduced)
        const stats = document.querySelector(".wwa__stats");
        if (stats) {
          gsap.fromTo(
            stats,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".wwa__stats",
                start: "top 80%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // 5. CTA button fade up
        const cta = document.querySelector(".wwa__cta");
        if (cta) {
          gsap.fromTo(
            cta,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".wwa__cta",
                start: "top 85%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // 6. Image parallax (reduced on mobile)
        const image = document.querySelector(".wwa__image");
        if (image) {
          gsap.to(image, {
            y: -20,
            ease: "none",
            scrollTrigger: {
              trigger: ".wwa__image-col",
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          });
        }

        // 7. Image accent corner fade in
        const imageAccent = document.querySelector(".wwa__image-accent");
        if (imageAccent) {
          gsap.fromTo(
            imageAccent,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".wwa__image-wrapper",
                start: "top 70%",
                toggleActions: "play none none none",
              },
            },
          );
        }
      },
    });
  }

  function initCEOAnimations() {
    if (!elementExists("#ceo-message")) return;
    
        const ceoImageAccent = document.querySelector(".ceo__image");
        if (ceoImageAccent) {
          gsap.fromTo(
            ceoImageAccent,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".ceo__image-col",
                start: "top 70%",
                toggleActions: "play none none none",
              },
            },
          );
        }

    const headingLines = document.querySelectorAll(
      "#ceo-message .text-reveal-inner"
    );

    if (headingLines.length) {
      gsap.fromTo(
        headingLines,
        { y: "110%" },
        {
          y: "0%",
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "#ceo-message",
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#ceo-message",
        start: "top 75%",
        toggleActions: "play none none none"
      }
    });

    tl.fromTo(
      ".ceo__image-wrapper",
      {
        opacity: 0,
        scale: 0.95
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.9,
        ease: "power2.out"
      }
    );

    tl.fromTo(
      [
        ".section-label",
        ".ceo__quote",
        ".ceo__body",
        ".ceo__signature"
      ],
      {
        opacity: 0,
        y: 40
      },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out"
      },
      "-=0.4"
    );
  }
  
  // =========================================================
  // â”€â”€ What We Do Section Animations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Three category cards with index numbers
  // =========================================================

  function initWWDAnimations() {
    if (!elementExists("#what-we-do")) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // If reduced motion: make everything visible
    if (prefersReducedMotion) {
      gsap.set(
        [
          ".wwd__heading-line .text-reveal-inner",
          ".wwd__context",
          ".wwd__card",
          ".wwd__card-index",
          ".wwd__card-item",
        ],
        { clearProps: "all", opacity: 1 },
      );
      gsap.set(".wwd__heading-line .text-reveal-inner", { y: "0%" });
      return;
    }

    // Use matchMedia for responsive animation intensity
    ScrollTrigger.matchMedia({
      // =========================================================
      // DESKTOP (min-width: 769px) â€” Full animations
      // =========================================================
      "(min-width: 769px)": function () {
        // 1. Section label fade up
        const sectionLabel = document.querySelector(
          "#what-we-do .section-label",
        );
        if (sectionLabel) {
          gsap.fromTo(
            sectionLabel,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: "#what-we-do",
                start: "top 75%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // 2. Heading lines text reveal stagger
        const headingLines = document.querySelectorAll(
          ".wwd__heading-line .text-reveal-inner",
        );
        if (headingLines.length) {
          gsap.fromTo(
            headingLines,
            { y: "110%" },
            {
              y: "0%",
              duration: 0.9,
              stagger: 0.12,
              ease: "power3.out",
              scrollTrigger: {
                trigger: "#what-we-do",
                start: "top 75%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // 3. Context text fade up
        const contextText = document.querySelector(".wwd__context");
        if (contextText) {
          gsap.fromTo(
            contextText,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".wwd__context",
                start: "top 80%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // 4. Cards stagger reveal (left to right)
        const cards = document.querySelectorAll(".wwd__card");
        if (cards.length) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.15,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".wwd__grid",
                start: "top 75%",
                toggleActions: "play none none none",
              },
            },
          );

          // Index numbers fade in with delay
          const cardIndexes = document.querySelectorAll(".wwd__card-index");
          if (cardIndexes.length) {
            gsap.fromTo(
              cardIndexes,
              { opacity: 0 },
              {
                opacity: 1,
                duration: 0.5,
                stagger: 0.15,
                delay: 0.3,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: ".wwd__grid",
                  start: "top 75%",
                  toggleActions: "play none none none",
                },
              },
            );
          }

          // Items inside cards cascade stagger
          cards.forEach((card) => {
            const items = card.querySelectorAll(".wwd__card-item");
            if (items.length) {
              gsap.fromTo(
                items,
                { opacity: 0, x: -10 },
                {
                  opacity: 1,
                  x: 0,
                  duration: 0.4,
                  stagger: 0.08,
                  ease: "power2.out",
                  scrollTrigger: {
                    trigger: card,
                    start: "top 70%",
                    toggleActions: "play none none none",
                  },
                },
              );
            }
          });
        }
      },

      // =========================================================
      // MOBILE (max-width: 768px) â€” Simplified animations
      // =========================================================
      "(max-width: 768px)": function () {
        // 1. Section label fade up
        const sectionLabel = document.querySelector(
          "#what-we-do .section-label",
        );
        if (sectionLabel) {
          gsap.fromTo(
            sectionLabel,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: "#what-we-do",
                start: "top 75%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // 2. Heading lines text reveal stagger
        const headingLines = document.querySelectorAll(
          ".wwd__heading-line .text-reveal-inner",
        );
        if (headingLines.length) {
          gsap.fromTo(
            headingLines,
            { y: "110%" },
            {
              y: "0%",
              duration: 0.9,
              stagger: 0.12,
              ease: "power3.out",
              scrollTrigger: {
                trigger: "#what-we-do",
                start: "top 75%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // 3. Context text fade up (reduced y travel)
        const contextText = document.querySelector(".wwd__context");
        if (contextText) {
          gsap.fromTo(
            contextText,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".wwd__context",
                start: "top 80%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // 4. Cards stagger reveal (reduced)
        const cards = document.querySelectorAll(".wwd__card");
        if (cards.length) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".wwd__grid",
                start: "top 75%",
                toggleActions: "play none none none",
              },
            },
          );

          // Index numbers fade in
          const cardIndexes = document.querySelectorAll(".wwd__card-index");
          if (cardIndexes.length) {
            gsap.fromTo(
              cardIndexes,
              { opacity: 0 },
              {
                opacity: 1,
                duration: 0.5,
                stagger: 0.1,
                delay: 0.2,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: ".wwd__grid",
                  start: "top 75%",
                  toggleActions: "play none none none",
                },
              },
            );
          }

          // Items inside cards cascade
          cards.forEach((card) => {
            const items = card.querySelectorAll(".wwd__card-item");
            if (items.length) {
              gsap.fromTo(
                items,
                { opacity: 0, x: -8 },
                {
                  opacity: 1,
                  x: 0,
                  duration: 0.4,
                  stagger: 0.06,
                  ease: "power2.out",
                  scrollTrigger: {
                    trigger: card,
                    start: "top 70%",
                    toggleActions: "play none none none",
                  },
                },
              );
            }
          });
        }
      },
    });
  }

  // =========================================================
  // â”€â”€ How We Do It Section Animations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Three-step process flow with connecting lines
  // =========================================================

  function initHWDIAnimations() {
    if (!elementExists("#how-we-do-it")) return;

    // Early gsap.set() to prevent FOUC (default animation states)
    gsap.set(".hwdi__heading-line .text-reveal-inner", { y: "110%" });
    gsap.set(".hwdi__subtitle", { opacity: 0 });
    gsap.set(".hwdi__step", { opacity: 0 });
    gsap.set(".hwdi__step-number", { scale: 0.7, opacity: 0 });
    gsap.set(".hwdi__step-accent", {
      scaleY: 0,
      transformOrigin: "top center",
    });
    gsap.set(".hwdi__connector-line", {
      scaleX: 0,
      transformOrigin: "left center",
    });

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // If reduced motion: make everything visible
    if (prefersReducedMotion) {
      gsap.set(
        [
          ".hwdi__heading-line .text-reveal-inner",
          ".hwdi__subtitle",
          ".hwdi__step",
          ".hwdi__step-number",
          ".hwdi__step-accent",
          ".hwdi__connector-line",
        ],
        { clearProps: "all", opacity: 1 },
      );
      gsap.set(".hwdi__heading-line .text-reveal-inner", { y: "0%" });
      gsap.set(".hwdi__step-number", { scale: 1 });
      gsap.set(".hwdi__step-accent", { scaleY: 1 });
      gsap.set(".hwdi__connector-line", { scaleX: 1 });
      return;
    }

    // Use matchMedia for responsive animation intensity
    ScrollTrigger.matchMedia({
      // =========================================================
      // DESKTOP (min-width: 769px) â€” Full animations
      // =========================================================
      "(min-width: 769px)": function () {
        // 1. Section label fade up (centered)
        const sectionLabel = document.querySelector(
          "#how-we-do-it .section-label",
        );
        if (sectionLabel) {
          gsap.fromTo(
            sectionLabel,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: "#how-we-do-it",
                start: "top 75%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // 2. Heading lines text reveal stagger
        const headingLines = document.querySelectorAll(
          ".hwdi__heading-line .text-reveal-inner",
        );
        if (headingLines.length) {
          gsap.fromTo(
            headingLines,
            { y: "110%" },
            {
              y: "0%",
              duration: 0.9,
              stagger: 0.12,
              ease: "power3.out",
              scrollTrigger: {
                trigger: "#how-we-do-it",
                start: "top 75%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // 3. Subtitle fade up
        const subtitle = document.querySelector(".hwdi__subtitle");
        if (subtitle) {
          gsap.fromTo(
            subtitle,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".hwdi__subtitle",
                start: "top 80%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // 4. Steps reveal sequentially with stagger
        const steps = document.querySelectorAll(".hwdi__step");
        if (steps.length) {
          gsap.fromTo(
            steps,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".hwdi__steps",
                start: "top 70%",
                toggleActions: "play none none none",
              },
            },
          );

          // Step numbers scale-in
          const stepNumbers = document.querySelectorAll(".hwdi__step-number");
          if (stepNumbers.length) {
            gsap.fromTo(
              stepNumbers,
              { scale: 0.8, opacity: 0 },
              {
                scale: 1,
                opacity: 1,
                duration: 0.6,
                stagger: 0.2,
                ease: "back.out(1.7)",
                scrollTrigger: {
                  trigger: ".hwdi__steps",
                  start: "top 70%",
                  toggleActions: "play none none none",
                },
              },
            );
          }

          // Step accent lines draw down
          const stepAccents = document.querySelectorAll(".hwdi__step-accent");
          if (stepAccents.length) {
            gsap.fromTo(
              stepAccents,
              { scaleY: 0 },
              {
                scaleY: 1,
                duration: 0.5,
                stagger: 0.2,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: ".hwdi__steps",
                  start: "top 70%",
                  toggleActions: "play none none none",
                },
              },
            );
          }
        }

        // 5. Connecting lines draw with stagger after steps
        const connectors = document.querySelectorAll(".hwdi__connector-line");
        if (connectors.length) {
          gsap.fromTo(
            connectors,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 0.8,
              stagger: 0.15,
              ease: "power2.inOut",
              scrollTrigger: {
                trigger: ".hwdi__steps",
                start: "top 65%",
                toggleActions: "play none none none",
              },
            },
          );
        }
      },

      // =========================================================
      // MOBILE (max-width: 768px) â€” Simplified animations
      // =========================================================
      "(max-width: 768px)": function () {
        // 1. Section label fade up
        const sectionLabel = document.querySelector(
          "#how-we-do-it .section-label",
        );
        if (sectionLabel) {
          gsap.fromTo(
            sectionLabel,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: "#how-we-do-it",
                start: "top 75%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // 2. Heading lines text reveal stagger
        const headingLines = document.querySelectorAll(
          ".hwdi__heading-line .text-reveal-inner",
        );
        if (headingLines.length) {
          gsap.fromTo(
            headingLines,
            { y: "110%" },
            {
              y: "0%",
              duration: 0.9,
              stagger: 0.12,
              ease: "power3.out",
              scrollTrigger: {
                trigger: "#how-we-do-it",
                start: "top 75%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // 3. Subtitle fade up (reduced y travel)
        const subtitle = document.querySelector(".hwdi__subtitle");
        if (subtitle) {
          gsap.fromTo(
            subtitle,
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".hwdi__subtitle",
                start: "top 80%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        // 4. Steps reveal sequentially (reduced)
        const steps = document.querySelectorAll(".hwdi__step");
        if (steps.length) {
          gsap.fromTo(
            steps,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.15,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".hwdi__steps",
                start: "top 70%",
                toggleActions: "play none none none",
              },
            },
          );

          // Step numbers scale-in
          const stepNumbers = document.querySelectorAll(".hwdi__step-number");
          if (stepNumbers.length) {
            gsap.fromTo(
              stepNumbers,
              { scale: 0.8, opacity: 0 },
              {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                stagger: 0.15,
                ease: "back.out(1.5)",
                scrollTrigger: {
                  trigger: ".hwdi__steps",
                  start: "top 70%",
                  toggleActions: "play none none none",
                },
              },
            );
          }

          // Step accent lines draw down
          const stepAccents = document.querySelectorAll(".hwdi__step-accent");
          if (stepAccents.length) {
            gsap.fromTo(
              stepAccents,
              { scaleY: 0 },
              {
                scaleY: 1,
                duration: 0.4,
                stagger: 0.15,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: ".hwdi__steps",
                  start: "top 70%",
                  toggleActions: "play none none none",
                },
              },
            );
          }
        }

        // 5. Connecting lines hidden on mobile, skip animation
      },
    });
  }

  // =========================================================
  // â”€â”€ Alumni Network Section Animations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Dual-scrolling marquees with fade-in + scale entrance
  // =========================================================

  function initAlumniAnimations() {
    if (!elementExists("#alumni-network")) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // If reduced motion: make everything visible immediately
    if (prefersReducedMotion) {
      gsap.set(
        [
          "#alumni-network .section-label",
          ".alumni__heading-line .text-reveal-inner",
          ".alumni__subtitle",
          ".alumni__marquee-wrapper",
        ],
        { clearProps: "all", opacity: 1 },
      );
      gsap.set(".alumni__heading-line .text-reveal-inner", { y: "0%" });
      return;
    }

    // Set initial states to prevent FOUC
    gsap.set("#alumni-network .section-label", { opacity: 0, y: 16 });
    gsap.set("#alumni-network .text-reveal-inner", { y: "110%" });
    gsap.set(".alumni__subtitle", { opacity: 0, y: 20 });
    gsap.set(".alumni__marquee-wrapper", { opacity: 0, scale: 0.97 });

    // Section label fade up
    const label = document.querySelector("#alumni-network .section-label");
    if (label) {
      gsap.fromTo(
        label,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#alumni-network",
            start: "top 75%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    // Heading reveal
    const headings = document.querySelectorAll(
      "#alumni-network .text-reveal-inner",
    );
    if (headings.length) {
      gsap.fromTo(
        headings,
        { y: "110%" },
        {
          y: "0%",
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "#alumni-network",
            start: "top 75%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    // Subtitle fade up
    const subtitle = document.querySelector(".alumni__subtitle");
    if (subtitle) {
      gsap.fromTo(
        subtitle,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".alumni__subtitle",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    // Marquee wrapper fade + scale in
    const marquee = document.querySelector(".alumni__marquee-wrapper");
    if (marquee) {
      gsap.fromTo(
        marquee,
        { opacity: 0, scale: 0.97 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".alumni__marquee-wrapper",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    }
  }

  // =========================================================
  // â”€â”€ Featured Programs Section Animations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Pinned horizontal track scroll (Desktop) + entrance reveals
  // =========================================================

  function initProgramsAnimations() {
    if (!elementExists("#featured-programs")) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Early GSAP sets for FOUC
    gsap.set("#featured-programs .section-label", { opacity: 0, y: 16 });
    gsap.set("#featured-programs .text-reveal-inner", { y: "110%" });
    gsap.set("#featured-programs .programs__subtitle", { opacity: 0, y: 20 });

    if (prefersReducedMotion) {
      gsap.set(
        [
          "#featured-programs .section-label",
          "#featured-programs .text-reveal-inner",
          "#featured-programs .programs__subtitle",
        ],
        { clearProps: "all", opacity: 1 },
      );
      gsap.set("#featured-programs .text-reveal-inner", { y: "0%" });
      return;
    }

    // Label fade-up
    const label = document.querySelector("#featured-programs .section-label");
    if (label) {
      gsap.fromTo(
        label,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#featured-programs",
            start: "top 75%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    // Heading Reveal
    const headings = document.querySelectorAll(
      "#featured-programs .text-reveal-inner",
    );
    if (headings.length) {
      gsap.fromTo(
        headings,
        { y: "100%" },
        {
          y: "0%",
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "#featured-programs",
            start: "top 75%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    // Subtitle fade-up
    const subtitle = document.querySelector(
      "#featured-programs .programs__subtitle",
    );
    if (subtitle) {
      gsap.fromTo(
        subtitle,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#featured-programs .programs__subtitle",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    // Horizontal scroll setup (Desktop only, min-width: 769px)
    ScrollTrigger.matchMedia({
      "(min-width: 769px)": function () {
        const track = document.querySelector(".programs__track");
        if (!track) return;

        const getScrollAmount = () => {
          return track.scrollWidth - window.innerWidth;
        };

        gsap.to(track, {
          x: () => -getScrollAmount(),
          ease: "none",
          scrollTrigger: {
            trigger: "#featured-programs",
            pin: true,
            scrub: 1,
            start: "bottom bottom",
            end: () => "+=" + getScrollAmount(),
            invalidateOnRefresh: true,
          },
        });
      },
    });
  }

  // =========================================================
  // â”€â”€ Why Maverick Section Animations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Bento Grid reveal animations
  // =========================================================

  function initWhyMaverickAnimations() {
    if (!elementExists("#why-maverick")) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    gsap.set("#why-maverick .section-label", { opacity: 0, y: 16 });
    gsap.set("#why-maverick .text-reveal-inner", { y: "110%" });
    gsap.set("#why-maverick .why__subtitle", { opacity: 0, y: 20 });
    gsap.set("#why-maverick .why__tile", { opacity: 0, y: 40 });

    if (prefersReducedMotion) {
      gsap.set(
        [
          "#why-maverick .section-label",
          "#why-maverick .text-reveal-inner",
          "#why-maverick .why__subtitle",
          "#why-maverick .why__tile",
        ],
        { clearProps: "all", opacity: 1 },
      );
      gsap.set("#why-maverick .text-reveal-inner", { y: "0%" });
      return;
    }

    // Label fade-up
    const label = document.querySelector("#why-maverick .section-label");
    if (label) {
      gsap.fromTo(
        label,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#why-maverick",
            start: "top 75%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    // Heading Reveal
    const headings = document.querySelectorAll(
      "#why-maverick .text-reveal-inner",
    );
    if (headings.length) {
      gsap.fromTo(
        headings,
        { y: "110%" },
        {
          y: "0%",
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "#why-maverick",
            start: "top 75%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    // Subtitle fade-up
    const subtitle = document.querySelector("#why-maverick .why__subtitle");
    if (subtitle) {
      gsap.fromTo(
        subtitle,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#why-maverick .why__subtitle",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    // Bento Grid Tiles Stagger
    const tiles = document.querySelectorAll("#why-maverick .why__tile");
    if (tiles.length) {
      gsap.fromTo(
        tiles,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#why-maverick .why__grid",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );
    }
  }
  // =========================================================
  // â”€â”€ Global Opportunities & Pathways Section Animations â”€â”€
  // Editorial split-screen reveal with text reveal + stagger
  // =========================================================

  function initOpportunitiesAnimations() {
    if (!elementExists("#global-opportunities")) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // ----- Reduced Motion: Skip animations, show everything -----
    if (prefersReducedMotion) {
      gsap.set(
        [
          "#global-opportunities .section-label",
          "#global-opportunities .text-reveal-inner",
          "#global-opportunities .opportunities__subtitle",
          "#global-opportunities .opportunities__column-header",
          "#global-opportunities .opportunities__item",
          "#global-opportunities .opportunities__divider",
        ],
        { clearProps: "all", opacity: 1 },
      );
      gsap.set("#global-opportunities .text-reveal-inner", { y: "0%" });
      return;
    }

    // ----- FOUC Prevention (Initial Hidden States) -----
    gsap.set("#global-opportunities .section-label", { opacity: 0, y: 16 });
    gsap.set("#global-opportunities .text-reveal-inner", { y: "110%" });
    gsap.set("#global-opportunities .opportunities__subtitle", {
      opacity: 0,
      y: 20,
    });
    gsap.set("#global-opportunities .opportunities__column-header", {
      opacity: 0,
      y: 30,
    });
    gsap.set("#global-opportunities .opportunities__item", {
      opacity: 0,
      y: 24,
    });
    gsap.set("#global-opportunities .opportunities__divider", {
      scaleY: 0,
      transformOrigin: "top center",
    });

    // ----- 1. Section Label Fade Up -----
    const label = document.querySelector(
      "#global-opportunities .section-label",
    );
    if (label) {
      gsap.to(label, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#global-opportunities",
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
    }

    // ----- 2. Heading Text Reveal -----
    const headingInner = document.querySelector(
      "#global-opportunities .opportunities__heading .text-reveal-inner",
    );
    if (headingInner) {
      gsap.to(headingInner, {
        y: "0%",
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#global-opportunities",
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
    }

    // ----- 3. Subtitle Fade Up -----
    const subtitle = document.querySelector(
      "#global-opportunities .opportunities__subtitle",
    );
    if (subtitle) {
      gsap.to(subtitle, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#global-opportunities",
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
    }

    // ----- 4. Divider Scale Down -----
    const divider = document.querySelector(
      "#global-opportunities .opportunities__divider",
    );
    if (divider) {
      gsap.to(divider, {
        scaleY: 1,
        duration: 0.8,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: "#global-opportunities .opportunities__split",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }

    // ----- 5. Column Headers Fade Up (Both Columns Together) -----
    const columnHeaders = document.querySelectorAll(
      "#global-opportunities .opportunities__column-header",
    );
    if (columnHeaders.length) {
      gsap.to(columnHeaders, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#global-opportunities .opportunities__split",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    }

    // ----- 6. List Items Stagger Reveal (Per Column) -----
    const leftItems = document.querySelectorAll(
      "#global-opportunities .opportunities__column--left .opportunities__item",
    );
    if (leftItems.length) {
      gsap.to(leftItems, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        delay: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#global-opportunities .opportunities__split",
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
    }

    const rightItems = document.querySelectorAll(
      "#global-opportunities .opportunities__column--right .opportunities__item",
    );
    if (rightItems.length) {
      gsap.to(rightItems, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        delay: 0.45,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#global-opportunities .opportunities__split",
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
    }
  }

  // =========================================================
  // â”€â”€ University Partners Section Animations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Map fade-in + pin stagger reveal + detail panel entrance
  // =========================================================

  function initPartnersAnimations() {
    // if (!elementExists("#university-partners")) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // ----- Reduced Motion: Skip animations -----
    if (prefersReducedMotion) {
      gsap.set(
        [
          "#university-partners .section-label",
          "#university-partners .text-reveal-inner",
          "#university-partners .partners__pin",
          "#university-partners .partners__detail-panel",
          "#university-partners .partners__mobile-item",
        ],
        { clearProps: "all", opacity: 1 },
      );
      gsap.set("#university-partners .text-reveal-inner", { y: "0%" });
      return;
    }

    // ----- FOUC Prevention (only set existing elements) -----
    // const labelEl = document.querySelector(
    //   "#university-partners .section-label",
    // );
    // const textRevealEls = document.querySelectorAll(
    //   "#university-partners .text-reveal-inner",
    // );
    // const subtitleEl = document.querySelector(
    //   "#university-partners .partners__subtitle",
    // );
    // const detailPanelEl = document.querySelector(
    //   "#university-partners .partners__detail-panel",
    // );

    // if (labelEl) gsap.set(labelEl, { opacity: 0, y: 16 });
    // if (textRevealEls.length) gsap.set(textRevealEls, { y: "110%" });
    // if (subtitleEl) gsap.set(subtitleEl, { opacity: 0, y: 20 });
    // if (detailPanelEl) gsap.set(detailPanelEl, { opacity: 0, y: 40 });

    // ----- 1. Section Label -----
    const label = document.querySelector("#university-partners .section-label");
    // if (label) {
    //   gsap.to(label, {
    //     opacity: 1,
    //     y: 0,
    //     duration: 0.6,
    //     ease: "power2.out",
    //     scrollTrigger: {
    //       trigger: "#university-partners",
    //       start: "top 75%",
    //       toggleActions: "play none none none",
    //     },
    //   });
    // }

    // ----- 2. Heading Text Reveal -----
    const headings = document.querySelectorAll(
      "#university-partners .text-reveal-inner",
    );
    // if (headings.length) {
    //   gsap.to(headings, {
    //     y: "0%",
    //     duration: 0.9,
    //     stagger: 0.12,
    //     ease: "power3.out",
    //     scrollTrigger: {
    //       trigger: "#university-partners",
    //       start: "top 75%",
    //       toggleActions: "play none none none",
    //     },
    //   });
    // }

    // ----- 5. Pins Stagger Reveal (Desktop) -----
    // Wait briefly for JS to inject pins, then animate them
    // setTimeout(() => {
    //   const pins = document.querySelectorAll(
    //     "#university-partners .partners__pin",
    //   );
    //   if (pins.length) {
    //     gsap.set(pins, { opacity: 0, scale: 0, transformOrigin: "center" });
    //     gsap.to(pins, {
    //       opacity: 1,
    //       scale: 1,
    //       duration: 0.5,
    //       stagger: 0.06,
    //       ease: "back.out(1.7)",
    //       scrollTrigger: {
    //         trigger: "#university-partners .partners__map-stage",
    //         start: "top 70%",
    //         toggleActions: "play none none none",
    //       },
    //     });
    //   }
    // }, 100);

    // ----- 6. Mobile List Items Stagger -----
    setTimeout(() => {
      const mobileItems = document.querySelectorAll(
        "#university-partners .partners__mobile-item",
      );
      if (mobileItems.length) {
        gsap.set(mobileItems, { opacity: 0, x: -20 });
        gsap.to(mobileItems, {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#university-partners .partners__mobile-list",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      }
    }, 100);

    // ----- 7. Detail Panel Entrance -----
    const detailPanel = document.querySelector(
      "#university-partners .partners__detail-panel",
    );
    if (detailPanel) {
      gsap.to(detailPanel, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#university-partners .partners__detail-panel",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }
  }

  // =========================================================
  // â”€â”€ Faculty Insights Section Animations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Insight card grid with images. LIGHT theme.
  // =========================================================

  function initInsightsAnimations() {
    if (!elementExists("#faculty-insights")) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(
        ["#faculty-insights .text-reveal-inner", "#faculty-insights .fade-up"],
        { clearProps: "all", opacity: 1 },
      );
      gsap.set("#faculty-insights .text-reveal-inner", { y: "0%" });
      return;
    }

    // Section label fade up
    const sectionLabel = document.querySelector(
      "#faculty-insights .section-label",
    );
    if (sectionLabel) {
      gsap.fromTo(
        sectionLabel,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#faculty-insights",
            start: "top 75%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    // Heading text reveal
    const headingLines = document.querySelectorAll(
      "#faculty-insights .insights__heading-line .text-reveal-inner",
    );
    if (headingLines.length) {
      gsap.fromTo(
        headingLines,
        { y: "110%" },
        {
          y: "0%",
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "#faculty-insights",
            start: "top 75%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    // Subtitle fade up
    const subtitle = document.querySelector("#faculty-insights .insights__subtitle");
    if (subtitle) {
      gsap.fromTo(
        subtitle,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#faculty-insights",
            start: "top 75%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    // Insight cards stagger reveal
    const cards = document.querySelectorAll("#faculty-insights .insights__card");
    if (cards.length) {
      gsap.fromTo(
        cards,
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#faculty-insights .insights__scroll",
            start: "top 75%",
            toggleActions: "play none none none",
          },
        },
      );
    }
  }

  // =========================================================
  // â”€â”€ Upcoming Events Section Animations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Horizontal scroll event cards. DARK theme.
  // =========================================================

  function initEventsAnimations() {
    if (!elementExists("#upcoming-events")) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(
        ["#upcoming-events .text-reveal-inner", "#upcoming-events .fade-up"],
        { clearProps: "all", opacity: 1 },
      );
      gsap.set("#upcoming-events .text-reveal-inner", { y: "0%" });
      return;
    }

    // Section label fade up
    const sectionLabel = document.querySelector(
      "#upcoming-events .section-label",
    );
    if (sectionLabel) {
      gsap.fromTo(
        sectionLabel,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#upcoming-events",
            start: "top 75%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    // Heading text reveal
    const headingLines = document.querySelectorAll(
      "#upcoming-events .events__heading-line .text-reveal-inner",
    );
    if (headingLines.length) {
      gsap.fromTo(
        headingLines,
        { y: "110%" },
        {
          y: "0%",
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "#upcoming-events",
            start: "top 75%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    // Subtitle fade up
    const subtitle = document.querySelector("#upcoming-events .events__subtitle");
    if (subtitle) {
      gsap.fromTo(
        subtitle,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#upcoming-events",
            start: "top 75%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    // Event cards stagger reveal (x: 40 for horizontal effect)
    const cards = document.querySelectorAll("#upcoming-events .events__card");
    if (cards.length) {
      gsap.fromTo(
        cards,
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#upcoming-events .events__scroll",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );
    }
  }

  // =========================================================
  // â”€â”€ Video Testimonials Section Animations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Video card grid with tabs + modal. LIGHT theme.
  // =========================================================

  function initTestimonialsAnimations() {
    if (!elementExists("#video-testimonials")) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(
        ["#video-testimonials .text-reveal-inner", "#video-testimonials .fade-up"],
        { clearProps: "all", opacity: 1 },
      );
      gsap.set("#video-testimonials .text-reveal-inner", { y: "0%" });
      return;
    }

    // Section label fade up
    const sectionLabel = document.querySelector(
      "#video-testimonials .section-label",
    );
    if (sectionLabel) {
      gsap.fromTo(
        sectionLabel,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#video-testimonials",
            start: "top 75%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    // Heading text reveal
    const headingLines = document.querySelectorAll(
      "#video-testimonials .testimonials__heading-line .text-reveal-inner",
    );
    if (headingLines.length) {
      gsap.fromTo(
        headingLines,
        { y: "110%" },
        {
          y: "0%",
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "#video-testimonials",
            start: "top 75%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    // Subtitle fade up
    const subtitle = document.querySelector(
      "#video-testimonials .testimonials__subtitle",
    );
    if (subtitle) {
      gsap.fromTo(
        subtitle,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#video-testimonials",
            start: "top 75%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    // Cards stagger reveal
    const cards = document.querySelectorAll(
      "#video-testimonials .testimonials__card",
    );
    if (cards.length) {
      gsap.fromTo(
        cards,
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#video-testimonials .testimonials__scroll",
            start: "top 75%",
            toggleActions: "play none none none",
          },
        },
      );
    }
  }

  // =========================================================
  // â”€â”€ Final CTA Section Animations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Centered call-to-action with gradient. DARK theme.
  // =========================================================

  function initFinalCTAAnimations() {
    if (!elementExists("#final-cta")) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(
        ["#final-cta .text-reveal-inner", "#final-cta .fade-up"],
        { clearProps: "all", opacity: 1 },
      );
      gsap.set("#final-cta .text-reveal-inner", { y: "0%" });
      return;
    }

    // Section label fade up
    const sectionLabel = document.querySelector("#final-cta .section-label");
    if (sectionLabel) {
      gsap.fromTo(
        sectionLabel,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#final-cta",
            start: "top 70%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    // Heading text reveal (single line)
    const headingInner = document.querySelector(
      "#final-cta .text-reveal-inner",
    );
    if (headingInner) {
      gsap.fromTo(
        headingInner,
        { y: "110%" },
        {
          y: "0%",
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "#final-cta",
            start: "top 70%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    // Subtitle fade up
    const subtitle = document.querySelector("#final-cta .final-cta__subtitle");
    if (subtitle) {
      gsap.fromTo(
        subtitle,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#final-cta",
            start: "top 70%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    // Buttons fade up with stagger
    const buttons = document.querySelectorAll("#final-cta .final-cta__btn");
    if (buttons.length) {
      gsap.fromTo(
        buttons,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#final-cta .final-cta__buttons",
            start: "top 70%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    // Phone text fade up (last)
    const phone = document.querySelector("#final-cta .final-cta__phone");
    if (phone) {
      gsap.fromTo(
        phone,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#final-cta .final-cta__phone",
            start: "top 75%",
            toggleActions: "play none none none",
          },
        },
      );
    }
  }

  // =========================================================
  // INITIALIZE
  // =========================================================

  function initFooterAnimations() {
    if (!elementExists("#footer")) return;
    
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    // Update copyright year dynamically
    const yearEl = document.querySelector("[data-current-year]");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
    
    // Newsletter form submit handler (placeholder — actual submission via PHP later)
    const newsletterForm = document.querySelector("[data-newsletter-form]");
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector(".footer__newsletter-input");
        const btn = newsletterForm.querySelector(".footer__newsletter-btn span");
        if (input && input.value && btn) {
          const originalText = btn.textContent;
          btn.textContent = "Subscribed ✓";
          input.value = "";
          setTimeout(() => {
            btn.textContent = originalText;
          }, 2500);
        }
      });
    }
    
    if (prefersReducedMotion) return;
    
    // FOUC prevention
    const cols = document.querySelectorAll(".footer__col");
    const bottom = document.querySelector(".footer__bottom");
    
    if (cols.length) gsap.set(cols, { opacity: 0, y: 30 });
    if (bottom) gsap.set(bottom, { opacity: 0, y: 20 });
    
    // Columns stagger reveal
    if (cols.length) {
      gsap.to(cols, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#footer",
          start: "top 85%",
          toggleActions: "play none none none"
        }
      });
    }
    
    // Bottom row
    if (bottom) {
      gsap.to(bottom, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: "#footer",
          start: "top 85%",
          toggleActions: "play none none none"
        }
      });
    }
  }

  // =========================================================
  // â”€â”€ Accreditations, Partnerships & Recognitions Section Animations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Infinite logo slider + hover effects + scroll animations
  // =========================================================

  function initAccreditationsAnimations() {
    if (!elementExists("#accreditations")) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // If reduced motion: make everything visible, skip slider animation
    if (prefersReducedMotion) {
      gsap.set(
        [
          ".accreditations__header",
          ".accreditations__badges",
          ".accred-slider-track .accred-card",
          ".accreditations__trust",
        ],
        { clearProps: "all", opacity: 1 },
      );
      return;
    }

    // Initialize all accreditations animations
    initAccredSlider();
    initAccredScrollAnimations();
  }

  // ----- Infinite Logo Slider -----
  function initAccredSlider() {
    initInfiniteSlider('.accred-slider-track', '.accred-slider-wrapper', {
      duration: 50,
      direction: 'left',
      enableOnMobile: false, // Disable on mobile for performance
    });
  }

  // ----- Scroll Trigger Animations -----
  function initAccredScrollAnimations() {
    const accredSection = document.querySelector("#accreditations");
    if (!accredSection) return;

    // Skip scroll animations on mobile for performance
    if (isMobile()) {
      gsap.set(
        [
          ".accreditations .section-label",
          ".accreditations__heading",
          ".accreditations__subheading",
          ".accreditations__badges",
          ".accred-slider-track .accred-card",
          ".accreditations__trust",
        ],
        { clearProps: "all", opacity: 1 },
      );
      return;
    }

    // 1. Section label fades in
    const sectionLabel = accredSection.querySelector(".section-label");
    if (sectionLabel) {
      gsap.fromTo(
        sectionLabel,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#accreditations",
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        },
      );
    }

    // 2. Heading fades in
    const heading = accredSection.querySelector(".accreditations__heading");
    if (heading) {
      gsap.fromTo(
        heading,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#accreditations",
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        },
      );
    }

    // 3. Subheading fades in
    const subheading = accredSection.querySelector(".accreditations__subheading");
    if (subheading) {
      gsap.fromTo(
        subheading,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#accreditations",
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        },
      );
    }

    // 4. Badges appear with stagger effect
    const badges = document.querySelectorAll(".accreditations__badges");
    if (badges.length) {
      gsap.fromTo(
        badges,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#accreditations",
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        },
      );
    }

    // 5. Cards scale up from 0.9 to 1.0
    const cards = document.querySelectorAll(".accred-slider-track .accred-card");
    if (cards.length) {
      gsap.fromTo(
        cards,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.7,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#accreditations",
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        },
      );
    }

    // 6. Trust statement fades in
    const trust = document.querySelector(".accreditations__trust");
    if (trust) {
      gsap.fromTo(
        trust,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#accreditations",
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        },
      );
    }
  }

  // =========================================================
  // â”€â”€ Network / Alumni Section Animations â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â€
  // Infinite company logo slider + hover effects + scroll animations
  // =========================================================

  function initNetworkAnimations() {
    if (!elementExists("#alumni-network")) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // If reduced motion: make everything visible, skip slider animation
    if (prefersReducedMotion) {
      gsap.set(
        [
          ".network__header",
          ".network-slider-track .network-card",
          ".network__trust",
        ],
        { clearProps: "all", opacity: 1 },
      );
      return;
    }

    // Initialize all network animations
    initNetworkSlider();
    initNetworkScrollAnimations();
  }

  // ----- Infinite Logo Slider -----
  function initNetworkSlider() {
    initInfiniteSlider('.network-slider-track', '.network-slider-wrapper', {
      duration: 50,
      direction: 'left',
      enableOnMobile: false, // Disable on mobile for performance
    });
  }

  // ----- Scroll Trigger Animations -----
  function initNetworkScrollAnimations() {
    const networkSection = document.querySelector("#alumni-network");
    if (!networkSection) return;

    // Skip scroll animations on mobile for performance
    if (isMobile()) {
      gsap.set(
        [
          ".network .section-label",
          ".network__heading",
          ".network__subheading",
          ".network__description",
          ".network-slider-track .network-card",
          ".network__trust",
        ],
        { clearProps: "all", opacity: 1 },
      );
      return;
    }

    // 1. Section label fades in
    const sectionLabel = networkSection.querySelector(".section-label");
    if (sectionLabel) {
      gsap.fromTo(
        sectionLabel,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#alumni-network",
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        },
      );
    }

    // 2. Heading fades in
    const heading = networkSection.querySelector(".network__heading");
    if (heading) {
      gsap.fromTo(
        heading,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#alumni-network",
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        },
      );
    }

    // 3. Subheading fades in
    const subheading = networkSection.querySelector(".network__subheading");
    if (subheading) {
      gsap.fromTo(
        subheading,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#alumni-network",
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        },
      );
    }

    // 4. Description fades in
    const description = networkSection.querySelector(".network__description");
    if (description) {
      gsap.fromTo(
        description,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#alumni-network",
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        },
      );
    }

    // 5. Cards scale up from 0.9 to 1.0
    const cards = document.querySelectorAll(".network-slider-track .network-card");
    if (cards.length) {
      gsap.fromTo(
        cards,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.7,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#alumni-network",
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        },
      );
    }

    // 6. Trust statement fades in
    const trust = document.querySelector(".network__trust");
    if (trust) {
      gsap.fromTo(
        trust,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "#alumni-network",
            start: "top 80%",
            toggleActions: "play none none none",
            once: true,
          },
        },
      );
    }
  }

  function initAllAnimations() {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // --- Hero ---
    if (!prefersReducedMotion) {
      initHeroAnimations();
    } else {
      // Reduced motion: make all hero elements immediately visible
      gsap.set(
        [
          ".text-reveal-inner",
          ".fade-up",
          ".hero__accent-bar",
          ".hero__video-fallback",
          ".hero__video",
          ".hero__overlay",
        ],
        { clearProps: "all" },
      );
      // Ensure visibility
      gsap.set([".text-reveal-inner", ".fade-up"], {
        opacity: 1,
        y: 0,
        clearProps: "transform",
      });
      if (elementExists(".hero__accent-bar")) {
        gsap.set(".hero__accent-bar", { opacity: 1, scaleY: 1 });
      }
    }

    initHeroScrollAnimations();

    // --- Numbers Section ---
    initNumbersAnimations();

    // --- What Is Maverick Section ---
    initWIMAnimations();

    // --- Who We Are Section ---
    initWWAAnimations();
    
    // --- CEO Message Section ---
    initCEOAnimations();

    // --- What We Do Section ---
    initWWDAnimations();

    // --- How We Do It Section ---
    initHWDIAnimations();

    // --- Alumni Network Section ---
    initAlumniAnimations();

    // --- Featured Programs Section ---
    initProgramsAnimations();

    // --- Why Maverick Section ---
    initWhyMaverickAnimations();

    // Global Opportunities & Pathways Section
    initOpportunitiesAnimations();

    // --- University Partners Section ---
    initPartnersAnimations();

    // --- Faculty Insights Section ---
    initInsightsAnimations();

    // --- Upcoming Events Section ---
    initEventsAnimations();

    // --- Video Testimonials Section ---
    initTestimonialsAnimations();

    // --- Final CTA Section ---
    initFinalCTAAnimations();

    // --- Footer ---
    initFooterAnimations();

    // --- Accreditations, Partnerships & Recognitions Section ---
    initAccreditationsAnimations();

    // --- Network / Alumni Section ---
    initNetworkAnimations();

    // Force ScrollTrigger to recalculate after all triggers are created
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.refresh();
    }

    console.log(
      "Maverick Animations â€” Hero + Numbers + WIM + WWA + WWD + HWDI + Insights + Events + Testimonials + Final CTA Modules Initialized",
    );
  }

  // Safe listener pattern with global flag
  function startAnimations() {
    if (window.__animationsStarted) return;
    window.__animationsStarted = true;
    initAllAnimations();
  }

  if (window.__lenisReady) {
    startAnimations();
  } else {
    document.addEventListener("lenisReady", startAnimations, { once: true });
  }

  // Safety fallback â€” start anyway after 1s
  setTimeout(function () {
    if (!window.__animationsStarted) {
      console.warn("lenisReady never fired â€” starting anyway");
      startAnimations();
    }
  }, 1000);
})();


