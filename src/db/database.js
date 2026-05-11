import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../../data/flights.db');

let db = null;

function initDatabase() {
  const dataDir = path.dirname(DB_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS flights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      source TEXT NOT NULL,
      origin TEXT NOT NULL,
      destination TEXT NOT NULL,
      departureDate DATE NOT NULL,
      returnDate DATE NOT NULL,
      price REAL NOT NULL,
      pricePerPerson REAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      airline TEXT,
      stops INTEGER,
      totalHours INTEGER,
      bookingUrl TEXT,
      passengers INTEGER DEFAULT 2,
      isOpenJaw BOOLEAN DEFAULT 0,
      UNIQUE(source, origin, destination, departureDate, returnDate, price, passengers)
    );

    CREATE TABLE IF NOT EXISTS deals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      origin TEXT NOT NULL,
      destination TEXT NOT NULL,
      departureDate DATE NOT NULL,
      returnDate DATE NOT NULL,
      price REAL NOT NULL,
      pricePerPerson REAL NOT NULL,
      targetPrice REAL NOT NULL,
      source TEXT NOT NULL,
      percentBelowTarget REAL,
      bookingUrl TEXT,
      emailSent BOOLEAN DEFAULT 0,
      emailSentAt DATETIME
    );

    CREATE TABLE IF NOT EXISTS price_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      origin TEXT NOT NULL,
      destination TEXT NOT NULL,
      departureDate DATE NOT NULL,
      returnDate DATE NOT NULL,
      minPrice REAL NOT NULL,
      avgPrice REAL,
      maxPrice REAL,
      sourceWithLowest TEXT,
      sourceCount INTEGER DEFAULT 1
    );

    CREATE INDEX IF NOT EXISTS idx_flights_destination ON flights(destination);
    CREATE INDEX IF NOT EXISTS idx_flights_source ON flights(source);
    CREATE INDEX IF NOT EXISTS idx_flights_timestamp ON flights(timestamp);
    CREATE INDEX IF NOT EXISTS idx_deals_destination ON deals(destination);
    CREATE INDEX IF NOT EXISTS idx_deals_timestamp ON deals(timestamp);
  `);

  return db;
}

function getDatabase() {
  if (!db) {
    initDatabase();
  }
  return db;
}

export function saveFlight(flight) {
  const database = getDatabase();
  const stmt = database.prepare(`
    INSERT OR IGNORE INTO flights (
      source, origin, destination, departureDate, returnDate,
      price, pricePerPerson, currency, airline, stops, totalHours,
      bookingUrl, passengers, isOpenJaw
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  try {
    stmt.run(
      flight.source,
      flight.origin,
      flight.destination,
      flight.departureDate,
      flight.returnDate,
      flight.price,
      flight.pricePerPerson,
      flight.currency || 'USD',
      flight.airline || '',
      flight.stops || 0,
      flight.totalHours || 0,
      flight.bookingUrl || '',
      flight.passengers || 2,
      flight.isOpenJaw ? 1 : 0
    );
  } catch (error) {
    console.error('Error saving flight:', error.message);
  }
}

export function recordDeal(deal) {
  const database = getDatabase();
  const stmt = database.prepare(`
    INSERT INTO deals (
      origin, destination, departureDate, returnDate,
      price, pricePerPerson, targetPrice, source,
      percentBelowTarget, bookingUrl, emailSent
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const percentBelow = ((deal.targetPrice - deal.pricePerPerson) / deal.targetPrice) * 100;
  stmt.run(
    deal.origin,
    deal.destination,
    deal.departureDate,
    deal.returnDate,
    deal.price,
    deal.pricePerPerson,
    deal.targetPrice,
    deal.source,
    percentBelow,
    deal.bookingUrl || '',
    0
  );
}

export function getCheapestFlights(origin, destination, departureDate, returnDate) {
  const database = getDatabase();
  const stmt = database.prepare(`
    SELECT * FROM flights
    WHERE origin = ? AND destination = ? AND departureDate = ? AND returnDate = ?
    ORDER BY pricePerPerson ASC
    LIMIT 5
  `);

  return stmt.all(origin, destination, departureDate, returnDate);
}

export function getLatestDeals(limit = 10) {
  const database = getDatabase();
  const stmt = database.prepare(`
    SELECT * FROM deals
    ORDER BY timestamp DESC
    LIMIT ?
  `);

  return stmt.all(limit);
}

export function getUnsentDeals() {
  const database = getDatabase();
  const stmt = database.prepare(`
    SELECT * FROM deals
    WHERE emailSent = 0
    ORDER BY timestamp DESC
  `);

  return stmt.all();
}

export function markDealAsEmailed(dealId) {
  const database = getDatabase();
  const stmt = database.prepare(`
    UPDATE deals
    SET emailSent = 1, emailSentAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  stmt.run(dealId);
}

export function updatePriceHistory(origin, destination, departureDate, returnDate, flights) {
  const database = getDatabase();
  if (flights.length === 0) return;

  const prices = flights.map(f => f.pricePerPerson);
  const minPrice = Math.min(...prices);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const maxPrice = Math.max(...prices);
  const sourceWithLowest = flights.find(f => f.pricePerPerson === minPrice).source;

  const stmt = database.prepare(`
    INSERT INTO price_history (
      origin, destination, departureDate, returnDate,
      minPrice, avgPrice, maxPrice, sourceWithLowest, sourceCount
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    origin,
    destination,
    departureDate,
    returnDate,
    minPrice,
    avgPrice,
    maxPrice,
    sourceWithLowest,
    flights.length
  );
}

export function getPriceHistory(origin, destination, departureDate, returnDate, days = 7) {
  const database = getDatabase();
  const stmt = database.prepare(`
    SELECT * FROM price_history
    WHERE origin = ? AND destination = ? AND departureDate = ? AND returnDate = ?
    AND timestamp > datetime('now', '-' || ? || ' days')
    ORDER BY timestamp ASC
  `);

  return stmt.all(origin, destination, departureDate, returnDate, days);
}

export function getTopDestinations(limit = 10) {
  const database = getDatabase();
  const stmt = database.prepare(`
    SELECT destination, MIN(pricePerPerson) as minPrice, source
    FROM flights
    WHERE timestamp > datetime('now', '-1 day')
    GROUP BY destination
    ORDER BY minPrice ASC
    LIMIT ?
  `);

  return stmt.all(limit);
}

export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}
