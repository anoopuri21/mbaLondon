(function () {
  "use strict";

  // Testimonials data - flattened array with category badges
  const testimonialsData = [
    {
      category: "STUDENT",
      name: "Aarav Sharma",
      role: "MBA Student, Mumbai",
      thumbnail: "assets/images/universities/placeholder-logo.png",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
      category: "STUDENT",
      name: "Maya Johnson",
      role: "BBA Student, London",
      thumbnail: "assets/images/universities/placeholder-logo.png",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
      category: "STUDENT",
      name: "Chen Wei",
      role: "DBA Candidate, Singapore",
      thumbnail: "assets/images/universities/placeholder-logo.png",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
      category: "ALUMNI",
      name: "Sarah Mitchell",
      role: "Director, Emirates Airlines",
      thumbnail: "assets/images/universities/placeholder-logo.png",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
      category: "ALUMNI",
      name: "Rajesh Kumar",
      role: "CEO, TechVentures",
      thumbnail: "assets/images/universities/placeholder-logo.png",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
      category: "ALUMNI",
      name: "Elena Petrov",
      role: "VP Strategy, PwC London",
      thumbnail: "assets/images/universities/placeholder-logo.png",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
      category: "CORPORATE",
      name: "Emirates Group",
      role: "Corporate Training Partner",
      thumbnail: "assets/images/universities/placeholder-logo.png",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
      category: "CORPORATE",
      name: "ADNOC",
      role: "Leadership Development",
      thumbnail: "assets/images/universities/placeholder-logo.png",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
      category: "CORPORATE",
      name: "Fly Dubai",
      role: "Executive Education",
      thumbnail: "assets/images/universities/placeholder-logo.png",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
      category: "FACULTY",
      name: "Dr. Sarah Chen",
      role: "Head of Technology",
      thumbnail: "assets/images/universities/placeholder-logo.png",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
      category: "FACULTY",
      name: "Prof. James Mitchell",
      role: "Leadership Chair",
      thumbnail: "assets/images/universities/placeholder-logo.png",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
    {
      category: "FACULTY",
      name: "Dr. Aisha Patel",
      role: "Career Director",
      thumbnail: "assets/images/universities/placeholder-logo.png",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    },
  ];

  // DOM elements
  const track = document.getElementById("testimonialsTrack");
  const modal = document.getElementById("videoModal");
  const modalClose = document.getElementById("modalClose");
  const modalPlayer = document.getElementById("modalPlayer");

  // Render all testimonials
  function renderAllTestimonials() {
    if (!track) return;

    let html = "";
    testimonialsData.forEach((item) => {
      html += `
        <article class="testimonials__card" data-video="${item.video}">
          <div class="testimonials__card-thumb">
            <img src="${item.thumbnail}" alt="${item.name}" loading="lazy" />
            <span class="testimonials__card-badge">${item.category}</span>
            <button class="testimonials__play" aria-label="Play video by ${item.name}">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>
          </div>
          <div class="testimonials__card-info">
            <h4 class="testimonials__card-name">${item.name}</h4>
            <span class="testimonials__card-role">${item.role}</span>
          </div>
        </article>
      `;
    });

    track.innerHTML = html;
  }

  // Open modal with video
  function openModal(videoUrl) {
    if (!modal || !modalPlayer) return;

    // Detect YouTube vs local video
    let playerContent;
    if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
      // YouTube iframe
      playerContent = `<iframe src="${videoUrl}?autoplay=1" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    } else {
      // Local HTML5 video
      playerContent = `<video src="${videoUrl}" controls autoplay></video>`;
    }

    modalPlayer.innerHTML = playerContent;
    modal.classList.add("testimonials__modal--active");
    document.body.classList.add("modal-open");
  }

  // Close modal
  function closeModal() {
    if (!modal || !modalPlayer) return;

    modal.classList.remove("testimonials__modal--active");
    document.body.classList.remove("modal-open");

    // Clear player content after transition
    setTimeout(() => {
      modalPlayer.innerHTML = "";
    }, 400);
  }

  // Setup card clicks (event delegation)
  function setupCardClicks() {
    if (!track) return;

    track.addEventListener("click", (e) => {
      const card = e.target.closest(".testimonials__card");
      if (card) {
        const videoUrl = card.getAttribute("data-video");
        if (videoUrl) {
          openModal(videoUrl);
        }
      }
    });
  }

  // Setup modal close events
  function setupModalEvents() {
    if (!modal || !modalClose) return;

    // Close button
    modalClose.addEventListener("click", closeModal);

    // ESC key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("testimonials__modal--active")) {
        closeModal();
      }
    });

    // Click backdrop (but not modal content)
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Initialize on DOM ready
  function init() {
    // Render all testimonials
    renderAllTestimonials();

    // Setup event listeners
    setupCardClicks();
    setupModalEvents();
  }

  // Run init when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
