import { source as amadeus } from './amadeus.js';
import { source as kiwi } from './kiwi.js';
import { source as googleFlights } from './google-flights.js';
import { source as skyscanner } from './skyscanner.js';
import { source as kayak } from './kayak.js';
import { source as momondo } from './momondo.js';

const allSources = {
  amadeus,
  kiwi,
  'google-flights': googleFlights,
  skyscanner,
  kayak,
  momondo
};

export function getEnabledSources(enabledNames) {
  return enabledNames
    .map(name => allSources[name])
    .filter(Boolean);
}

export function getAllSources() {
  return Object.values(allSources);
}

export function getSource(name) {
  return allSources[name];
}
