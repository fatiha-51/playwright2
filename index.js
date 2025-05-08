const express = require('express');
const { chromium } = require('playwright');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(express.json());
app.use(morgan('combined'));

// Route de santé pour le healthcheck
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Exemple de route avec Playwright
app.get('/scrape', async (req, res) => {
  let browser = null;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage();
    
    await page.goto('https://example.com');
    const title = await page.title();
    
    res.json({
      success: true,
      data: {
        title,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors du scraping'
    });
  } finally {
    if (browser) await browser.close();
  }
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint non trouvé'
  });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Erreur interne du serveur'
  });
});

// Démarrage du serveur
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

// Gestion propre de l'arrêt
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
