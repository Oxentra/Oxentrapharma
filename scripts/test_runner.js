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
      { w: 375, name: '375px (iPhone 6/7/8)' },
      { w: 768, name: '768px (Tablet Portrait)' },
      { w: 1023, name: '1023px (Max Mobile/Tablet Boundary)' },
      { w: 1024, name: '1024px (Exact Desktop Breakpoint Boundary)' },
      { w: 1025, name: '1025px (Desktop Boundary + 1px)' },
      { w: 1280, name: '1280px (Standard Desktop)' }
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
        // Must show mobile button, must hide desktop nav
        const passed = navState.btnVisible && !navState.deskNavVisible;
        record('Navigation', `Mobile breakpoint ${vp.name}`, passed, `btn: ${navState.btnRect ? navState.btnRect.w + 'px' : 'none'}, deskNav: ${navState.deskNavRect ? navState.deskNavRect.w + 'px' : 'none'}`);
      } else {
        // >= 1024px: Must show desktop nav, must hide mobile button
        const passed = !navState.btnVisible && navState.deskNavVisible;
        record('Navigation', `Desktop breakpoint ${vp.name}`, passed, `btn: ${navState.btnRect ? navState.btnRect.w + 'px' : 'none'}, deskNav: ${navState.deskNavRect ? navState.deskNavRect.w + 'px' : 'none'}`);
      }
    }

    // TEST SUITE 2: Viewport Horizontal Overflow Testing Across 13 Viewports
    console.log('\n--- SUITE 2: Horizontal Overflow Testing ---');
    const allViewports = [320, 360, 375, 390, 393, 414, 430, 768, 1023, 1024, 1025, 1280, 1440];
    for (const w of allViewports) {
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

    // TEST SUITE 3: Mobile Product Carousel at 320px & 375px
    console.log('\n--- SUITE 3: Product Carousel Testing ---');
    await client.setViewport(320, 800);
    await new Promise(r => setTimeout(r, 200));

    const carouselInfo = await client.eval(`(() => {
      const slider = document.getElementById('portfolio-slider-container');
      if (!slider) return { exists: false };
      const cards = slider.querySelectorAll('.product-card');
      if (!cards.length) return { exists: false };
      const firstCard = cards[0];
      const cardRect = firstCard.getBoundingClientRect();
      const sliderRect = slider.getBoundingClientRect();
      return {
        exists: true,
        count: cards.length,
        cardWidth: Math.round(cardRect.width),
        sliderWidth: Math.round(sliderRect.width),
        cardWithinBounds: cardRect.width <= sliderRect.width
      };
    })()`);

    record('Carousel', 'Carousel exists with cards', carouselInfo.exists && carouselInfo.count > 0, `cards: ${carouselInfo.count}`);
    record('Carousel', 'Card fits within 320px viewport container', carouselInfo.cardWithinBounds, `card: ${carouselInfo.cardWidth}px, slider: ${carouselInfo.sliderWidth}px`);

    // TEST SUITE 4: Footer Telephone Icon Dimensions & Styling
    console.log('\n--- SUITE 4: Footer Styling & Icon Dimensions ---');
    const footerInfo = await client.eval(`(() => {
      const footer = document.querySelector('footer');
      if (!footer) return { exists: false };
      const telLink = footer.querySelector('a[href^="tel:"]');
      const telSvg = telLink ? telLink.parentElement.querySelector('svg') : null;
      const telSvgRect = telSvg ? telSvg.getBoundingClientRect() : null;
      const quickLink = footer.querySelector('ul a');
      const quickLinkStyle = quickLink ? window.getComputedStyle(quickLink) : null;
      const logoImg = footer.querySelector('img[alt*="Oxentra"]');
      const logoRect = logoImg ? logoImg.getBoundingClientRect() : null;
      return {
        exists: true,
        telSvgWidth: telSvgRect ? Math.round(telSvgRect.width) : null,
        telSvgHeight: telSvgRect ? Math.round(telSvgRect.height) : null,
        linkColor: quickLinkStyle ? quickLinkStyle.color : null,
        isDefaultBlue: quickLinkStyle ? quickLinkStyle.color === 'rgb(0, 0, 238)' : false,
        logoHeight: logoRect ? Math.round(logoRect.height) : null
      };
    })()`);

    record('Footer', 'Telephone icon is constrained (<=24px)', footerInfo.telSvgWidth <= 24 && footerInfo.telSvgHeight <= 24, `${footerInfo.telSvgWidth}x${footerInfo.telSvgHeight}px`);
    record('Footer', 'Footer links do not display browser default blue', !footerInfo.isDefaultBlue, `color: ${footerInfo.linkColor}`);
    record('Footer', 'Footer logo has clean height without clipping', footerInfo.logoHeight <= 50, `height: ${footerInfo.logoHeight}px`);

    // TEST SUITE 5: Global Search Input Selector
    console.log('\n--- SUITE 5: Global Search Functionality ---');
    const searchInfo = await client.eval(`(() => {
      const inputs = document.querySelectorAll('.oxentra-search-input');
      return {
        foundCount: inputs.length,
        hasListeners: inputs.length > 0
      };
    })()`);
    record('Search', 'Search inputs with .oxentra-search-input discovered', searchInfo.foundCount > 0, `found: ${searchInfo.foundCount}`);

    // TEST SUITE 6: Other Key Pages Navigation and Overflow Checks
    console.log('\n--- SUITE 6: Multi-page Regression Testing ---');
    const pages = ['about.html', 'products.html', 'contact.html', 'careers.html', 'calcintra.html'];
    for (const page of pages) {
      await client.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/${page}` });
      await new Promise(r => setTimeout(r, 1000));

      // Test mobile
      await client.setViewport(375, 800);
      await new Promise(r => setTimeout(r, 150));
      const mobileStatus = await client.eval(`(() => {
        const btn = document.getElementById('mobile-menu-btn');
        const deskNav = document.querySelector('header nav');
        const overflow = document.documentElement.scrollWidth > window.innerWidth;
        function isVisible(el) {
          if (!el) return false;
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).visibility !== 'hidden';
        }
        return { btnVisible: isVisible(btn), deskNavVisible: isVisible(deskNav), overflow };
      })()`);

      record('Pages', `${page} at 375px mobile navigation correct`, mobileStatus.btnVisible && !mobileStatus.deskNavVisible && !mobileStatus.overflow, `btn: ${mobileStatus.btnVisible}, deskNav: ${mobileStatus.deskNavVisible}, ovf: ${mobileStatus.overflow}`);

      // Test desktop
      await client.setViewport(1280, 800);
      await new Promise(r => setTimeout(r, 200));
      const deskStatus = await client.eval(`(() => {
        const btn = document.getElementById('mobile-menu-btn');
        const deskNav = document.querySelector('header nav');
        const overflow = document.documentElement.scrollWidth > window.innerWidth;
        function isVisible(el) {
          if (!el) return false;
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).visibility !== 'hidden';
        }
        return { btnVisible: isVisible(btn), deskNavVisible: isVisible(deskNav), overflow };
      })()`);

      record('Pages', `${page} at 1280px desktop navigation correct`, !deskStatus.btnVisible && deskStatus.deskNavVisible && !deskStatus.overflow, `btn: ${deskStatus.btnVisible}, deskNav: ${deskStatus.deskNavVisible}, ovf: ${deskStatus.overflow}`);
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
