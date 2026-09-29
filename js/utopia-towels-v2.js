const searchItems = [
  {
    title: "Hand Towels",
    description: "Every sink, softly covered.",
    href: "#collections",
    keywords: "hand towel sink small towel",
  },
  {
    title: "Bath Towels",
    description: "Everyday softness after every rinse.",
    href: "#collections",
    keywords: "bath towel shower soft absorbent",
  },
  {
    title: "Beach Towels",
    description: "Bold beach stripes with a soft finish.",
    href: "#collections",
    keywords: "beach towel stripe pool summer cabana",
  },
  {
    title: "Kitchen Towels",
    description: "Ready for spills, counters, and hands.",
    href: "#collections",
    keywords: "kitchen towel dish counter spill",
  },
  {
    title: "Wash Cloths",
    description: "Wash your troubles away.",
    href: "#collections",
    keywords: "wash cloth face cloth washcloth",
  },
  {
    title: "Turkish Beach Towels",
    description: "Best sellers in blue, cyan, pink, and beige.",
    href: "#best-seller",
    keywords: "turkish beach towel best seller blue cyan pink beige travel",
  },
  {
    title: "The Fall Edit",
    description: "Warm tones and plush textures.",
    href: "#fall-edit",
    keywords: "fall autumn season warm plaid",
  },
  {
    title: "OEKO-TEX Certified",
    description: "Tested for harmful substances.",
    href: "#sustainability-title",
    keywords: "oeko tex sustainable certified safe made in green",
  },
  {
    title: "Where to Buy",
    description: "Amazon, Target Plus, eBay, Walmart and more.",
    href: "#where-to-buy",
    keywords: "amazon walmart target ebay tiktok shein shopify temu shop buy retailer",
  },
];

const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector("[data-menu-toggle]");
const primaryNav = document.querySelector("[data-primary-nav]");
const searchTrigger = document.querySelector("[data-search-trigger]");
const searchPanel = document.querySelector("[data-search-panel]");
const searchClose = document.querySelector("[data-search-close]");
const searchInput = document.querySelector("[data-search-input]");
const searchResults = document.querySelector("[data-search-results]");

function setMobileMenu(open) {
  if (!siteHeader || !menuToggle) {
    return;
  }

  siteHeader.classList.toggle("is-menu-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

function renderSearchResults(query = "") {
  if (!searchResults) {
    return;
  }

  const normalizedQuery = query.trim().toLowerCase();
  const results = normalizedQuery
    ? searchItems.filter((item) =>
        `${item.title} ${item.description} ${item.keywords}`.toLowerCase().includes(normalizedQuery),
      )
    : searchItems.slice(0, 4);

  searchResults.replaceChildren(
    ...(results.length
      ? results.map((item) => {
          const link = document.createElement("a");
          const title = document.createElement("strong");
          const description = document.createElement("span");

          link.href = item.href;
          link.dataset.searchResult = "";
          title.textContent = item.title;
          description.textContent = item.description;
          link.append(title, description);
          return link;
        })
      : [
          Object.assign(document.createElement("p"), {
            className: "search-empty",
            textContent: 'No towel matches yet. Try "bath", "beach", or "Turkish".',
          }),
        ]),
  );
}

function openSearch() {
  if (!searchPanel || !searchTrigger || !searchInput) {
    return;
  }

  setMobileMenu(false);
  searchPanel.hidden = false;
  searchTrigger.setAttribute("aria-expanded", "true");
  renderSearchResults(searchInput.value);
  searchInput.focus();
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
  setMobileMenu(menuToggle.getAttribute("aria-expanded") !== "true");
});

primaryNav?.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    setMobileMenu(false);
  }
});

document.addEventListener("click", (event) => {
  if (siteHeader?.classList.contains("is-menu-open") && !siteHeader.contains(event.target)) {
    setMobileMenu(false);
  }
});

// Keep Tab / Shift+Tab inside the search dialog while it is open.
function trapSearchFocus(event) {
  const focusable = searchPanel.querySelectorAll("input, button, a[href]");
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (!searchPanel.contains(document.activeElement)) {
    event.preventDefault();
    first.focus();
  } else if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Tab" && searchPanel && !searchPanel.hidden) {
    trapSearchFocus(event);
    return;
  }

  if (event.key !== "Escape") {
    return;
  }

  if (searchPanel && !searchPanel.hidden) {
    closeSearch();
    return;
  }

  if (siteHeader?.classList.contains("is-menu-open")) {
    setMobileMenu(false);
    menuToggle?.focus();
  }
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const scrollBehavior = prefersReducedMotion ? "auto" : "smooth";

function scrollCarousel(id, direction) {
  const track = document.getElementById(id);

  if (!track) {
    return;
  }

  const firstItem = track.firstElementChild;
  const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
  const step = firstItem ? firstItem.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
  const atStart = track.scrollLeft <= 2;
  const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;

  if (direction < 0 && atStart) {
    track.scrollTo({ left: track.scrollWidth, behavior: scrollBehavior });
  } else if (direction > 0 && atEnd) {
    track.scrollTo({ left: 0, behavior: scrollBehavior });
  } else {
    track.scrollBy({ left: direction * step, behavior: scrollBehavior });
  }
}

document.querySelectorAll("[data-carousel-prev]").forEach((button) => {
  button.addEventListener("click", () => scrollCarousel(button.dataset.carouselPrev, -1));
});

document.querySelectorAll("[data-carousel-next]").forEach((button) => {
  button.addEventListener("click", () => scrollCarousel(button.dataset.carouselNext, 1));
});

// Reviews advance right-to-left one card at a time, holding each card in focus for a few
// seconds, and can be dragged with a mouse or finger. The strip holds two hidden copies of
// the cards and its offset is wrapped by one set's width, which looks identical, so the row
// never runs out in either direction.
const REVIEW_HOLD = 3000; // ms each card rests in focus
const REVIEW_MOVE = 900; // ms to glide to the next card
const GLIDE_DECAY = 0.05; // share of fling velocity left after one second
const GLIDE_STOP = 60; // px/s below which a fling settles onto the nearest card

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

function setUpReviewsMarquee(viewport) {
  const strip = viewport.querySelector(".reviews__track");

  if (!strip || !strip.firstElementChild) {
    return;
  }

  const originals = Array.from(strip.children);

  for (let copy = 0; copy < 2; copy += 1) {
    originals.forEach((item) => {
      const clone = item.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.inert = true;
      strip.append(clone);
    });
  }

  const cards = Array.from(strip.children);
  const firstClone = cards[originals.length];
  const measureLoop = () => firstClone.offsetLeft - cards[0].offsetLeft;
  let loopWidth = measureLoop();
  let offset = 0;
  let velocity = 0;
  let tween = null;
  let holdUntil = performance.now() + REVIEW_HOLD;
  let lastFrame = null;
  let hovering = false;
  let focused = false;
  let onScreen = false;
  let frameId = null;
  let drag = null;
  let activeCard = null;

  const step = () => loopWidth / originals.length;
  const nearestStop = (value) => Math.round(value / step()) * step();

  const moveTo = (target, time) => {
    if (prefersReducedMotion) {
      offset = target;
      tween = null;
      holdUntil = time + REVIEW_HOLD;
      return;
    }

    tween = { from: offset, to: target, start: time };
  };

  // The card nearest the middle of the content column is the one in focus.
  const updateActiveCard = () => {
    const cardWidth = cards[0].offsetWidth;
    const centre = viewport.parentElement.clientWidth / 2;
    const index = Math.round((offset + centre - cardWidth / 2) / step());
    const next = cards[Math.min(Math.max(index, 0), cards.length - 1)];

    if (next !== activeCard) {
      activeCard?.classList.remove("is-active");
      next.classList.add("is-active");
      activeCard = next;
    }
  };

  const render = () => {
    if (loopWidth > 0) {
      offset = ((offset % loopWidth) + loopWidth) % loopWidth;
    }

    strip.style.transform = `translate3d(${-offset}px, 0, 0)`;
    updateActiveCard();
  };

  const tick = (time) => {
    const elapsed = lastFrame === null ? 0 : Math.min(time - lastFrame, 64) / 1000;
    lastFrame = time;

    if (drag) {
      // Position follows the pointer in pointermove.
    } else if (Math.abs(velocity) > GLIDE_STOP) {
      offset += velocity * elapsed;
      velocity *= GLIDE_DECAY ** elapsed;
    } else if (tween) {
      const progress = Math.min((time - tween.start) / REVIEW_MOVE, 1);
      offset = tween.from + (tween.to - tween.from) * easeInOut(progress);

      if (progress === 1) {
        offset = tween.to;
        tween = null;
        holdUntil = time + REVIEW_HOLD;
      }
    } else {
      velocity = 0;

      if (Math.abs(offset - nearestStop(offset)) > 0.5) {
        moveTo(nearestStop(offset), time);
      } else if (!prefersReducedMotion && !hovering && !focused && time >= holdUntil) {
        moveTo(nearestStop(offset) + step(), time);
      }
    }

    render();
    frameId = onScreen ? window.requestAnimationFrame(tick) : null;
  };

  const start = () => {
    if (frameId === null) {
      lastFrame = null;
      frameId = window.requestAnimationFrame(tick);
    }
  };

  viewport.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    drag = { x: event.clientX, offset, lastX: event.clientX, lastTime: event.timeStamp };
    velocity = 0;
    tween = null;
    viewport.setPointerCapture(event.pointerId);
    viewport.classList.add("is-dragging");
  });

  viewport.addEventListener("pointermove", (event) => {
    if (!drag) {
      return;
    }

    offset = drag.offset - (event.clientX - drag.x);
    const since = event.timeStamp - drag.lastTime;

    if (since > 0) {
      velocity = (-(event.clientX - drag.lastX) / since) * 1000;
    }

    drag.lastX = event.clientX;
    drag.lastTime = event.timeStamp;
    render();
  });

  const endDrag = (event) => {
    if (!drag) {
      return;
    }

    // A pause before letting go means no fling; the row just settles onto the nearest card.
    if (event.timeStamp - drag.lastTime > 100) {
      velocity = 0;
    }

    drag = null;
    viewport.classList.remove("is-dragging");
  };

  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointercancel", endDrag);
  viewport.addEventListener("dragstart", (event) => event.preventDefault());

  viewport.addEventListener("pointerenter", (event) => {
    hovering = event.pointerType === "mouse";
  });

  viewport.addEventListener("pointerleave", () => {
    hovering = false;
  });

  // Only keyboard focus holds the row; a mouse or touch drag also focuses the viewport.
  viewport.addEventListener("focusin", () => {
    focused = viewport.matches(":focus-visible");
  });

  viewport.addEventListener("focusout", () => {
    focused = false;
  });

  viewport.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
      return;
    }

    event.preventDefault();
    velocity = 0;
    const base = tween ? tween.to : nearestStop(offset);
    moveTo(base + (event.key === "ArrowRight" ? step() : -step()), performance.now());
    render();
  });

  new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;

    if (onScreen) {
      start();
    }
  }).observe(viewport);

  new ResizeObserver(() => {
    loopWidth = measureLoop();
  }).observe(strip);

  render();
  strip.classList.add("has-focus");
}

document.querySelectorAll("[data-reviews-marquee]").forEach(setUpReviewsMarquee);

// Videos only download and play while on screen. Visitors who prefer reduced motion,
// or whose browser blocks autoplay, keep the native controls instead.
function setUpAutoplayVideo(video) {
  const toggle = video.parentElement.querySelector("[data-video-toggle]");

  if (!toggle) {
    return;
  }

  let pausedByVisitor = false;

  const useNativeControls = () => {
    video.controls = true;
    toggle.hidden = true;
  };

  const syncToggle = () => {
    toggle.classList.toggle("is-paused", video.paused);
    toggle.setAttribute("aria-label", video.paused ? "Play video" : "Pause video");
  };

  video.controls = false;
  toggle.hidden = false;
  syncToggle();
  video.addEventListener("play", syncToggle);
  video.addEventListener("pause", syncToggle);

  toggle.addEventListener("click", () => {
    pausedByVisitor = !video.paused;

    if (pausedByVisitor) {
      video.pause();
    } else {
      video.play().catch(useNativeControls);
    }
  });

  new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        video.pause();
      } else if (!pausedByVisitor) {
        video.play().catch(useNativeControls);
      }
    },
    { threshold: 0.25 },
  ).observe(video);
}

if (!prefersReducedMotion) {
  document.querySelectorAll("[data-autoplay-video]").forEach(setUpAutoplayVideo);
}

renderSearchResults();
