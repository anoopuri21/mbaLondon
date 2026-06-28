(function () {
  "use strict";

  const SCROLL_AMOUNT_DESKTOP = 420;
  const SCROLL_DURATION = 600;
  const DRAG_THRESHOLD = 5; // pixels — must exceed this to count as drag

  function initScrollRow(row) {
    const container = row.querySelector("[data-scroll-container]");
    const prevBtn = row.querySelector("[data-scroll-prev]");
    const nextBtn = row.querySelector("[data-scroll-next]");

    if (!container) return;

    let isDown = false;
    let hasDragged = false;
    let startX = 0;
    let startPageX = 0;
    let scrollLeft = 0;
    let velocity = 0;
    let lastX = 0;
    let lastTime = 0;
    let momentumId = null;

    // ===== MOUSEDOWN: Start tracking =====
    container.addEventListener("mousedown", (e) => {
      isDown = true;
      hasDragged = false;
      startX = e.pageX - container.offsetLeft;
      startPageX = e.pageX;
      scrollLeft = container.scrollLeft;
      lastX = e.pageX;
      lastTime = Date.now();
      cancelAnimationFrame(momentumId);
    });

    // ===== MOUSEMOVE: Detect if user is dragging =====
    container.addEventListener("mousemove", (e) => {
      if (!isDown) return;

      const distance = Math.abs(e.pageX - startPageX);

      // Only treat as drag if user moved beyond threshold
      if (distance > DRAG_THRESHOLD) {
        if (!hasDragged) {
          hasDragged = true;
          container.classList.add("is-dragging");
        }

        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 1.5;
        container.scrollLeft = scrollLeft - walk;

        // Calculate velocity for momentum
        const now = Date.now();
        const dt = now - lastTime;
        if (dt > 0) {
          velocity = (e.pageX - lastX) / dt;
        }
        lastX = e.pageX;
        lastTime = now;
      }
    });

    // ===== MOUSEUP: Stop tracking =====
    container.addEventListener("mouseup", () => {
      if (!isDown) return;
      isDown = false;

      if (hasDragged) {
        container.classList.remove("is-dragging");
        applyMomentum();
      }
      // If !hasDragged, this was a click — do nothing, let click pass
    });

    container.addEventListener("mouseleave", () => {
      if (!isDown) return;
      isDown = false;

      if (hasDragged) {
        container.classList.remove("is-dragging");
        applyMomentum();
      }
    });

    function applyMomentum() {
      const decay = 0.95;
      function step() {
        if (Math.abs(velocity) < 0.1) {
          cancelAnimationFrame(momentumId);
          return;
        }
        container.scrollLeft -= velocity * 16;
        velocity *= decay;
        momentumId = requestAnimationFrame(step);
      }
      momentumId = requestAnimationFrame(step);
    }

    // ===== CLICK SUPPRESSION =====
    // Only suppress clicks if a real drag happened (hasDragged was true)
    // Use capture phase to catch click before it reaches links/buttons
    container.addEventListener(
      "click",
      (e) => {
        if (hasDragged) {
          e.preventDefault();
          e.stopPropagation();
          // Reset for next interaction
          hasDragged = false;
        }
      },
      true,
    );

    // ===== ARROW BUTTONS =====
    function smoothScrollBy(amount) {
      const start = container.scrollLeft;
      const target = start + amount;
      const startTime = performance.now();

      function animate(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / SCROLL_DURATION, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        container.scrollLeft = start + (target - start) * eased;
        if (progress < 1) requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        smoothScrollBy(-SCROLL_AMOUNT_DESKTOP);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        smoothScrollBy(SCROLL_AMOUNT_DESKTOP);
      });
    }

    // ===== BUTTON STATE UPDATE =====
    function updateButtons() {
      if (!prevBtn || !nextBtn) return;
      const maxScroll = container.scrollWidth - container.clientWidth;
      prevBtn.disabled = container.scrollLeft <= 1;
      nextBtn.disabled = container.scrollLeft >= maxScroll - 1;
    }

    container.addEventListener("scroll", updateButtons);
    window.addEventListener("resize", updateButtons);

    updateButtons();
    setTimeout(updateButtons, 500);
    setTimeout(updateButtons, 1500);
  }

  function init() {
    const rows = document.querySelectorAll("[data-scroll-row]");
    rows.forEach(initScrollRow);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
