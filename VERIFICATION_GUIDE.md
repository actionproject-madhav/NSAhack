# Verification Guide - No Mock Data

## What Was Fixed

1. Removed ALL mock portfolio data from database
2. UserContext now ONLY loads from trading API
3. Portfolio only shows stocks purchased through trade page
4. Cash balance tracked properly per user
5. No localStorage fallbacks to mock data

---

## How to Verify

### Step 1: Clear Your Browser

```
1. Open DevTools (F12)
2. Go to Application > Local Storage
3. Delete "user" entry
4. Refresh page
```

### Step 2: Login Fresh

```
1. Logout if logged in
2. Login with Google
3. Complete onboarding if needed
```

### Step 3: Check Dashboard

**Expected:**
- Portfolio value: $0.00
- 0 positions
- No random stocks showing

If you see stocks you didn't buy, open DevTools console and check for errors.

### Step 4: Check Wallet Page

**Expected:**
- Total Account Value: $0.00
- Portfolio Value: $0.00
- Available Cash: $0.00 (will show $10,000 after first trade page visit)
- "No holdings yet" message

### Step 5: Visit Trade Page

**Expected:**
- Available Cash displays: $10,000.00
- Real stock prices from Yahoo Finance
- Buy button enabled

**What happens:**
1. Backend checks if user has cash_balance
2. If not, initializes to $10,000
3. Frontend displays the balance

### Step 6: Buy a Stock

```
1. Search for AAPL (or any stock)
2. Enter quantity: 5
3. Click "Buy"
4. You should see:
   - Success message
   - Cash balance decreases
   - Redirects to portfolio
```

### Step 7: Verify Purchase

**Dashboard should now show:**
- Portfolio value: (quantity × current price)
- 1 position
- The stock you just bought

**Wallet should show:**
- Total Account Value: (cash + portfolio value)
- Portfolio Value: (your stocks' value)
- Available Cash: ($10,000 - what you spent)
- Your stock listed under Holdings

### Step 8: Refresh Page

```
1. Hit F5 to refresh
2. Everything should persist:
   - Same cash balance
   - Same portfolio
   - Same stock prices (may update if market moved)
```

### Step 9: Check Database

```bash
# In MongoDB
db.users.findOne({ email: "your@email.com" })

# Should see:
{
  email: "your@email.com",
  cash_balance: 9122.50,  # Example after buying
  portfolio: [
    {
      ticker: "AAPL",
      quantity: 5,
      avgPrice: 175.50,
      currentPrice: 175.50
    }
  ],
  total_value: 877.50
}
```

### Step 10: Check Transactions

```bash
# In MongoDB
db.transactions.find({ user_id: "YOUR_USER_ID" })

# Should see:
{
  user_id: "...",
  type: "buy",
  ticker: "AAPL",
  quantity: 5,
  price: 175.50,
  total: 877.50,
  timestamp: ISODate("...")
}
```

---

## Testing Multiple Purchases

### Buy Same Stock Twice

```
1. Buy 5 AAPL at $175.50
2. Buy 3 more AAPL at $180.00
3. Result:
   - Quantity: 8 shares
   - Avg Price: $177.19 (weighted average)
   - Current Price: $180.00 (latest)
```

### Buy Different Stocks

```
1. Buy 5 AAPL
2. Buy 10 MSFT
3. Portfolio shows both
4. Total value = sum of all positions
```

---

## Common Issues & Fixes

### Issue: Still seeing random stocks

**Fix:**
```
1. Clear browser localStorage
2. Logout
3. Run: cd backend && python3 clear_mock_data.py
4. Login again
```

### Issue: Cash balance shows $0

**Solution:** Visit the Trade page once. Backend will initialize to $10,000.

### Issue: Portfolio shows but values are wrong

**Check:**
1. Open DevTools console
2. Look for "Loaded real portfolio from trading API"
3. If you see errors, check backend is running
4. Verify `/api/trading/portfolio` endpoint works:
   ```bash
   curl "http://localhost:5000/api/trading/portfolio?user_id=YOUR_ID"
   ```

### Issue: Can't buy stocks

**Possible causes:**
1. Not enough cash
2. Backend not running
3. Invalid stock ticker
4. Check console for errors

---

## API Testing

### Check Your Balance

```bash
# Replace YOUR_USER_ID with your actual user ID or email
curl "http://localhost:5000/api/trading/balance?user_id=YOUR_USER_ID"

# Expected:
{
  "success": true,
  "cash_balance": 10000.00
}
```

### Check Your Portfolio

```bash
curl "http://localhost:5000/api/trading/portfolio?user_id=YOUR_USER_ID"

# Expected (if no trades):
{
  "success": true,
  "portfolio": [],
  "cash_balance": 10000.00,
  "portfolio_value": 0,
  "total_account_value": 10000.00
}

# Expected (after trades):
{
  "success": true,
  "portfolio": [
    {
      "ticker": "AAPL",
      "quantity": 5,
      "avgPrice": 175.50,
      "currentPrice": 175.50
    }
  ],
  "cash_balance": 9122.50,
  "portfolio_value": 877.50,
  "total_account_value": 10000.00
}
```

### Buy Stock via API

```bash
curl -X POST http://localhost:5000/api/trading/buy \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "YOUR_USER_ID",
    "ticker": "AAPL",
    "quantity": 5
  }'

# Expected:
{
  "success": true,
  "message": "Successfully bought 5 shares of AAPL",
  "transaction": {
    "ticker": "AAPL",
    "quantity": 5,
    "price": 175.50,
    "total": 877.50
  },
  "new_balance": 9122.50,
  "portfolio_value": 877.50
}
```

---

## Data Flow Verification

### When You Login:

```
1. Frontend checks localStorage → finds user email
2. Frontend calls /auth/user/{id} → gets user profile
3. Frontend calls /api/trading/portfolio → gets REAL portfolio
4. Sets user state with:
   - portfolio: [] (if no trades)
   - totalValue: 0 (if no trades)
5. NO MOCK DATA LOADED
```

### When You Buy a Stock:

```
1. Frontend calls /api/trading/buy
2. Backend:
   a. Fetches real price from Yahoo Finance
   b. Validates cash balance
   c. Updates portfolio in database
   d. Records transaction
   e. Returns new balance
3. Frontend:
   a. Calls /api/trading/portfolio
   b. Updates user state
   c. Shows new portfolio
```

### When You Refresh:

```
1. Frontend loads user from localStorage (for quick display)
2. Immediately calls /api/trading/portfolio (for real data)
3. Updates display with real current prices
4. NO OLD MOCK DATA SHOWN
```

---

## Success Criteria

### All checks must pass:

- [ ] New user starts with empty portfolio
- [ ] New user gets $10,000 on first trade page visit
- [ ] Buying stock deducts cash correctly
- [ ] Portfolio only shows purchased stocks
- [ ] Quantities and prices are correct
- [ ] Multiple purchases average correctly
- [ ] Page refresh maintains data
- [ ] No random mock stocks appear
- [ ] Database shows correct data
- [ ] Transactions are recorded
- [ ] Cash balance is consistent
- [ ] All pages show same data

---

## Clean Slate Testing

To test from absolute scratch:

```bash
# 1. Clear database
cd backend
python3 clear_mock_data.py

# 2. Clear browser
# Open DevTools → Application → Clear storage → Clear site data

# 3. Restart backend
python3 app.py

# 4. Restart frontend
cd ../frontend
npm run dev

# 5. Login with Google
# 6. Check everything is $0
# 7. Go to Trade page → should get $10,000
# 8. Buy a stock
# 9. Verify it appears everywhere correctly
```

---

## Console Logging

Watch for these console logs:

### Good Signs:
```
✅ Loading user profile from database...
✅ Loaded real portfolio from trading API: 0 positions
✅ User profile loaded - Portfolio: 0 positions
✅ Loaded real portfolio from trading API: 1 positions
✅ User data refreshed: 1 positions, $877.50
```

### Bad Signs:
```
❌ Trading API error, portfolio will be empty until trades are made
❌ Could not load from trading API, using database portfolio
❌ Error loading profile from database
```

If you see bad signs, check:
1. Backend is running
2. Trading endpoints are registered
3. MongoDB is connected
4. No CORS errors

---

## Final Verification

After following all steps, you should have:

1. Clean database with no mock data
2. Only stocks you actually bought showing
3. Correct cash balance after purchases
4. Consistent values across all pages
5. Transaction history in database
6. Everything persists after refresh

**The system is now 100% real data with no mocks!**

