import axios from 'axios';
import { sleep, delayedCall, logProgress, logError } from '../utils/helpers.js';

let accessToken = null;
let tokenExpiry = null;

async function getAccessToken() {
  if (accessToken && tokenExpiry && new Date() < tokenExpiry) {
    return accessToken;
  }

  if (!process.env.AMADEUS_CLIENT_ID || !process.env.AMADEUS_CLIENT_SECRET) {
    logError('Amadeus credentials not configured');
    return null;
  }

  try {
    const response = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      {
        grant_type: 'client_credentials',
        client_id: process.env.AMADEUS_CLIENT_ID,
        client_secret: process.env.AMADEUS_CLIENT_SECRET
      },
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );

    accessToken = response.data.access_token;
    tokenExpiry = new Date(Date.now() + (response.data.expires_in * 1000));
    return accessToken;
  } catch (error) {
    logError('Failed to get Amadeus token', error);
    return null;
  }
}

async function searchFlights(origin, destination, depDate, retDate, adults = 2) {
  const token = await getAccessToken();
  if (!token) return [];

  try {
    const response = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
      params: {
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate: depDate,
        returnDate: retDate,
        adults,
        currencyCode: 'USD',
        max: 10
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.data.data || response.data.data.length === 0) {
      return [];
    }

    return response.data.data.map(offer => ({
      source: 'amadeus',
      price: parseFloat(offer.price.total),
      pricePerPerson: parseFloat(offer.price.total) / adults,
      airline: offer.validatingAirlineCodes?.[0] || 'Unknown',
      stops: offer.itineraries[0].segments.length - 1,
      totalHours: calculateDuration(offer.itineraries),
      currency: offer.price.currency,
      bookingUrl: `https://amadeus.com/en/search?o=${origin}&d=${destination}&dd=${depDate}`,
      raw: offer
    }));
  } catch (error) {
    logError(`Amadeus search error for ${origin}-${destination}`, error);
    return [];
  }
}

function calculateDuration(itineraries) {
  let totalMinutes = 0;
  itineraries.forEach(itinerary => {
    itinerary.segments.forEach(segment => {
      const departure = new Date(segment.departure.at);
      const arrival = new Date(segment.arrival.at);
      totalMinutes += (arrival - departure) / (1000 * 60);
    });
  });
  return Math.round(totalMinutes / 60);
}

export async function searchAllRoutes(origins, destinations, depDates, retDates) {
  const results = [];
  let count = 0;

  logProgress('🔍 Searching Amadeus API...');

  for (const origin of origins) {
    for (const dest of destinations) {
      for (const depDate of depDates) {
        for (const retDate of retDates) {
          try {
            count++;
            if (count > 1) {
              await delayedCall(() => Promise.resolve(), 1000);
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

            logProgress(`✓ Amadeus: ${origin}→${dest.code} ${depDate}`);
          } catch (error) {
            logError(`Amadeus error: ${origin}→${dest.code}`, error);
          }
        }
      }
    }
  }

  return results;
}

export const source = {
  name: 'amadeus',
  displayName: 'Amadeus API',
  searchAllRoutes
};
