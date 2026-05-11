import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { formatPrice, formatDate } from './helpers.js';
import { getLatestDeals, getTopDestinations } from '../db/database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPORTS_DIR = path.join(__dirname, '../../reports');

function ensureReportsDir() {
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }
}

export function generateDailyReport() {
  ensureReportsDir();

  const deals = getLatestDeals(10);
  const topDestinations = getTopDestinations(10);
  const timestamp = new Date().toISOString();
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  let markdown = `# Flight Deal Report - ${reportDate}\n\n`;
  markdown += `*Generated: ${new Date().toLocaleString()}*\n\n`;

  if (deals.length > 0) {
    markdown += `## 🎉 Top ${deals.length} Deals Found\n\n`;
    markdown += `| Route | Dates | Price | Target | Savings | Source |\n`;
    markdown += `|-------|-------|-------|--------|---------|--------|\n`;

    deals.forEach(deal => {
      const savings = Math.round(deal.targetPrice - deal.pricePerPerson);
      markdown += `| ${deal.origin} → ${deal.destination} | ${deal.departureDate} to ${deal.returnDate} | ${formatPrice(deal.pricePerPerson)} | ${formatPrice(deal.targetPrice)} | **-${formatPrice(savings)}** (${deal.percentBelowTarget?.toFixed(1)}%) | ${deal.source} |\n`;
    });
    markdown += '\n';
  } else {
    markdown += `## 📊 No deals found matching target prices yet.\n\n`;
  }

  if (topDestinations.length > 0) {
    markdown += `## 💰 Cheapest Flights by Destination\n\n`;
    markdown += `| Destination | Min Price | Source |\n`;
    markdown += `|-------------|-----------|--------|\n`;

    topDestinations.forEach(dest => {
      markdown += `| ${dest.destination} | ${formatPrice(dest.minPrice)} | ${dest.source} |\n`;
    });
    markdown += '\n';
  }

  markdown += `---\n`;
  markdown += `### ℹ️ How to Use\n`;
  markdown += `- Book early for best prices\n`;
  markdown += `- Prices are per person\n`;
  markdown += `- Check multiple sources for best availability\n`;
  markdown += `- Prices update every 4 hours\n\n`;
  markdown += `*This report is automatically generated. Visit the dashboard for live updates.*\n`;

  const fileName = `report-${new Date().toISOString().split('T')[0]}.md`;
  const filePath = path.join(REPORTS_DIR, fileName);

  fs.writeFileSync(filePath, markdown, 'utf-8');
  console.log(`✓ Report generated: ${fileName}`);

  return filePath;
}
