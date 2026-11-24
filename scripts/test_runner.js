const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8088;
const CHROME_PORT = 9222;
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

// 1. Static HTTP Server
function createServer() {
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  };

  const server = http.createServer((req, res) => {
    let filePath = path.join(process.cwd(), req.url.split('?')[0]);
    if (filePath.endsWith(path.sep) || req.url === '/') {
      filePath = path.join(filePath, 'index.html');
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      const mime = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });

  return new Promise((resolve) => {
    server.listen(PORT, '127.0.0.1', () => {
      console.log(`[Test Server] Running on http://127.0.0.1:${PORT}`);
      resolve(server);
    });
  });
}

// 2. Launch Headless Chrome
function launchChrome() {
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${CHROME_PORT}`,
    '--disable-gpu',
    '--no-sandbox',
    '--disable-background-networking',
    '--disable-default-apps',
    '--disable-extensions',
    '--disable-sync',
    '--disable-translate',
    '--mute-audio',
    '--hide-scrollbars',
    '--user-data-dir=' + path.join(process.cwd(), '.chrome-test-profile')
  ]);

  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const res = await fetch(`http://127.0.0.1:${CHROME_PORT}/json/version`);
        if (res.ok) {
          console.log('[Headless Chrome] Successfully launched with CDP');
          resolve(chromeProcess);
        } else {
          reject(new Error('Chrome did not respond to /json/version'));
        }
      } catch (e) {
        reject(e);
      }
    }, 1500);
  });
}

// 3. CDP Client
class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = (err) => reject(err);
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const { res, rej } = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) rej(msg.error);
          else res(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((res, rej) => {
      const msgId = this.id++;
      this.callbacks.set(msgId, { res, rej });
      this.ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  async eval(expression) {
    const result = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    });
    return result.result ? result.result.value : null;
  }

  async setViewport(width, height) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 1024
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function runTests() {
  let server, chrome;
  const results = [];

  function record(category, testName, passed, details = '') {
    results.push({ category, testName, status: passed ? 'PASS' : 'FAIL', details });
    const mark = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`[${category}] ${mark}: ${testName} ${details ? '(' + details + ')' : ''}`);
  }

  try {
    server = await createServer();
    chrome = await launchChrome();

    // Get or create page target
    const listRes = await fetch(`http://127.0.0.1:${CHROME_PORT}/json/list`);
    const list = await listRes.json();
    let tabInfo = list.find(t => t.type === 'page');
    if (!tabInfo) {
      const newTabRes = await fetch(`http://127.0.0.1:${CHROME_PORT}/json/new?http://127.0.0.1:${PORT}/index.html`, { method: 'PUT' });
      tabInfo = await newTabRes.json();
    }
    const client = new CDPClient(tabInfo.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('DOM.enable');
    await client.send('CSS.enable');
    await client.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/index.html` });

    // Wait 2s for initial layout
    await new Promise(r => setTimeout(r, 2000));

    // TEST SUITE 1: 1024px Breakpoint Conflict & Mobile/Desktop Navigation Split
    console.log('\n--- SUITE 1: Navigation Breakpoint Testing ---');
    const navViewports = [
      { w: 320, name: '320px (Mobile Mini)' },
      { w: 340, name: '340px (Small Mobile)' },
      { w: 360, name: '360px (Android Compact)' },
      { w: 375, name: '375px (iPhone 6/7/8)' },
      { w: 390, name: '390px (iPhone 12/13/14)' },
      { w: 414, name: '414px (iPhone Plus/Max)' },
      { w: 768, name: '768px (Tablet Portrait)' },
      { w: 1023, name: '1023px (Max Mobile/Tablet Boundary)' },
      { w: 1024, name: '1024px (Exact Desktop Breakpoint Boundary)' },
      { w: 1025, name: '1025px (Desktop Boundary + 1px)' },
      { w: 1280, name: '1280px (Standard Desktop)' },
      { w: 1440, name: '1440px (Wide Desktop)' }
    ];

    for (const vp of navViewports) {
      await client.setViewport(vp.w, 800);
      await new Promise(r => setTimeout(r, 200));

      const navState = await client.eval(`(() => {
        const btn = document.getElementById('mobile-menu-btn');
        const deskNav = document.querySelector('header nav');
        function isVisible(el) {
          if (!el) return false;
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).visibility !== 'hidden';
        }
        return {
          btnVisible: isVisible(btn),
          deskNavVisible: isVisible(deskNav),
          btnRect: btn ? { w: Math.round(btn.getBoundingClientRect().width), h: Math.round(btn.getBoundingClientRect().height) } : null,
          deskNavRect: deskNav ? { w: Math.round(deskNav.getBoundingClientRect().width), h: Math.round(deskNav.getBoundingClientRect().height) } : null
        };
      })()`);

      if (vp.w <= 1023) {
        const passed = navState.btnVisible && !navState.deskNavVisible;
        record('Navigation', `Mobile breakpoint ${vp.name}`, passed, `btn: ${navState.btnRect ? navState.btnRect.w + 'px' : 'none'}, deskNav: ${navState.deskNavRect ? navState.deskNavRect.w + 'px' : 'none'}`);
      } else {
        const passed = !navState.btnVisible && navState.deskNavVisible;
        record('Navigation', `Desktop breakpoint ${vp.name}`, passed, `btn: ${navState.btnRect ? navState.btnRect.w + 'px' : 'none'}, deskNav: ${navState.deskNavRect ? navState.deskNavRect.w + 'px' : 'none'}`);
      }
    }

    // TEST SUITE 2: Viewport Horizontal Overflow Testing Across Required Viewports
    console.log('\n--- SUITE 2: Horizontal Overflow Testing ---');
    const requiredViewports = [320, 340, 360, 375, 390, 414, 440, 768, 1024, 1440];
    for (const w of requiredViewports) {
      await client.setViewport(w, 800);
      await new Promise(r => setTimeout(r, 150));

      const overflowInfo = await client.eval(`(() => {
        const docWidth = document.documentElement.scrollWidth;
        const bodyWidth = document.body.scrollWidth;
        const winWidth = window.innerWidth;
        return {
          hasOverflow: docWidth > winWidth || bodyWidth > winWidth,
          docWidth,
          bodyWidth,
          winWidth
        };
      })()`);

      record('Overflow', `No horizontal scrollbar at ${w}px`, !overflowInfo.hasOverflow, `win: ${overflowInfo.winWidth}px, doc: ${overflowInfo.docWidth}px`);
    }

    // TEST SUITE 3: Header Responsiveness, Call Button Visibility & Sizing
    console.log('\n--- SUITE 3: Mobile Header Responsiveness & Icon Centering ---');
    for (const w of [320, 340, 360, 375, 390, 414, 440, 768]) {
      await client.setViewport(w, 800);
      await new Promise(r => setTimeout(r, 150));

      const headerState = await client.eval(`(() => {
        const callBtn = document.querySelector('header a[href^="tel:"]');
        const callSvg = callBtn ? callBtn.querySelector('svg') : null;
        const menuBtn = document.getElementById('mobile-menu-btn');
        const logo = document.querySelector('header .oxentra-logo-img');
        const shell = document.querySelector('header .oxentra-navbar-shell');
        const search = document.querySelector('.oxentra-search-wrapper');

        if (!callBtn || !callSvg || !menuBtn || !logo || !shell) return { exists: false };

        const callRect = callBtn.getBoundingClientRect();
        const svgRect = callSvg.getBoundingClientRect();
        const menuRect = menuBtn.getBoundingClientRect();
        const logoRect = logo.getBoundingClientRect();
        const shellRect = shell.getBoundingClientRect();
        const searchRect = search ? search.getBoundingClientRect() : null;

        const searchStyle = search ? window.getComputedStyle(search) : null;
        const searchMarginLeft = searchStyle ? parseFloat(searchStyle.marginLeft) : 0;
        const gapLogoSearch = searchRect && logoRect ? Math.round(searchRect.left - logoRect.right) : 0;
        const noOverlap = searchRect && logoRect ? searchRect.left >= logoRect.right : false;

        // Icon must be completely inside Call button bounds without cut-off
        const svgInsideCallBtn = svgRect.left >= callRect.left - 0.5 &&
                                 svgRect.right <= callRect.right + 0.5 &&
                                 svgRect.top >= callRect.top - 0.5 &&
                                 svgRect.bottom <= callRect.bottom + 0.5;

        // Shell must not overflow window width
        const shellWithinWindow = shellRect.right <= window.innerWidth;

        return {
          exists: true,
          callBtnVisible: callRect.width > 0 && callRect.height > 0,
          menuBtnVisible: menuRect.width > 0 && menuRect.height > 0,
          callBtnSize: Math.round(callRect.width) + 'x' + Math.round(callRect.height),
          svgInsideCallBtn,
          logoWidth: Math.round(logoRect.width),
          logoHeight: Math.round(logoRect.height),
          shellWithinWindow,
          searchMarginLeft,
          gapLogoSearch,
          noOverlap
        };
      })()`);

      record('Header', `Call & Menu buttons visible & unclipped at ${w}px`,
        headerState.callBtnVisible && headerState.menuBtnVisible && headerState.svgInsideCallBtn && headerState.shellWithinWindow && headerState.searchMarginLeft >= 6 && headerState.noOverlap,
        `btn: ${headerState.callBtnSize}, logo: ${headerState.logoWidth}x${headerState.logoHeight}px, unclipped: ${headerState.svgInsideCallBtn}, searchMargin: ${headerState.searchMarginLeft}px, gap: ${headerState.gapLogoSearch}px`
      );
    }

    // TEST SUITE 4: Desktop Header Fluidity & Search Input Usability (1024px & 1440px)
    console.log('\n--- SUITE 4: Desktop Header Dynamic Width & Usability ---');
    for (const w of [1024, 1280, 1440]) {
      await client.setViewport(w, 800);
      await new Promise(r => setTimeout(r, 150));

      const deskHeaderState = await client.eval(`(() => {
        const searchWrapper = document.querySelector('.oxentra-search-wrapper');
        const searchInput = document.querySelector('.oxentra-search-input');
        const ctaBtn = document.querySelector('.oxentra-cta-btn');
        const nav = document.querySelector('header nav');
        const shell = document.querySelector('.oxentra-navbar-shell');

        if (!searchWrapper || !searchInput || !ctaBtn || !shell) return { exists: false };

        const searchRect = searchWrapper.getBoundingClientRect();
        const ctaRect = ctaBtn.getBoundingClientRect();
        const shellRect = shell.getBoundingClientRect();

        return {
          exists: true,
          searchWidth: Math.round(searchRect.width),
          ctaWidth: Math.round(ctaRect.width),
          ctaFullyVisible: ctaRect.right <= shellRect.right + 1,
          searchUsable: searchRect.width >= 120 && searchRect.width <= 240
        };
      })()`);

      record('Header', `Search & Contact CTA balanced at ${w}px`,
        deskHeaderState.searchUsable && deskHeaderState.ctaFullyVisible,
        `searchW: ${deskHeaderState.searchWidth}px, ctaW: ${deskHeaderState.ctaWidth}px, ctaInBounds: ${deskHeaderState.ctaFullyVisible}`
      );
    }

    // TEST SUITE 5: Mobile & Desktop Footer Legal Links Alignment & Formatting
    console.log('\n--- SUITE 5: Footer Legal Links Alignment Across Viewports ---');
    for (const w of requiredViewports) {
      await client.setViewport(w, 800);
      await new Promise(r => setTimeout(r, 150));

      const footerState = await client.eval(`(() => {
        const container = document.querySelector('.oxentra-footer-legal-links');
        const cookieBtn = document.querySelector('.ox-cc-footer-trigger');
        const separators = document.querySelectorAll('.footer-legal-separator');
        const copyright = document.querySelector('footer p');

        if (!container || !cookieBtn) return { exists: false };

        const containerRect = container.getBoundingClientRect();
        const cookieRect = cookieBtn.getBoundingClientRect();
        const winWidth = window.innerWidth;

        // Separators must be hidden on mobile (<640px) and visible on desktop (>=768px)
        let sepCheck = true;
        if (separators.length > 0) {
          const firstSepStyle = window.getComputedStyle(separators[0]);
          if (winWidth < 640) {
            sepCheck = firstSepStyle.display === 'none';
          } else if (winWidth >= 768) {
            sepCheck = firstSepStyle.display !== 'none';
          }
        }

        // Cookie Preferences should never wrap onto multiple lines (height <= 24px)
        const cookieSingleLine = cookieRect.height <= 24;

        // Container must not cause overflow
        const containerInBounds = containerRect.right <= winWidth + 2;

        return {
          exists: true,
          cookieHeight: Math.round(cookieRect.height),
          cookieSingleLine,
          sepCheck,
          containerInBounds,
          winWidth
        };
      })()`);

      record('Footer Legal', `Legal links cleanly aligned at ${w}px`,
        footerState.exists && footerState.cookieSingleLine && footerState.sepCheck && footerState.containerInBounds,
        `singleLine: ${footerState.cookieSingleLine} (${footerState.cookieHeight}px), sepsCorrect: ${footerState.sepCheck}`
      );
    }

    // TEST SUITE 6: Multi-page Regression Testing Across All 15 HTML Pages
    console.log('\n--- SUITE 6: Multi-page Regression Testing (All 15 Pages) ---');
    const all15Pages = [
      'index.html', 'about.html', 'products.html', 'contact.html', 'careers.html',
      'calcintra.html', 'glideplus.html', 'heaveenema.html', 'heavesenema.html',
      'lxentra.html', 'nervoxplus.html', 'oxentibmr.html', 'oxrizinelc.html',
      'pxentradsr.html', 'mobile_nav_showcase.html'
    ];

    for (const page of all15Pages) {
      await client.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/${page}` });
      await new Promise(r => setTimeout(r, 1200));

      // Test mobile (375px)
      await client.setViewport(375, 800);
      await new Promise(r => setTimeout(r, 150));
      const mobileStatus = await client.eval(`(() => {
        const btn = document.getElementById('mobile-menu-btn');
        const deskNav = document.querySelector('header nav');
        const overflow = document.documentElement.scrollWidth > window.innerWidth;
        const callBtn = document.querySelector('header a[href^="tel:"]');
        const legalLinks = document.querySelector('.oxentra-footer-legal-links');

        function isVisible(el) {
          if (!el) return false;
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).visibility !== 'hidden';
        }

        return {
          btnVisible: isVisible(btn),
          deskNavVisible: isVisible(deskNav),
          callVisible: isVisible(callBtn),
          overflow,
          hasFooterLinks: !!legalLinks
        };
      })()`);

      const mobilePass = !mobileStatus.overflow && (page === 'mobile_nav_showcase.html' || (mobileStatus.btnVisible && !mobileStatus.deskNavVisible));
      record('All Pages', `${page} at 375px responsive check`, mobilePass, `ovf: ${mobileStatus.overflow}, btn: ${mobileStatus.btnVisible}`);

      // Test desktop (1440px)
      await client.setViewport(1440, 800);
      await new Promise(r => setTimeout(r, 150));
      const deskStatus = await client.eval(`(() => {
        const btn = document.getElementById('mobile-menu-btn');
        const deskNav = document.querySelector('header nav');
        const overflow = document.documentElement.scrollWidth > window.innerWidth;

        function isVisible(el) {
          if (!el) return false;
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).visibility !== 'hidden';
        }

        return {
          btnVisible: isVisible(btn),
          deskNavVisible: isVisible(deskNav),
          overflow
        };
      })()`);

      const deskPass = !deskStatus.overflow && (page === 'mobile_nav_showcase.html' || (!deskStatus.btnVisible && deskStatus.deskNavVisible));
      record('All Pages', `${page} at 1440px responsive check`, deskPass, `ovf: ${deskStatus.overflow}, deskNav: ${deskStatus.deskNavVisible}`);
    }

    // TEST SUITE 7: Hero to Metrics Section Transition & Stacking Context
    console.log('\n--- SUITE 7: Hero to Metrics Section Transition & Stacking Context ---');
    await client.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/index.html` });
    await new Promise(r => setTimeout(r, 1500));
    await client.setViewport(440, 956);
    await new Promise(r => setTimeout(r, 200));

    for (const sy of [2800, 2900, 3000, 3100, 3200]) {
      await client.eval(`window.scrollTo(0, ${sy})`);
      await new Promise(r => setTimeout(r, 150));

      const transState = await client.eval(`(() => {
        const hero = document.getElementById('hero');
        const pinSpacer = document.querySelector('.pin-spacer');
        const metrics = document.getElementById('metrics-section');
        const card = metrics ? metrics.querySelector('.bg-white') : null;

        const hr = hero.getBoundingClientRect();
        const pr = pinSpacer ? pinSpacer.getBoundingClientRect() : null;
        const mr = metrics.getBoundingClientRect();
        const cr = card ? card.getBoundingClientRect() : null;
        const mStyle = window.getComputedStyle(metrics);

        const pinAligned = !pr || Math.abs(Math.round(hr.bottom) - Math.round(pr.bottom)) <= 1;
        const metricsFlush = Math.round(mr.top) === Math.round(hr.bottom);
        const cardGap = cr ? Math.round(cr.top - mr.top) : 0;
        const bgCorrect = mStyle.backgroundColor === 'rgb(248, 250, 252)';
        const zIndexCorrect = parseInt(mStyle.zIndex, 10) >= 20;

        return {
          scrollY: window.scrollY,
          pinAligned,
          metricsFlush,
          cardGap,
          bgCorrect,
          zIndexCorrect,
          details: 'heroBottom: ' + Math.round(hr.bottom) + ', metricsTop: ' + Math.round(mr.top) + ', cardGap: ' + cardGap + 'px, bg: ' + mStyle.backgroundColor
        };
      })()`);

      record('Hero Transition', `Hero to metrics transition at scrollY ${sy}`,
        transState.pinAligned && transState.metricsFlush && transState.cardGap >= 24 && transState.bgCorrect && transState.zIndexCorrect,
        transState.details
      );
    }

    client.close();

    // Summary
    console.log('\n=============================================');
    const passedCount = results.filter(r => r.status === 'PASS').length;
    const totalCount = results.length;
    console.log(`TOTAL TESTS: ${totalCount} | PASSED: ${passedCount} | FAILED: ${totalCount - passedCount}`);
    console.log('=============================================\n');

    if (totalCount === passedCount) {
      console.log('🎉 ALL AUTOMATED REGRESSION TESTS PASSED PERFECTLY!');
    } else {
      console.error('⚠️ SOME TESTS FAILED. Inspect details above.');
    }

  } catch (err) {
    console.error('Fatal error during test run:', err);
  } finally {
    if (chrome) {
      chrome.kill('SIGKILL');
      console.log('[Headless Chrome] Terminated');
    }
    if (server) {
      server.close();
      console.log('[Test Server] Stopped');
    }
    // Clean up temporary profile
    const profileDir = path.join(process.cwd(), '.chrome-test-profile');
    try {
      if (fs.existsSync(profileDir)) {
        fs.rmSync(profileDir, { recursive: true, force: true });
      }
    } catch (_) {}
  }
}

runTests();
