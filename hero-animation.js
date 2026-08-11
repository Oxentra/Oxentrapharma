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

  const ctx = canvas.getContext("2d", { alpha: false });

  // 300 Frames sequence (ezgif-frame-001.jpg to ezgif-frame-300.jpg)
  const totalFrames = 300;
  const images = [];
  const loadedFrames = {};

  const pad = (num, size) => num.toString().padStart(size, '0');

  // Pre-generate image paths: images/herosection/ezgif-frame-001.jpg ... 300.jpg
  for (let i = 1; i <= totalFrames; i++) {
    const img = new Image();
    img.src = `images/herosection/ezgif-frame-${pad(i, 3)}.jpg`;
    images.push(img);
  }

  // Handle aspect-ratio canvas scaling (cover size centering with smooth interpolation)
  function drawImageCover(ctx, img) {
    if (!img || !img.complete || img.naturalWidth === 0) return;
    
    const canvas = ctx.canvas;
    const hRatio = canvas.width / img.naturalWidth;
    const vRatio = canvas.height / img.naturalHeight;
    const ratio = Math.max(hRatio, vRatio);
    const centerShift_x = (canvas.width - img.naturalWidth * ratio) / 2;
    const centerShift_y = (canvas.height - img.naturalHeight * ratio) / 2;
    
    ctx.drawImage(
      img, 
      0, 0, img.naturalWidth, img.naturalHeight,
      centerShift_x, centerShift_y, img.naturalWidth * ratio, img.naturalHeight * ratio
    );
  }

  // Nearest Loaded Frame fallback scanner
  function getNearestLoadedImage(index) {
    const safeIndex = Math.min(Math.max(0, index), totalFrames - 1);
    if (loadedFrames[safeIndex]) return images[safeIndex];

    let left = safeIndex - 1;
    let right = safeIndex + 1;

    while (left >= 0 || right < totalFrames) {
      if (left >= 0 && loadedFrames[left]) return images[left];
      if (right < totalFrames && loadedFrames[right]) return images[right];
      left--;
      right++;
    }

    return images[0];
  }

  let lastDrawnIndex = -1;

  // Master frame rendering routine with deduplication
  function drawFrame(index) {
    const roundedIndex = Math.round(index);
    if (roundedIndex === lastDrawnIndex && loadedFrames[roundedIndex]) return;
    
    const img = getNearestLoadedImage(roundedIndex);
    if (img) {
      drawImageCover(ctx, img);
      if (loadedFrames[roundedIndex]) {
        lastDrawnIndex = roundedIndex;
      }
    }
  }

  // Smooth lerp frame loop for rAF fluidity
  let currentFrame = 0;
  let targetFrame = 0;
  let animationFrameId = null;

  function updateFrameLoop() {
    const diff = targetFrame - currentFrame;
    if (Math.abs(diff) > 0.05) {
      currentFrame += diff * 0.35; // Butter-smooth interpolation factor
      drawFrame(currentFrame);
      animationFrameId = requestAnimationFrame(updateFrameLoop);
    } else {
      currentFrame = targetFrame;
      drawFrame(currentFrame);
      animationFrameId = null;
    }
  }

  function requestSmoothFrame(frameIndex) {
    targetFrame = frameIndex;
    if (!animationFrameId) {
      animationFrameId = requestAnimationFrame(updateFrameLoop);
    }
  }

  // Resize canvas to window dimensions with DPR awareness
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    lastDrawnIndex = -1;
    drawFrame(currentFrame);
  }

  // Synchronous Load of the first frame for instantaneous first-paint
  images[0].onload = () => {
    loadedFrames[0] = true;
    resizeCanvas();
  };
  
  // Background Preloading for the remaining 299 frames
  images.forEach((img, idx) => {
    if (idx === 0) return;
    img.onload = () => {
      loadedFrames[idx] = true;
      if (Math.round(currentFrame) === idx) {
        drawFrame(idx);
      }
    };
  });

  // Playhead object for GSAP timeline
  const playhead = { frame: 0 };

  // DOM elements
  const heroHeader = document.getElementById("hero-main-header");
  const heroShadeOverlay = document.getElementById("hero-shade-overlay");

  // Set initial state: NO black shade at start, NO text overlay at start
  if (heroShadeOverlay) {
    gsap.set(heroShadeOverlay, { opacity: 0 });
  }
  if (heroHeader) {
    gsap.set(heroHeader, { opacity: 0, y: 35, scale: 0.96, pointerEvents: "none" });
  }

  // Master timeline scrubbing through the 400vh hero section with ultra-smooth physics
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.8, // Ultra-smooth inertia physics scrubbing
      pin: ".hero-sticky-viewport",
      pinSpacing: true,
      anticipatePin: 1,
      invalidateOnRefresh: true
    }
  });

  // 1. Scrub through all 300 image frames across the scroll smoothly
  tl.to(playhead, {
    frame: totalFrames - 1,
    ease: "none",
    duration: 1,
    onUpdate: () => {
      requestSmoothFrame(playhead.frame);
    }
  }, 0);

  // 2. Fade in Black/Navy Shade Overlay AND Content AFTER Frame 76 (between 0.22 and 0.42 scroll progress)
  if (heroShadeOverlay) {
    tl.to(heroShadeOverlay, {
      opacity: 1,
      ease: "power2.out",
      duration: 0.25
    }, 0.22);
  }

  if (heroHeader) {
    tl.to(heroHeader, {
      opacity: 1,
      y: 0,
      scale: 1,
      pointerEvents: "auto",
      ease: "power2.out",
      duration: 0.25
    }, 0.22);
  }

  // Listeners
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 100);
  });

  // Fallback initial draw
  if (images[0].complete) {
    loadedFrames[0] = true;
    resizeCanvas();
  }
});
