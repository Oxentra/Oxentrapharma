document.addEventListener("DOMContentLoaded", () => {
  // Ensure GSAP and ScrollTrigger are loaded
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.warn("GSAP or ScrollTrigger is not loaded. Hero scroll animations disabled.");
    return;
  }

  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  const heroSection = document.getElementById("hero");
  const canvas = document.getElementById("hero-canvas");
  if (!heroSection || !canvas) return;

  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
  }

  // 300 Frames sequence (ezgif-frame-001.jpg to ezgif-frame-300.jpg)
  const totalFrames = 300;
  const images = new Array(totalFrames);
  const loadedFrames = {};
  const requestedFrames = {};

  const pad = (num, size) => num.toString().padStart(size, '0');
  const getFrameSrc = (idx) => `images/herosection/ezgif-frame-${pad(idx + 1, 3)}.jpg`;

  // Create image instances
  for (let i = 0; i < totalFrames; i++) {
    images[i] = new Image();
  }

  // Handle aspect-ratio canvas scaling (cover size centering)
  function drawImageCover(ctx, img) {
    if (!img || !img.complete || img.naturalWidth === 0) return;
    
    const canvas = ctx.canvas;
    const hRatio = canvas.width / img.naturalWidth;
    const vRatio = canvas.height / img.naturalHeight;
    const ratio = Math.max(hRatio, vRatio);
    const centerShift_x = (canvas.width - img.naturalWidth * ratio) / 2;
    const centerShift_y = (canvas.height - img.naturalHeight * ratio) / 2;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img, 
      0, 0, img.naturalWidth, img.naturalHeight,
      centerShift_x, centerShift_y, img.naturalWidth * ratio, img.naturalHeight * ratio
    );

    const isMobilePortrait =
      window.innerWidth <= 768 &&
      window.innerWidth < window.innerHeight;

    if (isMobilePortrait) {
      const gradientHeight = Math.min(
        Math.max(canvas.height * 0.22, 140),
        300
      );

      const topGrad = ctx.createLinearGradient(0, 0, 0, gradientHeight);
      topGrad.addColorStop(0, "rgba(0, 43, 62, 1)");
      topGrad.addColorStop(0.40, "rgba(0, 43, 62, 0.95)");
      topGrad.addColorStop(0.75, "rgba(0, 43, 62, 0.60)");
      topGrad.addColorStop(1, "rgba(0, 43, 62, 0)");

      ctx.save();
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, canvas.width, gradientHeight);
      ctx.restore();
    }
  }

  // Nearest Loaded Frame fallback scanner (Ensures zero blank frames / flickering on fast scrubs)
  function getNearestLoadedImage(index) {
    const rounded = Math.round(index);
    if (loadedFrames[rounded]) return images[rounded];

    let left = rounded - 1;
    let right = rounded + 1;

    while (left >= 0 || right < totalFrames) {
      if (left >= 0 && loadedFrames[left]) return images[left];
      if (right < totalFrames && loadedFrames[right]) return images[right];
      left--;
      right++;
    }

    return images[0];
  }

  // Master frame rendering routine
  function drawFrame(index) {
    const img = getNearestLoadedImage(index);
    if (img) {
      drawImageCover(ctx, img);
    }
  }

  // Playhead variable for GSAP scrubbing
  const playhead = { frame: 0 };

  // Resize canvas to window dimensions
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
    }
    drawFrame(playhead.frame);
  }

  // RequestAnimationFrame throttled frame rendering for 60fps/120fps display sync
  let renderPending = false;
  function scheduleRender() {
    if (!renderPending) {
      renderPending = true;
      requestAnimationFrame(() => {
        drawFrame(playhead.frame);
        renderPending = false;
      });
    }
  }

  // -------------------------------------------------------------
  // Progressive Controlled-Concurrency Frame Preloading & Decoding Queue
  // -------------------------------------------------------------
  const MAX_CONCURRENT_REQUESTS = 6;
  let activeRequests = 0;
  const loadQueue = [];

  function loadSingleFrame(idx, onComplete) {
    if (loadedFrames[idx] || requestedFrames[idx]) {
      if (onComplete) onComplete();
      return;
    }

    requestedFrames[idx] = true;
    activeRequests++;

    const img = images[idx];
    
    const finalizeLoad = () => {
      loadedFrames[idx] = true;
      activeRequests--;
      if (Math.round(playhead.frame) === idx) {
        scheduleRender();
      }
      if (onComplete) onComplete();
      processQueue();
    };

    img.onload = () => {
      // Decode asynchronously off the main thread if supported to prevent drawImage jank
      if ("decode" in img) {
        img.decode().then(finalizeLoad).catch(finalizeLoad);
      } else {
        finalizeLoad();
      }
    };

    img.onerror = () => {
      activeRequests--;
      if (onComplete) onComplete();
      processQueue();
    };

    img.src = getFrameSrc(idx);
  }

  function processQueue() {
    while (activeRequests < MAX_CONCURRENT_REQUESTS && loadQueue.length > 0) {
      const nextIdx = loadQueue.shift();
      if (!loadedFrames[nextIdx] && !requestedFrames[nextIdx]) {
        loadSingleFrame(nextIdx);
      }
    }
  }

  function enqueueFrame(idx, prioritize = false) {
    if (loadedFrames[idx] || requestedFrames[idx]) return;
    if (prioritize) {
      const existingIdx = loadQueue.indexOf(idx);
      if (existingIdx !== -1) {
        loadQueue.splice(existingIdx, 1);
      }
      loadQueue.unshift(idx);
    } else {
      if (!loadQueue.includes(idx)) {
        loadQueue.push(idx);
      }
    }
    processQueue();
  }

  // Priority 1: Instant load of Frame 1 for immediate first paint
  loadSingleFrame(0, () => {
    resizeCanvas();
  });

  // Priority 2: Pre-buffer initial 25 frames for instant initial scroll smoothness
  for (let i = 1; i <= Math.min(25, totalFrames - 1); i++) {
    enqueueFrame(i);
  }

  // Priority 3: Progressively queue remaining frames in background during idle moments
  const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 100));
  idleCallback(() => {
    for (let i = 26; i < totalFrames; i++) {
      enqueueFrame(i);
    }
  });

  // Priority 4: Dynamic directional lookahead prefetch based on scroll position & direction
  let lastProgress = 0;
  function boostNearbyFrames(targetFrame, currentProgress) {
    const isScrollingDown = currentProgress >= lastProgress;
    lastProgress = currentProgress;

    const center = Math.round(targetFrame);
    const forwardLookahead = isScrollingDown ? 25 : 10;
    const backwardLookahead = isScrollingDown ? 8 : 20;

    // Prioritize in the direction of motion
    if (isScrollingDown) {
      for (let offset = 1; offset <= forwardLookahead; offset++) {
        if (center + offset < totalFrames) enqueueFrame(center + offset, true);
      }
      for (let offset = 1; offset <= backwardLookahead; offset++) {
        if (center - offset >= 0) enqueueFrame(center - offset, true);
      }
    } else {
      for (let offset = 1; offset <= backwardLookahead; offset++) {
        if (center - offset >= 0) enqueueFrame(center - offset, true);
      }
      for (let offset = 1; offset <= forwardLookahead; offset++) {
        if (center + offset < totalFrames) enqueueFrame(center + offset, true);
      }
    }
  }

  // DOM elements
  const heroHeader = document.getElementById("hero-main-header");
  const heroShadeOverlay = document.getElementById("hero-shade-overlay");

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Set initial state: NO black shade at start, NO text overlay at start (unless user prefers reduced motion)
  if (heroShadeOverlay) {
    gsap.set(heroShadeOverlay, { opacity: prefersReducedMotion ? 1 : 0 });
  }
  if (heroHeader) {
    gsap.set(heroHeader, {
      opacity: prefersReducedMotion ? 1 : 0,
      y: prefersReducedMotion ? 0 : 35,
      scale: prefersReducedMotion ? 1 : 0.95,
      pointerEvents: prefersReducedMotion ? "auto" : "none"
    });
  }

  // Detect mobile device
  const isMobile = window.innerWidth <= 768;

  // Master timeline scrubbing through the 400vh hero section
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom bottom",
      scrub: isMobile ? 0.05 : 0.25, // Responsive scrub for instant touch performance on mobile
      pin: ".hero-sticky-viewport",
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const currentProgressFrame = self.progress * (totalFrames - 1);
        boostNearbyFrames(currentProgressFrame, self.progress);
      }
    }
  });

  // 1. Scrub through all 300 image frames across the scroll
  tl.to(playhead, {
    frame: totalFrames - 1,
    snap: "frame",
    ease: "none",
    duration: 1,
    onUpdate: scheduleRender
  }, 0);

  // 2. Fade in Black/Navy Shade Overlay AND Content AFTER Frame 76 (between 0.22 and 0.42 scroll progress)
  if (heroShadeOverlay) {
    tl.to(heroShadeOverlay, {
      opacity: 1,
      ease: "power2.out",
      duration: 0.2
    }, 0.22);
  }

  if (heroHeader) {
    tl.to(heroHeader, {
      opacity: 1,
      y: 0,
      scale: 1,
      pointerEvents: "auto",
      ease: "power2.out",
      duration: 0.2
    }, 0.22);
  }

  // Listeners
  window.addEventListener("resize", resizeCanvas);

  // Fallback initial draw
  if (images[0].complete && images[0].naturalWidth > 0) {
    loadedFrames[0] = true;
    resizeCanvas();
  }
});

