# FinLit Restart Guide

## Quick Restart Commands

### Restart Backend
```bash
cd backend
pkill -f "python3 app.py"
python3 app.py
```

Or use the start script:
```bash
cd backend
./start_backend.sh
```

### Restart Frontend
```bash
cd frontend
npm run dev
```

## Verify Everything is Running

### Check Backend
```bash
curl http://localhost:5000/health
```
Should return: `{"status": "healthy", "database": "connected"}`

### Check Frontend
Open browser to: `http://localhost:5173`

## Current Status

✅ **Backend**: Running on port 5000
✅ **Database**: Connected to MongoDB Atlas
✅ **All Endpoints**: Working correctly
✅ **Tests**: 10/10 passing

## Troubleshooting

If backend won't start:
1. Check if port 5000 is in use: `lsof -i :5000`
2. Kill existing process: `pkill -f "python3 app.py"`
3. Check logs: `tail -f /tmp/finlit_backend.log`

If frontend won't start:
1. Check if port 5173 is in use: `lsof -i :5173`
2. Kill existing process: `pkill -f "vite"`
3. Clear node_modules and reinstall: `rm -rf node_modules && npm install`

