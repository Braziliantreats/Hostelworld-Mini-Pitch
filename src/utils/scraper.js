import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { sleep } from './helpers.js';

puppeteer.use(StealthPlugin());

let browser = null;

async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process'
      ]
    });
  }
  return browser;
}

export async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
  }
}

export async function scrapeGoogleFlights(origin, destination, depDate, retDate) {
  const url = `https://www.google.com/flights?hl=en#search;f=${origin};t=${destination};d=${depDate.replace(/-/g, '')};r=${retDate.replace(/-/g, '')};tt=r`;

  try {
    const browserInstance = await getBrowser();
    const page = await browserInstance.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await sleep(2000);

    const flights = await page.evaluate(() => {
      const results = [];
      const flightCards = document.querySelectorAll('[role="button"][jsaction*="click"]');

      flightCards.forEach(card => {
        const priceEl = card.querySelector('[data-is-muted="false"] .r0wTof');
        if (priceEl) {
          const priceText = priceEl.innerText.replace(/[^0-9]/g, '');
          const price = parseInt(priceText);

          const airlineEl = card.querySelector('.sDwsqf');
          const airline = airlineEl?.innerText || 'Unknown';

          const durationEl = card.querySelector('.AdWm4c');
          const duration = durationEl?.innerText || '';

          if (price > 0) {
            results.push({
              price,
              airline,
              duration
            });
          }
        }
      });

      return results;
    });

    await page.close();
    return flights;
  } catch (error) {
    console.error('Google Flights scrape error:', error.message);
    return [];
  }
}

export async function scrapeSkyscanner(origin, destination, depDate, retDate) {
  const url = `https://www.skyscanner.com/transport/flights/${origin}/${destination}/${depDate.replace(/-/g, '')}/${retDate.replace(/-/g, '')}/`;

  try {
    const browserInstance = await getBrowser();
    const page = await browserInstance.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await sleep(2000);

    const flights = await page.evaluate(() => {
      const results = [];
      const rows = document.querySelectorAll('[data-testid*="FlightCardSection"]');

      rows.forEach(row => {
        const priceEl = row.querySelector('[data-testid="price-text"]');
        const airlineEls = row.querySelectorAll('[data-testid*="AirlineLogoImage"]');

        if (priceEl) {
          const priceText = priceEl.innerText.replace(/[^0-9]/g, '');
          const price = parseInt(priceText);

          const airlines = Array.from(airlineEls)
            .map(el => el.getAttribute('alt'))
            .filter(Boolean)
            .join(', ');

          if (price > 0) {
            results.push({
              price,
              airline: airlines || 'Multiple',
              duration: ''
            });
          }
        }
      });

      return results;
    });

    await page.close();
    return flights;
  } catch (error) {
    console.error('Skyscanner scrape error:', error.message);
    return [];
  }
}

export async function scrapeKayak(origin, destination, depDate, retDate) {
  const url = `https://www.kayak.com/flights/${origin}-${destination}/${depDate}/${retDate}`;

  try {
    const browserInstance = await getBrowser();
    const page = await browserInstance.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await sleep(2000);

    const flights = await page.evaluate(() => {
      const results = [];
      const rows = document.querySelectorAll('[data-test-id*="ResultCard"]');

      rows.forEach(row => {
        const priceEl = row.querySelector('[data-test-id="result-price"]');
        const airlineEl = row.querySelector('[data-test-id*="airline"]');

        if (priceEl) {
          const priceText = priceEl.innerText.replace(/[^0-9]/g, '');
          const price = parseInt(priceText);

          if (price > 0) {
            results.push({
              price,
              airline: airlineEl?.innerText || 'Unknown',
              duration: ''
            });
          }
        }
      });

      return results;
    });

    await page.close();
    return flights;
  } catch (error) {
    console.error('Kayak scrape error:', error.message);
    return [];
  }
}
