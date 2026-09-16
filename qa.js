const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const outDir = path.join(process.cwd(), 'temp', 'ux-evidence', 'P006');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  const scenarios = [
    { vp: { width: 1366, height: 768 }, name: 'L', theme: 'light', lang: 'en' },
    { vp: { width: 1366, height: 768 }, name: 'L', theme: 'dark', lang: 'mr' },
    { vp: { width: 768, height: 1024 }, name: 'T', theme: 'light', lang: 'en' },
    { vp: { width: 360, height: 800 }, name: 'M', theme: 'light', lang: 'mr' },
    { vp: { width: 360, height: 800 }, name: 'M', theme: 'dark', lang: 'mr' },
  ];

  let errors = 0;

  for (const sc of scenarios) {
    const context = await browser.newContext({ viewport: sc.vp });
    const page = await context.newPage();
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error(`[${sc.name} ${sc.theme} ${sc.lang}] Console Error:`, msg.text());
        errors++;
      }
    });

    await page.goto('http://localhost:3102/__ui');
    
    // Set theme and language
    await page.evaluate(({ theme, lang }) => {
      localStorage.setItem('mahaskills.theme', theme);
      localStorage.setItem('i18nextLng', lang);
      if (theme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }, sc);

    // reload to apply
    await page.reload({ waitUntil: 'networkidle' });

    // Wait a bit for charts to render
    await page.waitForTimeout(1000);

    const hasScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });

    if (hasScroll) {
      console.warn(`[${sc.name} ${sc.theme} ${sc.lang}] Horizontal scroll detected!`);
    }

    const filename = `gallery-${sc.name}-${sc.theme}-${sc.lang}.png`;
    await page.screenshot({ path: path.join(outDir, filename), fullPage: true });
    
    console.log(`Saved ${filename}`);
    
    // Test Keyboard Focus
    if (sc.name === 'L' && sc.theme === 'light') {
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.screenshot({ path: path.join(outDir, `gallery-focus-${sc.name}.png`) });
    }

    await context.close();
  }

  await browser.close();
  console.log(`QA finished with ${errors} console errors.`);
})();
