# Render Backend Test Endpoints

## Quick Test Endpoints

### 1. **Backend Running Check** (Fast - No DB)
```
GET https://finlit-backend.onrender.com/health
```

**Response:**
```json
{
  "status": "healthy",
  "backend": "running",
  "database": "connected" or "disconnected"
}
```

**Use this to:**
- ✅ Check if backend service is running
- ✅ Quick health check (fast response)

---

### 2. **Full Health Check** (Tests Database Connection)
```
GET https://finlit-backend.onrender.com/api/health
```

**Response (Connected):**
```json
{
  "status": "healthy",
  "database": {
    "connected": true,
    "mongo_uri_set": true,
    "database_name_set": true,
    "database_name": "receipt_scanner"
  }
}
```

**Response (Not Connected):**
```json
{
  "status": "unhealthy",
  "database": {
    "connected": false,
    "mongo_uri_set": true,
    "database_name_set": true,
    "database_name": "receipt_scanner",
    "error": "Database not connected",
    "troubleshooting": {
      "check_mongo_uri": "Set MONGO_URI in Render environment variables",
      "check_database_name": "Set DATABASE_NAME in Render environment variables",
      "check_network_access": "Allow 0.0.0.0/0 in MongoDB Atlas Network Access",
      "check_credentials": "Verify username and password in MONGO_URI are correct"
    }
  }
}
```

**Use this to:**
- ✅ Check if database is connected
- ✅ See detailed connection status
- ✅ Get troubleshooting tips if connection fails

---

## Testing in Browser

1. **Quick Check:**
   ```
   https://finlit-backend.onrender.com/health
   ```

2. **Full Check:**
   ```
   https://finlit-backend.onrender.com/api/health
   ```

---

## Testing with curl

```bash
# Quick check
curl https://finlit-backend.onrender.com/health

# Full health check
curl https://finlit-backend.onrender.com/api/health
```

---

## What to Check

### If `/health` shows "disconnected":
- Backend is running but database isn't connected
- Check Render logs for connection errors
- Verify `MONGO_URI` and `DATABASE_NAME` in Render environment variables

### If `/api/health` shows connection details:
- Shows exactly what's configured
- Helps diagnose connection issues

---

## Expected Behavior

**First Request (Cold Start):**
- May take 30-60 seconds (Render free tier cold start)
- Database connection attempt happens
- Subsequent requests are faster

**After Warm:**
- Instant response
- Database connection cached

---

## Current Issue

You're getting "Database not connected" errors. Check:

1. **Render Environment Variables:**
   - `MONGO_URI` = `mongodb+srv://finlit:Nepal@cluster0.9swrerc.mongodb.net/receipt_scanner?retryWrites=true&w=majority`
   - `DATABASE_NAME` = `receipt_scanner`

2. **MongoDB Atlas Network Access:**
   - Go to Network Access → Add IP Address
   - Add `0.0.0.0/0` (allow all IPs)

3. **Render Logs:**
   - Check for connection errors
   - Look for "✅ MongoDB Atlas connection successful" message

