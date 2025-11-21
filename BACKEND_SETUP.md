# Backend Setup & Testing Guide

## Quick Status Check

Run this to check backend and database:
```bash
cd backend
python3 test_backend_health.py
```

## Start Backend Locally

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies (if needed):**
   ```bash
   pip3 install -r requirements.txt
   ```

3. **Set up environment variables:**
   Create `backend/.env` file with:
   ```
   MONGO_URI=your_mongodb_connection_string
   DATABASE_NAME=receipt_scanner
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GEMINI_API_KEY=your_gemini_api_key
   FINNHUB_API_KEY=your_finnhub_api_key
   FLASK_SECRET_KEY=your_secret_key
   ```

4. **Start the backend:**
   ```bash
   python3 app.py
   ```

   You should see:
   ```
   ✅ MongoDB Atlas connection successful!
   * Running on http://0.0.0.0:5000
   ```

## Test Backend Endpoints

Once backend is running, test these:

1. **Health check:**
   ```bash
   curl http://localhost:5000/health
   ```
   Should return: `{"status": "healthy", "database": "connected"}`

2. **Config:**
   ```bash
   curl http://localhost:5000/api/config
   ```

## Frontend Configuration

Make sure your frontend `.env` has:
```
VITE_API_BASE_URL=http://localhost:5000
```

For deployed frontend, use:
```
VITE_API_BASE_URL=https://finlit-backend.onrender.com
```

## Database Status

✅ **Database is connected!**
- Users: 2
- Transactions: 1

The database connection is working. You just need to start the backend server.

## Troubleshooting

### Backend won't start:
1. Check if port 5000 is already in use:
   ```bash
   lsof -i :5000
   ```
2. Kill existing process if needed:
   ```bash
   kill -9 <PID>
   ```

### Connection refused:
- Make sure backend is running on port 5000
- Check firewall settings
- Verify `VITE_API_BASE_URL` in frontend `.env`

### Database connection issues:
- Verify `MONGO_URI` in `backend/.env`
- Check MongoDB Atlas IP whitelist
- Test connection with `test_backend_health.py`

