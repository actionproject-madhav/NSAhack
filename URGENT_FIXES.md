# 🚨 URGENT: Fix These 2 Issues

## Issue 1: Database Not Connected (500 Error)

### The Problem
```
Error: Database not connected
Status: 500
```

### The Fix (3 Steps)

#### Step 1: URL-Encode Your Password in MONGO_URI

1. Go to **Render Dashboard** → Your Backend Service → **Environment**
2. Find `MONGO_URI`
3. **CRITICAL**: Change `Madhav@` to `Madhav%40`

**BROKEN:**
```
mongodb+srv://finlit:Madhav@cluster0.9swrerc.mongodb.net/receipt_scanner?retryWrites=true&w=majority
```

**FIXED:**
```
mongodb+srv://finlit:Madhav%40@cluster0.9swrerc.mongodb.net/receipt_scanner?retryWrites=true&w=majority
```

#### Step 2: Verify DATABASE_NAME

Make sure you have:
```
DATABASE_NAME=receipt_scanner
```

#### Step 3: MongoDB Atlas Network Access

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **Network Access** → **Add IP Address**
3. Click **Allow Access from Anywhere** (adds `0.0.0.0/0`)
4. Click **Confirm**

### After Fixing

1. **Save** environment variables in Render
2. **Redeploy** backend (or wait for auto-redeploy)
3. **Check logs** - should see: `✅ MongoDB Atlas connection successful!`

---

## Issue 2: Format String Error in AI Endpoint

### The Problem
```
Error: unsupported format string passed to NoneType.__format__
```

### The Fix

✅ **Already fixed in code** - handles None values in stock quote data

**What was wrong:**
- When stock quote data had `None` values, Python's format string failed
- Fixed by adding `or 0` to handle None values

**No action needed** - just redeploy after fixing Issue 1.

---

## Verify Everything Works

1. Visit: `https://your-backend.onrender.com/api/health`
2. Should show: `"database": "connected"`

3. Try buying a stock - should work without errors
4. Try AI stock intelligence - should work without format errors

---

## Still Not Working?

Check Render logs for:
- `❌ MONGODB CONNECTION FAILED`
- `MONGO_URI set: Yes/No`
- Connection error details

**Common mistakes:**
- ❌ Password not URL-encoded (`@` instead of `%40`) ← **MOST COMMON**
- ❌ Network access not set to `0.0.0.0/0`
- ❌ Wrong database name
- ❌ Wrong username/password

