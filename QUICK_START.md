# FinLit Quick Start Guide

## Start Backend Server

**Option 1: Use the start script**
```bash
cd backend
./start_backend.sh
```

**Option 2: Manual start**
```bash
cd backend
python3 app.py
```

The backend will run on `http://localhost:5000`

## Verify Backend is Running

```bash
curl http://localhost:5000/health
```

Should return: `{"status": "healthy", "database": "connected"}`

## Frontend Configuration

Make sure `frontend/.env` has:
```
VITE_API_BASE_URL=http://localhost:5000
```

## Common Issues

### "User not found" errors
- **Cause**: Backend not running or user not in database
- **Fix**: 
  1. Start backend: `cd backend && python3 app.py`
  2. Complete onboarding to save user to database
  3. Frontend now uses email instead of Google ID (more reliable)

### 404 errors on endpoints
- **Cause**: Backend not running
- **Fix**: Start backend server (see above)

### CORS errors
- **Cause**: Frontend URL not in CORS whitelist
- **Fix**: Backend automatically includes `http://localhost:5173` in CORS origins

## All Fixed Issues

✅ **Backend endpoints** - Now support email, ObjectId, and Google ID lookup
✅ **Frontend** - Uses email when available (more reliable)
✅ **Onboarding** - Saves users to database correctly
✅ **Trading** - Buy/sell endpoints working
✅ **Portfolio** - Built from transactions only (no mock data)
✅ **Transaction history** - Working correctly

## Test Everything

```bash
cd backend
python3 test_all_functionality.py
```

Should show: **10/10 tests passed** ✅

