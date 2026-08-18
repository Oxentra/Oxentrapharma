/**
 * Oxentra Pharma — Production Cookie Consent System
 * Version 1.0 (Enterprise Pharma Standard — Pfizer/Cipla/OneTrust Style)
 * 
 * Standalone, zero-dependency, accessible, and production-ready cookie consent module.
 * Fully protects existing functionality and guarantees zero regressions.
 */

(function () {
  'use strict';

  // Constants
  const STORAGE_KEY = 'oxentra_cookie_consent';
  const CONSENT_VERSION = '1.0';

  // Default consent state
  const defaultConsent = {
    version: CONSENT_VERSION,
    timestamp: '',
    necessary: true,
    analytics: false,
    marketing: false
  };

  // Safe localStorage helper with in-memory fallback
  let memoryFallbackStorage = null;

  function isLocalStorageAvailable() {
    try {
      const testKey = '__ox_cc_test__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  }

  const hasLocalStorage = isLocalStorageAvailable();

  function getStoredConsent() {
    try {
      let raw = null;
      if (hasLocalStorage) {
        raw = localStorage.getItem(STORAGE_KEY);
      } else if (memoryFallbackStorage) {
        raw = memoryFallbackStorage;
      }
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.version === CONSENT_VERSION && parsed.necessary === true) {
        return {
          version: CONSENT_VERSION,
          timestamp: parsed.timestamp || new Date().toISOString(),
          necessary: true,
          analytics: Boolean(parsed.analytics),
          marketing: Boolean(parsed.marketing)
        };
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  function saveConsent(consent) {
    const payload = {
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString(),
      necessary: true,
      analytics: Boolean(consent.analytics),
      marketing: Boolean(consent.marketing)
    };

    try {
      const jsonStr = JSON.stringify(payload);
      if (hasLocalStorage) {
        localStorage.setItem(STORAGE_KEY, jsonStr);
      } else {
        memoryFallbackStorage = jsonStr;
      }
    } catch (e) {
      memoryFallbackStorage = JSON.stringify(payload);
    }

    currentConsent = payload;
    onConsentUpdated(payload);
    return payload;
  }

  // Active state
  let currentConsent = getStoredConsent();
  let lastFocusedElement = null;
  const consentCallbacks = {
    analytics: [],
    marketing: [],
    change: []
  };

  // Google Consent Mode integration helper
  function updateGoogleConsentMode(consent) {
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        'analytics_storage': consent.analytics ? 'granted' : 'denied',
        'ad_storage': consent.marketing ? 'granted' : 'denied',
        'ad_user_data': consent.marketing ? 'granted' : 'denied',
        'ad_personalization': consent.marketing ? 'granted' : 'denied'
      });
    } else if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: 'oxentra_cookie_consent_update',
        consent_analytics: consent.analytics,
        consent_marketing: consent.marketing
      });
    }
  }

  // Activate permitted third-party scripts tagged with data-cookiecategory
  function activatePermittedScripts(consent) {
    if (!consent) return;

    const scripts = document.querySelectorAll('script[type="text/plain"][data-cookiecategory]');
    scripts.forEach(script => {
      const category = (script.getAttribute('data-cookiecategory') || '').trim().toLowerCase();
      if (script.getAttribute('data-cookie-executed') === 'true') return;

      if (category === 'necessary' || (category === 'analytics' && consent.analytics) || (category === 'marketing' && consent.marketing)) {
        const newScript = document.createElement('script');
        
        // Copy attributes
        Array.from(script.attributes).forEach(attr => {
          if (attr.name === 'type') {
            newScript.type = 'text/javascript';
          } else if (attr.name === 'data-src') {
            newScript.src = attr.value;
          } else if (attr.name !== 'data-cookiecategory' && attr.name !== 'data-cookie-executed') {
            newScript.setAttribute(attr.name, attr.value);
          }
        });

        if (!newScript.src && script.src) {
          newScript.src = script.src;
        }

        if (script.textContent) {
          newScript.textContent = script.textContent;
        }

        script.setAttribute('data-cookie-executed', 'true');
        if (script.parentNode) {
          script.parentNode.insertBefore(newScript, script.nextSibling);
        } else {
          document.head.appendChild(newScript);
        }
      }
    });
  }

  // Dispatch events and run callbacks
  function onConsentUpdated(consent) {
    updateGoogleConsentMode(consent);
    activatePermittedScripts(consent);

    // Call registered callbacks
    if (consent.analytics) {
      consentCallbacks.analytics.forEach(cb => { try { cb(consent); } catch (err) { console.error(err); } });
    }
    if (consent.marketing) {
      consentCallbacks.marketing.forEach(cb => { try { cb(consent); } catch (err) { console.error(err); } });
    }
    consentCallbacks.change.forEach(cb => { try { cb(consent); } catch (err) { console.error(err); } });

    // Dispatch DOM custom events
    const eventDetail = { detail: { consent: Object.freeze({ ...consent }) } };
    const customEvent = new CustomEvent('oxentra_consent_updated', eventDetail);
    window.dispatchEvent(customEvent);
    document.dispatchEvent(customEvent);
  }

  // DOM Elements cache
  let dom = {
    root: null,
    banner: null,
    backdrop: null,
    modal: null,
    acceptAllBtn: null,
    rejectBtn: null,
    settingsBtn: null,
    modalSaveBtn: null,
    modalCancelBtn: null,
    modalCloseBtn: null,
    analyticsSwitch: null,
    marketingSwitch: null
  };

  // Build UI templates (Pfizer / Cipla / OneTrust standard docked layout)
  function createConsentDOM() {
    if (dom.root) return;

    const root = document.createElement('div');
    root.className = 'ox-cc-root';
    root.setAttribute('aria-live', 'polite');

    root.innerHTML = `
      <!-- Standard Bottom Cookie Bar (Pfizer/Cipla Enterprise Pattern) -->
      <aside 
        id="oxentra-cookie-banner" 
        class="ox-cc-banner" 
        role="region" 
        aria-label="Cookie consent banner"
      >
        <div class="ox-cc-banner-container">
          <div class="ox-cc-banner-content">
            <div class="ox-cc-banner-header">
              <div class="ox-cc-banner-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              </div>
              <h2 class="ox-cc-banner-title">Your Privacy</h2>
            </div>
            <p class="ox-cc-banner-desc">
              We use cookies to provide essential website functionality and improve your browsing experience. You can manage your preferences or accept optional cookies.
            </p>
          </div>
          <div class="ox-cc-banner-actions">
            <button type="button" id="ox-cc-btn-settings" class="ox-cc-btn ox-cc-btn-subtle">
              Cookie Settings
            </button>
            <button type="button" id="ox-cc-btn-reject" class="ox-cc-btn ox-cc-btn-secondary">
              Reject Non-Essential
            </button>
            <button type="button" id="ox-cc-btn-accept-all" class="ox-cc-btn ox-cc-btn-primary">
              Accept All
            </button>
          </div>
        </div>
      </aside>

      <!-- Cookie Preferences Modal (OneTrust / Pfizer Preference Centre) -->
      <div 
        id="oxentra-cookie-backdrop" 
        class="ox-cc-backdrop" 
        tabindex="-1"
      >
        <div 
          id="oxentra-cookie-modal" 
          class="ox-cc-modal" 
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="ox-cc-modal-title" 
          aria-describedby="ox-cc-modal-desc"
        >
          <!-- Modal Header -->
          <div class="ox-cc-modal-header">
            <div>
              <span class="ox-cc-modal-badge">Oxentra Pharma</span>
              <h3 id="ox-cc-modal-title" class="ox-cc-modal-title">Privacy Preference Centre</h3>
            </div>
            <button type="button" id="ox-cc-modal-close" class="ox-cc-modal-close-btn" aria-label="Close preferences dialog">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="ox-cc-modal-body">
            <p id="ox-cc-modal-desc" class="ox-cc-modal-lead">
              When you visit our website, it may store or retrieve information on your browser, mostly in the form of cookies. You can choose which categories of cookies you want to allow.
            </p>

            <!-- Category: Strictly Necessary -->
            <div class="ox-cc-category-card">
              <div class="ox-cc-category-header">
                <div class="ox-cc-category-info">
                  <span class="ox-cc-category-title">Strictly Necessary Cookies</span>
                </div>
                <span class="ox-cc-badge-always-active" aria-label="Strictly necessary cookies are always enabled">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  Always Active
                </span>
              </div>
              <p class="ox-cc-category-desc">
                These cookies are necessary for the website to function securely and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences or navigating secure pages.
              </p>
            </div>

            <!-- Category: Analytics -->
            <div class="ox-cc-category-card">
              <div class="ox-cc-category-header">
                <label for="ox-cc-switch-analytics" class="ox-cc-category-title" style="cursor: pointer;">
                  Performance & Analytics Cookies
                </label>
                <div class="ox-cc-switch-wrap">
                  <button 
                    type="button" 
                    id="ox-cc-switch-analytics" 
                    class="ox-cc-switch" 
                    role="switch" 
                    aria-checked="false" 
                    aria-label="Toggle Analytics Cookies"
                  >
                    <span class="ox-cc-switch-thumb" aria-hidden="true"></span>
                  </button>
                </div>
              </div>
              <p class="ox-cc-category-desc">
                These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us understand which pages are the most and least popular and see how visitors move around the site.
              </p>
            </div>

            <!-- Category: Marketing -->
            <div class="ox-cc-category-card">
              <div class="ox-cc-category-header">
                <label for="ox-cc-switch-marketing" class="ox-cc-category-title" style="cursor: pointer;">
                  Targeting & Marketing Cookies
                </label>
                <div class="ox-cc-switch-wrap">
                  <button 
                    type="button" 
                    id="ox-cc-switch-marketing" 
                    class="ox-cc-switch" 
                    role="switch" 
                    aria-checked="false" 
                    aria-label="Toggle Marketing Cookies"
                  >
                    <span class="ox-cc-switch-thumb" aria-hidden="true"></span>
                  </button>
                </div>
              </div>
              <p class="ox-cc-category-desc">
                These cookies may be set through our site by our advertising and marketing partners. They may be used by those companies to build a profile of your interests and show you relevant content across platforms.
              </p>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="ox-cc-modal-footer">
            <button type="button" id="ox-cc-modal-cancel" class="ox-cc-btn ox-cc-btn-secondary">
              Cancel
            </button>
            <button type="button" id="ox-cc-modal-save" class="ox-cc-btn ox-cc-btn-primary">
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(root);

    // Cache elements
    dom.root = root;
    dom.banner = root.querySelector('#oxentra-cookie-banner');
    dom.backdrop = root.querySelector('#oxentra-cookie-backdrop');
    dom.modal = root.querySelector('#oxentra-cookie-modal');
    dom.acceptAllBtn = root.querySelector('#ox-cc-btn-accept-all');
    dom.rejectBtn = root.querySelector('#ox-cc-btn-reject');
    dom.settingsBtn = root.querySelector('#ox-cc-btn-settings');
    dom.modalSaveBtn = root.querySelector('#ox-cc-modal-save');
    dom.modalCancelBtn = root.querySelector('#ox-cc-modal-cancel');
    dom.modalCloseBtn = root.querySelector('#ox-cc-modal-close');
    dom.analyticsSwitch = root.querySelector('#ox-cc-switch-analytics');
    dom.marketingSwitch = root.querySelector('#ox-cc-switch-marketing');

    setupEventListeners();
  }

  // Toggle switch helper
  function toggleSwitch(switchEl) {
    if (!switchEl) return;
    const isChecked = switchEl.getAttribute('aria-checked') === 'true';
    switchEl.setAttribute('aria-checked', isChecked ? 'false' : 'true');
  }

  function setSwitchState(switchEl, checked) {
    if (!switchEl) return;
    switchEl.setAttribute('aria-checked', checked ? 'true' : 'false');
  }

  function getSwitchState(switchEl) {
    if (!switchEl) return false;
    return switchEl.getAttribute('aria-checked') === 'true';
  }

  // Show / Hide banner
  function showBanner() {
    if (!dom.banner) createConsentDOM();
    if (dom.banner) {
      dom.banner.classList.add('ox-cc-visible');
    }
  }

  function hideBanner() {
    if (dom.banner) {
      dom.banner.classList.remove('ox-cc-visible');
    }
  }

  // Open / Close Settings Modal
  function openSettings(triggerEl) {
    lastFocusedElement = triggerEl || document.activeElement;
    if (!dom.backdrop) createConsentDOM();

    // Populate current preferences
    const consent = currentConsent || { analytics: false, marketing: false };
    setSwitchState(dom.analyticsSwitch, consent.analytics);
    setSwitchState(dom.marketingSwitch, consent.marketing);

    dom.backdrop.classList.add('ox-cc-visible');
    document.body.classList.add('ox-cc-modal-open');

    // Focus first focusable item inside modal
    setTimeout(() => {
      if (dom.modalCloseBtn) {
        dom.modalCloseBtn.focus();
      }
    }, 50);
  }

  function closeSettings() {
    if (dom.backdrop) {
      dom.backdrop.classList.remove('ox-cc-visible');
    }
    document.body.classList.remove('ox-cc-modal-open');

    // Restore focus to triggering element
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      try {
        lastFocusedElement.focus();
      } catch (e) {}
    }
  }

  // Focus trap inside preferences modal
  function handleModalKeyDown(e) {
    if (!dom.backdrop || !dom.backdrop.classList.contains('ox-cc-visible')) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeSettings();
      return;
    }

    if (e.key === 'Tab') {
      const focusableEls = dom.modal.querySelectorAll(
        'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusableEls.length === 0) return;

      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    }
  }

  // Setup Event Listeners
  function setupEventListeners() {
    // Banner "Accept All"
    dom.acceptAllBtn.addEventListener('click', () => {
      saveConsent({ analytics: true, marketing: true });
      hideBanner();
      closeSettings();
    });

    // Banner "Reject Non-Essential"
    dom.rejectBtn.addEventListener('click', () => {
      saveConsent({ analytics: false, marketing: false });
      hideBanner();
      closeSettings();
    });

    // Banner "Cookie Settings"
    dom.settingsBtn.addEventListener('click', (e) => {
      openSettings(e.currentTarget);
    });

    // Modal Close button
    dom.modalCloseBtn.addEventListener('click', () => {
      closeSettings();
    });

    // Modal Cancel button
    dom.modalCancelBtn.addEventListener('click', () => {
      closeSettings();
    });

    // Backdrop click outside modal
    dom.backdrop.addEventListener('click', (e) => {
      if (e.target === dom.backdrop) {
        closeSettings();
      }
    });

    // Modal Save Preferences
    dom.modalSaveBtn.addEventListener('click', () => {
      const analyticsChecked = getSwitchState(dom.analyticsSwitch);
      const marketingChecked = getSwitchState(dom.marketingSwitch);

      saveConsent({
        analytics: analyticsChecked,
        marketing: marketingChecked
      });

      closeSettings();
      hideBanner();
    });

    // Switch toggles via click
    dom.analyticsSwitch.addEventListener('click', () => toggleSwitch(dom.analyticsSwitch));
    dom.marketingSwitch.addEventListener('click', () => toggleSwitch(dom.marketingSwitch));

    // Switch toggles via keyboard (Enter / Space)
    [dom.analyticsSwitch, dom.marketingSwitch].forEach(switchEl => {
      switchEl.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          toggleSwitch(switchEl);
        }
      });
    });

    // Global Keydown for Modal trap
    document.addEventListener('keydown', handleModalKeyDown);

    // Bind footer preference triggers across page
    bindFooterTriggers();
  }

  function bindFooterTriggers() {
    const triggers = document.querySelectorAll(
      '[data-oxentra-cookie-trigger], .ox-cc-footer-trigger, .oxentra-cookie-pref-btn'
    );
    triggers.forEach(btn => {
      if (!btn.hasAttribute('data-ox-cc-bound')) {
        btn.setAttribute('data-ox-cc-bound', 'true');
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          openSettings(e.currentTarget);
        });
      }
    });
  }

  // Initialization
  function init() {
    createConsentDOM();

    // Check if consent has already been chosen
    if (!currentConsent) {
      // First visit / no valid consent
      showBanner();
    } else {
      // Existing consent found: execute permitted scripts
      activatePermittedScripts(currentConsent);
      updateGoogleConsentMode(currentConsent);
    }

    // Re-bind footer buttons if dynamic content added
    bindFooterTriggers();

    // Dispatch ready event
    const readyEvent = new CustomEvent('oxentra_consent_ready', {
      detail: {
        consent: currentConsent ? Object.freeze({ ...currentConsent }) : null,
        hasConsent: Boolean(currentConsent)
      }
    });
    window.dispatchEvent(readyEvent);
    document.dispatchEvent(readyEvent);
  }

  // Public API exposed on window.OxentraConsent
  window.OxentraConsent = {
    version: CONSENT_VERSION,
    getConsent: function () {
      return currentConsent ? { ...currentConsent } : null;
    },
    hasConsent: function (category) {
      if (!currentConsent) return false;
      if (category === 'necessary') return true;
      return Boolean(currentConsent[category]);
    },
    setConsent: function (prefs) {
      return saveConsent(prefs || {});
    },
    acceptAll: function () {
      const consent = saveConsent({ analytics: true, marketing: true });
      hideBanner();
      closeSettings();
      return consent;
    },
    rejectNonEssential: function () {
      const consent = saveConsent({ analytics: false, marketing: false });
      hideBanner();
      closeSettings();
      return consent;
    },
    openSettings: function (triggerEl) {
      openSettings(triggerEl);
    },
    closeSettings: function () {
      closeSettings();
    },
    showBanner: function () {
      showBanner();
    },
    hideBanner: function () {
      hideBanner();
    },
    resetConsent: function () {
      if (hasLocalStorage) {
        localStorage.removeItem(STORAGE_KEY);
      }
      memoryFallbackStorage = null;
      currentConsent = null;
      showBanner();
    },
    onConsent: function (category, callback) {
      if (typeof callback !== 'function') return;
      const cat = (category || '').toLowerCase();
      if (cat === 'analytics' || cat === 'marketing') {
        consentCallbacks[cat].push(callback);
        if (currentConsent && currentConsent[cat]) {
          try { callback(currentConsent); } catch (e) {}
        }
      }
    },
    onConsentChange: function (callback) {
      if (typeof callback !== 'function') return;
      consentCallbacks.change.push(callback);
      if (currentConsent) {
        try { callback(currentConsent); } catch (e) {}
      }
    }
  };

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
