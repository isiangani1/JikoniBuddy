const fs = require('fs');
const path = require('path');

const CLASS_MAP = {
  // Layout components
  "dashboard": "p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0",
  "dashboard-header": "flex flex-col md:flex-row md:items-end justify-between gap-6 bg-gradient-to-r from-purple-900/40 to-transparent p-6 sm:p-8 rounded-[24px] border border-white/10",
  "dashboard-grid": "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  "card": "bg-white/5 border border-white/10 rounded-[24px] p-6 flex flex-col gap-4 hover:border-white/20 transition-colors",
  "table-card": "bg-white/5 border border-white/10 rounded-[24px] overflow-hidden",
  "data-table": "w-full text-left text-sm text-white",
  "category-page": "p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto flex flex-col gap-8 min-w-0",
  "category-hero": "flex flex-col lg:flex-row gap-6 bg-gradient-to-r from-purple-900/40 to-transparent p-6 sm:p-8 rounded-[24px] border border-white/10",
  "category-hero-content": "flex-1 flex flex-col gap-2 justify-center",
  "category-hero-card": "w-full lg:w-[280px] shrink-0 bg-white/5 border border-white/10 rounded-[20px] p-6 flex flex-col justify-center",
  "category-grid": "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
  "category-card": "bg-white/5 border border-white/10 rounded-[20px] p-6 hover:border-white/20 transition-colors flex flex-col gap-2",
  "section": "flex flex-col gap-6",
  "section fade-in": "flex flex-col gap-6 animate-in fade-in duration-500",
  "section-header": "flex items-center justify-between border-b border-white/10 pb-4",
  "profile-section": "flex flex-col gap-6 animate-in fade-in duration-500",
  
  // Specific blocks
  "buddy-job-hero": "flex w-full flex-col gap-6 bg-gradient-to-br from-violet-900/40 to-[#120c1c]/90 px-6 py-10 shadow-[0_20px_60px_rgba(30,15,60,0.5)] md:flex-row",
  "buddy-job-card": "bg-white/5 border border-white/10 rounded-[20px] p-6",
  "modal-card": "bg-[#160b24] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md rounded-2xl border border-white/10 p-6 shadow-2xl z-50",
  "stat-card": "bg-white/5 border border-white/10 rounded-[20px] p-6 hover:border-white/20 transition-colors",

  // Typography
  "eyebrow": "text-purple-300 font-bold tracking-widest uppercase text-xs m-0",
  "subhead": "text-white/70 m-0 text-lg",
  "muted": "text-white/50 text-sm",
  "label": "text-white/60 text-xs font-bold uppercase tracking-wider",

  // Buttons & Actions
  "primary": "px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity whitespace-nowrap",
  "primary full": "w-full px-5 py-2.5 rounded-xl bg-[#2dd4bf] text-[#0d0a14] font-semibold hover:opacity-90 transition-opacity",
  "ghost": "px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold transition-colors whitespace-nowrap backdrop-blur",
  "ghost small": "px-3 py-1.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors backdrop-blur",
  "hero-actions": "flex flex-wrap gap-3 mt-4",
  "badge": "inline-flex items-center justify-center px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold text-xs border border-purple-500/30",
};

// Add combination mappings for keys that are substrings of others
const classReplacements = Object.entries(CLASS_MAP).sort((a, b) => b[0].length - a[0].length);

function walk(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walk(dirPath, callback);
    } else {
      if (f.endsWith('.tsx') || f.endsWith('.ts')) {
        callback(dirPath);
      }
    }
  }
}

let modifiedFiles = 0;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let newContent = content;

  // We want to replace exactly the class inside className="..."
  // but classes can be combined like className="card fade-in"
  // This simple regex approaches it class by class using word boundaries
  
  for (const [oldClass, newClass] of classReplacements) {
    // Regex matches the string within className="..." or className={`...`} that contains the exact oldClass
    // Wait, dynamic template strings might break it. 
    // Safest approach: Just replace `className="oldClass"` directly first.
    // Also handle template literals: className={`oldClass ${extra}`}
    const regex1 = new RegExp(`className="${oldClass}"`, 'g');
    const regex2 = new RegExp(`className=\\{([\"\'])${oldClass}([\"\'])\\}`, 'g');
    // Also if oldClass is mixed with others e.g. className="section fade-in":
    const regex3 = new RegExp(`className="([^"]*)\\b${oldClass}\\b([^"]*)"`, 'g');

    newContent = newContent.replace(regex1, `className="${newClass}"`);
    newContent = newContent.replace(regex2, `className="${newClass}"`);
    newContent = newContent.replace(regex3, (match, prefix, suffix) => {
      // Remove the oldClass, add the newClass
      const cleanedPrefix = prefix.trim();
      const cleanedSuffix = suffix.trim();
      const combined = [cleanedPrefix, newClass, cleanedSuffix].filter(Boolean).join(" ");
      return `className="${combined}"`;
    });
  }

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    modifiedFiles++;
    console.log(`Updated: ${filePath}`);
  }
}

walk('/home/druid/Documents/Project/jikoni_baddies/apps/web/app', processFile);
walk('/home/druid/Documents/Project/jikoni_baddies/apps/web/components', processFile);

console.log(`Done. Modified ${modifiedFiles} files.`);
