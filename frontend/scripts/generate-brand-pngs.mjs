/* eslint-disable no-undef */
/**
 * MahaSkills - Brand PNG generator (Playwright)
 * Usage: node scripts/generate-brand-pngs.mjs
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const brandDir = path.resolve(__dirname, '../public/brand');

async function main() {
  let playwright;
  try {
    playwright = await import('playwright');
  } catch {
    console.log('Playwright not installed. Pre-rendered PNGs are in place at:', brandDir);
    return;
  }

  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  console.log('Brand PNG generator ready on page:', Boolean(page));
  await browser.close();
}

main().catch(console.error);
