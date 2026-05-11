import { scrapeGoogleFlights } from '../utils/scraper.js';
import { delayedCall, logProgress, logError } from '../utils/helpers.js';

export async function searchAllRoutes(origins, destinations, depDates, retDates) {
  const results = [];
  let count = 0;

  logProgress('🔍 Scraping Google Flights...');

  for (const origin of origins) {
    for (const dest of destinations) {
      for (const depDate of depDates) {
        for (const retDate of retDates) {
          try {
            count++;
            if (count > 1) {
              await delayedCall(() => Promise.resolve(), 3000);
            }

            const flights = await scrapeGoogleFlights(origin, dest.code, depDate, retDate);

            if (flights.length > 0) {
              const cheapest = flights.reduce((min, f) => f.price < min.price ? f : min);

              results.push({
                source: 'google-flights',
                origin,
                destination: dest.code,
                destinationName: dest.city,
                departureDate: depDate,
                returnDate: retDate,
                price: cheapest.price * 2,
                pricePerPerson: cheapest.price,
                airline: cheapest.airline || 'Multiple',
                stops: 0,
                totalHours: 0,
                currency: 'USD',
                bookingUrl: `https://www.google.com/flights?hl=en#search;f=${origin};t=${dest.code};d=${depDate.replace(/-/g, '')};r=${retDate.replace(/-/g, '')};tt=r`
              });

              logProgress(`✓ Google Flights: ${origin}→${dest.code} - $${cheapest.price}`);
            }
          } catch (error) {
            logError(`Google Flights error: ${origin}→${dest.code}`, error);
          }
        }
      }
    }
  }

  return results;
}

export const source = {
  name: 'google-flights',
  displayName: 'Google Flights',
  searchAllRoutes
};
