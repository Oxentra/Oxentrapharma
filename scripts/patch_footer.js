const fs = require('fs');
const path = require('path');

const dir = path.resolve('.');
const htmlFiles = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'mobile_nav_showcase.html');

console.log(`Checking ${htmlFiles.length} HTML files for footer legal links update...`);

// Regex to match the copyright paragraph and legal links container
// Matching:
// <p>© 2026 Oxentra Pharma Pvt. Ltd. All rights reserved.</p>
// ...
// <div class="flex gap-4">
//   <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
//   <span>|</span>
//   <a href="#" class="hover:text-white transition-colors">Terms & Conditions</a>
//   <span>|</span>
//   <button ...>Cookie Preferences</button>
// </div>

const targetRegex = /<p>\s*©\s*2026\s*Oxentra\s*Pharma\s*Pvt\.\s*Ltd\.\s*All\s*rights\s*reserved\.\s*<\/p>\s*<div\s+class="flex\s+gap-4">\s*<a\s+href="#"\s+class="hover:text-white\s+transition-colors">\s*Privacy\s+Policy\s*<\/a>\s*<span>\s*\|\s*<\/span>\s*<a\s+href="#"\s+class="hover:text-white\s+transition-colors">\s*Terms\s*&\s*Conditions\s*<\/a>\s*<span>\s*\|\s*<\/span>\s*<button\s+type="button"\s+class="hover:text-white\s+transition-colors\s+ox-cc-footer-trigger"\s+data-oxentra-cookie-trigger>\s*Cookie\s+Preferences\s*<\/button>\s*<\/div>/;

const replacement = `<p class="text-center md:text-left">© 2026 Oxentra Pharma Pvt. Ltd. All rights reserved.</p>
      <div class="oxentra-footer-legal-links flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center">
        <a href="#" class="hover:text-white transition-colors whitespace-nowrap">Privacy Policy</a>
        <span class="footer-legal-separator hidden sm:inline text-slate-700 select-none">|</span>
        <a href="#" class="hover:text-white transition-colors whitespace-nowrap">Terms & Conditions</a>
        <span class="footer-legal-separator hidden sm:inline text-slate-700 select-none">|</span>
        <button type="button" class="hover:text-white transition-colors ox-cc-footer-trigger whitespace-nowrap" data-oxentra-cookie-trigger>Cookie Preferences</button>
      </div>`;

let patchedCount = 0;

htmlFiles.forEach(file => {
  const filePath = path.join(dir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  if (targetRegex.test(content)) {
    const updated = content.replace(targetRegex, replacement);
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`[PATCHED] ${file}`);
    patchedCount++;
  } else if (content.includes('oxentra-footer-legal-links')) {
    console.log(`[ALREADY PATCHED] ${file}`);
  } else {
    console.warn(`[WARNING: PATTERN NOT FOUND] ${file}`);
  }
});

console.log(`Completed: ${patchedCount} files patched.`);
