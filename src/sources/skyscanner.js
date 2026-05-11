import { logProgress, logError } from '../utils/helpers.js';

// Note: Skyscanner has deprecated their free API. This source uses web scraping as a fallback.
export async function searchAllRoutes(origins, destinations, depDates, retDates) {
  const results = [];

  logProgress('🔍 Searching Skyscanner...');
  logProgress('⚠️ Skyscanner free API deprecated. Using alternative sources recommended.');

  // Placeholder: Skyscanner would require careful scraping due to JavaScript rendering
  // For production, consider using Rapid API Skyscanner endpoint (paid) or focus on other sources

  return results;
}

export const source = {
  name: 'skyscanner',
  displayName: 'Skyscanner',
  searchAllRoutes
};
