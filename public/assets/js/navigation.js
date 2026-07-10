/**
 * Maverick Business Academy
 * Navigation — Complete Interaction Module
 * 
 * Features:
 *  1. Scroll State Change (is-scrolled @ 80px)
 *  2. Hide on Scroll Down / Show on Scroll Up (is-hidden @ 200px)
 *  3. Logo Transition (CSS-driven)
 *  4. Active Page Indicator
 *  5. Desktop Mega Menu (Programs)
 *  6. Desktop Dropdown Menus (About Us, Global Pathways)
 *  7. Mobile Hamburger Menu
 *  8. Mobile Accordion Submenus
 *  9. GSAP Program Cards Animation
 * 10. Keyboard Accessibility
 */

(function() {
  'use strict';

  // =========================================================
  // CACHE DOM ELEMENTS
  // =========================================================

  const navbar = document.getElementById('navbar');

  if (!navbar) {
    console.warn('Navigation: #navbar element not found.');
    return;
  }

  const navLinks = navbar.querySelectorAll('.navbar__link[href]');

  // Desktop mega menu
  const megaItem = navbar.querySelector('.navbar__item--has-mega');
  const megaTrigger = megaItem ? megaItem.querySelector('[data-menu="programs"]') : null;
  const megaPanel = navbar.querySelector('.navbar__mega[data-mega="programs"]');
  const megaBackdrop = megaPanel ? megaPanel.querySelector('.mega__backdrop') : null;

  // Desktop dropdowns
  const dropdownItems = navbar.querySelectorAll('.navbar__item--has-dropdown');

  function syncDropdownAccessibility(item) {
    const trigger = item.querySelector('.navbar__link--trigger');
    const dropdown = item.querySelector('.navbar__dropdown');
    if (!trigger || !dropdown) return;
    const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
    dropdown.setAttribute('aria-hidden', isExpanded ? 'false' : 'true');
  }

  // Mobile menu
  const hamburger = navbar.querySelector('.navbar__hamburger');
  const mobileMenu = navbar.querySelector('.navbar__mobile');
  const mobileTriggers = navbar.querySelectorAll('.navbar__mobile-trigger');

  // =========================================================
  // STATE
  // =========================================================

  // Scroll state
  let lastScrollY = window.scrollY || window.pageYOffset || 0;
  let currentScrollY = lastScrollY;
  let ticking = false;

  const SCROLLED_THRESHOLD = 80;
  const HIDE_THRESHOLD = 200;

  // Menu state
  let megaCloseTimeout = null;
  const dropdownCloseTimeouts = new Map();
  let isMobileMenuOpen = false;

  // Breakpoint
  const DESKTOP_BREAKPOINT = 1024;

  function isDesktop() {
    return window.innerWidth >= DESKTOP_BREAKPOINT;
  }

  // =========================================================
  // SCROLL BEHAVIOR
  // =========================================================
  // Behavior 1: is-scrolled toggle
  // Behavior 2: is-hidden toggle (hide on down, show on up)
  // Behavior 3: Logo transition (CSS handles via .is-scrolled)

  function updateNavbarState() {
    currentScrollY = window.scrollY || window.pageYOffset || 0;

    // Behavior 1: Scroll State Change
    if (currentScrollY > SCROLLED_THRESHOLD) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }

    // Behavior 2: Hide on Scroll Down / Show on Scroll Up
    // Don't hide while a mega menu / dropdown is open
    const menuOpen = navbar.querySelector('.navbar__item--has-mega.is-active, .navbar__item--has-dropdown.is-active');
    
    if (currentScrollY > HIDE_THRESHOLD && !menuOpen && !isMobileMenuOpen) {
      if (currentScrollY > lastScrollY) {
        navbar.classList.add('is-hidden');
      } else if (currentScrollY < lastScrollY) {
        navbar.classList.remove('is-hidden');
      }
    } else {
      navbar.classList.remove('is-hidden');
    }

    lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
    ticking = false;
  }

  function onScroll() {
    currentScrollY = window.scrollY || window.pageYOffset || 0;
    if (!ticking) {
      window.requestAnimationFrame(updateNavbarState);
      ticking = true;
    }
  }

  // =========================================================
  // ACTIVE PAGE INDICATOR
  // =========================================================

  function setActiveNavLink() {
    if (!navLinks.length) return;

    const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
    let matched = false;

    navLinks.forEach(link => {
      link.classList.remove('is-current');
      try {
        const linkUrl = new URL(link.getAttribute('href'), window.location.origin);
        const linkPath = linkUrl.pathname.replace(/\/$/, '') || '/';
        if (
          linkPath === currentPath ||
          (linkPath !== '/' && currentPath.startsWith(linkPath + '/'))
        ) {
          link.classList.add('is-current');
          matched = true;
        }
      } catch (e) {}
    });

    if (!matched && (currentPath === '/' || currentPath.endsWith('index.html'))) {
      const firstTopLink = navbar.querySelector('.navbar__menu > .navbar__item > a.navbar__link');
      if (firstTopLink) firstTopLink.classList.add('is-current');
    }
  }

  // =========================================================
  // GSAP ANIMATIONS - Mega Menu
  // =========================================================

  function animateMegaMenuIn() {
    if (typeof gsap === 'undefined') return;

    const cards = megaPanel ? megaPanel.querySelectorAll('.mega__program-card') : [];
    const labelCol = megaPanel ? megaPanel.querySelector('.mega__label-col') : null;
    const featuredCard = megaPanel ? megaPanel.querySelector('.mega__featured-card') : null;

    // Kill any existing tweens to prevent stacking
    gsap.killTweensOf([cards, labelCol, featuredCard]);

    if (labelCol) {
      gsap.fromTo(labelCol,
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', overwrite: true }
      );
    }

    if (cards.length) {
      gsap.fromTo(cards,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: 'power2.out', delay: 0.1, overwrite: true }
      );
    }

    if (featuredCard) {
      gsap.fromTo(featuredCard,
        { opacity: 0, x: 10 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', overwrite: true }
      );
    }
  }

  // =========================================================
  // MEGA MENU (Programs)
  // =========================================================

  function openMegaMenu() {
    if (!megaItem || !megaPanel) return;
    if (megaCloseTimeout) {
      clearTimeout(megaCloseTimeout);
      megaCloseTimeout = null;
    }
    // Close any open dropdowns first
    closeAllDropdowns(true);

    megaItem.classList.add('is-active');
    megaPanel.classList.add('is-open');
    megaPanel.setAttribute('aria-hidden', 'false');
    if (megaTrigger) megaTrigger.setAttribute('aria-expanded', 'true');

    animateMegaMenuIn();
  }

  function closeMegaMenu(immediate = false) {
    if (!megaItem || !megaPanel) return;

    const doClose = () => {
      megaItem.classList.remove('is-active');
      megaPanel.classList.remove('is-open');
      megaPanel.setAttribute('aria-hidden', 'true');
      if (megaTrigger) megaTrigger.setAttribute('aria-expanded', 'false');
      megaCloseTimeout = null;
    };

    if (immediate) {
      if (megaCloseTimeout) clearTimeout(megaCloseTimeout);
      doClose();
    } else {
      if (megaCloseTimeout) clearTimeout(megaCloseTimeout);
      megaCloseTimeout = setTimeout(doClose, 150);
    }
  }

  function initMegaMenu() {
    if (!megaItem || !megaPanel || !megaTrigger) return;

    // Hover open (desktop only)
    megaItem.addEventListener('mouseenter', () => {
      if (!isDesktop()) return;
      openMegaMenu();
    });

    megaItem.addEventListener('mouseleave', () => {
      if (!isDesktop()) return;
      closeMegaMenu(false);
    });

    // Click toggle
    megaTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = megaPanel.classList.contains('is-open');
      if (isOpen) {
        closeMegaMenu(true);
      } else {
        openMegaMenu();
      }
    });

    // Backdrop click closes
    if (megaBackdrop) {
      megaBackdrop.addEventListener('click', () => closeMegaMenu(true));
    }
  }

  // =========================================================
  // DROPDOWN MENUS (About Us, Global Pathways)
  // =========================================================

  function openDropdown(item) {
    const trigger = item.querySelector('.navbar__link--trigger');
    const dropdown = item.querySelector('.navbar__dropdown');

    // Clear any pending close for this item
    const existingTimeout = dropdownCloseTimeouts.get(item);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      dropdownCloseTimeouts.delete(item);
    }

    // Close mega menu if open
    closeMegaMenu(true);

    // Close other dropdowns
    dropdownItems.forEach(other => {
      if (other !== item) closeDropdown(other, true);
    });

    item.classList.add('is-active');
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    if (dropdown) dropdown.setAttribute('aria-hidden', 'false');
    syncDropdownAccessibility(item);
  }

  function closeDropdown(item, immediate = false) {
    const trigger = item.querySelector('.navbar__link--trigger');
    const dropdown = item.querySelector('.navbar__dropdown');

    const doClose = () => {
      item.classList.remove('is-active');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
      if (dropdown) dropdown.setAttribute('aria-hidden', 'true');
      dropdownCloseTimeouts.delete(item);
      syncDropdownAccessibility(item);
    };

    if (immediate) {
      const t = dropdownCloseTimeouts.get(item);
      if (t) clearTimeout(t);
      doClose();
    } else {
      const existing = dropdownCloseTimeouts.get(item);
      if (existing) clearTimeout(existing);
      const timeout = setTimeout(doClose, 150);
      dropdownCloseTimeouts.set(item, timeout);
    }
  }

  function closeAllDropdowns(immediate = false) {
    dropdownItems.forEach(item => closeDropdown(item, immediate));
  }

  function initDropdowns() {
    dropdownItems.forEach(item => {
      const trigger = item.querySelector('.navbar__link--trigger');
      if (!trigger) return;

      // Hover
      item.addEventListener('mouseenter', () => {
        if (!isDesktop()) return;
        openDropdown(item);
      });

      item.addEventListener('mouseleave', () => {
        if (!isDesktop()) return;
        closeDropdown(item, false);
      });

      // Click toggle
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = item.classList.contains('is-active');
        if (isOpen) {
          closeDropdown(item, true);
        } else {
          openDropdown(item);
        }
      });
    });
  }

  // =========================================================
  // CLOSE MENUS - Outside click / Escape
  // =========================================================

  function closeAllMenus(immediate = true) {
    closeMegaMenu(immediate);
    closeAllDropdowns(immediate);
  }

  function initGlobalMenuClose() {
    // Click outside
    document.addEventListener('click', (e) => {
      // If click is inside navbar, let individual handlers deal with it
      if (navbar.contains(e.target)) return;
      closeAllMenus(true);
    });

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        if (isMobileMenuOpen) {
          closeMobileMenu();
        } else {
          closeAllMenus(true);
        }
      }
    });
  }

  // =========================================================
  // MOBILE MENU
  // =========================================================

  function openMobileMenu() {
    if (!hamburger || !mobileMenu) return;
    isMobileMenuOpen = true;

    hamburger.classList.add('is-active');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close menu');

    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');

    navbar.classList.add('is-menu-open');
    document.body.classList.add('no-scroll');

    // Ensure navbar is visible
    navbar.classList.remove('is-hidden');

    // Stop Lenis while mobile menu overlay is open
    if (window.lenisInstance && typeof window.lenisInstance.stop === 'function') {
      window.lenisInstance.stop();
    }
  }

  function closeMobileMenu() {
    if (!hamburger || !mobileMenu) return;
    isMobileMenuOpen = false;

    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Toggle mobile menu');

    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');

    navbar.classList.remove('is-menu-open');
    document.body.classList.remove('no-scroll');

    // Close all submenus
    closeAllMobileSubmenus();

    // Resume Lenis after mobile menu overlay closes
    if (window.lenisInstance && typeof window.lenisInstance.start === 'function') {
      window.lenisInstance.start();
    }
  }

  function toggleMobileMenu() {
    if (isMobileMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function initMobileMenu() {
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    // Close mobile menu when a standard link (non-trigger) is clicked
    const mobileLinks = mobileMenu.querySelectorAll('a.navbar__mobile-link, a.navbar__mobile-sublink');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        // Small delay so navigation can register
        setTimeout(closeMobileMenu, 150);
      });
    });
  }

  // =========================================================
  // MOBILE ACCORDION SUBMENUS
  // =========================================================

  function closeAllMobileSubmenus(exceptTrigger = null) {
    mobileTriggers.forEach(trigger => {
      if (trigger === exceptTrigger) return;
      const key = trigger.getAttribute('data-mobile-menu');
      const submenu = navbar.querySelector(`.navbar__mobile-submenu[data-mobile-submenu="${key}"]`);
      if (submenu) {
        trigger.classList.remove('is-active');
        submenu.classList.remove('is-open');
        submenu.style.maxHeight = '0px';
      }
    });
  }

  function toggleMobileSubmenu(trigger) {
    const key = trigger.getAttribute('data-mobile-menu');
    if (!key) return;

    const submenu = navbar.querySelector(`.navbar__mobile-submenu[data-mobile-submenu="${key}"]`);
    if (!submenu) return;

    const isOpen = submenu.classList.contains('is-open');

    if (isOpen) {
      // Close
      trigger.classList.remove('is-active');
      submenu.classList.remove('is-open');
      submenu.style.maxHeight = '0px';
    } else {
      // Close others first (only one open at a time)
      closeAllMobileSubmenus(trigger);

      // Open
      trigger.classList.add('is-active');
      submenu.classList.add('is-open');
      // Set max-height to scrollHeight for animation
      submenu.style.maxHeight = submenu.scrollHeight + 'px';
    }
  }

  function initMobileAccordion() {
    mobileTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMobileSubmenu(trigger);
      });
    });
  }

  // =========================================================
  // KEYBOARD ACCESSIBILITY
  // =========================================================

  function initKeyboardNav() {
    // Close dropdown when focus leaves it
    dropdownItems.forEach(item => {
      const dropdown = item.querySelector('.navbar__dropdown');
      if (!dropdown) return;

      const focusable = dropdown.querySelectorAll('a');
      if (!focusable.length) return;

      const lastLink = focusable[focusable.length - 1];
      lastLink.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && !e.shiftKey) {
          // Tabbing forward out of dropdown
          closeDropdown(item, true);
        }
      });

      const firstLink = focusable[0];
      const trigger = item.querySelector('.navbar__link--trigger');
      if (trigger && firstLink) {
        firstLink.addEventListener('keydown', (e) => {
          if (e.key === 'Tab' && e.shiftKey) {
            // Shift+Tab back to trigger - keep open, normal behavior
          }
        });
      }
    });

    // Arrow key navigation inside dropdowns
    dropdownItems.forEach(item => {
      const dropdown = item.querySelector('.navbar__dropdown');
      if (!dropdown) return;
      const links = Array.from(dropdown.querySelectorAll('.navbar__dropdown-link'));
      links.forEach((link, i) => {
        link.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = links[i + 1] || links[0];
            next.focus();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = links[i - 1] || links[links.length - 1];
            prev.focus();
          } else if (e.key === 'Escape') {
            closeDropdown(item, true);
            const trigger = item.querySelector('.navbar__link--trigger');
            if (trigger) trigger.focus();
          }
        });
      });
    });
  }

  // =========================================================
  // RESPONSIVE HANDLING
  // =========================================================

  function handleResize() {
    // If we resize to desktop while mobile menu is open, close it
    if (isDesktop() && isMobileMenuOpen) {
      closeMobileMenu();
    }
    // Close desktop menus if we resize to mobile
    if (!isDesktop()) {
      closeAllMenus(true);
    }
    // Recalculate open mobile submenu heights
    if (isMobileMenuOpen) {
      navbar.querySelectorAll('.navbar__mobile-submenu.is-open').forEach(submenu => {
        submenu.style.maxHeight = submenu.scrollHeight + 'px';
      });
    }
  }

  // =========================================================
  // INITIALIZE
  // =========================================================

  function init() {
    // Scroll + active page
    updateNavbarState();
    setActiveNavLink();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Menus
    initMegaMenu();
    initDropdowns();
    initGlobalMenuClose();

    // Mobile
    initMobileMenu();
    initMobileAccordion();

    // Keyboard
    initKeyboardNav();

    // Resize
    let resizeRaf = false;
    window.addEventListener('resize', () => {
      if (resizeRaf) return;
      resizeRaf = true;
      requestAnimationFrame(() => {
        handleResize();
        resizeRaf = false;
      });
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
