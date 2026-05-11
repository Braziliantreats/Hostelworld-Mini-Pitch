import axios from 'axios';
import { delayedCall, logProgress, logError } from '../utils/helpers.js';

const API_KEY = process.env.KIWI_API_KEY;
const BASE_URL = 'https://api.tequila.kiwi.com';

async function searchFlights(origin, destination, depDate, retDate, adults = 2) {
  if (!API_KEY) {
    logError('Kiwi API key not configured');
    return [];
  }

  try {
    const response = await axios.get(`${BASE_URL}/v2/search`, {
      params: {
        fly_from: origin,
        fly_to: destination,
        date_from: depDate.replace(/-/g, 'd'),
        date_to: depDate.replace(/-/g, 'd'),
        return_from: retDate.replace(/-/g, 'd'),
        return_to: retDate.replace(/-/g, 'd'),
        adults,
        curr: 'USD',
        limit: 20,
        sort: 'price'
      },
      headers: {
        'apikey': API_KEY
      }
    });

    if (!response.data.data || response.data.data.length === 0) {
      return [];
    }

    return response.data.data.map(result => ({
      source: 'kiwi',
      price: result.price,
      pricePerPerson: result.price / adults,
      airline: result.airlines?.join(', ') || 'Multiple',
      stops: result.stops || 0,
      totalHours: Math.round(result.duration.total / 3600),
      currency: 'USD',
      bookingUrl: result.deep_link || `https://www.kiwi.com/search/results/${origin}/${destination}/${depDate}/${retDate}`,
      raw: result
    }));
  } catch (error) {
    logError(`Kiwi search error for ${origin}-${destination}`, error);
    return [];
  }
}

export async function searchAllRoutes(origins, destinations, depDates, retDates) {
  const results = [];
  let count = 0;

  logProgress('🔍 Searching Kiwi.com API...');

  for (const origin of origins) {
    for (const dest of destinations) {
      for (const depDate of depDates) {
        for (const retDate of retDates) {
          try {
            count++;
            if (count > 1) {
              await delayedCall(() => Promise.resolve(), 500);
            }

            const flights = await searchFlights(origin, dest.code, depDate, retDate);

            flights.forEach(flight => {
              results.push({
                ...flight,
                origin,
                destination: dest.code,
                destinationName: dest.city,
                departureDate: depDate,
                returnDate: retDate
              });
            });

            logProgress(`✓ Kiwi: ${origin}→${dest.code} ${depDate}`);
          } catch (error) {
            logError(`Kiwi error: ${origin}→${dest.code}`, error);
          }
        }
      }
    }
  }

  return results;
}

export const source = {
  name: 'kiwi',
  displayName: 'Kiwi.com',
  searchAllRoutes
};
