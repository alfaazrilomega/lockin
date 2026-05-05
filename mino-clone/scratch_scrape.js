const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  const mediaUrls = new Set();
  
  // Intercept network requests
  page.on('response', async (response) => {
    const url = response.url();
    const type = response.request().resourceType();
    
    // Check if the resource is an image or media
    if (type === 'image' || type === 'media') {
      mediaUrls.add(url);
    }
    // Also check content-type for videos in case they are fetched as xhr/fetch
    const headers = response.headers();
    if (headers['content-type'] && (headers['content-type'].includes('video') || headers['content-type'].includes('image'))) {
      mediaUrls.add(url);
    }
  });

  console.log('Navigating to https://mino.works/ ...');
  await page.goto('https://mino.works/', { waitUntil: 'networkidle2', timeout: 60000 });
  
  // Scroll down a bit to trigger lazy loading
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      let distance = 100;
      let timer = setInterval(() => {
        let scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight || totalHeight > 10000) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });

  // Wait a bit more for requests to finish
  await new Promise(r => setTimeout(r, 5000));
  
  console.log('--- Extracted Media URLs ---');
  Array.from(mediaUrls).forEach(url => {
    // Filter out common small icons/trackers
    if (!url.includes('google-analytics') && !url.includes('facebook') && !url.includes('data:image')) {
      console.log(url);
    }
  });
  
  await browser.close();
})();
