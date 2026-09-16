const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Set dark mode preference
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.setViewportSize({ width: 1040, height: 800 });
  
  // Create a minimal HTML with the SVG logo to use as fallback since rendering the 3D scene needs the Vite server running.
  // Actually, we can just load the dev server if it's running. Is it? No.
  const html = \
    <!DOCTYPE html>
    <html class="dark">
      <head>
        <style>
          body { background: #000; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
          svg { width: 300px; height: 300px; }
        </style>
      </head>
      <body>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <rect x="4" y="18" width="6" height="12" rx="1.5" fill="#0E3998" />
          <rect x="13" y="11" width="6" height="19" rx="1.5" fill="#0E3998" />
          <rect x="22" y="6" width="6" height="24" rx="1.5" fill="#0E3998" />
          <polygon points="25,0 28,3 25,6 22,3" fill="#D88B09" />
        </svg>
      </body>
    </html>
  \;
  
  await page.setContent(html);
  await page.screenshot({ path: 'frontend/public/brand/hero-fallback-dark.png' });
  
  // Light mode
  const htmlLight = html.replace('background: #000', 'background: #fff');
  await page.setContent(htmlLight);
  await page.screenshot({ path: 'frontend/public/brand/hero-fallback.png' });
  
  await browser.close();
})();
