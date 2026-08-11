// Product Data from Brochure (Oxentra v1.0.1)
const products = {
  glideplus: {
    id: "glideplus",
    name: "GLIDEPLUS™",
    subtitle: "Liquid Paraffin, Milk of Magnesia & Sodium Picosulfate Suspension",
    category: "Gastroenterology",
    form: "Suspension (200 ml)",
    composition: [
      "Liquid Paraffin IP - 1.25ml",
      "Milk of Magnesia IP - 3.75ml",
      "Sodium Picosulfate BP - 3.3 mg"
    ],
    indications: [
      "Chronic Constipation Management",
      "Bowel clearance before radiology or endoscopy",
      "Comfortable relief in painful anorectal conditions (hemorrhoids, anal fissures)"
    ],
    features: [
      "Triple-Action Synergy for comprehensive and effective relief",
      "Controlled & Predictable Bowel Movement",
      "Optimized Dose Formulation",
      "Sugar-Free, Mixed Fruit & Vanilla Flavour for superior palatability"
    ],
    slogan: "The Triple-Action key to effortless relief",
    color: "pink",
    shortDesc: "For Chronic Constipation Relief"
  },
  oxentibmr: {
    id: "oxentibmr",
    name: "OXENTIB MR™",
    subtitle: "Etoricoxib & Thiocolchicoside Tablets",
    category: "Orthopedics & Rheumatology",
    form: "Tablets",
    composition: [
      "Etoricoxib IP - 60mg",
      "Thiocolchicoside IP - 4mg"
    ],
    indications: [
      "Musculoskeletal pain and inflammation associated with muscle spasms",
      "Low back pain, neck pain, and muscle strains",
      "Osteoarthritis, rheumatoid arthritis, and ankylosing spondylitis pain"
    ],
    features: [
      "The Dual Action Advantage (Peripheral Analgesic + Central Myorelaxant)",
      "Highly selective COX-2 inhibition for powerful pain management with gastric safety",
      "Centralized muscle relaxation with Thiocolchicoside",
      "Faster functional recovery and improved mobility"
    ],
    slogan: "Optimal Pain Control. Enhanced Mobility.",
    color: "red",
    shortDesc: "Effective Pain Management"
  },
  nervoxplus: {
    id: "nervoxplus",
    name: "NERVOX PLUS™",
    subtitle: "Benfotiamine, Methylcobalamin, Alpha Lipoic Acid, Inositol, Folic Acid & Minerals Capsules",
    category: "Neurology & Metabolic Health",
    form: "Soft Gelatin Capsules",
    composition: [
      "Benfotiamine - 150mg",
      "Methylcobalamin IP - 1500mcg",
      "Alpha Lipoic Acid IP - 100mg",
      "Inositol IP - 100mg",
      "Chromium Polynicotinate - 200mcg",
      "Folic Acid IP - 1.5mg",
      "Selenium Dioxide USP - 55mcg"
    ],
    indications: [
      "Diabetic Neuropathy & Peripheral Neuropathy",
      "Hyperhomocysteinemia",
      "Chronic Fatigue & Neurological Weakness",
      "Entrapment Neuropathies (e.g. Carpal Tunnel)",
      "General Nutritional Neuropathies"
    ],
    features: [
      "Advanced peripheral nerve support and myelin sheath regeneration",
      "Metabolic energy replenishment and cellular energy support",
      "Potent antioxidant action to combat oxidative stress in nerves"
    ],
    slogan: "End the Burn. Start the Build.",
    color: "emerald",
    shortDesc: "Nerve Health & Metabolic Support"
  },
  calcintra: {
    id: "calcintra",
    name: "CALCINTRA™",
    subtitle: "Calcium Citrate, Vitamin D3, Magnesium & Zinc Tablets",
    category: "Orthopedics / Bone Health",
    form: "Tablets",
    composition: [
      "Calcium Citrate USP - 1000mg",
      "Vitamin D3 IP - 200 IU",
      "Magnesium Hydroxide IP (Eq. to Magnesium) - 100mg",
      "Zinc Sulphate Monohydrate IP (Eq. to Elemental Zinc) - 4mg"
    ],
    indications: [
      "Pregnancy and Lactation",
      "Post-menopausal osteoporosis",
      "Senile osteoporosis or age-related bone loss",
      "Calcium deficiency prophylaxis and therapeutic management"
    ],
    features: [
      "The small size tablet with superior absorption advantage",
      "Independent absorption of Calcium Citrate even with reduced stomach acid",
      "Promotes collagen synthesis and bone matrix mineralization",
      "Better patient compliance over long-term therapy"
    ],
    slogan: "Complete Mineralization. Maximum Compliance.",
    color: "purple",
    shortDesc: "Bone Strength & Nutritional Support"
  },
  pxentradsr: {
    id: "pxentradsr",
    name: "PXENTRA DSR™",
    subtitle: "Pantoprazole Sodium (EC) & Domperidone (SR) Capsules",
    category: "Gastroenterology",
    form: "Hard Gelatin Capsules",
    composition: [
      "Pantoprazole Sodium - 40 mg (as enteric coated Tablet)",
      "Domperidone IP - 30 mg (10mg as immediate release & 20mg as Sustained release)"
    ],
    indications: [
      "Gastroesophageal Reflux Disease (GERD)",
      "Nausea and vomiting associated with hyperacidity",
      "Peptic ulcers and gastritis control",
      "Prompt relief of nausea and bloating alongside consistent PPI efficacy"
    ],
    features: [
      "24 Hours Acid Control with 3-part release mechanism",
      "Domperidone 20 mg SR: Prolonged prokinetic coverage throughout the day/night",
      "Enteric Coated Pantoprazole 40 mg: Delayed release and protection from gastric acid",
      "Domperidone 10 mg IR: Rapid relief of acute symptoms"
    ],
    slogan: "Precision Release. Proven Results all the day.",
    color: "blue",
    shortDesc: "Acid Control & GI Protection"
  },
  lxentra: {
    id: "lxentra",
    name: "LXENTRA™",
    subtitle: "Luliconazole IP 1% w/w Cream",
    category: "Dermatology",
    form: "20 gm Cream",
    composition: [
      "Luliconazole IP - 1% w/w",
      "Benzyl Alcohol IP - 1% w/w (as preservative)"
    ],
    indications: [
      "Tinea pedis (Athlete's Foot)",
      "Tinea cruris (Jock Itch)",
      "Tinea corporis (Ringworm)",
      "Cutaneous Candidiasis",
      "Pityriasis Versicolor",
      "Onychomycosis (Off-label use)"
    ],
    features: [
      "Superior Skin Penetration and retention in the stratum corneum",
      "Rapid Symptom Relief from itching, burning, and scaling",
      "Once-Daily Dosing for maximum patient compliance",
      "High Cure Rates against key dermatophytes"
    ],
    slogan: "Delivers Targeted Efficacy and Definitive Results",
    color: "teal",
    shortDesc: "Healthy Skin, Lasting Care"
  },
  oxrizinelc: {
    id: "oxrizinelc",
    name: "OXRIZINE LC™",
    subtitle: "Levocetirizine Hydrochloride & Montelukast Sodium Tablets",
    category: "Allergy & Respiratory",
    form: "Bi-layered Tablets",
    composition: [
      "Levocetirizine Hydrochloride IP - 5.0 mg",
      "Montelukast Sodium IP - 10.0 mg"
    ],
    indications: [
      "Allergic Rhinitis (Seasonal & Perennial)",
      "Asthma prophylaxis with comorbid allergic rhinitis",
      "Chronic Idiopathic Urticaria",
      "Skin allergies and inflammatory conditions"
    ],
    features: [
      "Dual-Pathway Inflammation Control (Antihistamine + Leukotriene Receptor Antagonist)",
      "Superior Nasal Decongestion and bronchoprotective action",
      "Broad Spectrum of Efficacy with minimal drowsiness",
      "Convenient once-daily dosing"
    ],
    slogan: "For All-Day, All-Night Allergy Freedom",
    color: "orange",
    shortDesc: "All-Day & All-Night Allergy Relief"
  },
  heaveenema: {
    id: "heaveenema",
    name: "HEAVE™ ENEMA",
    subtitle: "Glycerine & Sodium Chloride Enema",
    category: "Gastroenterology",
    form: "Enema (100 ml)",
    composition: [
      "Glycerine IP - 15% w/v",
      "Sodium Chloride IP - 15% w/v",
      "In an aqueous base"
    ],
    indications: [
      "Immediate and complete lower bowel evacuation",
      "Severe fecal impaction",
      "Pre-operative or post-operative bowel preparation"
    ],
    features: [
      "Dual Hyperosmotic Power drawing water to soften and stimulate",
      "Predictable & Rapid Onset (evacuation within 5 to 15 minutes)",
      "Minimal Systemic Risk and localized rectal action",
      "High Efficacy Concentration"
    ],
    slogan: "Maximum Osmotic Power. Minimal Systemic Impact.",
    color: "cyan",
    shortDesc: "Rapid Bowel Evacuation"
  },
  heavesenema: {
    id: "heavesenema",
    name: "HEAVE S™ ENEMA",
    subtitle: "Sodium Dihydrogen Phosphate Dihydrate & Sodium Phosphate Enema",
    category: "Gastroenterology",
    form: "Enema (100 ml)",
    composition: [
      "Sodium Dihydrogen Phosphate Dihydrate IP - 10 g",
      "Sodium Phosphate IP - 8 g",
      "In an aqueous base"
    ],
    indications: [
      "Cases demanding immediate bowel evacuation",
      "Preparation of patients for endoscopic or surgical procedures",
      "Relief of acute constipation"
    ],
    features: [
      "Fast, complete, and reliable colon emptying",
      "Saves clinical preparation time",
      "Gentle osmotic action targeting lower rectum"
    ],
    slogan: "Fast, Complete, Reliable lower bowel evacuation",
    color: "rose",
    shortDesc: "Gentle Colon Emptying"
  }
};

const purposeTabs = {
  purpose: {
    title: "Our Purpose",
    text: "Guided by our core values, we at Oxentra Pharma continuously strive to enrich and support clinical excellence, ensuring that patients receive formulations backed by robust scientific research. Our commitment focuses on bringing quality formulations to healthcare networks around the world.",
    image: "purpose-sustainable-future.jpg",
    gradient: "from-blue-950/85 via-blue-950/45 to-transparent"
  },
  wellness: {
    title: "Illness To Wellness",
    text: "Our formulations are designed to support patients on their pathway from illness to wellness. By ensuring the highest quality in therapeutic delivery, we help communities lead healthier and more active lives.",
    image: "purpose-wellness.jpg",
    gradient: "from-emerald-950/85 via-emerald-950/45 to-transparent"
  },
  people: {
    title: "Our People. Our Pride.",
    text: "Our employees are our greatest asset. At Oxentra Pharma, we foster a culture of safety, inclusion, and innovation, empowering our teams to deliver excellence at every step of the pharmaceutical manufacturing process.",
    image: "purpose-people.jpg",
    gradient: "from-slate-950/85 via-slate-950/45 to-transparent"
  },
  thinkOxentra: {
    title: "BREATHE. Think Oxentra",
    text: "We are committed to delivering respiratory and therapeutic excellence that healthcare providers trust. We maintain uncompromising transparency, reliable raw material sourcing, and batch-to-batch consistency that clinical professionals can trust completely.",
    image: "hero-scientific-lifestyle.jpg",
    gradient: "from-[#002B3E]/95 via-[#002B3E]/50 to-transparent"
  },
  sustainability: {
    title: "Towards A Sustainable Future",
    text: "In alignment with our purpose of 'Caring for life', we at Oxentra Pharma have relentlessly worked to enrich the lives of the communities we touch and nurture life on the planet through active environmental stewardship.",
    image: "hero-globe-care.jpg",
    gradient: "from-emerald-950/85 via-emerald-950/40 to-transparent"
  }
};

// 4 Modern Clinical Digital Brochures Data (Digitizing pages 2-9 of brochure PDF)
const clinicalBrochures = {
  gastro: {
    title: "Gastroenterology & Acid Management Brochure",
    subtitle: "Complete Constipation Management & Acid Control",
    color: "blue",
    productIds: ["glideplus", "pxentradsr", "heaveenema"],
    slogan: "Predictable, comfortable, and complete bowel comfort all day long.",
    benefits: [
      "Triple-Action Constipation Relief (Liquid Paraffin + Milk of Magnesia + Sodium Picosulfate)",
      "24-Hour Acid Control via precision 3-part capsule release mechanism",
      "Immediate bowel clearance (evacuation within 5-15 mins) with localized osmotic action",
      "Highly palatable Vanilla & Mix Fruit Sugar-free suspensions"
    ],
    indications: [
      "Chronic Constipation Management",
      "Hyperacidity, bloating, and GERD symptoms",
      "Clinical bowel preparation for endoscopy/radiology"
    ]
  },
  neuro: {
    title: "Neurology & Metabolic Health Brochure",
    subtitle: "Advanced Peripheral Nerve Support & Metabolism Correction",
    color: "emerald",
    productIds: ["nervoxplus"],
    slogan: "End the Burn. Start the Build. Restoring nerve health.",
    benefits: [
      "Advanced peripheral nerve regeneration with Methylcobalamin & Benfotiamine",
      "Alpha Lipoic Acid antioxidant barrier to stop neurological burning sensations",
      "Cellular metabolic energy support with Chromium, Inositol, and Folic Acid",
      "Soft gelatin capsule form for maximum bioavailability and absorption rate"
    ],
    indications: [
      "Diabetic Neuropathy & Peripheral Neuropathies",
      "Chronic Fatigue, metabolic weakness, and nutritional neuropathies",
      "Entrapment neuropathy relief"
    ]
  },
  skin: {
    title: "Dermatology & Skin Care Brochure",
    subtitle: "Targeted Treatment of Persistent Dermatophyte Infections",
    color: "teal",
    productIds: ["lxentra"],
    slogan: "Delivers targeted efficacy and definitive results in tinea infections.",
    benefits: [
      "Superior skin penetration, retaining active medicine in stratum corneum layers",
      "Rapid symptoms relief (relieves itching, burning, and scaling instantly)",
      "Convenient Once-Daily Dosing to guarantee clinical compliance",
      "Broad-spectrum antifungal efficacy against dermatophytes and candidiasis"
    ],
    indications: [
      "Tinea pedis (Athlete's Foot), Tinea cruris (Jock Itch), Tinea corporis",
      "Pityriasis Versicolor and Cutaneous Candidiasis",
      "Onychomycosis management"
    ]
  },
  ortho: {
    title: "Orthopedics & Allergy Care Brochure",
    subtitle: "Complete Bone Health, Musculoskeletal Pain, & Allergy Freedom",
    color: "indigo",
    productIds: ["calcintra", "oxentibmr", "oxrizinelc"],
    slogan: "Optimal pain control, bone mineralization, and allergy-free nights.",
    benefits: [
      "Dual-Action muscle spasm and pain relief: Etoricoxib + Thiocolchicoside centrally acting relaxant",
      "Small-sized Calcium Citrate complex tablets for superior stomach-acid-independent absorption",
      "Dual-Pathway allergy freedom: Levocetirizine + Montelukast for 24-hour symptom control",
      "Promotes structural collagen synthesis and bone matrix mineralization"
    ],
    indications: [
      "Osteoarthritis, muscle strains, low back pain, and spasms",
      "Pregnancy/lactation calcium support, post-menopausal osteoporosis",
      "Seasonal and perennial allergic rhinitis, chronic idiopathic urticaria"
    ]
  }
};

// Document Ready
document.addEventListener("DOMContentLoaded", () => {
  initHeaderScroll();
  initSearchBar();
  initMobileMenu();
  initRevealOnScroll();
  initPurposeTabs();
  initProductsCarousel();
  initMetricsCounter();
  // initProductModals();
  initLeafletMap();
  initContactForm();
  initBrochureLibrary();
  initImageLazyLoading();
  initWhyUsMobileCarousel();
});

// Mobile Menu Toggle
function initMobileMenu() {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuIconOpen = document.getElementById("menu-icon-open");
  const menuIconClose = document.getElementById("menu-icon-close");
  
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.contains("hidden");
      if (isOpen) {
        mobileMenu.classList.remove("hidden");
        mobileMenu.classList.add("flex");
        menuIconOpen.classList.add("hidden");
        menuIconClose.classList.remove("hidden");
      } else {
        mobileMenu.classList.add("hidden");
        mobileMenu.classList.remove("flex");
        menuIconOpen.classList.remove("hidden");
        menuIconClose.classList.add("hidden");
      }
    });

    mobileMenu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        mobileMenu.classList.remove("flex");
        menuIconOpen.classList.remove("hidden");
        menuIconClose.classList.add("hidden");
      });
    });
  }
}

// Reveal Scroll Observer (Enhanced for Smooth Animations)
function initRevealOnScroll() {
  const selector = ".reveal, .reveal-fade, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur";
  const reveals = document.querySelectorAll(selector);
  
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  });
  
  reveals.forEach(el => observer.observe(el));
}

// Cipla Purpose Tabs
function initPurposeTabs() {
  const buttons = document.querySelectorAll(".purpose-tab-btn");
  const panelImg = document.getElementById("purpose-panel-img");
  const panelTitle = document.getElementById("purpose-panel-title");
  const panelText = document.getElementById("purpose-panel-text");

  if (!panelTitle) return;

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const tabKey = btn.dataset.tab;
      const tabData = purposeTabs[tabKey];

      if (!tabData) return;

      buttons.forEach(b => {
        // Reset inactive styles
        b.classList.remove("bg-white", "shadow-md", "font-bold");
        b.classList.add("hover:bg-slate-100/50", "font-semibold");
        
        const iconCont = b.querySelector(".tab-icon-container");
        if (iconCont) {
          iconCont.classList.remove("border-blue-600/30", "bg-blue-50/50");
          iconCont.classList.add("border-blue-600/20", "bg-transparent");
        }
      });

      // Set active styles
      btn.classList.add("bg-white", "shadow-md", "font-bold");
      btn.classList.remove("hover:bg-slate-100/50", "font-semibold");
      
      const iconCont = btn.querySelector(".tab-icon-container");
      if (iconCont) {
        iconCont.classList.remove("border-blue-600/20", "bg-transparent");
        iconCont.classList.add("border-blue-600/30", "bg-blue-50/50");
      }

      const elements = [panelImg, panelTitle, panelText];
      elements.forEach(el => {
        if (el) {
          el.classList.remove("tab-content-active");
          void el.offsetWidth;
          el.classList.add("tab-content-active");
        }
      });

      const icon = btn.querySelector(".tab-icon-svg");
      setTimeout(() => {
        if (panelImg) panelImg.src = tabData.image;
        if (panelTitle) {
          panelTitle.innerText = tabData.title;
        }
        if (panelText) panelText.innerText = tabData.text;
      }, 50);
    });
  });
}

// Carousel Controls
function initProductsCarousel() {
  // 1. Portfolio Carousel
  const portContainer = document.getElementById("portfolio-slider-container");
  const portPrev = document.getElementById("portfolio-prev-btn");
  const portNext = document.getElementById("portfolio-next-btn");

  if (portContainer && portPrev && portNext) {
    const scrollAmount = 300;
    
    // Auto-scroll logic with manual override support
    let autoScrollTimer = null;
    let userInteractionTimeout = null;

    function startAutoScroll() {
      if (autoScrollTimer) return;
      autoScrollTimer = setInterval(() => {
        const maxScrollLeft = portContainer.scrollWidth - portContainer.clientWidth;
        if (portContainer.scrollLeft >= maxScrollLeft - 15) {
          portContainer.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          portContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }, 2000); // Shift every 2 seconds
    }

    function stopAutoScroll() {
      if (autoScrollTimer) {
        clearInterval(autoScrollTimer);
        autoScrollTimer = null;
      }
    }

    // Initial activation
    startAutoScroll();

    // Interaction handler to pause auto-scroll during active user control and resume after 5s
    function handleUserInteraction() {
      stopAutoScroll();
      clearTimeout(userInteractionTimeout);
      userInteractionTimeout = setTimeout(() => {
        userInteractionTimeout = null;
        startAutoScroll();
      }, 5000);
    }

    // Inactivity and hover observers
    portContainer.addEventListener('mouseenter', stopAutoScroll);
    portContainer.addEventListener('mouseleave', () => {
      if (!userInteractionTimeout) {
        startAutoScroll();
      }
    });

    portPrev.addEventListener("click", () => {
      portContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      handleUserInteraction();
    });

    portNext.addEventListener("click", () => {
      portContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      handleUserInteraction();
    });

    // Detect manual mouse wheel or swipe scrolling
    portContainer.addEventListener('wheel', handleUserInteraction, { passive: true });
    portContainer.addEventListener('touchmove', handleUserInteraction, { passive: true });
    portContainer.addEventListener('touchstart', stopAutoScroll, { passive: true });
    portContainer.addEventListener('touchend', handleUserInteraction, { passive: true });
  }

  // 2. Partners Carousel
  const partnersContainer = document.getElementById("partners-slider-container");
  const partnersPrev = document.getElementById("partners-prev-btn");
  const partnersNext = document.getElementById("partners-next-btn");

  if (partnersContainer && partnersPrev && partnersNext) {
    const scrollAmount = 200;
    partnersPrev.addEventListener("click", () => partnersContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
    partnersNext.addEventListener("click", () => partnersContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' }));
  }
}

// Stats Counter
function initMetricsCounter() {
  const section = document.getElementById("metrics-section");
  const counters = document.querySelectorAll(".counter-value");
  if (!section || counters.length === 0) return;

  let animated = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animate();
        animated = true;
        observer.unobserve(section);
      }
    });
  }, { threshold: 0.3 });
  observer.observe(section);

  function animate() {
    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target, 10);
      const duration = 1500;
      const step = Math.max(Math.floor(duration / target), 15);
      let curr = 0;

      const timer = setInterval(() => {
        curr += Math.ceil(target / (duration / step));
        if (curr >= target) {
          counter.innerText = target.toLocaleString('en-US') + (counter.dataset.suffix || "");
          clearInterval(timer);
        } else {
          counter.innerText = curr.toLocaleString('en-US') + (counter.dataset.suffix || "");
        }
      }, step);
    });
  }
}

// Modals
function initProductModals() {
  const modal = document.getElementById("product-modal");
  const openBtns = document.querySelectorAll(".open-details-btn");
  const closeBtn = document.getElementById("close-modal-btn");

  if (!modal || !closeBtn) return;

  const title = document.getElementById("modal-title");
  const subtitle = document.getElementById("modal-subtitle");
  const tag = document.getElementById("modal-tag");
  const form = document.getElementById("modal-form");
  const slogan = document.getElementById("modal-slogan");
  const composition = document.getElementById("modal-composition");
  const indications = document.getElementById("modal-indications");
  const features = document.getElementById("modal-features");

  openBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const key = btn.dataset.product;
      const data = products[key];
      if (!data) return;

      if (title) title.innerText = data.name;
      if (subtitle) subtitle.innerText = data.subtitle;
      if (tag) {
        tag.innerText = data.category;
        tag.className = `inline-block px-3 py-1 bg-blue-50 text-[#005B82] text-xs font-bold rounded-full uppercase tracking-wider`;
      }
      if (form) form.innerText = `Packaging: ${data.form}`;
      if (slogan) slogan.innerText = `"${data.slogan}"`;

      if (composition) {
        composition.innerHTML = data.composition
          .map(item => `<li class="flex items-start gap-2 py-1 font-mono text-xs border-b border-slate-100"><span class="text-orange-500">🧪</span><span>${item}</span></li>`)
          .join("");
      }
      if (indications) {
        indications.innerHTML = data.indications
          .map(item => `<li class="flex items-start gap-2 text-slate-600 text-sm"><span>•</span><span>${item}</span></li>`)
          .join("");
      }
      if (features) {
        features.innerHTML = data.features
          .map(item => `<li class="flex items-start gap-2 text-slate-600 text-sm"><span class="text-emerald-500 font-bold">✓</span><span>${item}</span></li>`)
          .join("");
      }

      modal.classList.remove("hidden");
      modal.classList.add("flex");
      document.body.classList.add("modal-open");
    });
  });

  const close = () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    document.body.classList.remove("modal-open");
  };

  closeBtn.addEventListener("click", close);
  modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.classList.contains("hidden")) close(); });
}

// Leaflet Map
function initLeafletMap() {
  const el = document.getElementById("location-map");
  if (!el) return;

  const coords = [9.998994, 76.302732];
  try {
    const map = L.map('location-map', { center: coords, zoom: 14, scrollWheelZoom: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO'
    }).addTo(map);
    L.marker(coords).addTo(map).bindPopup(`
      <div class="p-2">
        <h4 class="font-extrabold text-white">Oxentra Pharma Pvt. Ltd.</h4>
        <p class="text-xs text-slate-300">Formulations Crafted with Precision.</p>
      </div>
    `).openPopup();
  } catch (e) {
    console.error("Map initialization failed", e);
  }
}

// Contact form
function initContactForm() {
  const form = document.getElementById("partner-contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = form.querySelector("button[type='submit']");
    const text = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = "Processing...";
    setTimeout(() => {
      btn.innerHTML = "✓ Submitted!";
      btn.classList.add("bg-emerald-600");
      alert("Message received! Our team will contact you shortly.");
      form.reset();
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = text;
        btn.classList.remove("bg-emerald-600");
      }, 3000);
    }, 1200);
  });
}

// Clinical Brochure Library interactive logic
function initBrochureLibrary() {
  const tabContainer = document.getElementById("brochure-tabs-row");
  const viewer = document.getElementById("brochure-viewer-container");

  if (!tabContainer || !viewer) return;

  const tabButtons = tabContainer.querySelectorAll(".brochure-selector-btn");

  // Render a specific brochure Category
  function renderBrochure(categoryKey) {
    const brochure = clinicalBrochures[categoryKey];
    if (!brochure) return;

    // Apply animation trigger
    viewer.classList.remove("brochure-fade-in");
    void viewer.offsetWidth; // force reflow
    viewer.classList.add("brochure-fade-in");

    // Theme color match mappings
    const themeColorMap = {
      blue: "brand-blue",
      emerald: "emerald-600",
      teal: "teal-600",
      indigo: "indigo-600"
    };
    const colorClass = themeColorMap[brochure.color] || "brand-blue";

    // Reconstruct brochure inside the viewer panel
    let productsHtml = brochure.productIds.map(prodId => {
      const prod = products[prodId];
      if (!prod) return '';

      // Set box theme colors based on theme color class matching
      const borderMap = {
        pink: "border-pink-500 text-pink-600 bg-pink-50",
        red: "border-red-500 text-red-600 bg-red-50",
        emerald: "border-emerald-500 text-emerald-600 bg-emerald-50",
        purple: "border-purple-500 text-purple-600 bg-purple-50",
        blue: "border-blue-500 text-blue-600 bg-blue-50",
        teal: "border-teal-500 text-teal-600 bg-teal-50",
        orange: "border-orange-500 text-orange-600 bg-orange-50",
        cyan: "border-cyan-500 text-cyan-600 bg-cyan-50",
        rose: "border-rose-500 text-rose-600 bg-rose-50"
      };
      const themeColors = borderMap[prod.color] || "border-blue-500 text-blue-600 bg-blue-50";

      return `
        <!-- Product Brochure Card -->
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 items-center">
          
          <!-- Mockup Box left aligned -->
          <div class="flex-shrink-0 h-28 flex items-center justify-center">
            <div class="box-mockup hover:scale-105 transition-transform duration-300">
              <div class="box-face-front border-t-4 ${themeColors.split(' ')[0]}">
                <span class="text-[7px] font-black text-slate-400">Oxentra</span>
                <h5 class="text-[10px] font-black ${themeColors.split(' ')[1]} mt-2 font-display">${prod.name}</h5>
                <span class="text-[5px] text-slate-400 leading-tight font-mono mt-0.5">${prod.subtitle.substring(0, 30)}...</span>
                <div class="mt-auto h-2.5 w-full ${themeColors.split(' ')[2]} box-brand-strip"></div>
              </div>
              <div class="box-face-side">
                <span class="text-[5px] font-bold text-slate-400 origin-center rotate-90 whitespace-nowrap">${prod.name.replace('™', '')}</span>
              </div>
              <div class="box-face-top"></div>
            </div>
          </div>

          <!-- Product Details right aligned -->
          <div class="flex-grow space-y-2 text-center md:text-left">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <h4 class="text-lg font-black text-slate-800 font-display">${prod.name}</h4>
              <label class="inline-flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg select-none hover:bg-slate-100 transition-colors">
                <input type="checkbox" name="brochure-product" value="${prod.name}" checked class="form-checkbox text-brand-blue rounded border-slate-300 focus:ring-brand-blue h-4 w-4">
                <span class="text-xs font-semibold text-slate-600">Prescribe / Sample</span>
              </label>
            </div>
            <p class="text-xs text-slate-400 font-mono">${prod.subtitle}</p>
            <p class="text-xs font-semibold text-brand-orange">${prod.form}</p>
            <ul class="text-xs text-slate-500 font-mono space-y-0.5 pt-1">
              ${prod.composition.map(comp => `<li>🧪 ${comp}</li>`).join('')}
            </ul>
          </div>

        </div>
      `;
    }).join('');

    viewer.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left side: Product composition request forms (7/12) -->
        <div class="lg:col-span-7 space-y-4">
          <p class="text-xs font-extrabold tracking-widest text-[#005B82] uppercase mb-1">Prescription Selection Sheet</p>
          <div class="space-y-4">
            ${productsHtml}
          </div>
        </div>

        <!-- Right side: Clinical Details & Highlights (5/12) -->
        <div class="lg:col-span-5 bg-slate-50 rounded-2xl p-6 border border-slate-100/50 space-y-6">
          <div>
            <span class="inline-block px-3 py-1.5 bg-${colorClass}/10 text-${colorClass} text-xs font-bold rounded-full uppercase tracking-wider">
              Clinical Slogan
            </span>
            <h3 class="text-2xl font-black text-slate-900 mt-3 font-display">${brochure.title}</h3>
            <p class="text-sm font-semibold text-slate-500 mt-1">${brochure.subtitle}</p>
            <p class="text-sm italic font-bold text-[#005B82] mt-4 border-l-2 border-brand-orange pl-3">
              "${brochure.slogan}"
            </p>
          </div>

          <div class="space-y-3 pt-2">
            <h4 class="font-extrabold text-slate-900 uppercase tracking-wide text-xs">🌟 Clinical Benefits</h4>
            <ul class="space-y-2 text-sm text-slate-600">
              ${brochure.benefits.map(ben => `<li class="flex items-start gap-2"><span class="text-emerald-500 font-bold mt-0.5">✓</span><span>${ben}</span></li>`).join('')}
            </ul>
          </div>

          <div class="space-y-3 pt-2 border-t border-slate-200/50">
            <h4 class="font-extrabold text-slate-900 uppercase tracking-wide text-xs">📋 Primary Indications</h4>
            <ul class="space-y-2 text-sm text-slate-600">
              ${brochure.indications.map(ind => `<li class="flex items-start gap-2"><span class="text-brand-blue font-bold mt-0.5">•</span><span>${ind}</span></li>`).join('')}
            </ul>
          </div>

          <!-- Bottom Action Panel -->
          <div class="pt-4 border-t border-slate-200/50">
            <button id="brochure-sample-request-btn" class="w-full py-3 bg-brand-orange hover:bg-orange-600 text-white font-bold rounded-xl shadow-md transition-all text-center">
              Request Samples for Checked Products
            </button>
          </div>

        </div>

      </div>
    `;

    // Hook up sample request button inside the dynamically created html
    const requestBtn = document.getElementById("brochure-sample-request-btn");
    if (requestBtn) {
      requestBtn.addEventListener("click", () => {
        const checkedBoxes = viewer.querySelectorAll("input[name='brochure-product']:checked");
        if (checkedBoxes.length === 0) {
          alert("Please check at least one product to request samples.");
          return;
        }
        
        const selectedProducts = Array.from(checkedBoxes).map(cb => cb.value).join(", ");
        requestBtn.disabled = true;
        requestBtn.innerHTML = `Sending request...`;

        setTimeout(() => {
          alert(`Success! We have submitted your sample request for: ${selectedProducts}. Our representative will contact your clinic shortly.`);
          requestBtn.disabled = false;
          requestBtn.innerHTML = `Request Samples for Checked Products`;
        }, 1200);
      });
    }
  }

  // Hook tab click events
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const category = btn.dataset.brochure;

      tabButtons.forEach(b => {
        b.classList.remove("brochure-tab-active");
        b.classList.add("bg-white", "text-slate-600", "border-slate-200");
      });

      btn.classList.add("brochure-tab-active");
      btn.classList.remove("bg-white", "text-slate-600", "border-slate-200");

      renderBrochure(category);
    });
  });

  // Render initial default brochure (Gastro)
  renderBrochure("gastro");
}

// Global Header Scroll Event Listener
function initHeaderScroll() {
  const header = document.querySelector("header");
  const scrollThreshold = 30;

  if (!header) return;

  function checkScroll() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add("header-scrolled");
    } else {
      header.classList.remove("header-scrolled");
    }
  }

  window.addEventListener("scroll", checkScroll);
  checkScroll(); // Run immediately on load
}

// Global Product Search Functionality
function initSearchBar() {
  const searchInputs = document.querySelectorAll(".nav-search-input");
  
  searchInputs.forEach(input => {
    // Search on Enter keypress
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const query = input.value.trim();
        if (query) {
          window.location.href = `products.html?search=${encodeURIComponent(query)}`;
        }
      }
    });
  });

  // Client-side search & filter logic for products page
  const isProductsPage = window.location.pathname.includes("products.html");
  if (isProductsPage) {
    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get("search");
    
    const productSearchInputs = document.querySelectorAll(".nav-search-input");
    const productCards = document.querySelectorAll(".product-card");
    const filterButtons = document.querySelectorAll(".filter-btn");

    function filterProducts() {
      let query = "";
      productSearchInputs.forEach(input => {
        if (input.value) {
          query = input.value.toLowerCase().trim();
        }
      });

      const activeBtn = document.querySelector(".filter-btn.bg-\\[\\#5b51e8\\]");
      const filter = activeBtn ? activeBtn.getAttribute("data-filter") : "all";

      productCards.forEach(card => {
        const categories = card.getAttribute("data-categories").split(" ");
        const cardTitle = card.querySelector("h4") ? card.querySelector("h4").innerText.toLowerCase() : "";
        const cardDesc = card.querySelector("p") ? card.querySelector("p").innerText.toLowerCase() : "";
        const textContent = cardTitle + " " + cardDesc + " " + card.innerText.toLowerCase();
        
        const matchesFilter = (filter === "all" || categories.includes(filter));
        const matchesQuery = (query === "" || textContent.includes(query));

        if (matchesFilter && matchesQuery) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    }

    // Initialize search inputs with URL query param if present
    productSearchInputs.forEach(input => {
      if (initialQuery) {
        input.value = initialQuery;
      }
      
      // Update other search inputs in sync and filter real-time
      input.addEventListener("input", (e) => {
        productSearchInputs.forEach(otherInput => {
          if (otherInput !== input) {
            otherInput.value = e.target.value;
          }
        });
        filterProducts();
      });
    });

    if (initialQuery) {
      filterProducts();
    }

    // Intercept clicks on category filters to apply keyword search simultaneously
    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        setTimeout(filterProducts, 50);
      });
    });
  }
}

// Automatic Lazy Loading for Images
function initImageLazyLoading() {
  const images = document.querySelectorAll("img:not([loading])");
  images.forEach(img => {
    // Skip logo and hero images for immediate LCP rendering
    if (!img.src.includes("logo") && !img.closest("#hero")) {
      img.setAttribute("loading", "lazy");
    }
  });
}

// Auto-slide Why Choose Oxentra icons every 2 seconds on mobile view only
function initWhyUsMobileCarousel() {
  const whyUsSection = document.querySelector("#why-us");
  if (!whyUsSection) return;

  const scrollContainer = whyUsSection.querySelector(".flex.overflow-x-auto");
  if (!scrollContainer) return;

  let autoScrollInterval = null;

  function startAutoScroll() {
    if (window.innerWidth > 768) return; // Mobile view only

    if (!autoScrollInterval) {
      autoScrollInterval = setInterval(() => {
        if (window.innerWidth > 768) return;

        const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        const step = 160; // Smooth slide step for icons

        if (scrollContainer.scrollLeft >= maxScrollLeft - 10) {
          // Smoothly loop back to start once all icons are displayed
          scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          // Slide right to show next set of icons
          scrollContainer.scrollBy({ left: step, behavior: "smooth" });
        }
      }, 2000); // Every 2 seconds
    }
  }

  function stopAutoScroll() {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      autoScrollInterval = null;
    }
  }

  // Start auto scroll on mobile load
  if (window.innerWidth <= 768) {
    startAutoScroll();
  }

  // Handle screen resize (Pause on Desktop, Start on Mobile)
  window.addEventListener("resize", () => {
    if (window.innerWidth <= 768) {
      startAutoScroll();
    } else {
      stopAutoScroll();
      scrollContainer.scrollLeft = 0; // Keep desktop layout standard
    }
  });

  // Pause on user touch interaction
  scrollContainer.addEventListener("touchstart", stopAutoScroll, { passive: true });
}

