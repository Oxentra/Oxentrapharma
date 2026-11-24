const fs = require('fs');
const path = require('path');

const dir = path.resolve('.');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

console.log(`Processing ${files.length} HTML files...`);

const twRegex = /(?:<!--\s*Tailwind\s*CSS\s*CDN\s*-->\s*)?<script\s+src="https:\/\/cdn\.tailwindcss\.com"><\/script>(?:\s*<script>\s*tailwind\.config\s*=\s*\{[\s\S]*?\}[\s\S]*?<\/script>)?/;

const footerLogoRegex = /<img\s+src="logo\.png"\s+alt="Oxentra\s+Pharma"\s+class="w-auto\s+object-contain"[\s\S]*?style="[^"]*margin:\s*-61px[^"]*"[\s\S]*?width="842"\s+height="595">/;

let totalPatched = 0;

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. Tailwind CDN removal and local compiled CSS replacement
  if (twRegex.test(content)) {
    content = content.replace(twRegex, '<!-- Compiled Tailwind CSS -->\n  <link rel="stylesheet" href="tailwind.css?v=1">');
    console.log(`[${file}] Replaced Tailwind CDN with local tailwind.css`);
    modified = true;
  } else {
    console.warn(`[${file}] Warning: Tailwind CDN pattern not found!`);
  }

  // 2. Mobile drawer resize listener update (768 -> 1023)
  if (content.includes('window.innerWidth > 768')) {
    content = content.replace(/window\.innerWidth\s*>\s*768/g, 'window.innerWidth > 1023');
    console.log(`[${file}] Updated drawer resize breakpoint to 1023px`);
    modified = true;
  }

  // 3. Footer logo cleanup
  if (footerLogoRegex.test(content)) {
    content = content.replace(footerLogoRegex, '<img src="logo_clean.png" alt="Oxentra Pharma" class="h-10 w-auto object-contain" decoding="async" loading="lazy" width="456" height="113">');
    console.log(`[${file}] Cleaned up footer logo (removed negative margins)`);
    modified = true;
  }

  // 4. Footer telephone icon explicit width and height
  if (content.includes('<svg class="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0"')) {
    content = content.replace(/<svg class="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0"(?!\s+width=)/g, '<svg class="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" width="16" height="16"');
    console.log(`[${file}] Added explicit width/height to footer telephone icon`);
    modified = true;
  }

  // 5. Carousel card width adjustments for index.html
  if (file === 'index.html' && content.includes('min-w-[260px]')) {
    content = content.replace(/min-w-\[260px\]/g, 'min-w-[220px]');
    console.log(`[${file}] Updated carousel card min-width from 260px to 220px`);
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalPatched++;
  }
});

console.log(`Successfully patched ${totalPatched} of ${files.length} HTML files.`);
