const searchItems = [
  {
    title: "Hand Towels",
    description: "Every sink, softly covered.",
    href: "#collections",
    keywords: "hand towel sink quick dry small towel",
  },
  {
    title: "Bath Towels",
    description: "Everyday softness after every rinse.",
    href: "#collections",
    keywords: "bath towel shower soft absorbent",
  },
  {
    title: "Cabana Stripe Beach Towels",
    description: "Bold stripes for easy beach days.",
    href: "#seller",
    keywords: "cabana beach stripe pool summer best seller",
  },
  {
    title: "Turkish Beach Towel",
    description: "Light and quick-drying, made for beach days away.",
    href: "#collections",
    keywords: "turkish beach towel light quick drying travel",
  },
  {
    title: "Made to Last",
    description: "Washed, used, and loved.",
    href: "#comfort",
    keywords: "durable long lasting quality",
  },
  {
    title: "Where to Buy",
    description: "Find Utopia Towels on your favorite retailers.",
    href: "#shop",
    keywords: "amazon walmart target shop buy retailer",
  },
];

const searchTrigger = document.querySelector("[data-search-trigger]");
const searchPanel = document.querySelector("[data-search-panel]");
const searchClose = document.querySelector("[data-search-close]");
const searchInput = document.querySelector("[data-search-input]");
const searchResults = document.querySelector("[data-search-results]");
const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector("[data-menu-toggle]");
const primaryNav = document.querySelector("[data-primary-nav]");

function setMobileMenu(open) {
  if (!siteHeader || !menuToggle) {
    return;
  }

  siteHeader.classList.toggle("is-menu-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

function closeMobileMenu() {
  setMobileMenu(false);
}

function renderSearchResults(query = "") {
  const normalizedQuery = query.trim().toLowerCase();
  const results = normalizedQuery
    ? searchItems.filter((item) =>
        `${item.title} ${item.description} ${item.keywords}`.toLowerCase().includes(normalizedQuery),
      )
    : searchItems.slice(0, 4);

  if (!searchResults) {
    return;
  }

  searchResults.innerHTML = results.length
    ? results
        .map(
          (item) => `
            <a href="${item.href}" data-search-result>
              <strong>${item.title}</strong>
              <span>${item.description}</span>
            </a>
          `,
        )
        .join("")
    : '<p class="search-empty">No towel matches yet. Try "bath", "beach", or "quick dry".</p>';
}

function openSearch() {
  if (!searchPanel || !searchTrigger || !searchInput) {
    return;
  }

  closeMobileMenu();
  searchPanel.hidden = false;
  searchTrigger.setAttribute("aria-expanded", "true");
  renderSearchResults(searchInput.value);
  window.setTimeout(() => searchInput.focus(), 0);
}

function closeSearch() {
  if (!searchPanel || !searchTrigger) {
    return;
  }

  searchPanel.hidden = true;
  searchTrigger.setAttribute("aria-expanded", "false");
  searchTrigger.focus();
}

searchTrigger?.addEventListener("click", openSearch);
searchClose?.addEventListener("click", closeSearch);
searchInput?.addEventListener("input", (event) => renderSearchResults(event.target.value));
searchPanel?.addEventListener("click", (event) => {
  if (event.target === searchPanel) {
    closeSearch();
  }
});
searchResults?.addEventListener("click", (event) => {
  if (event.target.closest("[data-search-result]")) {
    closeSearch();
  }
});

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  setMobileMenu(!isOpen);
});

primaryNav?.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    closeMobileMenu();
  }
});

document.addEventListener("click", (event) => {
  if (!siteHeader || !siteHeader.classList.contains("is-menu-open")) {
    return;
  }

  if (!siteHeader.contains(event.target)) {
    closeMobileMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && searchPanel && !searchPanel.hidden) {
    closeSearch();
  }

  if (event.key === "Escape" && siteHeader?.classList.contains("is-menu-open")) {
    closeMobileMenu();
    menuToggle?.focus();
  }
});

function scrollCarousel(id, direction) {
  const carousel = document.getElementById(id);

  if (!carousel) {
    return;
  }

  if (carousel === reviewCarousel) {
    scrollReviewCarousel(direction);
    return;
  }

  const firstItem = carousel.firstElementChild;
  const gap = Number.parseFloat(getComputedStyle(carousel).columnGap) || 0;
  const distance = firstItem ? firstItem.getBoundingClientRect().width + gap : carousel.clientWidth * 0.8;
  const isAtStart = carousel.scrollLeft <= 2;
  const isAtEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 2;

  if (direction < 0 && isAtStart) {
    carousel.scrollTo({
      left: carousel.scrollWidth,
      behavior: "smooth",
    });
    return;
  }

  if (direction > 0 && isAtEnd) {
    carousel.scrollTo({
      left: 0,
      behavior: "smooth",
    });
    return;
  }

  carousel.scrollBy({
    left: direction * distance,
    behavior: "smooth",
  });
}

document.querySelectorAll("[data-carousel-prev]").forEach((button) => {
  button.addEventListener("click", () => scrollCarousel(button.dataset.carouselPrev, -1));
});

document.querySelectorAll("[data-carousel-next]").forEach((button) => {
  button.addEventListener("click", () => scrollCarousel(button.dataset.carouselNext, 1));
});

const reviewCarousel = document.getElementById("reviews-carousel");
let activeReviewIndex = 1;
let reviewSwipeStartX = null;
let reviewSwipeStartY = null;
let reviewWheelLocked = false;
let reviewAnimationTimer = null;

function getReviewCards() {
  return reviewCarousel ? Array.from(reviewCarousel.querySelectorAll(".testimonial")) : [];
}

function renderReviewCarousel() {
  if (!reviewCarousel) {
    return;
  }

  const cards = getReviewCards();

  if (cards.length === 0) {
    return;
  }

  if (cards.length < 3) {
    activeReviewIndex = Math.floor(cards.length / 2);
  }

  reviewCarousel.classList.add("is-ready");
  cards.forEach((card, index) => {
    const previousIndex = (activeReviewIndex - 1 + cards.length) % cards.length;
    const nextIndex = (activeReviewIndex + 1) % cards.length;
    const isVisible = index === previousIndex || index === activeReviewIndex || index === nextIndex;
    const visualOrder = index === previousIndex ? 1 : index === activeReviewIndex ? 2 : 3;

    card.classList.toggle("is-visible", isVisible);
    card.classList.toggle("featured", index === activeReviewIndex);
    card.setAttribute("aria-hidden", isVisible ? "false" : "true");
    card.style.order = isVisible ? String(visualOrder) : "";
  });
}

function scrollReviewCarousel(direction) {
  const cards = getReviewCards();

  if (cards.length <= 1) {
    return;
  }

  reviewCarousel.classList.remove("is-moving-next", "is-moving-prev");
  void reviewCarousel.offsetWidth;
  reviewCarousel.classList.add(direction > 0 ? "is-moving-next" : "is-moving-prev");
  window.clearTimeout(reviewAnimationTimer);
  reviewAnimationTimer = window.setTimeout(() => {
    reviewCarousel.classList.remove("is-moving-next", "is-moving-prev");
  }, 380);

  activeReviewIndex = (activeReviewIndex + direction + cards.length) % cards.length;
  renderReviewCarousel();
}

function handleReviewSwipe(startX, startY, endX, endY) {
  const deltaX = endX - startX;
  const deltaY = endY - startY;

  if (Math.abs(deltaX) < 36 || Math.abs(deltaX) < Math.abs(deltaY)) {
    return;
  }

  scrollReviewCarousel(deltaX < 0 ? 1 : -1);
}

reviewCarousel?.addEventListener(
  "wheel",
  (event) => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) {
      return;
    }

    event.preventDefault();
    if (reviewWheelLocked) {
      return;
    }

    reviewWheelLocked = true;
    scrollReviewCarousel(event.deltaX > 0 ? 1 : -1);
    window.setTimeout(() => {
      reviewWheelLocked = false;
    }, 360);
  },
  { passive: false },
);

reviewCarousel?.addEventListener("pointerdown", (event) => {
  reviewSwipeStartX = event.clientX;
  reviewSwipeStartY = event.clientY;
});

reviewCarousel?.addEventListener("pointerup", (event) => {
  if (reviewSwipeStartX === null || reviewSwipeStartY === null) {
    return;
  }

  handleReviewSwipe(reviewSwipeStartX, reviewSwipeStartY, event.clientX, event.clientY);
  reviewSwipeStartX = null;
  reviewSwipeStartY = null;
});

reviewCarousel?.addEventListener("pointercancel", () => {
  reviewSwipeStartX = null;
  reviewSwipeStartY = null;
});

window.addEventListener("load", () => {
  renderSearchResults();
  renderReviewCarousel();
});

window.addEventListener("resize", renderReviewCarousel);
