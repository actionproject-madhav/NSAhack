# Render Database Setup - CRITICAL FIX NEEDED

## Current Issue

Your backend on Render is returning **"Database not connected"** errors. This means:
- ❌ User profiles cannot be loaded
- ❌ Trading (buy/sell) doesn't work
- ❌ Portfolio data cannot be saved/retrieved
- ❌ All user data is lost on refresh

## Root Cause

The MongoDB connection is failing on Render because:
1. `MONGO_URI` environment variable may not be set correctly
2. `DATABASE_NAME` environment variable may not be set
3. MongoDB Atlas Network Access may not allow Render IPs

## IMMEDIATE FIX REQUIRED

### Step 1: Set Environment Variables in Render

Go to **Render Dashboard → Your Backend Service (finlit-backend) → Environment**

Add/Verify these variables:

1. **MONGO_URI**
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   - Replace `username` with your MongoDB Atlas username
   - Replace `password` with your MongoDB Atlas password (URL-encode special characters)
   - Replace `cluster0.xxxxx` with your actual cluster address
   - **IMPORTANT**: No quotes, no spaces

2. **DATABASE_NAME**
   ```
   receipt_scanner
   ```
   (or whatever database name you want to use)

### Step 2: Check MongoDB Atlas Network Access

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Select your cluster
3. Click **Network Access** (left sidebar)
4. Click **Add IP Address**
5. Add `0.0.0.0/0` (allows access from anywhere)
   - Or add Render's specific IP ranges if you prefer
6. Click **Confirm**

### Step 3: Verify Database User

1. In MongoDB Atlas, go to **Database Access**
2. Make sure your database user exists
3. User should have **Read and write to any database** permissions
4. Note the username and password (used in MONGO_URI)

### Step 4: Restart Backend Service

1. Go to Render Dashboard → Your Backend Service
2. Click **Manual Deploy** → **Clear build cache & deploy**
3. Wait for deployment to complete

### Step 5: Check Logs

1. Go to Render Dashboard → Your Backend Service → **Logs**
2. Look for:
   - ✅ `MongoDB Atlas connection successful!` = Working
   - ❌ `MONGODB CONNECTION FAILED` = Still broken

## Verification

After fixing, test these endpoints:

```bash
# Health check (should show database: "connected")
curl https://finlit-backend.onrender.com/health

# Should return: {"status": "healthy", "database": "connected"}
```

## What Happens After Fix

Once the database is connected:
- ✅ User profiles will load from database
- ✅ Trading (buy/sell) will work
- ✅ Portfolio data will persist
- ✅ All user data will be saved
- ✅ No more "Database not connected" errors

## Current Status

- **Frontend**: ✅ Configured correctly (uses real APIs, no mock data)
- **Backend Code**: ✅ Ready (has auto-creation, proper error handling)
- **Database Connection**: ❌ **NOT CONNECTED** (needs environment variables)

## Mock Data Removed

All mock data has been removed from:
- ✅ Portfolio data (only from trading API)
- ✅ Stock prices (only from real APIs)
- ✅ User profiles (only from database)
- ✅ Trading history (only from database)

The app will show empty states when:
- User hasn't made any trades yet
- Database is not connected
- API calls fail

**No random/mock data will appear.**

