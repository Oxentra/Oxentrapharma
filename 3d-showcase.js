/* 3D Product Showcase Script */

document.addEventListener("DOMContentLoaded", () => {
  const bench = document.getElementById("showcase-lab-bench");
  const stage = document.getElementById("showcase-stage-wrapper");
  const glow = document.getElementById("showcase-backdrop-glow");
  const slots = document.querySelectorAll(".showcase-product-slot");
  const shadows = document.querySelectorAll(".showcase-shadow");
  const tabBtns = document.querySelectorAll(".showcase-tab-btn");
  const particlesContainer = document.getElementById("particles-container");

  let isAnimating = false;
  let activeProduct = null;
  let particleInterval = null;

  // Active state sequences timeouts references to clear them if retriggered mid-way
  let resetTimeout = null;
  let stage1Timeout = null;
  let stage2Timeout = null;
  let stage3Timeout = null;
  let stage4Timeout = null;

  // Particle dynamics spawner
  function startParticles() {
    stopParticles();
    particleInterval = setInterval(() => {
      if (!particlesContainer) return;
      const p = document.createElement("div");
      p.className = "micro-particle";
      
      const left = Math.random() * 100;
      const size = Math.random() * 3 + 2.5; // 2.5px to 5.5px
      const delay = Math.random() * 1.5;
      const duration = Math.random() * 4 + 7; // 7s to 11s
      const driftX = Math.random() * 120 - 60; // -60px to 60px drift
      
      p.style.left = `${left}%`;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.animationDelay = `${delay}s`;
      p.style.animationDuration = `${duration}s`;
      p.style.setProperty("--drift-x", `${driftX}px`);
      
      particlesContainer.appendChild(p);
      
      setTimeout(() => {
        p.remove();
      }, (delay + duration) * 1000);
    }, 350);
  }

  function stopParticles() {
    clearInterval(particleInterval);
    if (particlesContainer) {
      particlesContainer.innerHTML = "";
    }
  }

  // Selects and triggers the animation sequence for a selected product
  function selectProduct(productId) {
    if (isAnimating) return;
    isAnimating = true;

    // Reset previous selection states
    clearAllSequences();
    resetActiveStates();

    // Get product slot and shadow
    const targetSlot = document.querySelector(`.showcase-product-slot[data-product="${productId}"]`);
    const targetShadow = document.querySelector(`.showcase-shadow[data-product="${productId}"]`);
    const targetTabBtn = document.querySelector(`.showcase-tab-btn[data-product="${productId}"]`);

    if (!targetSlot || !targetShadow) {
      isAnimating = false;
      return;
    }

    activeProduct = productId;

    // Update Tab state
    tabBtns.forEach(btn => btn.classList.remove("active"));
    if (targetTabBtn) targetTabBtn.classList.add("active");

    // Enable laboratory backdrop dimmer mode
    bench.classList.add("product-active");
    targetSlot.classList.add("selected");
    targetShadow.classList.add("selected");
    glow.classList.add("active");

    // STAGE 1: 00:00–00:02 Extreme macro logo reveal
    stage.className = "showcase-stage-wrapper cam-stage-macro-zoom";
    targetSlot.classList.add("anim-center");
    targetShadow.classList.add("anim-center");

    // STAGE 2: 00:02–00:05 Slow dolly out with anti-gravity lift (2s mark)
    stage1Timeout = setTimeout(() => {
      stage.className = "showcase-stage-wrapper cam-stage-dolly-out";
      targetSlot.classList.add("anim-lifting");
      targetShadow.classList.add("anim-lifting");
      startParticles(); // Begin microscopic particle drift

      // STAGE 3: 00:05–00:08 Smooth 180° Orbit (5s mark)
      stage2Timeout = setTimeout(() => {
        stage.className = "showcase-stage-wrapper cam-stage-orbit";
        targetSlot.classList.remove("anim-lifting");
        targetShadow.classList.remove("anim-lifting");
        targetSlot.classList.add("anim-orbit");
        targetShadow.classList.add("anim-orbit");

        // STAGE 4: 00:08–00:10 Hero front view with slow push-in (8s mark)
        stage3Timeout = setTimeout(() => {
          stage.className = "showcase-stage-wrapper cam-stage-hero-push-in";
          targetSlot.classList.remove("anim-orbit");
          targetShadow.classList.remove("anim-orbit");
          targetSlot.classList.add("anim-hero-front");
          targetShadow.classList.add("anim-hero-front");

          // STAGE 5: 00:10–00:12+ Hold on product with levitation, hologram & light rings (10s mark)
          stage4Timeout = setTimeout(() => {
            stage.className = "showcase-stage-wrapper cam-stage-hold";
            targetSlot.classList.remove("anim-hero-front");
            targetShadow.classList.remove("anim-hero-front");
            targetSlot.classList.add("anim-hold-float");
            targetShadow.classList.add("anim-hold-float");
            bench.classList.add("hold-active"); // Triggers expanding light rings

            // Final unlock control (12s mark)
            resetTimeout = setTimeout(() => {
              isAnimating = false;
            }, 2000);

          }, 2000);

        }, 3000);

      }, 3000);

    }, 2000);
  }

  // Resets active state classes
  function resetActiveStates() {
    bench.classList.remove("product-active", "hold-active");
    stage.className = "showcase-stage-wrapper";
    glow.classList.remove("active");
    stopParticles();

    slots.forEach(slot => {
      slot.className = "showcase-product-slot";
    });

    shadows.forEach(shadow => {
      shadow.className = "showcase-shadow";
    });
  }

  // Clears timer handlers
  function clearAllSequences() {
    clearTimeout(resetTimeout);
    clearTimeout(stage1Timeout);
    clearTimeout(stage2Timeout);
    clearTimeout(stage3Timeout);
    clearTimeout(stage4Timeout);
  }

  // Click handler on slot objects
  slots.forEach(slot => {
    slot.addEventListener("click", () => {
      const prodId = slot.dataset.product;
      if (prodId === activeProduct) {
        // Toggle/Reset if clicked active
        if (!isAnimating) {
          clearAllSequences();
          resetActiveStates();
          activeProduct = null;
          tabBtns.forEach(btn => btn.classList.remove("active"));
        }
      } else {
        selectProduct(prodId);
      }
    });
  });

  // Click handler on tab selector buttons
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const prodId = btn.dataset.product;
      if (prodId === activeProduct) {
        if (!isAnimating) {
          clearAllSequences();
          resetActiveStates();
          activeProduct = null;
          btn.classList.remove("active");
        }
      } else {
        selectProduct(prodId);
      }
    });
  });
});
