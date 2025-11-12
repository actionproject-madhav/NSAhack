# Testing Trading System - Complete Verification

## Clear Old Data First

Before testing, clear any old mock data:

1. Open browser console (F12)
2. Run:
```javascript
localStorage.clear()
console.log('Cleared all localStorage data')
```
3. Refresh page
4. Login again

---

## Backend Verification

### 1. Check Backend is Running
```bash
curl http://localhost:5000/api/trading/balance?user_id=test
```

Should return:
```json
{
  "error": "User not found"
}
```
This is correct - means endpoint works.

### 2. Check Trading Blueprint Registered
```bash
curl http://localhost:5000/health 2>/dev/null || echo "Backend running"
```

---

## Complete Test Flow

### Step 1: Login
1. Go to http://localhost:5173
2. Login with Google
3. Complete onboarding if prompted

### Step 2: Check Initial State

**Open Browser Console** (F12) and look for these logs:
```
Loading user profile from database...
Loaded portfolio from trading API: 0 positions
```

This confirms it's using the trading API.

### Step 3: Check Wallet Page
1. Go to /wallet
2. You should see:
   - Total Account Value: $10,000.00
   - Portfolio Value: $0.00
   - Available Cash: $10,000.00

If you see different numbers, there's old data.

### Step 4: Buy First Stock

1. Go to /trade
2. Check you see "Available Cash: $10,000.00" in top right
3. Find AAPL (Apple)
4. Enter quantity: 5
5. Check total cost shows (5 x current AAPL price)
6. Click "Buy"

**Watch Console Logs:**
```
Refreshing user data from trading API...
User data refreshed: 1 positions, $XXX.XX
```

### Step 5: Verify Purchase

**Check Trade Page:**
- Cash balance should be less than $10,000

**Check Wallet Page:**
- Total Account Value: ~$10,000 (depending on prices)
- Portfolio Value: (5 × AAPL price)
- Available Cash: (10000 - purchase cost)

**Check Portfolio Page:**
- Should show 1 position
- AAPL: 5 shares
- Shows current value and gain/loss

**Check Dashboard:**
- Should show AAPL in portfolio

### Step 6: Check Database

You can verify in MongoDB:

```javascript
// Find your user
db.users.findOne({ email: "your_email@gmail.com" })
```

Should show:
```json
{
  "email": "your_email@gmail.com",
  "cash_balance": 9122.50,  // (example: if AAPL was $175.50)
  "portfolio": [
    {
      "ticker": "AAPL",
      "quantity": 5,
      "avgPrice": 175.50,
      "currentPrice": 175.50
    }
  ],
  "total_value": 877.50
}
```

Check transactions collection:
```javascript
db.transactions.find({ user_id: "USER_ID" }).sort({ timestamp: -1 })
```

Should show:
```json
{
  "user_id": "...",
  "type": "buy",
  "ticker": "AAPL",
  "quantity": 5,
  "price": 175.50,
  "total": 877.50,
  "timestamp": ISODate("...")
}
```

### Step 7: Buy More of Same Stock

1. Go back to /trade
2. Buy 3 more AAPL shares
3. Check portfolio shows 8 shares (5 + 3)
4. Average price should be calculated correctly

### Step 8: Buy Different Stock

1. Buy 10 shares of MSFT
2. Check portfolio shows 2 positions
3. Cash balance decreased again

---

## What Should NOT Happen

### Bad Signs (Old System):
- Portfolio shows data immediately without API call
- Console doesn't show "Loaded portfolio from trading API"
- Cash balance doesn't decrease after purchase
- Portfolio has random stocks you didn't buy
- Numbers don't match across pages
- Can buy infinite stocks without cash limit

### Good Signs (New System):
- Console shows "Loaded portfolio from trading API"
- Empty portfolio on first login
- Cash balance: $10,000 initially
- Cash decreases after each purchase
- Portfolio only shows what you bought
- Same numbers across all pages
- Can't buy if insufficient funds

---

## Debugging Common Issues

### Issue: Still seeing old portfolio data

**Solution:**
1. Clear localStorage:
```javascript
localStorage.clear()
```
2. Clear IndexedDB:
```javascript
indexedDB.databases().then(dbs => {
  dbs.forEach(db => indexedDB.deleteDatabase(db.name))
})
```
3. Logout and login again

### Issue: Portfolio shows 0 but I bought stocks

**Check:**
1. Look at browser console for errors
2. Check network tab - is API call to `/api/trading/portfolio` succeeding?
3. Check MongoDB - is data saved?
4. Check backend logs for errors

**Test API directly:**
```bash
curl "http://localhost:5000/api/trading/portfolio?user_id=YOUR_USER_ID"
```

### Issue: Can't buy stocks - "Insufficient funds" immediately

**Check:**
```bash
curl "http://localhost:5000/api/trading/balance?user_id=YOUR_USER_ID"
```

If it returns less than expected, check if there's old data in database:
```javascript
db.users.findOne({ email: "YOUR_EMAIL" }, { cash_balance: 1 })
```

### Issue: Numbers don't match across pages

**This means:**
- Different pages loading from different sources
- Some using localStorage, some using API

**Check console logs on each page:**
- Should see "Loaded portfolio from trading API" on all pages
- If any page doesn't show this, it's using old system

---

## Expected Console Logs

### On Login:
```
Loading user profile from database...
Loaded portfolio from trading API: 0 positions
Loaded complete user profile
```

### On Trade Page Load:
```
(Cash balance loaded)
```

### After Buying Stock:
```
Refreshing user data from trading API...
User data refreshed: 1 positions, $877.50
```

### On Wallet Page Load:
```
(Cash balance and portfolio loaded)
```

### On Portfolio/Dashboard Load:
```
(User data already loaded from context)
```

---

## API Test Commands

### Check Balance
```bash
curl "http://localhost:5000/api/trading/balance?user_id=YOUR_USER_ID"
```

### Buy Stock (replace USER_ID)
```bash
curl -X POST http://localhost:5000/api/trading/buy \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "YOUR_USER_ID",
    "ticker": "AAPL",
    "quantity": 5
  }'
```

### Check Portfolio
```bash
curl "http://localhost:5000/api/trading/portfolio?user_id=YOUR_USER_ID"
```

### Check Transactions
```bash
curl "http://localhost:5000/api/trading/transactions?user_id=YOUR_USER_ID&limit=10"
```

---

## Success Criteria

All of these should be true:

1. New user starts with $10,000 cash, 0 stocks
2. After buying 5 AAPL:
   - Cash = 10000 - (5 × AAPL_price)
   - Portfolio shows exactly 5 AAPL
   - Same numbers on Dashboard, Portfolio, Wallet, Trade pages
3. Transaction recorded in database
4. Buying more AAPL averages the cost
5. Can't buy if insufficient funds
6. Refresh button updates prices
7. All pages show consistent data
8. Console logs show "trading API" messages

---

## If Everything Works

You should be able to:

1. Start fresh with $10,000
2. Buy any stock with real prices
3. See exact quantity you bought
4. See correct cash remaining
5. Portfolio value updates with real prices
6. All pages show same data
7. Refresh updates everything
8. Can trade until cash runs out
9. Data persists after logout/login
10. No random stocks appear

This is a real paper trading simulator with 100% consistent data.

---

## If Something's Wrong

Post in console:
1. What you did (e.g., "Bought 5 AAPL")
2. What you see (e.g., "Shows 10 AAPL")
3. Console logs
4. Network tab showing API calls
5. Result of: `curl "http://localhost:5000/api/trading/portfolio?user_id=YOUR_USER_ID"`

This will help diagnose where the data flow is breaking.

