# 🚀 Flight Deal Tracker - Complete Setup Guide

Step-by-step instructions to get your flight deal tracker running on GitHub Actions with live dashboard.

---

## Prerequisites

- GitHub account (free)
- Public or private repository  
- 5-10 minutes

---

## Phase 1: Get API Keys (5 minutes)

### Step 1a: Amadeus API

1. Go to https://developers.amadeus.com/register
2. Sign up (free account)
3. Verify email
4. Go to https://developers.amadeus.com/dashboard
5. Click "Create New Application"
6. Fill form, select "Commercial Use"
7. Copy **Client ID** and **Client Secret**
8. Note: Use test credentials initially (sandbox environment)

**Keep these handy:**
```
AMADEUS_CLIENT_ID = _______________
AMADEUS_CLIENT_SECRET = _______________
```

### Step 1b: Kiwi.com API

1. Go to https://tequila.kiwi.com/
2. Click "Get Free API" 
3. Sign up (free account)
4. Verify email
5. Login to https://tequila.kiwi.com/dashboard
6. Copy **API Key**

**Keep this handy:**
```
KIWI_API_KEY = _______________
```

### Step 1c: Gmail App Password (for email alerts)

1. Go to https://myaccount.google.com/security
2. Check "2-Step Verification" is ON (enable if needed)
3. Go to https://myaccount.google.com/apppasswords
4. Select "Mail" and "Windows 10 Mail"
5. Click "Generate"
6. Copy the 16-character password (ignore spaces)

**Keep this handy:**
```
EMAIL_USER = _______________@gmail.com
EMAIL_PASSWORD = ____ ____ ____ ____
```

---

## Phase 2: Add GitHub Secrets (3 minutes)

1. Go to your GitHub repository
2. Click **Settings** (top navigation)
3. Left sidebar → **Secrets and variables** → **Actions**
4. Click **New repository secret**

**Add these 5 secrets one by one:**

| Name | Value | Source |
|------|-------|--------|
| `AMADEUS_CLIENT_ID` | Your Client ID | Amadeus dashboard |
| `AMADEUS_CLIENT_SECRET` | Your Client Secret | Amadeus dashboard |
| `KIWI_API_KEY` | Your API Key | Kiwi.com dashboard |
| `EMAIL_USER` | your-email@gmail.com | Your Gmail |
| `EMAIL_PASSWORD` | 16-char app password | Google Account |

### How to add each secret:

1. Click "New repository secret" button
2. **Name:** Exactly as shown above (case-sensitive)
3. **Value:** Paste the value
4. Click "Add secret"
5. Repeat for all 5

**Verification:** After adding, you should see 5 secrets listed (values hidden with dots).

---

## Phase 3: Enable GitHub Pages (2 minutes)

1. In repository **Settings**
2. Left sidebar → **Pages**
3. Under "Build and deployment"
4. Source → Select **GitHub Actions** (from dropdown)
5. Click "Save"

**Note:** If Pages shows "Your site is live at...", you're good!

---

## Phase 4: Customize Your Trip (Optional, 2 minutes)

Edit `config.json` to customize:

```json
{
  "trip": {
    "departureDate": "2026-06-14",
    "returnDate": "2026-06-28",
    "checkDates": {
      "departure": ["2026-06-12", "2026-06-13", "2026-06-14", "2026-06-15", "2026-06-16"],
      "return": ["2026-06-26", "2026-06-27", "2026-06-28", "2026-06-29", "2026-06-30"]
    }
  }
}
```

**What you can change:**
- Departure/return dates
- Origins (BOS, MHT, etc.)
- Destinations and cities
- Target prices per destination
- Which sources to check
- Email on/off

For details on all options, see `README.md`.

---

## Phase 5: Test Locally (Optional, 5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Create .env file locally
cp .env.example .env
# Edit .env and paste your API keys:
# AMADEUS_CLIENT_ID=...
# AMADEUS_CLIENT_SECRET=...
# KIWI_API_KEY=...
# EMAIL_USER=...
# EMAIL_PASSWORD=...

# 3. Run one test
npm run check

# 4. Check results
sqlite3 data/flights.db
sqlite> SELECT * FROM flights LIMIT 5;
sqlite> .quit
```

If this works, GitHub Actions will too!

---

## Phase 6: Trigger First Run (1 minute)

1. Go to **Actions** tab in repository
2. Left sidebar → **Flight Deal Tracker**
3. Click **Run workflow** button
4. Confirm **Run workflow**

**Watch it run:**
1. Yellow dot = Running
2. Green check = Success
3. Red X = Error (check logs)

**First run takes ~2-3 minutes** (scraping is slower)

---

## Phase 7: View Results (1 minute)

### Dashboard

1. Go to **Settings** → **Pages**
2. Copy your Pages URL
3. Open in browser (may take 1-2 min to deploy first time)
4. **Bookmark it!** You'll check this daily

Expected URL:
```
https://yourusername.github.io/hostelworld-mini-pitch/
```

### Reports

1. Go to **Code** tab
2. Folder → `reports/`
3. View latest `report-YYYY-MM-DD.md`

### Database

1. Go to **Code** tab
2. Folder → `data/`
3. `flights.db` (SQLite database)
4. Download locally if you want to analyze

---

## Phase 8: Enable Automatic Runs (Already Done!)

The workflow runs **automatically every 4 hours**:
- 00:00 UTC
- 04:00 UTC
- 08:00 UTC
- 12:00 UTC
- 16:00 UTC
- 20:00 UTC

**No action needed.** It just happens.

You can also manually trigger anytime via Actions tab.

---

## Verification Checklist

✅ All 5 secrets added to repository
✅ GitHub Pages enabled
✅ `config.json` customized (optional)
✅ First workflow run completed
✅ Dashboard accessible at GitHub Pages URL
✅ Local .env has your API keys

---

## Daily Usage

**Every morning, check:**
1. Dashboard: https://yourusername.github.io/...
2. Look for deals (green cards = prices below target)
3. Click booking link to reserve

**That's it!** The tracker runs automatically.

---

## Troubleshooting

### Workflow fails immediately
**Check:** Do all 5 secrets exist? 
Go Settings → Secrets and verify all are there.

### No flights found
**Check:** 
- Are airport codes valid? (BOS, SGN, GIG, etc.)
- Are dates in YYYY-MM-DD format?
- Try running again (APIs sometimes have delays)

### Dashboard shows "No deals yet"
**Check:**
- Dashboard updates every 4 hours
- First run may take 10+ minutes
- Some sources may be slow

### Email not working
**Check:**
- Gmail 2FA enabled? https://myaccount.google.com/security
- App password correct? https://myaccount.google.com/apppasswords
- Check workflow logs for email errors

### Missing past data
**First time?** Database starts empty. After ~24 hours, you'll have history.
**Reset?** Delete `data/flights.db`, next run creates new one.

---

## What Happens Each Run

```
1. GitHub Actions starts
2. Installs Node.js + dependencies
3. Loads your secrets as environment variables
4. Searches 6 sources simultaneously:
   - Amadeus API (airline-direct pricing)
   - Kiwi.com (budget carriers)
   - Google Flights (web scraping)
   - Skyscanner, Kayak, Momondo (stubs)
5. Saves all results to SQLite database
6. Detects deals (price ≤ target)
7. Sends email if deals found
8. Generates daily report
9. Builds dashboard HTML
10. Commits database to repo
11. Deploys dashboard to GitHub Pages
12. Done! Waits 4 hours.
```

All this happens **automatically** and **for free**.

---

## Cost Analysis

| Service | Cost | Free Tier |
|---------|------|-----------|
| GitHub Actions | Free* | 2,000 min/month |
| GitHub Pages | Free | Unlimited |
| Amadeus API | $0.50-2.00/call | 2,000 calls/month |
| Kiwi.com API | $0.15/call | 100 requests/day |
| Google Flights | Free | Built-in |
| Gmail | Free | Existing account |
| SQLite | Free | Local storage |
| **TOTAL** | | **$0** |

*Public repos get unlimited Actions. Private repos: 2,000 min/month = ~125 runs.

---

## Advanced: Custom Destinations

Edit `config.json`:

```json
{
  "airports": {
    "departure": ["BOS", "JFK"],
    "regions": {
      "Europe": {
        "destinations": [
          { "code": "LHR", "city": "London", "targetPrice": 600 },
          { "code": "CDG", "city": "Paris", "targetPrice": 650 }
        ]
      }
    }
  }
}
```

Save, push, done. Next run uses new destinations.

---

## Useful Commands

```bash
# Check flights once locally
npm run check

# Check only Amadeus
npm run check:source amadeus

# Rebuild dashboard
npm run build-dashboard

# Query database
sqlite3 data/flights.db
SELECT * FROM flights WHERE destination = 'BKK' ORDER BY pricePerPerson ASC LIMIT 5;

# View latest deals
SELECT * FROM deals WHERE timestamp > datetime('now', '-1 day');
```

---

## Support

**If something breaks:**

1. Check Actions tab for error logs
2. Review README.md for feature docs
3. Verify all 5 secrets are correct
4. Try local test: `npm run check`
5. Delete database: `rm data/flights.db`
6. Re-run workflow: Actions → Run workflow

---

## Have Questions?

- **API docs:** Check `.env.example` 
- **Features:** Read `README.md`
- **Config options:** Look in `config.json` comments
- **Source code:** Browse `src/` directory

---

**You're all set! Enjoy finding cheap flights! ✈️**
