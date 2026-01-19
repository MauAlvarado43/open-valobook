/**
 * Script: scrape-ability-stats.mjs
 * Purpose: Extract ability stats (metrics) from the Valorant Fandom Wiki
 * Usage: node scripts/scrape-ability-stats.mjs [--limit 10] [--verbose]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = "https://valorant.fandom.com/api.php";
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'assets');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'ability_stats.json');

/**
 * Fetches the list of all ability pages from the "Abilities" category
 */
async function getAbilityPages() {
  console.log('[API] Fetching list of abilities from category...');
  const pages = [];
  let cmcontinue = null;

  do {
    const url = new URL(API_URL);
    url.searchParams.append('action', 'query');
    url.searchParams.append('list', 'categorymembers');
    url.searchParams.append('cmtitle', 'Category:Abilities');
    url.searchParams.append('cmlimit', 'max');
    url.searchParams.append('format', 'json');
    url.searchParams.append('origin', '*');
    if (cmcontinue) url.searchParams.append('cmcontinue', cmcontinue);

    const response = await fetch(url);
    const data = await response.json();

    const members = data.query?.categorymembers || [];
    members.forEach(member => {
      if (member.ns === 0) { // Main namespace
        pages.push({
          id: member.pageid,
          title: member.title
        });
      }
    });

    cmcontinue = data.continue?.cmcontinue;
  } while (cmcontinue);

  console.log(`[API] Found ${pages.length} potential ability pages.`);
  return pages;
}

/**
 * Fetches the rendered HTML for a specific page
 */
async function getPageHtml(title) {
  const url = new URL(API_URL);
  url.searchParams.append('action', 'parse');
  url.searchParams.append('page', title);
  url.searchParams.append('prop', 'text');
  url.searchParams.append('format', 'json');
  url.searchParams.append('disableeditsection', '1');
  url.searchParams.append('origin', '*');

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.parse?.text?.['*'] || '';
  } catch (error) {
    console.error(`[ERROR] Failed to fetch HTML for ${title}: ${error.message}`);
    return '';
  }
}

/**
 * Parses the "Stats" table from the page HTML
 */
function parseStatsFromHtml(html) {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const stats = {};

  // Find the "Stats" section
  const statsHeader = Array.from(doc.querySelectorAll('h2, h3, h4')).find(h =>
    /stats|statistics|gameplay statistics/i.test(h.textContent)
  );

  if (!statsHeader) return stats;

  // Find the first table after the header
  let next = statsHeader.nextElementSibling;
  let table = null;

  for (let i = 0; i < 10 && next; i++) {
    if (next.tagName === 'TABLE') {
      table = next;
      break;
    }
    // Stop if we hit another header of same or higher level
    if (['H1', 'H2', 'H3'].includes(next.tagName)) break;
    next = next.nextElementSibling;
  }

  if (table) {
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      const th = row.querySelector('th');
      const td = row.querySelector('td');

      if (th && td) {
        const key = th.textContent.trim();
        const val = td.textContent.trim();
        if (key && val) stats[key] = val;
      } else {
        const cols = row.querySelectorAll('td');
        if (cols.length >= 2) {
          const key = cols[0].textContent.trim();
          const val = cols[1].textContent.trim();
          if (key && val) stats[key] = val;
        }
      }
    });
  }

  return stats;
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const limitArg = args.find(a => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1]) : null;

  console.log('========================================');
  console.log('Valorant Wiki Ability Stats Scraper');
  console.log('========================================\n');

  try {
    const pages = await getAbilityPages();
    const targetPages = limit ? pages.slice(0, limit) : pages;
    const results = [];

    for (let i = 0; i < targetPages.length; i++) {
      const page = targetPages[i];
      process.stdout.write(`[${i + 1}/${targetPages.length}] Processing: ${page.title}... `);

      const html = await getPageHtml(page.title);
      if (html) {
        const stats = parseStatsFromHtml(html);
        if (Object.keys(stats).length > 0) {
          results.push({
            name: page.title,
            id: page.id,
            stats,
            url: `https://valorant.fandom.com/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`
          });
          console.log(`OK (${Object.keys(stats).length} stats)`);
        } else {
          console.log('SKIP (No stats found)');
        }
      } else {
        console.log('ERROR (Empty HTML)');
      }

      // Small delay to be nice to the API
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
    console.log(`\n[SUCCESS] Extracted stats for ${results.length} abilities.`);
    console.log(`[INFO] Data saved to: ${OUTPUT_FILE}`);

  } catch (error) {
    console.error(`\n[FATAL] Process failed: ${error.message}`);
    process.exit(1);
  }
}

main();
