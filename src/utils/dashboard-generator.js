import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getTopDestinations, getLatestDeals, getPriceHistory } from '../db/database.js';
import config from '../../config.json' assert { type: 'json' };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DASHBOARD_DIR = path.join(__dirname, '../../docs');

function ensureDashboardDir() {
  if (!fs.existsSync(DASHBOARD_DIR)) {
    fs.mkdirSync(DASHBOARD_DIR, { recursive: true });
  }
}

export function generateDashboard() {
  ensureDashboardDir();

  const deals = getLatestDeals(15);
  const topDestinations = getTopDestinations(20);
  const lastUpdated = new Date().toLocaleString();

  let allDestinations = [];
  Object.values(config.airports.regions).forEach(region => {
    region.destinations.forEach(dest => {
      allDestinations.push({
        code: dest.code,
        city: dest.city,
        target: dest.targetPrice
      });
    });
  });

  // Build destination cards HTML
  let destinationCardsHtml = '';
  topDestinations.slice(0, 12).forEach(dest => {
    const destConfig = allDestinations.find(d => d.code === dest.destination);
    const targetPrice = destConfig?.target || 999999;
    const isDeal = dest.minPrice <= targetPrice;
    const savings = targetPrice - dest.minPrice;

    destinationCardsHtml += `
    <div class="destination-card ${isDeal ? 'deal' : ''}">
      <div class="destination-header">
        <h3>${dest.destination}</h3>
        <span class="target-badge" title="Target price">Target: $${targetPrice}</span>
      </div>
      <div class="price-display">
        <div class="current-price $${isDeal ? 'deal-price' : 'regular-price'}">
          $${dest.minPrice.toFixed(0)}
        </div>
        ${isDeal ? `<div class="savings">Save $${savings.toFixed(0)}</div>` : ''}
      </div>
      <div class="source-info">
        <small>Best: ${dest.source}</small>
      </div>
    </div>
    `;
  });

  let dealsTableHtml = '';
  if (deals.length > 0) {
    deals.slice(0, 10).forEach(deal => {
      dealsTableHtml += `
      <tr class="deal-row">
        <td><strong>${deal.origin} → ${deal.destination}</strong></td>
        <td>${deal.departureDate}<br/><small>${deal.returnDate}</small></td>
        <td><strong class="deal-price">$${deal.pricePerPerson.toFixed(0)}</strong></td>
        <td>$${deal.targetPrice}</td>
        <td><span class="savings-badge">-$${Math.round(deal.targetPrice - deal.pricePerPerson)}</span></td>
        <td>${deal.source}</td>
      </tr>
      `;
    });
  } else {
    dealsTableHtml = `<tr><td colspan="6" style="text-align: center; padding: 20px; color: #999;">No deals yet. Check back soon!</td></tr>`;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Flight Deal Tracker - June 2026</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
      color: #333;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    header {
      background: white;
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      text-align: center;
    }

    header h1 {
      font-size: 2.5em;
      color: #667eea;
      margin-bottom: 10px;
    }

    .trip-info {
      display: flex;
      justify-content: center;
      gap: 30px;
      margin-top: 15px;
      flex-wrap: wrap;
      font-size: 0.95em;
    }

    .trip-info span {
      color: #666;
    }

    .update-time {
      font-size: 0.85em;
      color: #999;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #eee;
    }

    .destinations-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .destination-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }

    .destination-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .destination-card.deal {
      border-left: 4px solid #10b981;
      background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
    }

    .destination-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .destination-header h3 {
      font-size: 1.3em;
      color: #333;
    }

    .target-badge {
      background: #f3f4f6;
      color: #666;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 0.8em;
      font-weight: 500;
    }

    .price-display {
      margin: 15px 0;
    }

    .current-price {
      font-size: 2em;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .regular-price {
      color: #667eea;
    }

    .deal-price {
      color: #10b981;
    }

    .savings {
      color: #10b981;
      font-size: 0.95em;
      font-weight: 600;
    }

    .source-info {
      color: #999;
      font-size: 0.85em;
    }

    section {
      background: white;
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }

    section h2 {
      color: #667eea;
      margin-bottom: 20px;
      font-size: 1.8em;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead {
      background: #f9fafb;
      border-bottom: 2px solid #e5e7eb;
    }

    th {
      padding: 12px;
      text-align: left;
      font-weight: 600;
      color: #667eea;
    }

    td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
    }

    tr:hover {
      background: #f9fafb;
    }

    .deal-row {
      background: #f0fdf4;
    }

    .savings-badge {
      background: #10b981;
      color: white;
      padding: 4px 10px;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.9em;
    }

    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 15px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }

    .stat-number {
      font-size: 2em;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .stat-label {
      font-size: 0.9em;
      opacity: 0.9;
    }

    footer {
      text-align: center;
      color: white;
      margin-top: 40px;
      font-size: 0.9em;
    }

    @media (max-width: 768px) {
      header h1 {
        font-size: 1.8em;
      }

      .destinations-grid {
        grid-template-columns: 1fr;
      }

      .trip-info {
        flex-direction: column;
        gap: 10px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>✈️ Flight Deal Tracker</h1>
      <div class="trip-info">
        <span>📅 June 12-30, 2026</span>
        <span>👥 2 Adults</span>
        <span>🗺️ Multiple Destinations</span>
      </div>
      <div class="update-time">Last updated: ${lastUpdated}</div>
    </header>

    <section>
      <h2>🎯 Destination Prices</h2>
      <div class="destinations-grid">
        ${destinationCardsHtml}
      </div>
    </section>

    <section>
      <h2>🎉 Active Deals</h2>
      <div class="stats">
        <div class="stat-card">
          <div class="stat-number">${deals.length}</div>
          <div class="stat-label">Deals Found</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">${topDestinations.length}</div>
          <div class="stat-label">Destinations Tracked</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">6</div>
          <div class="stat-label">Sources Checked</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Route</th>
            <th>Travel Dates</th>
            <th>Price</th>
            <th>Target</th>
            <th>Savings</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          ${dealsTableHtml}
        </tbody>
      </table>
    </section>

    <section>
      <h2>📊 How It Works</h2>
      <ul style="line-height: 1.8; margin-left: 20px;">
        <li><strong>Automated Tracking:</strong> Checks 6 flight sources every 4 hours</li>
        <li><strong>Deal Alerts:</strong> Notifies when prices hit target</li>
        <li><strong>Price History:</strong> Tracks trends over time</li>
        <li><strong>Multiple Routes:</strong> Monitors 15+ destinations</li>
        <li><strong>Best Prices:</strong> Shows cheapest option and which source found it</li>
      </ul>
    </section>

    <footer>
      <p>🤖 Automated Flight Deal Tracker | Checking Amadeus, Kiwi.com, Google Flights & more</p>
      <p>Prices updated every 4 hours • All prices per person</p>
    </footer>
  </div>
</body>
</html>`;

  const indexPath = path.join(DASHBOARD_DIR, 'index.html');
  fs.writeFileSync(indexPath, html, 'utf-8');
  console.log(`✓ Dashboard generated: index.html`);

  return indexPath;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateDashboard();
}
