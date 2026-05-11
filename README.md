# ✈️ International Flight Deal Tracker

Automated flight deal tracker for your June 2026 trip. Monitors 6 flight data sources every 4 hours and alerts you when prices drop below target. Deployed as a GitHub Actions workflow with a live dashboard on GitHub Pages.

**Features:**
- 🤖 Automated checks every 4 hours
- 📊 Live dashboard with current prices
- 📧 Email alerts when deals are found
- 💾 SQLite database tracking price history
- 📈 Trend analysis over time
- 🌐 Supports 15+ international destinations
- 📱 Mobile-friendly dashboard
- 🔄 Free tier APIs only

---

## 📋 Quick Start (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Copy .env.example to .env and fill in API keys
cp .env.example .env

# 3. Run once locally to test
npm run check

# 4. Set up GitHub Actions (see below)
# 5. Dashboard: https://<username>.github.io/<repo>/
```

---

## API Setup

### 1. Amadeus API (Free Tier)

1. Register: https://developers.amadeus.com/register
2. Create application
3. Copy Client ID & Secret to `.env`:

```bash
AMADEUS_CLIENT_ID=your_id
AMADEUS_CLIENT_SECRET=your_secret
```

**Free Tier:** 2,000 API calls/month

### 2. Kiwi.com Tequila API (Free Tier)

1. Register: https://tequila.kiwi.com/
2. Get API key from dashboard
3. Add to `.env`:

```bash
KIWI_API_KEY=your_key
```

**Free Tier:** 100 requests/day

### 3. Google Flights (No setup)

Uses Puppeteer scraping. No API key needed.

### 4. Email Alerts (Gmail)

1. Enable 2FA: https://myaccount.google.com/security
2. Create app password: https://myaccount.google.com/apppasswords
3. Add to `.env`:

```bash
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_RECIPIENT=optional-recipient@example.com
```

---

## GitHub Actions Setup

### Step 1: Add Secrets

Settings → Secrets and variables → Actions → New repository secret

```
AMADEUS_CLIENT_ID=...
AMADEUS_CLIENT_SECRET=...
KIWI_API_KEY=...
EMAIL_USER=...
EMAIL_PASSWORD=...
EMAIL_RECIPIENT=... (optional)
```

### Step 2: Enable GitHub Pages

Settings → Pages → Source: GitHub Actions

### Step 3: View Results

- **Dashboard:** https://yourusername.github.io/repo-name/
- **Reports:** `/reports/` in repo
- **Logs:** Actions tab

---

## Configuration

Customize `config.json`:

- **Destinations:** Add/remove countries & cities
- **Target prices:** Adjust budget per destination
- **Check dates:** Change date ranges
- **Sources:** Enable/disable APIs
- **Email:** Turn alerts on/off

---

## Usage

```bash
# One-time check
npm run check

# Check specific source
npm run check:source amadeus

# Rebuild dashboard
npm run build-dashboard

# Continuous mode
npm start
```

---

## Project Structure

```
src/
├── index.js                       # Main tracker
├── db/database.js                 # SQLite layer
├── sources/
│   ├── amadeus.js, kiwi.js, google-flights.js
│   └── index.js (loader)
└── utils/
    ├── email.js, scraper.js
    ├── report-generator.js
    └── dashboard-generator.js

data/flights.db                    # Auto-created database
docs/index.html                    # Auto-generated dashboard
reports/*.md                       # Auto-generated daily reports
config.json                        # Your configuration
.env                              # API keys (add to .env)
.github/workflows/flight-tracker.yml  # Runs every 4 hours
```

---

## Features

✅ Multi-source flight search
✅ Deal detection (price ≤ target)
✅ Email alerts with booking links
✅ Price history & trends
✅ Live mobile-friendly dashboard
✅ Daily markdown reports
✅ SQLite database persistence
✅ GitHub Pages deployment
✅ Source deduplication
✅ Rate limit handling

---

## Database

SQLite stores:
- All flight results
- Detected deals
- Price history over time

Query examples:
```bash
sqlite3 data/flights.db
SELECT * FROM deals WHERE departureDate = '2026-06-14';
SELECT * FROM price_history WHERE destination = 'BKK' ORDER BY timestamp DESC;
```

---

## Workflow

Runs automatically **every 4 hours**:
- 00:00, 04:00, 08:00, 12:00, 16:00, 20:00 UTC

**Manual trigger:** Actions tab → Run workflow

**Process:**
1. Search all sources
2. Save results to database
3. Detect deals
4. Send email alerts
5. Generate reports
6. Deploy dashboard
7. Commit changes

---

## Cost

✅ **$0 - Completely Free**

- GitHub Actions: 2,000 min/month (private) unlimited (public)
- GitHub Pages: Unlimited
- Amadeus: Free tier included
- Kiwi.com: Free tier included
- Gmail: Use existing account
- SQLite: Local (no cost)

---

## Troubleshooting

**API auth fails?**
- Check credentials match exactly
- Amadeus: Use test environment
- Kiwi: Verify API key format

**No flights found?**
- Verify IATA codes (e.g., BOS, SGN)
- Check date format (YYYY-MM-DD)
- Try different date ranges

**Email not sending?**
- Enable 2FA on Gmail
- Use app password (not regular password)
- Verify credentials in .env

**Dashboard not updating?**
- Check Actions for workflow errors
- Verify Pages is enabled
- Clear browser cache
- Check artifact uploads

**Workflow timeout?**
- Reduce destinations
- Disable slower sources
- Shorten date range

---

## Advanced

### Add Custom Source

Create `src/sources/my-source.js`:
```javascript
export async function searchAllRoutes(origins, destinations, depDates, retDates) {
  const results = [];
  // Your integration here
  return results;
}

export const source = {
  name: 'my-source',
  displayName: 'My Source',
  searchAllRoutes
};
```

Add to `config.json`:
```json
{
  "sources": {
    "enabled": ["amadeus", "my-source"]
  }
}
```

### Disable Email

In `config.json`:
```json
{
  "email": {
    "enabled": false
  }
}
```

### Disable Sources

In `config.json`:
```json
{
  "sources": {
    "enabled": ["amadeus", "kiwi"],
    "disabled": ["google-flights", "skyscanner", "kayak", "momondo"]
  }
}
```

---

## Notes

- All prices are per person (2 adults)
- UTC time for consistency
- Web scraping includes delays to avoid rate limiting
- Database persists between runs
- Dashboard accessible anywhere
- No payment required

**Enjoy your trip! ✈️🌍**
