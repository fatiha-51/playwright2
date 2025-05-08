const express = require('express');
const { chromium } = require('playwright');

const app = express();

app.get('/screenshot', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('Missing url parameter');

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    const screenshot = await page.screenshot({ fullPage: true });

    res.set('Content-Type', 'image/png');
    res.send(screenshot);
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  } finally {
    await browser.close();
  }
});

app.listen(3000, () => {
  console.log('Playwright API is running on port 3000');
});
