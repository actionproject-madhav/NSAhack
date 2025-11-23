# 🚨 URGENT: Fix Database Connection on Render

## The Error
```
Error: Database not connected
Status: 500
```

## Quick Fix (3 Steps)

### Step 1: Check Your MONGO_URI in Render

1. Go to **Render Dashboard** → Your Backend Service → **Environment**
2. Find `MONGO_URI`
3. **CRITICAL**: Your password `Madhav@` must be URL-encoded as `Madhav%40`

**Current (BROKEN):**
```
mongodb+srv://finlit:Madhav@cluster0.9swrerc.mongodb.net/receipt_scanner?retryWrites=true&w=majority
```

**Fixed (CORRECT):**
```
mongodb+srv://finlit:Madhav%40@cluster0.9swrerc.mongodb.net/receipt_scanner?retryWrites=true&w=majority
```

**Change:** `Madhav@` → `Madhav%40`

### Step 2: Verify DATABASE_NAME

In Render Environment Variables, make sure you have:
```
DATABASE_NAME=receipt_scanner
```

### Step 3: Check MongoDB Atlas Network Access

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **Network Access** (left sidebar)
3. Click **Add IP Address**
4. Click **Allow Access from Anywhere** (adds `0.0.0.0/0`)
5. Click **Confirm**

## After Making Changes

1. **Save** environment variables in Render
2. **Redeploy** your backend service (or wait for auto-redeploy)
3. **Check logs** in Render - you should see:
   ```
   ✅ MongoDB Atlas connection successful!
   ```

## Verify It Works

1. Visit: `https://your-backend.onrender.com/api/health`
2. Should show: `"database": "connected"`

## Still Not Working?

Check Render logs for:
- `❌ MONGODB CONNECTION FAILED`
- `MONGO_URI set: Yes/No`
- Connection error details

Common issues:
- ❌ Password not URL-encoded (`@` instead of `%40`)
- ❌ Network access not set to `0.0.0.0/0`
- ❌ Wrong database name
- ❌ Wrong username/password

