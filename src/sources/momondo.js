import { logProgress, logError } from '../utils/helpers.js';

export async function searchAllRoutes(origins, destinations, depDates, retDates) {
  const results = [];

  logProgress('🔍 Searching Momondo...');
  logProgress('⚠️ Momondo API integration in progress.');

  // Placeholder: Momondo aggregates flights from other sources
  // For best results, use primary sources like Amadeus and Kiwi directly

  return results;
}

export const source = {
  name: 'momondo',
  displayName: 'Momondo',
  searchAllRoutes
};
