import 'dotenv/config.js';
import config from '../config.json' assert { type: 'json' };
import { getEnabledSources } from './sources/index.js';
import {
  saveFlight,
  recordDeal,
  getCheapestFlights,
  getUnsentDeals,
  markDealAsEmailed,
  updatePriceHistory,
  closeDatabase
} from './db/database.js';
import { sendDealAlert } from './utils/email.js';
import { generateDailyReport } from './utils/report-generator.js';
import { generateDashboard } from './utils/dashboard-generator.js';
import { closeBrowser } from './utils/scraper.js';
import { logProgress, logError } from './utils/helpers.js';

const args = process.argv.slice(2);
const runOnce = args.includes('--run-once');
const specificSource = args.includes('--source') ? args[args.indexOf('--source') + 1] : null;

async function getAllDestinations() {
  const destinations = [];
  Object.values(config.airports.regions).forEach(region => {
    region.destinations.forEach(dest => {
      destinations.push({
        code: dest.code,
        city: dest.city,
        target: dest.targetPrice
      });
    });
  });
  return destinations;
}

async function searchFlights() {
  logProgress(`🚀 Starting flight search...`);
  logProgress(`📍 Origins: ${config.airports.departure.join(', ')}`);

  const sources = specificSource
    ? [config.sources.enabled.includes(specificSource) ? specificSource : null].filter(Boolean)
    : config.sources.enabled;

  if (sources.length === 0) {
    logError('No sources enabled');
    return [];
  }

  const enabledSourceModules = getEnabledSources(sources);
  const destinations = await getAllDestinations();
  let allFlights = [];

  for (const source of enabledSourceModules) {
    try {
      logProgress(`\n🔍 Querying ${source.displayName}...`);

      const flights = await source.searchAllRoutes(
        config.airports.departure,
        destinations,
        config.trip.checkDates.departure,
        config.trip.checkDates.return
      );

      allFlights = allFlights.concat(flights);
      logProgress(`✓ ${source.displayName}: Found ${flights.length} flights`);
    } catch (error) {
      logError(`Error searching ${source.displayName}`, error);
    }
  }

  return allFlights;
}

function processFlights(flights) {
  logProgress(`\n💾 Processing ${flights.length} flights...`);

  const flightsByRoute = {};
  const deals = [];

  flights.forEach(flight => {
    saveFlight(flight);

    const key = `${flight.origin}-${flight.destination}-${flight.departureDate}-${flight.returnDate}`;
    if (!flightsByRoute[key]) {
      flightsByRoute[key] = [];
    }
    flightsByRoute[key].push(flight);
  });

  Object.entries(flightsByRoute).forEach(([key, routeFlights]) => {
    const [origin, dest, depDate, retDate] = key.split('-');
    updatePriceHistory(origin, dest, depDate, retDate, routeFlights);

    routeFlights.forEach(flight => {
      const destConfig = [...Object.values(config.airports.regions)]
        .flatMap(r => r.destinations || [])
        .find(d => d.code === flight.destination);

      if (destConfig && flight.pricePerPerson <= destConfig.targetPrice) {
        logProgress(`🎉 DEAL FOUND: ${origin}→${dest} for $${flight.pricePerPerson} (target: $${destConfig.targetPrice})`);

        deals.push({
          origin: flight.origin,
          destination: flight.destination,
          departureDate: flight.departureDate,
          returnDate: flight.returnDate,
          price: flight.price,
          pricePerPerson: flight.pricePerPerson,
          targetPrice: destConfig.targetPrice,
          source: flight.source,
          bookingUrl: flight.bookingUrl
        });

        recordDeal(deals[deals.length - 1]);
      }
    });
  });

  return deals;
}

async function checkAndSendAlerts() {
  logProgress(`\n📧 Checking for deals to email...`);

  const unsentDeals = getUnsentDeals();
  if (unsentDeals.length > 0) {
    await sendDealAlert(unsentDeals);

    unsentDeals.forEach(deal => {
      markDealAsEmailed(deal.id);
    });
  } else {
    logProgress('No new deals to email');
  }
}

async function generateReports() {
  if (!config.reporting.enabled) return;

  logProgress(`\n📄 Generating reports...`);
  generateDailyReport();
  generateDashboard();
  logProgress('✓ Reports generated');
}

async function main() {
  try {
    logProgress(`\n${'='.repeat(50)}`);
    logProgress(`Flight Deal Tracker - ${new Date().toLocaleString()}`);
    logProgress(`${'='.repeat(50)}\n`);

    const flights = await searchFlights();
    if (flights.length > 0) {
      const deals = processFlights(flights);
      await checkAndSendAlerts();
      await generateReports();

      logProgress(`\n✅ Scan complete: Found ${flights.length} flights, ${deals.length} deals`);
    } else {
      logProgress('\n⚠️ No flights found');
    }
  } catch (error) {
    logError('Fatal error', error);
  } finally {
    await closeBrowser();
    closeDatabase();

    if (runOnce) {
      process.exit(0);
    }
  }
}

main();
