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

  // Select text overlay frames
  const overlay = document.querySelector(".hero-dark-overlay");
  const frame1 = document.querySelector(".hero-frame-1");
  const frame2 = document.querySelector(".hero-frame-2");
  const frame3 = document.querySelector(".hero-frame-3");
  const productsCta = document.getElementById("hero-products-cta");

  // Force initial CSS states via GSAP to prevent layout shifts
  gsap.set(frame1, { opacity: 1, scale: 1, y: 0 });
  gsap.set(frame2, { opacity: 0, y: 40, scale: 0.95 });
  gsap.set(frame3, { opacity: 0, y: 40, scale: 0.95 });

  // Click handler for Products CTA to smooth scroll to products
  if (productsCta) {
    productsCta.addEventListener("click", (e) => {
      e.preventDefault();
      const productsSection = document.getElementById("products");
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Sequence Configuration (300 JPEG frames)
  const totalFrames = 300;
  const images = [];
  const loadedFrames = {};

  const pad = (num, size) => num.toString().padStart(size, '0');

  // Pre-generate image paths
  for (let i = 1; i <= totalFrames; i++) {
    const img = new Image();
    img.src = `images/herosections/ezgif-frame-${pad(i, 3)}.jpg`;
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
  
  // Background Preloading for the remaining frames
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

  // Master timeline scrubbing through the 400vh hero section
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "bottom bottom",
      scrub: 1, // Smooth scrolling physics
      pin: ".hero-sticky-viewport",
      pinSpacing: false, // Viewport pins within the 400vh parent
      invalidateOnRefresh: true,
      onLeave: () => {
        const productsSection = document.getElementById("products");
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  });

  // Animate the image sequence frames (0 to 299)
  tl.to(playhead, {
    frame: totalFrames - 1,
    snap: "frame",
    ease: "none",
    duration: 1,
    onUpdate: () => {
      drawFrame(playhead.frame);
    }
  }, 0);

  // Synchronized text overlays animations
  // --- STAGE 1: Frame 1 Fade Out ---
  tl.to(frame1, {
    opacity: 0,
    scale: 1.1,
    y: -50,
    ease: "power1.out",
    duration: 0.18
  }, 0.05); // starts at progress 0.05, ends at 0.23

  // --- STAGE 2: Frame 2 Fade In, Hold, Fade Out ---
  tl.to(frame2, {
    opacity: 1,
    scale: 1,
    y: 0,
    pointerEvents: "auto",
    ease: "power2.out",
    duration: 0.18
  }, 0.28); // starts at 0.28, ends at 0.46

  tl.to(frame2, {
    opacity: 0,
    scale: 1.05,
    y: -50,
    pointerEvents: "none",
    ease: "power1.in",
    duration: 0.18
  }, 0.52); // starts at 0.52, ends at 0.70



  tl.to(frame3, {
    opacity: 1,
    scale: 1,
    y: 0,
    pointerEvents: "auto",
    ease: "power2.out",
    duration: 0.18
  }, 0.72); // starts at 0.72, ends at 0.90

  // No rotating clock progress circles; simplified to a clean pill button CTA

  // --- STAGE 4: Final Smooth Exit Transition ---
  tl.to(frame3, {
    y: 450, // Physical downward motion to guide the scroll transition to products
    opacity: 0,
    scale: 0.85,
    ease: "power1.in",
    duration: 0.12
  }, 0.93);



  // Listeners
  window.addEventListener("resize", resizeCanvas);

  // Fallback initial draw in case onload happened before setup
  if (images[0].complete) {
    loadedFrames[0] = true;
    resizeCanvas();
  }
});
