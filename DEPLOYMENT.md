# 🚀 Deploy to GitHub - 10 Minute Setup

---

## Step 1: Create GitHub Repository

**Option A: New Repository**

1. Go to https://github.com/new
2. Name: `hostelworld-mini-pitch` (or your choice)
3. Description: "International Flight Deal Tracker"
4. Visibility: **Public** (for unlimited Actions) or Private (2,000 min/month)
5. Click "Create repository"

**Option B: Push to Existing Repository**

Skip to Step 3.

---

## Step 2: Push Code to GitHub

```bash
cd ~/Hostelworld-Mini-Pitch

# Add GitHub remote (replace USERNAME and REPO)
git remote add origin https://github.com/USERNAME/REPO.git

# Push branch
git push -u origin claude/flight-deal-tracker-Dq829
```

---

## Step 3: Add GitHub Secrets (5 minutes)

Go to: **Settings** → **Secrets and variables** → **Actions**

Click **New repository secret** and add these 5:

```
Name: AMADEUS_CLIENT_ID
Value: [from Amadeus dashboard]

Name: AMADEUS_CLIENT_SECRET  
Value: [from Amadeus dashboard]

Name: KIWI_API_KEY
Value: [from Kiwi.com dashboard]

Name: EMAIL_USER
Value: your-email@gmail.com

Name: EMAIL_PASSWORD
Value: [16-char app password from Google]
```

Each takes ~5 seconds. Total: ~25 seconds.

---

## Step 4: Enable GitHub Pages (2 minutes)

Go to: **Settings** → **Pages**

- Source → **GitHub Actions** (dropdown)
- Click "Save"

Done! Pages will be live after first workflow run.

---

## Step 5: Run Workflow (30 seconds)

Go to: **Actions** tab

- Find "Flight Deal Tracker" workflow
- Click **Run workflow** button
- Confirm

**Yellow dot** = Running (wait 2-5 min)
**Green check** = Success! 

---

## Step 6: View Results

**Dashboard:** 
https://yourusername.github.io/hostelworld-mini-pitch/

(Replace USERNAME and REPO)

**First time?** May take 1-2 min to deploy.

---

## Step 7: Automatic Schedule

✅ Done! Workflow runs every 4 hours automatically.

No further action needed.

---

## One-Time Customization (Optional)

Edit `config.json` in repo to customize:
- Destinations
- Target prices  
- Date ranges
- Which sources to check

Push changes, next run uses new config.

---

## Commands for Testing

```bash
# Local test (requires .env with API keys)
npm install
cp .env.example .env
# [Add API keys to .env]
npm run check

# View database
sqlite3 data/flights.db
SELECT * FROM flights LIMIT 5;
```

---

## What You Get

✅ Searches 6 flight sources every 4 hours
✅ Detects deals (prices ≤ target)
✅ Emails you when flights are cheap
✅ Live dashboard with current prices
✅ Daily reports with top deals
✅ Price history & trends
✅ Mobile-friendly interface
✅ Zero monthly cost

---

## Workflow Details

**Runs:** Every 4 hours (00:00, 04:00, 08:00, 12:00, 16:00, 20:00 UTC)

**Duration:** 2-5 minutes per run

**Storage:** 
- Database: Persisted in repo
- Dashboard: GitHub Pages
- Reports: `/reports/` folder

**Cost:** Free (public repo unlimited Actions)

---

## Troubleshooting

**Workflow fails?**
→ Check Actions tab → Red job → View logs

**No flights found?**
→ API rate limits or bad airport codes

**Dashboard not updating?**
→ Clear browser cache (Ctrl+Shift+R)
→ First run takes ~10 min

**Email not working?**
→ Check workflow logs
→ Verify Gmail app password

---

## That's It!

Your flight deal tracker is now live. 

Dashboard: https://yourusername.github.io/repo-name/

Checks automatically every 4 hours.

No maintenance needed.

**Enjoy cheap flights! ✈️**
