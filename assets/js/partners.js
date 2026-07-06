/* ============================================================
   PARTNERS.JS — University Partners Section (Section 11)
   Powered by: D3-Geo + TopoJSON (lazy-loaded)
   Performance: Lazy load, debounced resize, accessibility
   PHP Migration: countriesData array → DB query
   ============================================================ */

(function () {
  "use strict";

  // ========================================================
  // ── CONFIG ──────────────────────────────────────────────
  // ========================================================

  const PLACEHOLDER_LOGO = "assets/images/universities/placeholder-logo.png";

  const D3_CDN = "https://cdn.jsdelivr.net/npm/d3@7.8.5/dist/d3.min.js";
  const TOPOJSON_CDN =
    "https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js";
  const WORLD_TOPO_URL =
    "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json";

  const RESIZE_DEBOUNCE_MS = 250;
  const LAZY_LOAD_MARGIN = "200px";

  // ========================================================
  // ── COUNTRY + UNIVERSITY DATA ───────────────────────────
  // ── PHP Migration: Replace with DB query output         ──
  // ========================================================

  const countriesData = [
    {
      id: "uae",
      name: "United Arab Emirates",
      city: "Dubai",
      lat: 25.2048,
      lng: 55.2708,
      isHub: true,
      universities: [
        {
          name: "Dubai International Business School",
          country: "United Arab Emirates",
          recognition: "KHDA Approved · UAE Accredited",
          programs: [
            { name: "MBA Finance", url: "/programs/mba-finance/" },
            { name: "Master in Project Management", url: "/programs/mpm/" },
          ],
        },
      ],
    },
    {
      id: "uk",
      name: "United Kingdom",
      city: "London",
      lat: 51.5074,
      lng: -0.1278,
      isHub: false,
      universities: [
        {
          name: "Maverick Business Academy",
          country: "United Kingdom",
          recognition: "OFS Registered · QAA Reviewed",
          programs: [
            { name: "Global MBA", url: "/programs/global-mba/" },
            { name: "DBA", url: "/programs/dba/" },
            { name: "PhD Business Management", url: "/programs/phd/" },
          ],
        },
        {
          name: "London Institute of Management",
          country: "United Kingdom",
          recognition: "UK Accredited · Royal Charter",
          programs: [
            { name: "BSc Business Management", url: "/programs/bsc/" },
            { name: "MBA Project Management", url: "/programs/mba-pm/" },
          ],
        },
      ],
    },
    {
      id: "india",
      name: "India",
      city: "Delhi",
      lat: 28.6139,
      lng: 77.2090,
      isHub: false,
      universities: [
        {
          name: "Swiss Business School",
          country: "India",
          recognition: "Triple Accredited · AACSB · EQUIS",
          programs: [
            { name: "Swiss Global MBA", url: "/programs/swiss-mba/" },
            { name: "Executive MBA", url: "/programs/exec-mba/" },
          ],
        },
      ],
    },
    {
      id: "usa",
      name: "United States",
      city: "New York",
      lat: 40.7128,
      lng: -74.006,
      isHub: false,
      universities: [
        {
          name: "New York Business Institute",
          country: "United States",
          recognition: "AACSB Accredited",
          programs: [
            { name: "Global MBA", url: "/programs/global-mba-us/" },
            { name: "DBA", url: "/programs/dba-us/" },
          ],
        },
      ],
    },
    {
      id: "singapore",
      name: "Singapore",
      city: "Singapore",
      lat: 1.3521,
      lng: 103.8198,
      isHub: false,
      universities: [
        {
          name: "Singapore Institute of Management",
          country: "Singapore",
          recognition: "CPE Registered · EduTrust Certified",
          programs: [
            { name: "Global MBA Asia", url: "/programs/mba-asia/" },
            {
              name: "Master in Business Analytics",
              url: "/programs/mba-analytics/",
            },
          ],
        },
      ],
    },
    {
      id: "australia",
      name: "Australia",
      city: "Sydney",
      lat: -33.8688,
      lng: 151.2093,
      isHub: false,
      universities: [
        {
          name: "Sydney Business Academy",
          country: "Australia",
          recognition: "TEQSA Registered",
          programs: [
            { name: "MBA Leadership", url: "/programs/mba-leadership/" },
            { name: "Master of Commerce", url: "/programs/master-commerce/" },
          ],
        },
      ],
    },
  ];

  // ========================================================
  // ── STATE ───────────────────────────────────────────────
  // ========================================================

  let mapInitialized = false;
  let projection = null;
  let worldData = null;
  let resizeTimer = null;
  let librariesLoaded = false;
  let librariesLoading = false;

  // ========================================================
  // ── LAZY SCRIPT LOADER ──────────────────────────────────
  // ========================================================

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load: ${src}`));
      document.head.appendChild(script);
    });
  }

  async function loadMapLibraries() {
    if (librariesLoaded || librariesLoading) return;
    librariesLoading = true;

    try {
      // Load D3 first, then TopoJSON (sequential to avoid conflicts)
      await loadScript(D3_CDN);
      await loadScript(TOPOJSON_CDN);
      librariesLoaded = true;
      librariesLoading = false;
      return true;
    } catch (err) {
      console.error("[Partners] Failed to load map libraries:", err);
      librariesLoading = false;
      return false;
    }
  }

  // ========================================================
  // ── D3 MAP RENDERING ────────────────────────────────────
  // ========================================================

  async function renderD3Map() {
    if (mapInitialized) return;

    const container = document.getElementById("partnersMapContainer");
    if (!container) return;

    // Ensure libraries loaded
    if (typeof d3 === "undefined" || typeof topojson === "undefined") {
      const loaded = await loadMapLibraries();
      if (!loaded) return;
    }

    // Fetch world TopoJSON if not cached
    if (!worldData) {
      try {
        const response = await fetch(WORLD_TOPO_URL);
        worldData = await response.json();
      } catch (err) {
        console.error("[Partners] Failed to load world map data:", err);
        return;
      }
    }

    // Clear container (in case of re-render)
    container.innerHTML = "";

    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    if (width === 0 || height === 0) {
      console.warn("[Partners] Container has zero dimensions, skipping render");
      return;
    }

    // Mercator projection
    projection = d3.geoMercator();

    const countries = topojson.feature(worldData, worldData.objects.countries);

    // Fit projection excluding Antarctica for better width usage
    const visibleBounds = {
      type: "Polygon",
      coordinates: [
        [
          [-180, 83],
          [180, 83],
          [180, -58],
          [-180, -58],
          [-180, 83],
        ],
      ],
    };

    projection.fitSize([width, height], visibleBounds);

    const pathGenerator = d3.geoPath().projection(projection);

    // Create SVG
    const svg = d3
      .select(container)
      .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    // Country shapes
    svg
      .append("g")
      .attr("class", "partners__countries-group")
      .selectAll("path")
      .data(countries.features)
      .enter()
      .append("path")
      .attr("class", "partners__country")
      .attr("d", pathGenerator);

    // Pins
    const pinsGroup = svg
      .append("g")
      .attr("class", "partners__pins-group")
      .attr("id", "partnersPins");

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    countriesData.forEach((country) => {
      const coords = projection([country.lng, country.lat]);
      if (!coords) return;

      const [x, y] = coords;
      const isHub = country.isHub;

      const pinGroup = pinsGroup
        .append("g")
        .attr("class", `partners__pin${isHub ? " partners__pin--hub" : ""}`)
        .attr("data-country-id", country.id)
        .attr("role", "button")
        .attr("tabindex", "0")
        .attr("aria-label", `Show universities in ${country.name}`);

      if (isHub) {
        pinGroup
          .append("circle")
          .attr("class", "partners__pin-ring")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", 7);
      }

      pinGroup
        .append("circle")
        .attr("class", "partners__pin-dot")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", isHub ? 7 : 5);

      pinGroup
        .append("text")
        .attr("class", "partners__pin-label")
        .attr("x", x)
        .attr("y", y - 15)
        .text(country.city);
    });

    mapInitialized = true;

    // Pin reveal animation (respects reduced motion)
    if (!prefersReducedMotion && typeof gsap !== "undefined") {
      const pins = document.querySelectorAll("#partnersPins .partners__pin");
      gsap.fromTo(
        pins,
        { opacity: 0, scale: 0, transformOrigin: "center" },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: "back.out(1.7)",
        },
      );
    }

    setupPinClickHandlers();
  }

  // Re-render on resize (debounced)
  function handleResize() {
    if (!mapInitialized) return;

    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      mapInitialized = false; // Force re-render
      renderD3Map();
    }, RESIZE_DEBOUNCE_MS);
  }

  // ========================================================
  // ── RENDER MOBILE COUNTRY LIST ──────────────────────────
  // ========================================================

  function renderMobileList() {
    const mobileListContainer = document.getElementById("partnersMobileList");
    if (!mobileListContainer) return;

    let listHTML = "";

    countriesData.forEach((country) => {
      const uniCount = country.universities.length;
      const hubBadge = country.isHub
        ? '<span class="partners__mobile-hub">HUB</span>'
        : "";

      listHTML += `
        <button class="partners__mobile-item" 
                data-country-id="${country.id}" 
                aria-label="Show universities in ${country.name}">
          <span class="partners__mobile-country">${country.name}</span>
          ${hubBadge}
          <span class="partners__mobile-count">${uniCount} ${uniCount === 1 ? "University" : "Universities"}</span>
          <span class="partners__mobile-arrow" aria-hidden="true">→</span>
        </button>
      `;
    });

    mobileListContainer.innerHTML = listHTML;
  }

  // ========================================================
  // ── RENDER DETAIL PANEL ─────────────────────────────────
  // ========================================================

  function renderDetailPanel(countryId, animate = true) {
    const country = countriesData.find((c) => c.id === countryId);
    if (!country) return;

    const countryEl = document.getElementById("partnersDetailCountry");
    const countEl = document.getElementById("partnersDetailCount");
    const universitiesEl = document.getElementById("partnersUniversities");

    if (!countryEl || !countEl || !universitiesEl) return;

    const buildContent = () => {
      countryEl.textContent = country.name;
      const uniCount = country.universities.length;
      countEl.textContent = `${uniCount} ${uniCount === 1 ? "University" : "Universities"}`;

      let cardsHTML = "";
      country.universities.forEach((uni) => {
        let programsHTML = "";
        uni.programs.forEach((program) => {
          programsHTML += `
            <div class="partners__program">
              <span class="partners__program-name">${program.name}</span>
              <a href="${program.url}" class="partners__program-cta">
                Explore <span aria-hidden="true">→</span>
              </a>
            </div>
          `;
        });

        cardsHTML += `
          <article class="partners__university-card">
            <div class="partners__university-header">
              <div class="partners__university-meta">
                <h4 class="partners__university-name">${uni.name}</h4>
                <span class="partners__university-country">${uni.country}</span>
                <span class="partners__university-recognition">${uni.recognition}</span>
              </div>
            </div>
            <div class="partners__university-programs">
              <span class="partners__programs-label">Programs Offered</span>
              ${programsHTML}
            </div>
          </article>
        `;
      });

      universitiesEl.innerHTML = cardsHTML;
    };

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (animate && !prefersReducedMotion && typeof gsap !== "undefined") {
      gsap.to([countryEl, countEl, universitiesEl], {
        opacity: 0,
        y: 10,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          buildContent();
          gsap.to([countryEl, countEl, universitiesEl], {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
            stagger: 0.05,
          });
        },
      });
    } else {
      buildContent();
    }

    // Update active states
    document.querySelectorAll(".partners__pin").forEach((pin) => {
      pin.classList.toggle(
        "partners__pin--active",
        pin.dataset.countryId === countryId,
      );
    });

    document.querySelectorAll(".partners__mobile-item").forEach((item) => {
      item.classList.toggle(
        "partners__mobile-item--active",
        item.dataset.countryId === countryId,
      );
    });
  }

  // ========================================================
  // ── CLICK HANDLERS ──────────────────────────────────────
  // ========================================================

  function setupPinClickHandlers() {
    const pinsContainer = document.getElementById("partnersPins");
    if (!pinsContainer) return;

    pinsContainer.addEventListener("click", (e) => {
      const pin = e.target.closest(".partners__pin");
      if (pin) {
        renderDetailPanel(pin.dataset.countryId);
        scrollToDetailPanel();
      }
    });

    pinsContainer.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        const pin = e.target.closest(".partners__pin");
        if (pin) {
          e.preventDefault();
          renderDetailPanel(pin.dataset.countryId);
          scrollToDetailPanel();
        }
      }
    });
  }

  function setupMobileClickHandlers() {
    const mobileListContainer = document.getElementById("partnersMobileList");
    if (!mobileListContainer) return;

    mobileListContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".partners__mobile-item");
      if (btn) {
        renderDetailPanel(btn.dataset.countryId);
        scrollToDetailPanel();
      }
    });
  }

  function scrollToDetailPanel() {
    const panel = document.getElementById("partnersDetailPanel");
    if (!panel) return;

    const offset = 100;
    const panelTop =
      panel.getBoundingClientRect().top + window.pageYOffset - offset;

    if (window.lenis && typeof window.lenis.scrollTo === "function") {
      window.lenis.scrollTo(panelTop, { duration: 1.2 });
    } else {
      window.scrollTo({ top: panelTop, behavior: "smooth" });
    }
  }

  // ========================================================
  // ── LAZY MAP TRIGGER (IntersectionObserver) ─────────────
  // ========================================================

  function setupLazyMapLoader() {
    const mapStage = document.getElementById("partnersMapStage");
    if (!mapStage) return;

    // Check if IntersectionObserver supported
    if (!("IntersectionObserver" in window)) {
      // Fallback: load immediately
      renderD3Map();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            renderD3Map();
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: LAZY_LOAD_MARGIN,
        threshold: 0.01,
      },
    );

    observer.observe(mapStage);
  }

  // ========================================================
  // ── INITIALIZE ──────────────────────────────────────────
  // ========================================================

  function initPartners() {
    if (!document.getElementById("university-partners")) return;

    // Static parts (render immediately)
    renderMobileList();
    setupMobileClickHandlers();
    renderDetailPanel("uae", false);

    // Map: lazy load when user scrolls near it
    setupLazyMapLoader();

    // Responsive: redraw on window resize (debounced)
    window.addEventListener("resize", handleResize);

    // Cleanup on page unload
    window.addEventListener("beforeunload", () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    });
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPartners);
  } else {
    initPartners();
  }
})();
