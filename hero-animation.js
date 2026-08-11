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

  // Nearest Loaded Frame fallback scanner
  function getNearestLoadedImage(index) {
    if (loadedFrames[index]) return images[index];

    let left = index - 1;
    let right = index + 1;

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

  // Resize canvas to window dimensions
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawFrame(playhead.frame);
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
      if (Math.round(playhead.frame) === idx) {
        drawFrame(idx);
      }
    };
  });

  // Playhead variable for GSAP scrubbing
  const playhead = { frame: 0 };

  // DOM elements
  const heroHeader = document.getElementById("hero-main-header");
  const heroShadeOverlay = document.getElementById("hero-shade-overlay");

  // Set initial state: NO black shade at start, NO text overlay at start
  if (heroShadeOverlay) {
    gsap.set(heroShadeOverlay, { opacity: 0 });
  }
  if (heroHeader) {
    gsap.set(heroHeader, { opacity: 0, y: 35, scale: 0.95, pointerEvents: "none" });
  }

  // Detect mobile device
  const isMobile = window.innerWidth <= 768;

  // RequestAnimationFrame throttled frame rendering for 60fps/120fps mobile display sync
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
      invalidateOnRefresh: true
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
  if (images[0].complete) {
    loadedFrames[0] = true;
    resizeCanvas();
  }
});
