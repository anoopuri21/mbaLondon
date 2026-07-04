(function () {
  "use strict";

  // Testimonials data - flattened array with category badges
  const testimonialsData = [
    {
      category: "STUDENT",
      name: "Aarav Sharma",
      role: "MBA Student, Mumbai",
      thumbnail: "https://mbalondon.org.uk/wp-content/uploads/2025/09/Screenshot-2025-09-19-121443.png",
      video: "https://www.youtube.com/embed/4p0rsCEljgo?si=PP73M4hGEdn5JiH7",
    },
    {
      category: "ALUMNI",
      name: "Sarah Mitchell",
      role: "Director, Emirates Airlines",
      thumbnail: "https://mbalondon.org.uk/wp-content/uploads/2025/09/Screenshot-2025-09-19-121743.png",
      video: "https://www.youtube.com/embed/4p0rsCEljgo?si=PP73M4hGEdn5JiH7",
    },
    {
      category: "CORPORATE",
      name: "Chen Wei",
      role: "DBA Candidate, Singapore",
      thumbnail: "https://mbalondon.org.uk/wp-content/uploads/2025/09/Screenshot-2025-09-19-122129.png",
      video: "https://www.youtube.com/embed/4p0rsCEljgo?si=PP73M4hGEdn5JiH7",
    },
    {
      category: "ALUMNI",
      name: "Sarah Mitchell",
      role: "Director, Emirates Airlines",
      thumbnail: "https://mbalondon.org.uk/wp-content/uploads/2025/09/Screenshot-2025-09-19-124044.png",
      video: "https://www.youtube.com/embed/4p0rsCEljgo?si=PP73M4hGEdn5JiH7",
    },
    {
      category: "ALUMNI",
      name: "Rajesh Kumar",
      role: "CEO, TechVentures",
      thumbnail: "https://mbalondon.org.uk/wp-content/uploads/2024/07/HeyG0AVCuCwmq.jpg",
      video: "https://www.youtube.com/embed/4p0rsCEljgo?si=PP73M4hGEdn5JiH7",
    },
    {
      category: "ALUMNI",
      name: "Elena Petrov",
      role: "VP Strategy, PwC London",
      thumbnail: "https://mbalondon.org.uk/wp-content/uploads/2024/07/8th-Epd.jpg",
      video: "https://www.youtube.com/embed/4p0rsCEljgo?si=PP73M4hGEdn5JiH7",
    },
    {
      category: "CORPORATE",
      name: "Emirates Group",
      role: "Corporate Training Partner",
      thumbnail: "https://mbalondon.org.uk/wp-content/uploads/2024/07/7th-EPD.jpg",
      video: "https://www.youtube.com/embed/4p0rsCEljgo?si=PP73M4hGEdn5JiH7",
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
            <img src="${item.thumbnail}" alt="${item.name}" loading="lazy" decoding="async" width="320" height="220" />
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
