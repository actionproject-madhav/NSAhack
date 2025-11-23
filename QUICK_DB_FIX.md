# Quick Database Fix for Render

## The Problem
You're getting `"Database not connected"` errors because MongoDB isn't connecting on Render.

## The Solution (3 Steps)

### Step 1: Get Your MongoDB Connection String

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (looks like: `mongodb+srv://...`)
5. **Replace `<password>`** with your actual database password
6. **Replace `<dbname>`** with `finlit` (or your database name)

**Example:**
```
mongodb+srv://myuser:MyPassword123@cluster0.xxxxx.mongodb.net/finlit?retryWrites=true&w=majority
```

### Step 2: Set Environment Variables in Render

Go to **Render Dashboard → Your Backend Service → Environment**

Add/Update these two variables:

1. **`MONGO_URI`** = Your full connection string from Step 1
2. **`DATABASE_NAME`** = `finlit` (or your database name)

⚠️ **Important:**
- If your password has special characters (@, #, %, etc.), URL-encode them:
  - `@` → `%40`
  - `#` → `%23`
  - `%` → `%25`
- No quotes around the values
- No extra spaces

### Step 3: Allow Network Access in MongoDB Atlas

1. Go to MongoDB Atlas → **Network Access**
2. Click **"Add IP Address"**
3. Select **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**
5. Wait 2-3 minutes for changes to take effect

## Verify It's Working

1. **Check Render Logs:**
   - Go to Render Dashboard → Your Backend Service → Logs
   - Look for: `"✅ MongoDB Atlas connection successful!"`

2. **Test the Health Endpoint:**
   - Visit: `https://your-backend.onrender.com/api/health`
   - Should show: `"connected": true`

3. **Test the App:**
   - Try logging in and buying a stock
   - Should work without "Database not connected" errors

## Still Not Working?

Check Render logs for these specific errors:

- **"Authentication failed"** → Wrong password in MONGO_URI
- **"Connection timeout"** → Network access not configured (Step 3)
- **"MONGO_URI not set"** → Environment variable not saved correctly

See `DATABASE_FIX_GUIDE.md` for detailed troubleshooting.

